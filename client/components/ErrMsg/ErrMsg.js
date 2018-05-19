import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import './ErrMsg.scss';
import { withRouter } from 'react-router';

/**
 * 错误信息提示
 *
 * @component ErrMsg
 * @examplelanguage js
 *
 * * 错误信息提示组件
 * * 错误信息提示组件
 *
 *
 */

 /**
 * 标题
 * 一般用于描述错误信息名称
 * @property title
 * @type string
 * @description 一般用于描述错误信息名称
 * @returns {object}
 */
@withRouter
class ErrMsg extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    type: PropTypes.string,
    history: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    desc: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    opration: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  }

  render () {
    let { type, title, desc, opration } = this.props;
    let icon = 'frown-o';
    if (type) {
      switch (type) {
        case 'noFollow':
          title = 'You have not subscribed to this project yet';
          desc = <span>Go to <a onClick={() => this.props.history.push('/group')}>“Project list”</a> and subscribe to a project</span>;
          break;
        case 'noInterface':
          title = 'There is no API for this project yet';
          desc = 'Add API in "API List" to the left';
          break;
        case 'noMemberInProject':
          title = 'There is no Member for this project yet';
          break;
        case 'noMemberInGroup':
          title = 'There is no Member for this Group yet';
          break;
        case 'noProject':
          title = 'There is no project in this group yet';
          desc = <span>please click "new project" button on the top right corner</span>;
          break;
        case 'noData':
          title = 'No data yet';
          desc = 'Try to look around other places';
          break;
        case 'noChange':
          title = 'No change';
          desc = 'This operation did not change the Api configuration'
          icon = 'meh-o';
          break;
        default:
          console.log('default');
      }
    }
    return (
      <div className="err-msg">
        <Icon type={icon} className="icon" />
        <p className="title">{title}</p>
        <p className="desc">{desc}</p>
        <p className="opration">{opration}</p>
      </div>
    )
  }
}

export default ErrMsg;
