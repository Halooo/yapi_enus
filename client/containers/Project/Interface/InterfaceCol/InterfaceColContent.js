import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
//import constants from '../../../../constants/variable.js'
import { Tooltip, Icon, Button, Row, Col, Spin, Modal, message, Select, Switch } from 'antd'
import { fetchInterfaceColList, fetchCaseList, setColData } from '../../../../reducer/modules/interfaceCol'
import HTML5Backend from 'react-dnd-html5-backend';
import { getToken } from '../../../../reducer/modules/project';
import { DragDropContext } from 'react-dnd';
import AceEditor from 'client/components/AceEditor/AceEditor';
import * as Table from 'reactabular-table';
import * as dnd from 'reactabular-dnd';
import * as resolve from 'table-resolver';
import axios from 'axios'
import CaseReport from './CaseReport.js'
import _ from 'underscore'
import { initCrossRequest } from 'client/components/Postman/CheckCrossInstall.js'
import produce from 'immer'
const { handleParams, crossRequest, handleCurrDomain, checkNameIsExistInArray } = require('common/postmanLib.js')
const {handleParamsValue, json_parse} = require('common/utils.js')

const Option = Select.Option;
import copy from 'copy-to-clipboard';



function handleReport(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return {};
  }
}


@connect(
  state => {
    return {
      interfaceColList: state.interfaceCol.interfaceColList,
      currColId: state.interfaceCol.currColId,
      currCaseId: state.interfaceCol.currCaseId,
      isShowCol: state.interfaceCol.isShowCol,
      isRander: state.interfaceCol.isRander,
      currCaseList: state.interfaceCol.currCaseList,
      currProject: state.project.currProject,
      token: state.project.token,
      curProjectRole: state.project.currProject.role
    }
  },
  {
    fetchInterfaceColList,
    fetchCaseList,
    setColData,
    getToken
  }
)
@withRouter
@DragDropContext(HTML5Backend)
class InterfaceColContent extends Component {

  static propTypes = {
    match: PropTypes.object,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    fetchCaseList: PropTypes.func,
    setColData: PropTypes.func,
    history: PropTypes.object,
    currCaseList: PropTypes.array,
    currColId: PropTypes.number,
    currCaseId: PropTypes.number,
    isShowCol: PropTypes.bool,
    isRander: PropTypes.bool,
    currProject: PropTypes.object,
    getToken: PropTypes.func,
    token: PropTypes.string,
    curProjectRole: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.reports = {};
    this.records = {};
    this.state = {
      rows: [],
      reports: {},
      visible: false,
      curCaseid: null,
      hasPlugin: false,
      currColEnv: '',
      advVisible: false,
      curScript: '',
      enableScript: false,
      autoVisible: false,
      mode: 'html',
      email: false
    };
    this.onRow = this.onRow.bind(this);
    this.onMoveRow = this.onMoveRow.bind(this);

  }

  async componentWillMount() {
    const result = await this.props.fetchInterfaceColList(this.props.match.params.id);
    await this.props.getToken(this.props.match.params.id);
    let { currColId } = this.props;
    const params = this.props.match.params;
    const { actionId } = params;
    this.currColId = currColId = +actionId ||
      result.payload.data.data[0]._id;
    this.props.history.push('/project/' + params.id + '/interface/col/' + currColId)
    if (currColId && currColId != 0) {
      let result = await this.props.fetchCaseList(currColId);
      if (result.payload.data.errcode === 0) {
        this.reports = handleReport(result.payload.data.colData.test_report);

      }

      this.props.setColData({ currColId: +currColId, isShowCol: true, isRander: false })

      this.handleColdata(this.props.currCaseList)
    }

    this._crossRequestInterval = initCrossRequest((hasPlugin) => {
      this.setState({
        hasPlugin: hasPlugin
      })
    });

  }

  componentWillUnmount() {
    clearInterval(this._crossRequestInterval)
  }

  // 整合header信息
  handleReqHeader = (req_header) => {
    let env = this.props.currProject.env;
    // console.log('env', env);
    let currDomain = handleCurrDomain(env, this.state.currColEnv);
    let header = currDomain.header;
    header.forEach(item => {
      if (!checkNameIsExistInArray(item.name, req_header)) {
        // item.abled = true;
        item = {
          ...item,
          abled: true
        }
        req_header.push(item)
      }
    })
    return req_header
  }


  handleColdata = (rows) => {
    // let newRows = JSON.parse(JSON.stringify(rows))
    // newRows = newRows.map((item) => {
    //   item.id = item._id;
    //   item._test_status = item.test_status;
    //   item.case_env = this.state.currColEnv || item.case_env
    //   item.req_headers = this.handleReqHeader(item.req_headers)
    //   return item;
    // })

    let that = this;
    let newRows = produce(rows, draftRows => {
      draftRows.map(item=>{
        item.id = item._id;
        item._test_status = item.test_status;
        item.case_env = that.state.currColEnv || item.case_env
        item.req_headers = that.handleReqHeader(item.req_headers)
        return item;
      })
    })

    this.setState({
      rows: newRows
    })
  }

  executeTests = async () => {
    for (let i = 0, l = this.state.rows.length, newRows, curitem; i < l; i++) {
      let { rows } = this.state;
      curitem = Object.assign({}, rows[i], {
        env: this.props.currProject.env,
        pre_script: this.props.currProject.pre_script,
        after_script: this.props.currProject.after_script
      }, { test_status: 'loading' });
      newRows = [].concat([], rows);
      newRows[i] = curitem;
      this.setState({
        rows: newRows
      })
      // console.log('newRows', newRows);
      let status = 'error', result;
      try {
        result = await this.handleTest(curitem);
        if (result.code === 400) {
          status = 'error';
        } else if (result.code === 0) {
          status = 'ok';
        } else if (result.code === 1) {
          status = 'invalid'
        }
      } catch (e) {
        console.error(e);
        status = 'error';
        result = e;
      }

      //result.body = result.data;
      this.reports[curitem._id] = result;
      this.records[curitem._id] = {
        params: result.params,
        body: result.res_body
      };

      curitem = Object.assign({}, rows[i], { test_status: status });
      newRows = [].concat([], rows);
      newRows[i] = curitem;
      this.setState({
        rows: newRows
      })
    }
    await axios.post('/api/col/up_col', { col_id: this.props.currColId, test_report: JSON.stringify(this.reports) })
  }

  handleTest = async (interfaceData) => {
    let requestParams = {};
    let options = handleParams(interfaceData, this.handleValue, requestParams)

    let result = {
      code: 400,
      msg: 'Data Error',
      validRes: []
    };

    try {
      let data = await crossRequest(options, interfaceData.pre_script, interfaceData.after_script)
      let res = data.res.body = json_parse(data.res.body);
      result = {
        ...options,
        ...result,
        res_header: data.res.header,
        res_body: res
      }

      if (options.data && typeof options.data === 'object') {
        requestParams = {
          ...requestParams,
          ...options.data
        }
      }

      let validRes = [];

      let responseData = Object.assign({}, {
        status: data.res.status,
        body: res,
        header: data.res.header,
        statusText: data.res.statusText
      })
      await this.handleScriptTest(interfaceData, responseData, validRes, requestParams);
      if (validRes.length === 0) {
        result.code = 0;
        result.validRes = [{ message: 'Validation passed' }];
      } else if (validRes.length > 0) {
        result.code = 1;
        result.validRes = validRes;
      }


    } catch (data) {
      result = {
        ...options,
        ...result,
        res_header: data.header,
        res_body: data.body || data.message,
        status: null,
        statusText: data.message,
        code: 400
      }
    }

    result.params = requestParams;
    return result;
  }

  //response, validRes
  handleScriptTest = async (interfaceData, response, validRes, requestParams) => {
    if (interfaceData.enable_script !== true) {
      return null;
    }
    try {
      let test = await axios.post('/api/col/run_script', {
        response: response,
        records: this.records,
        script: interfaceData.test_script,
        params: requestParams
      })
      if (test.data.errcode !== 0) {
        test.data.data.logs.forEach(item => {
          validRes.push({
            message: item
          })
        })
      }
    } catch (err) {
      validRes.push({
        message: 'Error: ' + err.message
      })
    }
  }

  handleValue = (val) => {
    return handleParamsValue(val, this.records);
  }



  arrToObj = (arr, requestParams) => {
    arr = arr || [];
    const obj = {};
    arr.forEach(item => {
      if (item.name && item.enable && item.type !== 'file') {
        obj[item.name] = this.handleValue(item.value);
        if (requestParams) {
          requestParams[item.name] = obj[item.name];
        }
      }
    })
    return obj;
  }

  onRow(row) {
    return {
      rowId: row.id,
      onMove: this.onMoveRow,
      onDrop: this.onDrop
    };
  }

  onDrop =() =>{
    let changes = [];
    this.state.rows.forEach((item, index) => {
      changes.push({
        id: item._id,
        index: index
      })
    })
    axios.post('/api/col/up_case_index', changes).then(() => {
    this.props.fetchInterfaceColList(this.props.match.params.id)
    })

  }
  onMoveRow({ sourceRowId, targetRowId }) {
    let rows = dnd.moveRows({
      sourceRowId,
      targetRowId
    })(this.state.rows);

    if (rows) {
      this.setState({ rows });
    }
  }

  async componentWillReceiveProps(nextProps) {
    let newColId = !isNaN(nextProps.match.params.actionId) ? +nextProps.match.params.actionId : 0;

    if (newColId && this.currColId && newColId !== this.currColId || nextProps.isRander) {
      this.currColId = newColId;
      await this.props.fetchCaseList(newColId);
      this.props.setColData({ currColId: +newColId, isShowCol: true, isRander: false })
      this.handleColdata(this.props.currCaseList)
    }
  }

  openReport = (id) => {
    if (!this.reports[id]) {
      return message.warn('Report not generated yet')
    }
    this.setState({
      visible: true,
      curCaseid: id
    })
  }

  openAdv = (id) => {
    let findCase = _.find(this.props.currCaseList, item => item.id === id)

    this.setState({
      enableScript: findCase.enable_script,
      curScript: findCase.test_script,
      advVisible: true,
      curCaseid: id
    })
  }

  handleScriptChange = (d) => {
    this.setState({
      curScript: d.text
    })
  }

  handleAdvCancel = () => {
    this.setState({
      advVisible: false
    });
  }

  handleAdvOk = async () => {
    const { curCaseid, enableScript, curScript } = this.state;
    const res = await axios.post('/api/col/up_case', {
      id: curCaseid,
      test_script: curScript,
      enable_script: enableScript
    });
    if (res.data.errcode === 0) {
      message.success('Updated');
    }
    this.setState({
      advVisible: false
    });
    let currColId = this.currColId;
    await this.props.fetchCaseList(currColId);
    this.props.setColData({ currColId: +currColId, isShowCol: true, isRander: false })
    this.handleColdata(this.props.currCaseList)
  }

  handleCancel = () => {
    this.setState({
      visible: false
    });
  }

  colEnvChange = (envName) => {
    this.setState({
      currColEnv: envName
    }, () => this.handleColdata(this.props.currCaseList));
  }

  autoTests = () =>{
    this.setState({
      autoVisible: true
    })
  }

  handleAuto = () =>{
    this.setState({
      autoVisible: false,
      email: false,
      mode: 'html'
    })
  }

  copyUrl =(url) =>{

    copy(url)
    message.success('Copied to clipbord');
  }

  modeChange =(mode)=>{
    this.setState({
      mode
    })
  }

  emailChange =(email) =>{
    this.setState({
      email
    })
  }

  render() {
    // console.log('rows',this.state.rows);
    const columns = [{
      property: 'casename',
      header: {
        label: 'Case name'
      },
      props: {
        style: {
          width: '250px'
        }
      },
      cell: {
        formatters: [
          (text, { rowData }) => {
            let record = rowData;
            return <Link to={"/project/" + record.project_id + "/interface/case/" + record._id}>{record.casename.length > 23 ? record.casename.substr(0, 20) + '...' : record.casename}</Link>
          }
        ]
      }
    }, {
      header: {
        label: 'key',
        formatters: [() => {
          return <Tooltip title={<span>Every case has a unique key to get response data from API. For example, <a href="https://yapi.ymfe.org/case.html#parameter" className="link-tooltip" target="blank">parameter</a> </span>}>
            Key</Tooltip>
        }]
      },
      props: {
        style: {
          width: '100px'
        }
      },
      cell: {
        formatters: [
          (value, { rowData }) => {
            return <span>{rowData._id}</span>
          }]
      }
    }, {
      property: 'test_status',
      header: {
        label: 'Status'
      },
      props: {
        style: {
          width: '100px'
        }
      },
      cell: {
        formatters: [(value, { rowData }) => {
          let id = rowData._id;
          let code = this.reports[id] ? this.reports[id].code : 0;
          if (rowData.test_status === 'loading') {
            return <div ><Spin /></div>
          }

          switch (code) {
            case 0:
              return <div ><Tooltip title="Pass"><Icon style={{ color: '#00a854' }} type="check-circle" /></Tooltip></div>
            case 400:
              return <div ><Tooltip title="Request error"><Icon type="info-circle" style={{ color: '#f04134' }} /></Tooltip></div>
            case 1:
              return <div ><Tooltip title="Validation failed"><Icon type="exclamation-circle" style={{ color: '#ffbf00' }} /></Tooltip></div>
            default:
              return <div ><Icon style={{ color: '#00a854' }} type="check-circle" /></div>
          }
        }]
      }
    }, {
      property: 'path',
      header: {
        label: 'API path'
      },
      cell: {
        formatters: [
          (text, { rowData }) => {
            let record = rowData;
            return (
              <Tooltip title="Go to API">
                <Link to={`/project/${record.project_id}/interface/api/${record.interface_id}`}>{record.path.length > 23 ? record.path + '...' : record.path}</Link>
              </Tooltip>
            )
          }
        ]
      }
    },
    {
      header: {
        label: 'Test report'

      },
      props: {
        style: {
          width: '200px'
        }
      },
      cell: {
        formatters: [(text, { rowData }) => {
          let reportFun = () => {
            if (!this.reports[rowData.id]) {
              return null;
            }
            return <Button onClick={() => this.openReport(rowData.id)}>Test report</Button>
          }
          return <div className="interface-col-table-action">
            {reportFun()}
          </div>
        }]
      }
    }
    ];
    const { rows, currColEnv } = this.state;
    const components = {
      header: {
        cell: dnd.Header
      },
      body: {
        row: dnd.Row
      }
    };
    const resolvedColumns = resolve.columnChildren({ columns });
    const resolvedRows = resolve.resolve({
      columns: resolvedColumns,
      method: resolve.nested
    })(rows);
    let colEnv = this.props.currProject.env || [];
    const localUrl = location.protocol + '//' + location.hostname + (location.port !== "" ? ":" + location.port : "");
    const autoTestsUrl = `/api/open/run_auto_test?id=${this.props.currColId}&token=${this.props.token}${this.state.currColEnv ? '&env_name='+this.state.currColEnv: ''}&mode=${this.state.mode}&email=${this.state.email}`;
    return (
      <div className="interface-col">
        <h2 className="interface-title" style={{ display: 'inline-block', margin: "0 20px", marginBottom: '16px' }}>Test cases&nbsp;<a target="_blank" rel="noopener noreferrer" href="https://yapi.ymfe.org/documents/case.html" >
          <Tooltip title="Click for documentation"><Icon type="question-circle-o" /></Tooltip>
        </a></h2>
        <div style={{ display: 'inline-block', margin: 0, marginBottom: '16px' }}>
          <Select value={currColEnv} style={{ width: "320px" }} onChange={this.colEnvChange}>
            <Option key="default" value="" >Default env</Option>
            {
              colEnv.map((item) => {
                return <Option key={item._id} value={item.name}>{item.name + ": " + item.domain}</Option>;
              })
            }
          </Select>
          &nbsp;
          <Tooltip title="Default use env for test example"><Icon type="question-circle-o" /></Tooltip>
        </div>
        {this.state.hasPlugin ?
          <div style={{ float: 'right' }}>
            {this.props.curProjectRole !=='guest'&&
              <Tooltip title="Automated test cannot be running on YApi server，Test env cannot be private network，please ensure YApi server can visit automated test server domain">
                <Button style={{ marginRight: '8px' }} onClick={this.autoTests}>Run Tests</Button>
              </Tooltip>
            }
            <Button type="primary" onClick={this.executeTests}>Start test</Button>
          </div>
           :
          <Tooltip title="请安装 cross-request Chrome 插件">
            <Button disabled type="primary" style={{ float: 'right' }} >Start test</Button>
          </Tooltip>
        }

        <Table.Provider
          components={components}
          columns={resolvedColumns}
          style={{ width: '100%', borderCollapse: 'collapse' }}
        >
          <Table.Header
            className="interface-col-table-header"
            headerRows={resolve.headerRows({ columns })}
          />

          <Table.Body
            className="interface-col-table-body"
            rows={resolvedRows}
            rowKey="id"
            onRow={this.onRow}
          />
        </Table.Provider>
        <Modal
          title="Test report"
          width="900px"
          style={{ minHeight: '500px' }}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <CaseReport {...this.reports[this.state.curCaseid]} />
        </Modal>

        <Modal
          title="Customize test script"
          width="660px"
          style={{ minHeight: '500px' }}
          visible={this.state.advVisible}
          onCancel={this.handleAdvCancel}
          onOk={this.handleAdvOk}
          maskClosable={false}
        >
          <h3>
            是否开启:&nbsp;
            <Switch checked={this.state.enableScript} onChange={e => this.setState({ enableScript: e })} />
          </h3>
          <AceEditor className="case-script" data={this.state.curScript} onChange={this.handleScriptChange} />

        </Modal>
        <Modal
          title="Server side automated tests"
          width="780px"
          style={{ minHeight: '500px' }}
          visible={this.state.autoVisible}
          onCancel={this.handleAuto}
          className="autoTestsModal"
          footer={null}
        >
          <Row type="flex" justify="space-around" className="row" align="middle">
            <Col span={3} className="label">Select env
              <Tooltip title="default to sample test env"><Icon type="question-circle-o" /></Tooltip>
              &nbsp;：
            </Col>
            <Col span={21}>
              <Select value={currColEnv} style={{ width: "320px" }} onChange={this.colEnvChange}>
                <Option key="default" value="" >Default env</Option>
                {
                  colEnv.map((item) => {
                  return <Option key={item._id} value={item.name}>{item.name + ": " + item.domain}</Option>;
                })
                }
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="space-around" className="row" align="middle">
            <Col span={3} className="label">Output format：</Col>
            <Col span={21}>
              <Select value={this.state.mode} onChange={this.modeChange}>
                <Option key="html" value="html" >html</Option>
                <Option key="json" value="json" >json</Option>
              </Select>
            </Col>
          </Row>
          <Row type="flex" justify="space-around" className="row" align="middle">
            <Col span={3} className="label">
             Email alert
              <Tooltip title={'Send email to project members when tests are not passing'}>
                <Icon type="question-circle-o" style={{ width: "10px" }} />
              </Tooltip>
              &nbsp;：
            </Col>
            <Col span={21}>
              <Switch checked={this.state.email} checkedChildren="Enable" unCheckedChildren="Disable" onChange={this.emailChange}/>
            </Col>
          </Row>

          <Row type="flex" justify="space-around" className="row" align="middle">
            <Col span={21} className="autoTestUrl"><a href={localUrl+autoTestsUrl} target="_blank">{autoTestsUrl}</a></Col>
            <Col span={3}>
              <Button className="copy-btn" onClick={()=>this.copyUrl(localUrl+autoTestsUrl)}>Copy</Button>
            </Col>
          </Row>
          <div className="autoTestMsg">
             Note：visit this URL，it can test all the cases, please ensure YApi server can visit the domain for testing server
          </div>
        </Modal>

      </div>
    )
  }
}

export default InterfaceColContent
