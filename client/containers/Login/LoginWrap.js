import React, { PureComponent as Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Tabs } from 'antd';
import LoginForm from './Login';
import RegForm from './Reg';
import './Login.scss';
const TabPane = Tabs.TabPane;

@connect(
  state =>({
    loginWrapActiveKey: state.user.loginWrapActiveKey
  })
)
export default class LoginWrap extends Component {
  constructor(props){
    super(props);
  }

  static propTypes = {
    form: PropTypes.object,
    loginWrapActiveKey:PropTypes.string
  }

  render() {
    const { loginWrapActiveKey } = this.props;
    return (
      <Tabs defaultActiveKey={loginWrapActiveKey} className="login-form" tabBarStyle={{border: 'none'}}>
        <TabPane tab="Log in" key="1">
          <LoginForm/>
        </TabPane>
        <TabPane tab="Sign up" key="2">
          <RegForm/>
        </TabPane>
      </Tabs>
    );
  }
}
