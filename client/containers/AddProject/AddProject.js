import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Form, Input, Icon, Tooltip, Select, message, Row, Col, Radio } from 'antd';
import { addProject } from  '../../reducer/modules/project.js';
import { fetchGroupList } from '../../reducer/modules/group.js'
import { autobind } from 'core-decorators';
import { setBreadcrumb } from  '../../reducer/modules/user';
const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { pickRandomProperty, handlePath, nameLengthLimit } from '../../common';
import constants from '../../constants/variable.js';
import { withRouter } from 'react-router';
import './Addproject.scss';

const formItemLayout = {
  labelCol: {
    lg: { span: 3 },
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    lg: { span: 21 },
    xs: { span: 24 },
    sm: { span: 14 }
  },
  className: 'form-item'
};

@connect(
  state => {
    return {
      groupList: state.group.groupList,
      currGroup: state.group.currGroup
    }
  },
  {
    fetchGroupList,
    addProject,
    setBreadcrumb
  }
)
@withRouter
class ProjectList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupList: [],
      currGroupId: null
    }
  }
  static propTypes = {
    groupList: PropTypes.array,
    form: PropTypes.object,
    currGroup: PropTypes.object,
    addProject: PropTypes.func,
    history: PropTypes.object,
    setBreadcrumb: PropTypes.func,
    fetchGroupList: PropTypes.func
  }

  handlePath = (e)=>{
    let val = e.target.value
    this.props.form.setFieldsValue({
      basepath: handlePath(val)
    })
  }

  // 确认添加项目
  @autobind
  handleOk(e) {
    const { form, addProject } = this.props;
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        values.group_id = values.group;
        values.icon = constants.PROJECT_ICON[0];
        values.color = pickRandomProperty(constants.PROJECT_COLOR);
        addProject(values).then((res) => {
          if (res.payload.data.errcode == 0) {
            form.resetFields();
            message.success('Created! ');
            this.props.history.push('/project/' + res.payload.data.data._id + '/interface/api');
          }
        });
      }
    });
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{name: 'New project'}]);
    if(!this.props.currGroup._id){
      await this.props.fetchGroupList();
    }
    if(this.props.groupList.length === 0){
      return null;
    }
    this.setState({
      currGroupId: this.props.currGroup._id ? this.props.currGroup._id : this.props.groupList[0]._id
    })
    this.setState({groupList: this.props.groupList});
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="g-row">
        <div className="g-row m-container">
          <Form>

            <FormItem
              {...formItemLayout}
              label="Project Name"
            >
              {getFieldDecorator('name', {
                rules: nameLengthLimit('Project')
              })(
                <Input />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Group"
            >
              {getFieldDecorator('group', {
                initialValue: this.state.currGroupId+'' ,
                rules: [{
                  required: true, message: 'Please select whcih group it belongs to!'
                }]
              })(
                <Select>
                  {this.state.groupList.map((item, index) => (
                    <Option disabled={!(item.role === 'dev' || item.role === 'owner' || item.role === 'admin')} value={item._id.toString()} key={index}>{item.group_name}</Option>
                  ))}
                </Select>
              )}
            </FormItem>

            <hr className="breakline" />

            <FormItem
              {...formItemLayout}
              label={(
                <span>
                  default route&nbsp;
                  <Tooltip title="default route for API，leave empty for root">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              )}
            >
              {getFieldDecorator('basepath', {
                rules: [{
                  required: false, message: 'enter default route for the project'
                }]
              })(
                <Input onBlur={this.handlePath} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Description"
            >
              {getFieldDecorator('desc', {
                rules: [{
                  required: false, message: 'Description under 50 chars!', max: 50
                }]
              })(
                <TextArea rows={4} />
              )}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Scope"
            >
              {getFieldDecorator('project_type', {
                rules: [{
                  required: true
                }],
                initialValue: 'private'
              })(
                <RadioGroup>
                  <Radio value="private" className="radio">
                    <Icon type="lock" />Private<br /><span className="radio-desc">Only group owner and project developer can index and see this project</span>
                  </Radio>
                  <br />
                  <Radio value="public" className="radio">
                    <Icon type="unlock" />Public<br /><span className="radio-desc">Everyone can index and see the project</span>
                  </Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
          <Row>
            <Col sm={{ offset: 6 }} lg={{ offset: 3 }}>
              <Button className="m-btn" icon="plus" type="primary"
                onClick={this.handleOk}
                >Create Project</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Form.create()(ProjectList);
