import './Header.scss'
import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Icon, Layout, Menu, Dropdown, message, Tooltip, Popover, Tag } from 'antd'
import { checkLoginState, logoutActions, loginTypeAction } from '../../reducer/modules/user'
import { changeMenuItem } from '../../reducer/modules/menu'
import { withRouter } from 'react-router';
import Srch from './Search/Search'
const { Header } = Layout;
import LogoSVG from '../LogoSVG/index.js';
import Breadcrumb from '../Breadcrumb/Breadcrumb.js'
import GuideBtns from '../GuideBtns/GuideBtns.js';
const plugin = require('client/plugin.js');

let HeaderMenu = {
  user: {
    path: '/user/profile',
    name: 'User Center',
    icon: 'user',
    adminFlag: false
  },
  solution: {
    path: '/user/list',
    name: 'User Management',
    icon: 'solution',
    adminFlag: true
  }
};

plugin.emitHook('header_menu', HeaderMenu);

const MenuUser = (props) => (
  <Menu theme="dark" className="user-menu">
    {Object.keys(HeaderMenu).map(key => {
      let item = HeaderMenu[key];
      const isAdmin = props.role === 'admin';
      if (item.adminFlag && !isAdmin) {
        return null
      }
      return (
        <Menu.Item key={key}>
          {
            item.name === 'User Center' ? <Link to={item.path + `/${props.uid}`}>
              <Icon type={item.icon} />
              {item.name}
            </Link> : <Link to={item.path}><Icon type={item.icon} />
              {item.name}
            </Link>
          }
        </Menu.Item>
      )
    })}
    {/*<Menu.Item key="0">*/}
    {/*<Link to={`/user/profile/${props.uid}`} onClick={props.relieveLink}><Icon type="user"/>个人中心</Link>*/}
    {/*</Menu.Item>*/}
    {/*<Menu.Item key="1">*/}
    {/*<Link to={`/follow`} onClick={props.relieveLink}><Icon type="star-o"/>我的关注</Link>*/}
    {/*</Menu.Item>*/}
    {/*{*/}
    {/*props.role === "admin" ? <Menu.Item key="2">*/}
    {/*<Link to={`/user/list`}><Icon type="solution"/>用户管理</Link>*/}
    {/*</Menu.Item> : ""*/}
    {/*}*/}

    <Menu.Item key="9">
      <a onClick={props.logout}><Icon type="logout" />Exit</a>
    </Menu.Item>
  </Menu>
);

const tipFollow = (<div className="title-container">
  <h3 className="title"><Icon type="star" /> Favorite</h3>
  <p>This is your personal favorite folder, for your convenience to find your own projects</p>
</div>);
const tipAdd = (<div className="title-container">
  <h3 className="title"><Icon type="plus-circle" /> New Project</h3>
  <p>Create new project anytime you want</p>
</div>);
const tipDoc = (<div className="title-container">
  <h3 className="title">Documentation <Tag color="orange">Recommended!</Tag></h3>
  <p>First time using YApi？read <a target="_blank" href="https://yapi.ymfe.org" rel="noopener noreferrer">user manual</a>
   for more details</p>
</div>);

MenuUser.propTypes = {
  user: PropTypes.string,
  msg: PropTypes.string,
  role: PropTypes.string,
  uid: PropTypes.number,
  relieveLink: PropTypes.func,
  logout: PropTypes.func
}

const ToolUser = (props) => {
  let imageUrl = props.imageUrl ? props.imageUrl : `/api/user/avatar?uid=${props.uid}`;
  return (
    <ul>
      <li className="toolbar-li item-search">
        <Srch groupList={props.groupList} />
      </li>
      <Popover
        overlayClassName="popover-index"
        content={<GuideBtns />}
        title={tipFollow}
        placement="bottomRight"
        arrowPointAtCenter
        visible={props.studyTip === 1 && !props.study}
      >
        <Tooltip placement="bottom" title={'My Favorite'}>
          <li className="toolbar-li">
            <Link to="/follow">
              <Icon className="dropdown-link" style={{ fontSize: 16 }} type="star" />
            </Link>
          </li>
        </Tooltip>
      </Popover>
      <Popover
        overlayClassName="popover-index"
        content={<GuideBtns />}
        title={tipAdd}
        placement="bottomRight"
        arrowPointAtCenter
        visible={props.studyTip === 2 && !props.study}
      >
        <Tooltip placement="bottom" title={'New Project'}>
          <li className="toolbar-li">
            <Link to="/add-project">
              <Icon className="dropdown-link" style={{ fontSize: 16 }} type="plus-circle" />
            </Link>
          </li>
        </Tooltip>
      </Popover>
      <Popover
        overlayClassName="popover-index"
        content={<GuideBtns isLast={true} />}
        title={tipDoc}
        placement="bottomRight"
        arrowPointAtCenter
        visible={props.studyTip === 3 && !props.study}
      >
        <Tooltip placement="bottom" title={'Documentation'}>
          <li className="toolbar-li">
            <a target="_blank" href="https://yapi.ymfe.org" rel="noopener noreferrer"><Icon
              className="dropdown-link" style={{ fontSize: 16 }} type="question-circle" /></a>
          </li>
        </Tooltip>
      </Popover>
      <li className="toolbar-li">

        <Dropdown
          placement="bottomRight"
          trigger={['click']}
          overlay={
            <MenuUser
              user={props.user}
              msg={props.msg}
              uid={props.uid}
              role={props.role}
              relieveLink={props.relieveLink}
              logout={props.logout}
            />
          }>
          <a className="dropdown-link">
            <span className="avatar-image">
              <img src={imageUrl} />
            </span>
            {/*props.imageUrl? <Avatar src={props.imageUrl} />: <Avatar src={`/api/user/avatar?uid=${props.uid}`} />*/}
            <span className="name"><Icon type="down" /></span>
          </a>
        </Dropdown>

      </li>
    </ul>
  )
};
ToolUser.propTypes = {
  user: PropTypes.string,
  msg: PropTypes.string,
  role: PropTypes.string,
  uid: PropTypes.number,
  relieveLink: PropTypes.func,
  logout: PropTypes.func,
  groupList: PropTypes.array,
  studyTip: PropTypes.number,
  study: PropTypes.bool,
  imageUrl: PropTypes.any
};


@connect(
  (state) => {
    return {
      user: state.user.userName,
      uid: state.user.uid,
      msg: null,
      role: state.user.role,
      login: state.user.isLogin,
      studyTip: state.user.studyTip,
      study: state.user.study,
      imageUrl: state.user.imageUrl
    }
  },
  {
    loginTypeAction,
    logoutActions,
    checkLoginState,
    changeMenuItem
  }
)
@withRouter
export default class HeaderCom extends Component {
  constructor(props) {
    super(props);
  }

  static propTypes = {
    router: PropTypes.object,
    user: PropTypes.string,
    msg: PropTypes.string,
    uid: PropTypes.number,
    role: PropTypes.string,
    login: PropTypes.bool,
    relieveLink: PropTypes.func,
    logoutActions: PropTypes.func,
    checkLoginState: PropTypes.func,
    loginTypeAction: PropTypes.func,
    changeMenuItem: PropTypes.func,
    history: PropTypes.object,
    location: PropTypes.object,
    study: PropTypes.bool,
    studyTip: PropTypes.number,
    imageUrl: PropTypes.any
  }
  linkTo = (e) => {
    if (e.key != '/doc') {
      this.props.changeMenuItem(e.key);
      if (!this.props.login) {
        message.info('Please login first', 1);
      }
    }
  }
  relieveLink = () => {
    this.props.changeMenuItem("");
  }
  logout = (e) => {
    e.preventDefault();
    this.props.logoutActions().then((res) => {
      if (res.payload.data.errcode == 0) {
        this.props.history.push('/');
        this.props.changeMenuItem("/");
        message.success('Signed out successfully! ');
      } else {
        message.error(res.payload.data.errmsg);
      }
    }).catch((err) => {
      message.error(err);
    });
  }
  handleLogin = (e) => {
    e.preventDefault();
    this.props.loginTypeAction("1");
  }
  handleReg = (e) => {
    e.preventDefault();
    this.props.loginTypeAction("2");
  }
  checkLoginState = () => {
    this.props.checkLoginState.then((res) => {
      if (res.payload.data.errcode !== 0) {
        this.props.history.push('/');
      }
    }).catch((err) => {
      console.log(err);
    })
  }


  render() {
    const { login, user, msg, uid, role, studyTip, study, imageUrl } = this.props;
    return (
      <Header className="header-box m-header">
        <div className="content g-row">
          <Link onClick={this.relieveLink} to="/group" className="logo">
            <div className="href">
              <span className="img"><LogoSVG length="32px" /></span>
            </div>
          </Link>
          <Breadcrumb />
          <div className="user-toolbar"
            style={{ position: 'relative', zIndex: this.props.studyTip > 0 ? 3 : 1 }}>
            {login ?
              <ToolUser
                {...{ studyTip, study, user, msg, uid, role, imageUrl }}
                relieveLink={this.relieveLink}
                logout={this.logout}
              />
              : ""}
          </div>
        </div>
      </Header>
    )
  }
}
