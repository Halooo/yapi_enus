import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Select, InputNumber, Switch, Col, message, Row, Input, Button, Icon, AutoComplete, Modal } from 'antd'
const Option = Select.Option;
const FormItem = Form.Item;
import { safeAssign } from 'client/common.js';
import AceEditor from 'client/components/AceEditor/AceEditor'
import constants from 'client/constants/variable.js'
import { httpCodes } from '../index.js'
import './CaseDesModal.scss'
import { connect } from 'react-redux'
import json5 from 'json5'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 12 }
};
const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 12, offset: 5 }
};

@connect(
  state => {
    return {
      currInterface: state.inter.curdata
    }
  }
)
class CaseDesForm extends Component {
  static propTypes = {
    form: PropTypes.object,
    caseData: PropTypes.object,
    currInterface: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isAdd: PropTypes.bool,
    visible: PropTypes.bool
  }
  // 初始化输入数据
  preProcess = caseData => {
    try {
      caseData = JSON.parse(JSON.stringify(caseData))
    } catch (error) {
      console.log(error)
    }
    
    const initCaseData = {
      ip: '',
      ip_enable: false,
      name: '',
      code: '200',
      delay: 0,
      headers: [{ name: '', value: '' }],
      paramsArr: [{ name: '', value: '' }],
      params: {},
      res_body: '',
      paramsForm: 'form'
    }
    caseData.params = caseData.params || {};
    const paramsArr = Object.keys(caseData.params).length ? Object.keys(caseData.params).map(key => {
      return { name: key, value: caseData.params[key] }
    }).filter(item => {
      if (typeof item.value === 'object') {
        // this.setState({ paramsForm: 'json' })
        caseData.paramsForm = 'json'
      }
      return typeof item.value !== 'object'
    }) : [{ name: '', value: '' }];
    const headers = caseData.headers && caseData.headers.length ? caseData.headers : [{ name: '', value: '' }];
    caseData.code = '' + caseData.code;
    caseData.params = JSON.stringify(caseData.params, null, 2);
    
    caseData = safeAssign(initCaseData, { ...caseData, headers, paramsArr });

    return caseData;
  }

  constructor(props) {
    super(props)
    const { caseData } = this.props;
    this.state = this.preProcess(caseData);
    
  }

  // 处理request_body编译器
  handleRequestBody = (d) => {
    this.setState({ res_body: d.text })
  }

  // 处理参数编译器
  handleParams = (d) => {
    this.setState({ params: d.text })
  }

  // 增加参数信息
  addValues = (key) => {
    const { getFieldValue } = this.props.form;
    let values = getFieldValue(key);
    values = values.concat({ name: '', value: '' });
    this.setState({ [key]: values })
  }

  // 删除参数信息
  removeValues = (key, index) => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    let values = getFieldValue(key);
    values = values.filter((val, index2) => index !== index2);
    setFieldsValue({ [key]: values })
    this.setState({ [key]: values })
  }

  // 处理参数
  getParamsKey = () => {
    let { req_query, req_body_form, req_body_type, method, req_body_other } = this.props.currInterface;
    let keys = [];

    req_query && Array.isArray(req_query) && req_query.forEach(item => {
      keys.push(item.name)
    })
    if (constants.HTTP_METHOD[method.toUpperCase()].request_body && req_body_type === 'form') {
      req_body_form && Array.isArray(req_body_form) && req_body_form.forEach(item => {
        keys.push(item.name)
      })
    } else if (constants.HTTP_METHOD[method.toUpperCase()].request_body && req_body_type === 'json' && req_body_other) {

      try {
        const bodyObj = json5.parse(req_body_other)
        keys = keys.concat(Object.keys(bodyObj))
      } catch (error) {
        console.log(error)
      }
    }
    return keys
  }

  endProcess = caseData => {
    const headers = [];
    const params = {};
    const { paramsForm } = this.state;
    caseData.headers && Array.isArray(caseData.headers) && caseData.headers.forEach(item => {
      if (item.name) {
        headers.push({
          name: item.name,
          value: item.value
        })
      }
    });
    caseData.paramsArr && Array.isArray(caseData.paramsArr) && caseData.paramsArr.forEach(item => {
      if (item.name) {
        params[item.name] = item.value
      }
    })
    caseData.headers = headers;
    if (paramsForm === 'form') {
      caseData.params = params;
    } else {
      try {
        caseData.params = json5.parse(caseData.params)
      } catch (error) {
        console.log(error)
        message.error('request json format incorrect')
        return false;
      }
    }
    delete caseData.paramsArr;
  
    return caseData;
  }

  handleOk = () => {
    const form = this.props.form;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.res_body = this.state.res_body;
        values.params = this.state.params;
        this.props.onOk(this.endProcess(values));
      }
    })
  }
  
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isAdd, visible, onCancel } = this.props;
    const { name, code, headers, ip, ip_enable, params, paramsArr, paramsForm, res_body, delay } = this.state
    
    this.props.form.initialValue
    const valuesTpl = (values, title) => {
      const dataSource = this.getParamsKey();
      const display = paramsForm === 'json' ? 'none' : ''
      return values.map((item, index) => (
        <div key={index} className="paramsArr" style={{ display }}>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel) }
            wrapperCol={index === 0 ? { span: 19 } : { span: 19, offset: 5 }}
            label={index ? '' : title}
          >
            <Row gutter={8}>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`paramsArr[${index}].name`, { initialValue: item.name })(
                    <AutoComplete
                      dataSource={dataSource}
                      placeholder="Param Name"
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`paramsArr[${index}].value`, { initialValue: item.value })(
                    <Input placeholder="Value" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                {values.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.removeValues('paramsArr', index)}
                  />
                ) : null}
              </Col>
            </Row>
          </FormItem>
        </div>
      ))
    }
    const headersTpl = (values, title) => {

      const dataSource = constants.HTTP_REQUEST_HEADER;
      return values.map((item, index) => (
        <div key={index} className='headers'>
          <FormItem
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel) }
            wrapperCol={index === 0 ? { span: 19 } : { span: 19, offset: 5 }}
            label={index ? '' : title}
          >
            <Row gutter={8}>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`headers[${index}].name`, { initialValue: item.name })(
                    <AutoComplete
                      dataSource={dataSource}
                      placeholder="Param Name"
                      filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem>
                  {getFieldDecorator(`headers[${index}].value`, { initialValue: item.value })(
                    <Input placeholder="Value" />
                  )}
                </FormItem>
              </Col>
              <Col span={4}>
                {values.length > 1 ? (
                  <Icon
                    className="dynamic-delete-button"
                    type="minus-circle-o"
                    onClick={() => this.removeValues('headers', index)}
                  />
                ) : null}
              </Col>
            </Row>
          </FormItem>
        </div>
      ))
    }
    return (
      <Modal
        title={isAdd ? 'Add Expect' : 'Edit Expect'}
        visible={visible}
        maskClosable={false}
        onOk={this.handleOk}
        width={780}
        onCancel={() => onCancel()}
        afterClose={() => this.setState({paramsForm: 'form'})}
        className="case-des-modal"
      >
        <Form onSubmit={this.handleOk}>
          <h2 className="sub-title" style={{ marginTop: 0 }}>Basic Info</h2>
          <FormItem
              {...formItemLayout}
              label="Expect Name"
          >
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: 'Please enter name for Expect！' }]
            })(
              <Input placeholder="Enter name" />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="IP Filter" className="ip-filter">
            <Col span={6} className="ip-switch">
              <FormItem>
                {getFieldDecorator('ip_enable', {
                  initialValue: ip_enable,
                  valuePropName: 'checked',
                  rules: [{ type: 'boolean' }]
                })(
                  <Switch />
                )}
              </FormItem>
            </Col>
            <Col span={18}>
              <div style={{ display: getFieldValue('ip_enable') ? '' : 'none' }} className="ip">
                <FormItem>
                  {getFieldDecorator('ip' ,getFieldValue('ip_enable') ? {
                    initialValue: ip,
                    rules: [{ pattern: constants.IP_REGEXP, message: 'Please enter correct IP address', required: true }]
                  } : {})(
                    <Input placeholder="Enter filtered IP address" />
                  )}
                </FormItem>
              </div>
            </Col>
          </FormItem>
          <Row className="params-form" style={{ marginBottom: 8 }}>
            <Col {...{ span: 12, offset: 5 }}>
              <Switch
                size="small"
                checkedChildren="JSON"
                unCheckedChildren="JSON"
                checked={paramsForm === 'json'}
                onChange={bool => {
                  this.setState({ paramsForm: bool ? 'json' : 'form' })
              }}
              />
            </Col>
          </Row>
          {
            valuesTpl(paramsArr, 'Param filter')
          }
          <FormItem wrapperCol={{ span: 6, offset: 5 }} style={{ display: paramsForm === 'form' ? '' : 'none' }}>
            <Button size="default" type="primary" onClick={() => this.addValues('paramsArr')} style={{ width: '100%' }}>
              <Icon type="plus" /> Add Param
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} wrapperCol={{ span: 17 }} label="Param filter" style={{ display: paramsForm === 'form' ? 'none' : '' }}>
            <AceEditor
              className="pretty-editor"
              data={params}
              onChange={this.handleParams}
            />
            <FormItem
            >
              {getFieldDecorator('params', paramsForm === 'json' ? {
                  rules: [{ validator: this.jsonValidator, message: 'Enter correct JSON string' }]
              } : {})(
                <Input style={{ display: 'none' }} />
                )}
            </FormItem>
          </FormItem>
          <h2 className="sub-title">Response</h2>
          <FormItem
              {...formItemLayout}
              required
              label="HTTP Code"
            >
            {getFieldDecorator('code',{
              initialValue: code
            })(
              <Select showSearch>
                {
                  httpCodes.map(code => <Option key={'' + code} value={'' + code}>{'' + code}</Option>)
                }
              </Select>
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="Time Delay"
          >
            {getFieldDecorator('delay', {
                initialValue: delay,
                rules: [{ required: true, message: 'Enter delay time', type: 'integer' }]
            })(
              <InputNumber placeholder="Delay time" min={0} />
              )}
            <span>ms</span>
          </FormItem>
          {
            headersTpl(headers, 'HTTP Header')
          }
          <FormItem wrapperCol={{ span: 6, offset: 5 }}>
            <Button size="default" type="primary" onClick={() => this.addValues('headers')} style={{ width: '100%' }}>
              <Icon type="plus" /> Add HTTP Header
            </Button>
          </FormItem>
          <FormItem {...formItemLayout} wrapperCol={{ span: 17 }} label="Body" required>
            <FormItem>
              <AceEditor
                className="pretty-editor"
                data={res_body}
                mode={this.props.currInterface.res_body_type === 'json' ? null : 'text'}
                onChange={this.handleRequestBody}
              />
            </FormItem>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

const CaseDesModal = Form.create()(CaseDesForm);
export default CaseDesModal;