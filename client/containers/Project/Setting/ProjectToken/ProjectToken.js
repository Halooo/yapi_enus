import React, {Component} from 'react'
import PropTypes from 'prop-types'
import './ProjectToken.scss'
import { getToken, updateToken } from '../../../../reducer/modules/project';
import { connect } from 'react-redux';
import { Icon, Tooltip, message, Modal } from 'antd';
import copy from 'copy-to-clipboard';
const confirm = Modal.confirm;



@connect(
  state => {
    return {
      token: state.project.token
    }
  },
  {
    getToken,
    updateToken
  }
)
class ProjectToken extends Component {

  static propTypes = {
    projectId: PropTypes.number,
    getToken: PropTypes.func,
    token: PropTypes.string,
    updateToken: PropTypes.func,
    curProjectRole: PropTypes.string
  }

  async componentDidMount() {
    await this.props.getToken(this.props.projectId);

  }

  copyToken = () => {
    copy(this.props.token)
    message.success('Copied to clipboard');
  }

  updateToken = () =>{
    let that = this;
    confirm({
      title: 'Regenerating key',
      content: 'Previous key will no longer work after regenerating key, are you sure?',
      okText: "Confirm",
      cancelText: "Cancel",
      async onOk() {
       await that.props.updateToken(that.props.projectId);
       message.success('Key updated');
      },
      onCancel() {}
    });
  }


  render() {

    return (
      <div className="project-token">
        <h2 className="token-title">Token</h2>
        <div className="message">{`Every project has a unique token, user can see the content of the project through this token`}</div>
        <div className="token">
          <span>token:  <span className="token-message">{this.props.token}</span></span>
          <Tooltip title="Copy">
            <Icon className="token-btn" type="copy" onClick={this.copyToken}/>
          </Tooltip>
          { this.props.curProjectRole === 'admin' || this.props.curProjectRole === 'owner' ?
            <Tooltip title="Refresh">
              <Icon className="token-btn" type="reload" onClick={this.updateToken} />
            </Tooltip> : null
          }
        </div>
        <div className="blockquote">{`To ensure the security, do not tell others about the token other than users in this project`}</div>
      </div>
    )
  }
}

export default ProjectToken
