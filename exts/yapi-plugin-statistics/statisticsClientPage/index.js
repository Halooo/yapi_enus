/**
 * Created by gxl.gao on 2017/10/25.
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import PropTypes from 'prop-types'
import './index.scss'
// import { withRouter } from 'react-router-dom';
import { Row, Col, Tooltip, Icon } from 'antd';
import { setBreadcrumb } from 'client/reducer/modules/user';
import StatisChart from './StatisChart';
import StatisTable from './StatisTable'

const CountOverview = (props) => (
  <Row type="flex" justify="space-start" className="m-row">
    <Col className="gutter-row" span={6}>
      <span>
        Total Groups
        <Tooltip placement="rightTop" title="Total public group number">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.groupCount}</h2>

    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        Total Projects
        <Tooltip placement="rightTop" title="Total project number">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.projectCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        Total APIs
        <Tooltip placement="rightTop" title="Total API number">
          {/*<a href="javascript:void(0)" className="m-a-help">?</a>*/}
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.interfaceCount}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        Total Test APIs
        <Tooltip placement="rightTop" title="Total test API number">
          {/*<a href="javascript:void(0)" className="m-a-help">?</a>*/}
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.date.interfaceCaseCount}</h2>
    </Col>
  </Row>
);

CountOverview.propTypes = {
  date: PropTypes.object
};

const StatusOverview = (props) => (
  <Row type="flex" justify="space-start" className="m-row">

    <Col className="gutter-row" span={6}>
      <span>
        Operating System
        <Tooltip placement="rightTop" title="System type, can be 'darwin', 'freebsd', 'linux', 'sunos' , 'win32'">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.systemName}</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        cpu
        <Tooltip placement="rightTop" title="cpu status">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.load} %</h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        System spare RAM / Total RAM
        <Tooltip placement="rightTop" title="RAM usage">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.freemem} G / {props.data.totalmem} G </h2>
    </Col>
    <Col className="gutter-row" span={6}>
      <span>
        Email status
        <Tooltip placement="rightTop" title="Email status in config">
          <Icon className="m-help" type="question-circle" />
        </Tooltip>
      </span>
      <h2 className="gutter-box">{props.data.mail}</h2>

    </Col>
  </Row>
);

StatusOverview.propTypes = {
  data: PropTypes.object
};


@connect(
  null, {
    setBreadcrumb
  }
)
class statisticsPage extends Component {
  static propTypes = {
    setBreadcrumb: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      count: {
        groupCount: 0,
        projectCount: 0,
        interfaceCount: 0,
        interfactCaseCount: 0
      },
      status: {
        mail: '',
        systemName: '',
        totalmem: '',
        freemem: '',
        uptime: ''
      },
      dataTotal: []
    }
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: 'System Info' }]);
    this.getStatisData();
    this.getSystemStatusData();
    this.getGroupData();
  }

  // 获取统计数据
  async getStatisData() {
    let result = await axios.get('/api/plugin/statismock/count');
    if (result.data.errcode === 0) {
      let statisData = result.data.data;
      this.setState({
        count: { ...statisData }
      });
    }
  }

  // 获取系统信息

  async getSystemStatusData() {
    let result = await axios.get('/api/plugin/statismock/get_system_status')
    if (result.data.errcode === 0) {
      let statusData = result.data.data;
      this.setState({
        status: { ...statusData }
      });
    }
  }

  // 获取分组详细信息

  async getGroupData() {
    let result = await axios.get('/api/plugin/statismock/group_data_statis')
    if (result.data.errcode === 0) {
      let statusData = result.data.data
      statusData.map(item=> {
        return item['key'] = item.name
      })
      this.setState({
        dataTotal: statusData
      });
    }
  }






  render() {
    const { count, status, dataTotal } = this.state;

    return (
      <div className="g-statistic">
        <div className="content">
          <h2 className="title">System Status</h2>
          <div className="system-content">
            <StatusOverview data={status}></StatusOverview>
          </div>
          <h2 className="title">Statistics</h2>
          <div>
            <CountOverview date={count}/>
            <StatisTable dataSource={dataTotal}/>
            <StatisChart />
          </div>

        </div>
      </div>

    )
  }
}

export default statisticsPage;
