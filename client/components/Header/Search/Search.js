import React, { PureComponent as Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Input, AutoComplete } from 'antd'
import './Search.scss'
import { withRouter } from 'react-router';
import axios from 'axios';
import { setCurrGroup } from '../../../reducer/modules/group'
import { changeMenuItem } from '../../../reducer/modules/menu'
const Option = AutoComplete.Option;


@connect(
  state => ({
    groupList: state.group.groupList,
    projectList: state.project.projectList
  }),{
    setCurrGroup,
    changeMenuItem
  }
)

@withRouter
export default class Srch extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[]
    };
  }

  static propTypes = {
    groupList : PropTypes.array,
    projectList: PropTypes.array,
    router: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object,
    setCurrGroup: PropTypes.func,
    changeMenuItem : PropTypes.func
  }

  onSelect = (value,option) => {
    if( option.props.tpye == "分组" ){
      this.props.changeMenuItem('/group');
      this.props.history.push('/group/'+value);
      this.props.setCurrGroup({"group_name":value,"_id":option.props['id']});
    } else {
      this.props.history.push('/project/'+option.props['id']);
    }
  }

  handleSearch = (value) => {
    axios.get('/api/project/search?q='+value)
      .then((res) => {
        if(res.data && res.data.errcode === 0){
          const dataSource = [];
          for(let title in res.data.data) {
            res.data.data[title].map(item => {
              dataSource.push(
                title == "group" ?
                  ( <Option
                    key={`${item._id}`}
                    tpye="分组"
                    value={`${item.groupName}`}
                    id={`${item._id}`}
                  >
                    {`Group: ${item.groupName}`}
                  </Option>) :
                  (<Option
                    key={`${item._id}`}
                    tpye="项目"
                    value={`${item._id}`}
                    id={`${item._id}`}
                  >
                    {`Project: ${item.name}`}
                  </Option>)
              )
            })
          }
          this.setState({
            dataSource: dataSource
          });
        }else{
          console.log("Search project/group failed");
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  getDataSource(groupList){
    const groupArr =[];
    groupList.forEach(item =>{
      groupArr.push("group: "+ item["group_name"]);
    })
    return groupArr;
  }

  render(){
    const { dataSource } = this.state;

    return(
      <div className="search-wrapper">
        <AutoComplete
          className="search-dropdown"
          dataSource={dataSource}
          style={{ width: '100%' }}
          defaultActiveFirstOption= {false}
          onSelect={this.onSelect}
          onSearch={this.handleSearch}
          filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
        >
          <Input
            prefix={<Icon type="search" className="srch-icon" />}
            placeholder="Search group/project"
            className="search-input"
          />
        </AutoComplete>
      </div>
    )
  }
}
