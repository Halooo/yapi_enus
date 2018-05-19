import './Home.scss';
import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Icon, Card } from 'antd';
import PropTypes from "prop-types";
import { withRouter } from 'react-router';
import { getImgPath } from '../../common.js';
import LogoSVG from '../../components/LogoSVG/index.js'
import { changeMenuItem } from '../../reducer/modules/menu'
const plugin = require('client/plugin.js');

const ThirdLogin = plugin.emitHook('third_login');
const HomeGuest = () => (
  <div className="g-body">
    <div className="m-bg">
      <div className="m-bg-mask m-bg-mask0"></div>
      <div className="m-bg-mask m-bg-mask1"></div>
      <div className="m-bg-mask m-bg-mask2"></div>
      <div className="m-bg-mask m-bg-mask3"></div>
    </div>
    <div className="main-one">
      <div className="container">
        <Row>
          <Col span={24}>
            <div className="home-header">
              <a href="#" className="item">YAPI</a>
              <a target="_blank" rel="noopener noreferrer" href="https://yapi.ymfe.org" className="item">Documentation</a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={9} xs={24}>
            <div className="home-des">
              <div className="logo">
                <LogoSVG length='72px' />
                <span className="name">YAPI</span>
              </div>
              <div className="detail">API management platform<br /><span className="desc">for better cross team communication</span></div>
              <div className="btn-group">
                <Link to="/login"><Button type="primary" className="btn-home btn-login">Login / Sign up</Button></Link>
                {ThirdLogin != null ?
                  <ThirdLogin />
                  : null
                }

              </div>
            </div>
          </Col>
          <Col lg={15} xs={0} className="col-img">
            <div className="img-container">
              <img className="img" src={getImgPath('/image/demo-img', 'jpg')} />
            </div>
          </Col>
        </Row>
      </div>
    </div>
    <div className="feat-part section-feature">
      <div className="container home-section">
        <h3 className="title">Designed for API development</h3>
        <span className="desc">High efficiency teamwork and testing</span>
        <Row key="feat-motion-row">
          <Col span={8} className="section-item" key="feat-wrapper-1">
            <Icon type="appstore-o" className="img" />
            <h4 className="title">Project management</h4>
            <span className="desc">Provides project dividing, management and API management</span>
          </Col>
          <Col span={8} className="section-item" key="feat-wrapper-2">
            <Icon type="api" className="img" />
            <h4 className="title">API Management</h4>
            <span className="desc">Friendly API documentation, websocket based collaboration tools and postman testing tools, improve collaboration efficiency</span>
          </Col>
          <Col span={8} className="section-item" key="feat-wrapper-3">
            <Icon type="database" className="img" />
            <h4 className="title">MockServer</h4>
            <span className="desc">Based on Mockjs, simple and powerful</span>
          </Col>
        </Row>
      </div>
    </div>
    <div className="feat-part m-mock m-skew home-section">
      <div className="m-skew-bg">
        <div className="m-bg-mask m-bg-mask0"></div>
        <div className="m-bg-mask m-bg-mask1"></div>
        <div className="m-bg-mask m-bg-mask2"></div>
      </div>
      <div className="container skew-container">
        <h3 className="title">Strong Mock Service</h3>
        <span className="desc">All you want about Mock API services</span>
        <Row className="row-card">
          <Col lg={12} xs={24} className="section-card">
            <Card title="Mock Rules">
              <p className="mock-desc">Write mock API through templates，improve efficiency in implementation，mock data can be generated randomly</p>
              <div className="code">
                <ol start="1">
                  <li className="item"><span className="orderNum orderNum-first">1</span><span><span>&#123;&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">2</span><span>&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;errcode|200-500&quot;</span><span>:&ensp;<span className="number">200</span>,&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">3</span><span>&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;errmsg|4-8&quot;</span><span>:&ensp;</span><span className="string">&quot;@string&quot;</span><span>,&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">4</span><span>&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;data&quot;</span><span>:&ensp;&#123;&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">5</span><span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;boolean|1&quot;</span><span>:&ensp;</span><span className="keyword">true</span><span>,&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">6</span><span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;array|2&quot;</span><span>:&ensp;&#91;<span className="string">&quot;Bob&quot;</span>,&ensp;<span className="string">&quot;Jim&quot;</span>&#93;,&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">7</span><span>&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;combine&quot;</span><span>:&ensp;</span><span className="string">&quot;@boolean&ensp;&amp;&ensp;@array&quot;</span><span>&ensp;&ensp;</span></span></li>
                  <li className="item"><span className="orderNum">8</span><span>&ensp;&ensp;&ensp;&ensp;&#125;&ensp;&ensp;</span></li>
                  <li className="item"><span className="orderNum orderNum-last">9</span><span>&#125;&ensp;&ensp;</span></li>
                </ol>
              </div>
            </Card>
          </Col>
          <Col lg={12} xs={24} className="section-card mock-after">
            <Card title="Generated Mock data">
              <p className="mock-desc">Generated Mock data can be used directly through AJAX request，also can be used with proxy server（no need to change a line of code）</p>
              <div className="code">
                <ol start="1">
                  <li className="alt"><span className="orderNum orderNum-first">1</span><span><span>&#123;&ensp;&ensp;</span></span></li>
                  <li className=""><span className="orderNum">2</span><span>&ensp;&ensp;<span className="string">&quot;errcode&quot;</span><span>:&ensp;</span><span className="number">304</span><span>,&ensp;&ensp;</span></span></li>
                  <li className="alt"><span className="orderNum">3</span><span>&ensp;&ensp;<span className="string">&quot;errmsg&quot;</span><span>:&ensp;</span><span className="string">&quot;JtkMIoRu)N#ie^h%Z77[F)&quot;</span><span>,&ensp;&ensp;</span></span></li>
                  <li className=""><span className="orderNum">4</span><span>&ensp;&ensp;<span className="string">&quot;data&quot;</span><span>:&ensp;&#123;&ensp;&ensp;</span></span></li>
                  <li className="alt"><span className="orderNum">5</span><span>&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;boolean&quot;</span><span>:&ensp;</span><span className="keyword">true</span><span>,&ensp;&ensp;</span></span></li>
                  <li className=""><span className="orderNum">6</span><span>&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;array&quot;</span><span>:&ensp;</span>&#91;<span className="string">&quot;Bob&quot;</span>,&ensp;<span className="string">&quot;Jim&quot;</span>,&ensp;<span className="string">&quot;Bob&quot;</span>,&ensp;<span className="string">&quot;Jim&quot;</span>&#93;<span>,&ensp;&ensp;</span></span></li>
                  <li className="alt"><span className="orderNum">7</span><span>&ensp;&ensp;&ensp;&ensp;<span className="string">&quot;combine&quot;</span><span>:&ensp;</span><span className="string">&quot;true & Bob,&ensp;Jim,&ensp;Bob,&ensp;Jim&quot;</span><span>&ensp;&ensp;</span></span></li>
                  <li className=""><span className="orderNum">8</span><span>&ensp;&ensp;&#125;&ensp;&ensp;</span></li>
                  <li className="alt"><span className="orderNum orderNum-last">9</span><span>&#125;&ensp;&ensp;</span></li>
                </ol>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
    <div className="home-section section-manage">
      <div className="container">
        <Row className="row-card" style={{ marginBottom: '.48rem' }}>
          <Col lg={7} xs={10} className="section-card">
            <Card>
              <div className="section-block block-first">
                <h4>Super admin(* N)</h4>
                <p className="item"> - Create Groups</p>
                <p className="item"> - Assign Group owners</p>
                <p className="item"> - Manage Member settings</p>
              </div>
              <div className="section-block block-second">
                <h4>Group Owner(* N)</h4>
                <p className="item"> - Create Projects</p>
                <p className="item"> - Manage Group / Project settings</p>
                <p className="item"> - Manage Developers and Members</p>
              </div>
              <div className="section-block block-third">
                <h4>Developer(* N) / Member(* N)</h4>
                <p className="item"> - Not allowed to create groups</p>
                <p className="item"> - Not allowed to change group/project settings</p>
              </div>
            </Card>
          </Col>
          <Col lg={17} xs={14} className="section-card manage-word">
            <Icon type="team" className="icon" />
            <h3 className="title">Flattened management model</h3>
            <p className="desc">Easy to access for all members</p>
            <p className="desc">The Super Admin -> Group owner -> Member management model is well designed</p>
          </Col>
        </Row>
      </div>
    </div>
  </div>
);
HomeGuest.propTypes = {
  introList: PropTypes.array
}

@connect(
  state => ({
    login: state.user.isLogin
  }),
  {
    changeMenuItem
  }
)
@withRouter
class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    if (this.props.login) {
      this.props.history.push('/group/261')
    }
  }

  componentDidMount() {

  }
  static propTypes = {
    introList: PropTypes.array,
    login: PropTypes.bool,
    history: PropTypes.object,
    changeMenuItem: PropTypes.func
  }
  toStart = () => {
    this.props.changeMenuItem('/group');
  }
  render() {
    return (
      <div className="home-main">
        <HomeGuest introList={this.props.introList} />
        <div className="row-tip">
          <div className="container">
            <div className="tip-title">
              <h3 className="title">Ready to use？</h3>
              <p className="desc">Sign up and start，see documentation for more details</p>
            </div>
            <div className="tip-btns">
              <div className="btn-group">
                <Link to="/login"><Button type="primary" className="btn-home btn-login">Log in / Sign up</Button></Link>
                <Button className="btn-home btn-home-normal"><a target="_blank" rel="noopener noreferrer" href="https://yapi.ymfe.org" >Documentation</a></Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

// Home.defaultProps={
//   introList:[{
//     title:"接口管理",
//     des:"满足你的所有接口管理需求。不再需要为每个项目搭建独立的接口管理平台和编写离线的接口文档，其权限管理和项目日志让协作开发不再痛苦。",
//     detail:[
//       {title:"团队协作",des:"多成员协作，掌握项目进度",iconType:"team"},
//       {title:"权限管理",des:"设置每个成员的操作权限",iconType:"usergroup-add"},
//       {title:"项目日志",des:"推送项目情况，掌握更新动态",iconType:"schedule"}
//     ],
//     img:"./image/demo-img.jpg"
//   },{
//     title:"接口测试",
//     des:"一键即可得到返回结果。根据用户的输入接口信息如协议、URL、接口名、请求头、请求参数、mock规则生成Mock接口，这些接口会自动生成模拟数据。",
//     detail:[
//       {title:"编辑接口",des:"团队开发时任何人都可以在权限许可下创建、修改接口",iconType:"tags-o"},
//       {title:"mock请求",des:"创建者可以自由构造需要的数据，支持复杂的生成逻辑",iconType:"fork"}
//     ],
//     img:"./image/demo-img.jpg"
//   }
//   ]
// };

export default Home
