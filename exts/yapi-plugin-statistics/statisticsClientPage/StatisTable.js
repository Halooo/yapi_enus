import React from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types'

const columns = [
  {
    title: 'Group',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Project',
    dataIndex: 'project',
    key: 'project'
  },
  {
    title: 'API',
    dataIndex: 'interface',
    key: 'interface'
  },
  {
    title: 'mock data',
    dataIndex: 'mock',
    key: 'mock'
  }
];

const StatisTable = (props) => {
  const {dataSource} = props;
    return (
      <div className="m-row-table">
        <h3 className="statis-title">Details</h3>
        <Table className="statis-table" pagination={false} dataSource={dataSource} columns={columns} />
      </div>
    )
}

StatisTable.propTypes = {
  dataSource: PropTypes.array
}


export default StatisTable;
