import React, { Component } from 'react';
import { Table } from 'antd';
import json5 from 'json5'
import PropTypes from 'prop-types'
import { schemaTransformToTable } from '../../../common/shema-transformTo-table.js';
import _ from 'underscore';

const messageMap = {
  desc: 'Note',
  default: '实例',
  maximum: 'maximum',
  minimum: 'minimum',
  maxItems: 'Max Items',
  minItems: 'Min Items',
  maxLength: 'Max Length',
  minLength: 'Min Length',
  enum: 'Enum',
  uniqueItems: 'If Unique Items',
  itemType: 'Item Type',
  format: 'format',
  itemFormat: 'item format'
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 200
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    width: 100,
    render: (text, item) => {
      // console.log('text',item.sub);
      return text === 'array' ? <span>{item.sub ? item.sub.itemType || '': 'array'} []</span> : <span>{text}</span>;
    }
  },
  {
    title: 'Is required',
    dataIndex: 'required',
    key: 'required',
    width: 80,
    render: text => {
      return <div>{text ? 'Required' : 'Not required'}</div>;
    }
  },
  {
    title: 'Default value',
    dataIndex: 'default',
    key: 'default'
  },
  {
    title: 'Note',
    dataIndex: 'desc',
    key: 'desc',
    render: (text, item) => {
      // console.log('text',item.sub);
      return _.isUndefined(item.childrenDesc) ? (
        <span>{text}</span>
      ) : (
        <span>{item.childrenDesc}</span>
      );
    }
  },
  {
    title: 'Other info',
    dataIndex: 'sub',
    key: 'sub',
    render: text => {
      return Object.keys(text || []).map((item, index) => {
        let name = messageMap[item];
        let value = text[item];

        return (
          !_.isUndefined(text[item]) && (
            <p key={index}>
              <span style={{ fontWeight: '700' }}>{name}: </span>
              <span>{value.toString()}</span>
            </p>
          )
        );
      });
    }
  }
];

class SchemaTable extends Component {

  static propTypes = {
    dataSource: PropTypes.string
  }

  constructor(props) {
    super(props);

  }

  render() {
    let product
    try{
      product = json5.parse(this.props.dataSource)
    }catch(e){
      product = null
    }
    if(!product){
      return null;
    }
    let data = schemaTransformToTable(product)
    data = _.isArray(data) ? data : []
    return <Table bordered size="small" pagination={false} dataSource={data} columns={columns} />;
  }
}
export default SchemaTable;
