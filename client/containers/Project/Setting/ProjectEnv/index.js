import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
import { Icon, Layout, Tooltip, message, Row, Popconfirm } from 'antd';
const { Content, Sider } = Layout;
import ProjectEnvContent from './ProjectEnvContent.js';
import { connect } from 'react-redux';
import { updateEnv, getProject } from '../../../../reducer/modules/project';
import EasyDragSort from '../../../../components/EasyDragSort/EasyDragSort.js';

@connect(
  state => {
    return {
      projectMsg: state.project.currProject
    };
  },
  {
    updateEnv,
    getProject
  }
)
class ProjectEnv extends Component {
  static propTypes = {
    projectId: PropTypes.number,
    updateEnv: PropTypes.func,
    getProject: PropTypes.func,
    projectMsg: PropTypes.object,
    onOk: PropTypes.func
  };

  initState(curdata, id) {
    let newValue = {};
    newValue['env'] = [].concat(curdata);
    newValue['_id'] = id;
    return Object.assign(
      {
        currentEnvMsg: {},
        delIcon: null,
        currentKey: -2
      },
      newValue
    );
  }

  constructor(props) {
    super(props);
    const { env, _id } = props.projectMsg;
    this.state = this.initState(env, _id);
  }
  async componentWillMount() {
    await this.props.getProject(this.props.projectId);
    this.handleClick(0, this.state.env[0]);
  }

  handleClick = (key, data) => {
    this.setState({
      currentEnvMsg: data,
      currentKey: key
    });
  };

  // 增加环境变量项
  addParams = (name, data) => {
    let newValue = {};
    data = { name: 'New env', domain: '', header: [] };
    newValue[name] = [].concat(data, this.state[name]);
    this.setState(newValue);
    this.handleClick(0, data);
  };

  // 删除提示信息
  showConfirm(key, name) {
    let assignValue = this.delParams(key, name);
    this.onSave(assignValue);
  }

  // 删除环境变量项
  delParams = (key, name) => {
    let curValue = this.state.env;
    let newValue = {};
    newValue[name] = curValue.filter((val, index) => {
      return index !== key;
    });
    this.setState(newValue);
    this.handleClick(0, newValue[name][0]);
    newValue['_id'] = this.state._id;
    return newValue;
  };

  enterItem = key => {
    this.setState({ delIcon: key });
  };

  // 保存设置
  async onSave(assignValue) {
    await this.props
      .updateEnv(assignValue)
      .then(res => {
        if (res.payload.data.errcode == 0) {
          this.props.getProject(this.props.projectId);
          message.success('Edit success! ');
          this.setState({ ...assignValue });
        }
      })
      .catch(() => {
        message.error('Env setting failed ');
      });
  }

  //  提交保存信息
  onSubmit = (value, index) => {
    let assignValue = {};
    assignValue['env'] = [].concat(this.state.env);
    assignValue['env'].splice(index, 1, value['env']);
    assignValue['_id'] = this.state._id;
    this.onSave(assignValue);
    this.props.onOk && this.props.onOk(assignValue['env'], index);
  };

  // 动态修改环境名称
  handleInputChange = (value, currentKey) => {
    let newValue = [].concat(this.state.env);
    newValue[currentKey].name = value || 'New env';
    this.setState({ env: newValue });
  };

  // 侧边栏拖拽
  handleDragMove = name => {
    return (data, from, to) => {
      let newValue = {
        [name]: data
      };
      this.setState(newValue);
      newValue['_id'] = this.state._id;
      this.handleClick(to, newValue[name][to]);
      this.onSave(newValue);
    };
  };

  render() {
    const { env, currentKey } = this.state;
    const envSettingItems = env.map((item, index) => {
      return (
        <Row
          key={index}
          className={'menu-item ' + (index === currentKey ? 'menu-item-checked' : '')}
          onClick={() => this.handleClick(index, item)}
          onMouseEnter={() => this.enterItem(index)}
        >
          <span className="env-icon-style">
            <span className="env-name" style={{ color: item.name === 'New env' && '#2395f1' }}>
              {item.name}
            </span>
            <Popconfirm
              title="Are you sure to delete this env variable?"
              onConfirm={e => {
                e.stopPropagation();
                this.showConfirm(index, 'env');
              }}
              okText="Confirm"
              cancelText="Cancel"
            >
              <Icon
                type="delete"
                className="interface-delete-icon"
                style={{
                  display: this.state.delIcon == index && env.length - 1 !== 0 ? 'block' : 'none'
                }}
              />
            </Popconfirm>
          </span>
        </Row>
      );
    });

    return (
      <div className="m-env-panel">
        <Layout className="project-env">
          <Sider width={195} style={{ background: '#fff' }}>
            <div style={{ height: '100%', borderRight: 0 }}>
              <Row className="first-menu-item menu-item">
                <div className="env-icon-style">
                  <h3>
                    Env List&nbsp;<Tooltip placement="top" title="Add env settings here">
                      <Icon type="question-circle-o" />
                    </Tooltip>
                  </h3>
                  <Tooltip title="Add env variables">
                    <Icon type="plus" onClick={() => this.addParams('env')} />
                  </Tooltip>
                </div>
              </Row>
              <EasyDragSort data={() => env} onChange={this.handleDragMove('env')}>
                {envSettingItems}
              </EasyDragSort>
            </div>
          </Sider>
          <Layout className="env-content">
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <ProjectEnvContent
                projectMsg={this.state.currentEnvMsg}
                onSubmit={e => this.onSubmit(e, currentKey)}
                handleEnvInput={e => this.handleInputChange(e, currentKey)}
              />
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default ProjectEnv;
