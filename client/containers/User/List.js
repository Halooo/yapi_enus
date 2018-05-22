import React, { PureComponent as Component } from 'react'
import { formatTime } from '../../common.js'
import { Link } from 'react-router-dom'
import { setBreadcrumb } from '../../reducer/modules/user';
//import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Table,
  Popconfirm,
  message
} from 'antd'
import axios from 'axios';

const limit = 20;
@connect(
  state => {
    return {
      curUserRole: state.user.role
    }
  }, {
    setBreadcrumb
  }
)
class List extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: [],
      total: null,
      current: 1
    }
  }
  static propTypes = {
    setBreadcrumb: PropTypes.func,
    curUserRole: PropTypes.string
  }
  changePage = (current) => {
    this.setState({
      current: current
    }, this.getUserList)
  }

  getUserList() {
    axios.get('/api/user/list?page=' + this.state.current + '&limit=' + limit).then((res) => {
      let result = res.data;

      if (result.errcode === 0) {
        let list = result.data.list;
        let total = result.data.count;
        list.map((item, index) => {
          item.key = index;
          item.up_time = formatTime(item.up_time)
        })
        this.setState({
          data: list,
          total: total
        });
      }
    })
  }

  componentDidMount() {
    this.getUserList()
  }

  confirm = (uid) => {
    axios.post('/api/user/del', {
      id: uid
    }).then((res) => {
      if (res.data.errcode === 0) {
        message.success('Deleted user');
        let userlist = this.state.data;
        userlist = userlist.filter((item) => {
          return item._id != uid
        })
        this.setState({
          data: userlist
        })
      } else {
        message.error(res.data.errmsg);
      }
    }, (err) => {
      message.error(err.message);
    })
  }

  async componentWillMount() {
    this.props.setBreadcrumb([{ name: 'User management' }]);
  }

  render() {
    const role = this.props.curUserRole;
    let data = [];
    if (role === 'admin') {
      data = this.state.data;
    }
    let columns = [{
      title: 'User name',
      dataIndex: 'username',
      key: 'username',
      width: 180,
      render: (username, item)=>{
        return <Link to={"/user/profile/" + item._id} >{item.username}</Link>
      }
    }, {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    }, {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 150
    }, {
      title: 'Last Updated',
      dataIndex: 'up_time',
      key: 'up_time',
      width: 160
    }, {
      title: 'Action',
      key: 'action',
      width: "90px",
      render: (item) => {
        return (
          <span>
            {/* <span className="ant-divider" /> */}
            <Popconfirm title="Delete this user?" onConfirm={() => { this.confirm(item._id) }} okText="Confirm" cancelText="Cancel">
              <a style={{display:"block",textAlign:"center"}} href="#">Delete</a>
            </Popconfirm>
          </span>
        )
      }
    }]

    columns = columns.filter((item) => {
      if (item.key === 'action' && role !== 'admin') {
        return false;
      }
      return true;
    })

    const pageConfig = {
      total: this.state.total,
      pageSize: limit,
      current: this.state.current,
      onChange: this.changePage
    }

    return (
      <section className="user-table">
        <h2 style={{marginBottom:'10px'}} >Total：{this.state.total} users</h2>
        <Table bordered={true} columns={columns} pagination={pageConfig} dataSource={data} />

      </section>
    )
  }
}

export default List
