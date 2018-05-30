import './View.scss';
import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Table, Icon, Row, Col, Tooltip, message } from 'antd';
import { Link } from 'react-router-dom';
import AceEditor from 'client/components/AceEditor/AceEditor';
import { formatTime } from '../../../../common.js';
import ErrMsg from '../../../../components/ErrMsg/ErrMsg.js';
import variable from '../../../../constants/variable';
import constants from '../../../../constants/variable.js';
import copy from 'copy-to-clipboard';
import SchemaTable from '../../../../components/SchemaTable/SchemaTable.js';

const HTTP_METHOD = constants.HTTP_METHOD;

@connect(state => {
  return {
    curData: state.inter.curdata,
    custom_field: state.group.field,
    currProject: state.project.currProject
  };
})
class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: true,
      enter: false
    };
  }
  static propTypes = {
    curData: PropTypes.object,
    currProject: PropTypes.object,
    custom_field: PropTypes.object
  };

  req_body_form(req_body_type, req_body_form) {
    if (req_body_type === 'form') {
      const columns = [
        {
          title: 'Param Name',
          dataIndex: 'name',
          key: 'name',
          width: 140
        },
        {
          title: 'Param Type',
          dataIndex: 'type',
          key: 'type',
          width: 100,
          render: text => {
            text = text || '';
            return text.toLowerCase() === 'text' ? (
              <span>
                <i className="query-icon text">T</i>Text
              </span>
            ) : (
              <span>
                <Icon type="file" className="query-icon" />File
              </span>
            );
          }
        },
        {
          title: 'Required?',
          dataIndex: 'required',
          key: 'required',
          width: 100
        },
        {
          title: 'Example',
          dataIndex: 'example',
          key: 'example',
          render(_, item) {
            return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>;
          }
        },
        {
          title: 'Value',
          dataIndex: 'value',
          key: 'value',
          render(_, item) {
            return <p style={{ whiteSpace: 'pre-wrap' }}>{item.value}</p>;
          }
        }
      ];

      const dataSource = [];
      if (req_body_form && req_body_form.length) {
        req_body_form.map((item, i) => {
          dataSource.push({
            key: i,
            name: item.name,
            value: item.desc,
            example: item.example,
            required: item.required == 0 ? 'No' : 'Yes',
            type: item.type
          });
        });
      }

      return (
        <div style={{ display: dataSource.length ? '' : 'none' }} className="colBody">
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      );
    }
  }
  res_body(res_body_type, res_body, res_body_is_json_schema) {
    if (res_body_type === 'json') {
      if (res_body_is_json_schema) {
        return <SchemaTable dataSource={res_body} />;
      } else {
        return (
          <div className="colBody">
            {/* <div id="vres_body_json" style={{ minHeight: h * 16 + 100 }}></div> */}
            <AceEditor data={res_body} readOnly={true} style={{ minHeight: 600 }} />
          </div>
        );
      }
    } else if (res_body_type === 'raw') {
      return (
        <div className="colBody">
          <AceEditor data={res_body} readOnly={true} mode="text" style={{ minHeight: 300 }} />
        </div>
      );
    }
  }

  req_body(req_body_type, req_body_other, req_body_is_json_schema) {
    if (req_body_other) {
      if (req_body_is_json_schema && req_body_type === 'json') {
        return <SchemaTable dataSource={req_body_other} />;
      } else {
        return (
          <div className="colBody">
            <AceEditor
              data={req_body_other}
              readOnly={true}
              style={{ minHeight: 300 }}
              mode={req_body_type === 'json' ? 'javascript' : 'text'}
            />
          </div>
        );
      }
    }
  }

  req_query(query) {
    const columns = [
      {
        title: 'Param Name',
        dataIndex: 'name',
        width: 140,
        key: 'name'
      },
      {
        title: 'Required?',
        width: 100,
        dataIndex: 'required',
        key: 'required'
      },
      {
        title: 'Example',
        dataIndex: 'example',
        key: 'example',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>;
        }
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.value}</p>;
        }
      }
    ];

    const dataSource = [];
    if (query && query.length) {
      query.map((item, i) => {
        dataSource.push({
          key: i,
          name: item.name,
          value: item.desc,
          example: item.example,
          required: item.required == 0 ? 'No' : 'Yes'
        });
      });
    }

    return (
      <Table bordered size="small" pagination={false} columns={columns} dataSource={dataSource} />
    );
  }

  countEnter(str) {
    let i = 0;
    let c = 0;
    if (!str || !str.indexOf) return 0;
    while (str.indexOf('\n', i) > -1) {
      i = str.indexOf('\n', i) + 2;
      c++;
    }
    return c;
  }

  componentDidMount() {
    if (!this.props.curData.title && this.state.init) {
      this.setState({ init: false });
    }
  }

  enterItem = () => {
    this.setState({
      enter: true
    });
  };

  leaveItem = () => {
    this.setState({
      enter: false
    });
  };

  copyUrl = url => {
    copy(url);
    message.success('Copied to clipboard!');
  };

  render() {
    const dataSource = [];
    if (this.props.curData.req_headers && this.props.curData.req_headers.length) {
      this.props.curData.req_headers.map((item, i) => {
        dataSource.push({
          key: i,
          name: item.name,
          required: item.required == 0 ? 'No' : 'Yes',
          value: item.value,
          example: item.example,
          desc: item.desc
        });
      });
    }

    const req_dataSource = [];
    if (this.props.curData.req_params && this.props.curData.req_params.length) {
      this.props.curData.req_params.map((item, i) => {
        req_dataSource.push({
          key: i,
          name: item.name,
          desc: item.desc,
          example: item.example
        });
      });
    }
    const req_params_columns = [
      {
        title: 'Param Name',
        dataIndex: 'name',
        key: 'name',
        width: 140
      },
      {
        title: 'Example',
        dataIndex: 'example',
        key: 'example',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>;
        }
      },
      {
        title: 'Description',
        dataIndex: 'desc',
        key: 'desc',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</p>;
        }
      }
    ];

    const columns = [
      {
        title: 'Param Name',
        dataIndex: 'name',
        key: 'name',
        width: '200px'
      },
      {
        title: 'Param Value',
        dataIndex: 'value',
        key: 'value',
        width: '300px'
      },
      {
        title: 'Required?',
        dataIndex: 'required',
        key: 'required',
        width: '100px'
      },
      {
        title: 'Example',
        dataIndex: 'example',
        key: 'example',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.example}</p>;
        }
      },
      {
        title: 'Description',
        dataIndex: 'desc',
        key: 'desc',
        render(_, item) {
          return <p style={{ whiteSpace: 'pre-wrap' }}>{item.desc}</p>;
        }
      }
    ];
    let status = {
      undone: 'Not Completed',
      done: 'Completed'
    };

    let bodyShow =
      this.props.curData.req_body_other ||
      (this.props.curData.req_body_type === 'form' &&
        this.props.curData.req_body_form &&
        this.props.curData.req_body_form.length);

    let requestShow =
      (dataSource && dataSource.length) ||
      (req_dataSource && req_dataSource.length) ||
      (this.props.curData.req_query && this.props.curData.req_query.length) || bodyShow

    let methodColor =
      variable.METHOD_COLOR[
        this.props.curData.method ? this.props.curData.method.toLowerCase() : 'get'
      ];



    // statusColor = statusColor[this.props.curData.status?this.props.curData.status.toLowerCase():"undone"];
    // const aceEditor = <div style={{ display: this.props.curData.req_body_other && (this.props.curData.req_body_type !== "form") ? "block" : "none" }} className="colBody">
    //   <AceEditor data={this.props.curData.req_body_other} readOnly={true} style={{ minHeight: 300 }} mode={this.props.curData.req_body_type === 'json' ? 'javascript' : 'text'} />
    // </div>
    if (!methodColor) methodColor = 'get';

    let res = (
      <div className="caseContainer">
        <h2 className="interface-title" style={{ marginTop: 0 }}>
          Basic Information
        </h2>
        <div className="panel-view">
          <Row className="row">
            <Col span={4} className="colKey">
              API Name:
            </Col>
            <Col span={8} className="colName">
              {this.props.curData.title}
            </Col>
            <Col span={4} className="colKey">
              Creator:
            </Col>
            <Col span={8} className="colValue">
              <Link className="user-name" to={'/user/profile/' + this.props.curData.uid}>
                <img src={'/api/user/avatar?uid=' + this.props.curData.uid} className="user-img" />
                {this.props.curData.username}
              </Link>
            </Col>
          </Row>
          <Row className="row">
            <Col span={4} className="colKey">
              Status:
            </Col>
            <Col span={8} className={'tag-status ' + this.props.curData.status}>
              {status[this.props.curData.status]}
            </Col>
            <Col span={4} className="colKey">
              Last updated:
            </Col>
            <Col span={8}>{formatTime(this.props.curData.up_time)}</Col>
          </Row>
          <Row className="row">
            <Col span={4} className="colKey">
              URL:
            </Col>
            <Col
              span={18}
              className="colValue"
              onMouseEnter={this.enterItem}
              onMouseLeave={this.leaveItem}
            >
              <span
                style={{ color: methodColor.color, backgroundColor: methodColor.bac }}
                className="colValue tag-method"
              >
                {this.props.curData.method}
              </span>
              <span className="colValue">
                {this.props.currProject.basepath}
                {this.props.curData.path}
              </span>
              <Tooltip title="Copy URL">
                <Icon
                  type="copy"
                  className="interface-url-icon"
                  onClick={() => this.copyUrl(this.props.curData.path)}
                  style={{ display: this.state.enter ? 'inline-block' : 'none' }}
                />
              </Tooltip>
            </Col>
          </Row>
          <Row className="row">
            <Col span={4} className="colKey">
              Mock url:
            </Col>
            <Col span={18} className="colValue href">
              <span
                onClick={() =>
                  window.open(
                    location.protocol +
                      '//' +
                      location.hostname +
                      (location.port !== '' ? ':' + location.port : '') +
                      `/mock/${this.props.currProject._id}${this.props.currProject.basepath}${
                        this.props.curData.path
                      }`,
                    '_blank'
                  )
                }
              >
                {location.protocol +
                  '//' +
                  location.hostname +
                  (location.port !== '' ? ':' + location.port : '') +
                  `/mock/${this.props.currProject._id}${this.props.currProject.basepath}${
                    this.props.curData.path
                  }`}
              </span>
            </Col>
          </Row>
          {this.props.curData.custom_field_value &&
            this.props.custom_field.enable && (
              <Row className="row remark">
                <Col span={4} className="colKey">
                  {this.props.custom_field.name}：
                </Col>
                <Col span={18} className="colValue">
                  {this.props.curData.custom_field_value}
                </Col>
              </Row>
            )}
        </div>
        {this.props.curData.desc && <h2 className="interface-title">Description</h2>}
        {this.props.curData.desc && (
          <div
            className="tui-editor-contents"
            style={{ margin: '0px', padding: '0px 20px', float: 'none' }}
            dangerouslySetInnerHTML={{ __html: this.props.curData.desc }}
          />
        )}
        <h2 className="interface-title" style={{ display: requestShow ? '' : 'none' }}>
          Request Params
        </h2>
        {req_dataSource.length ? (
          <div className="colHeader">
            <h3 className="col-title">URL Params: </h3>
            <Table
              bordered
              size="small"
              pagination={false}
              columns={req_params_columns}
              dataSource={req_dataSource}
            />
          </div>
        ) : (
          ''
        )}
        {dataSource.length ? (
          <div className="colHeader">
            <h3 className="col-title">Headers: </h3>
            <Table
              bordered
              size="small"
              pagination={false}
              columns={columns}
              dataSource={dataSource}
            />
          </div>
        ) : (
          ''
        )}
        {this.props.curData.req_query && this.props.curData.req_query.length ? (
          <div className="colQuery">
            <h3 className="col-title">Query：</h3>
            {this.req_query(this.props.curData.req_query)}
          </div>
        ) : (
          ''
        )}

        <div
          style={{
            display:
              this.props.curData.method &&
              HTTP_METHOD[this.props.curData.method.toUpperCase()].request_body
                ? ''
                : 'none'
          }}
        >
          <h3 style={{ display: bodyShow ? '' : 'none' }} className="col-title">
            Body:
          </h3>
          {this.props.curData.req_body_type === 'form'
            ? this.req_body_form(this.props.curData.req_body_type, this.props.curData.req_body_form)
            : this.req_body(
                this.props.curData.req_body_type,
                this.props.curData.req_body_other,
                this.props.curData.req_body_is_json_schema
              )}
        </div>

        <h2 className="interface-title">Response Data:</h2>
        {this.res_body(
          this.props.curData.res_body_type,
          this.props.curData.res_body,
          this.props.curData.res_body_is_json_schema
        )}
      </div>
    );

    if (!this.props.curData.title) {
      if (this.state.init) {
        res = <div />;
      } else {
        res = <ErrMsg type="noData" />;
      }
    }
    return res;
  }
}

export default View;
