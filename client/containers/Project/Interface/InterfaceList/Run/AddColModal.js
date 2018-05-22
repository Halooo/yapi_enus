import React, { PureComponent as Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Collapse, Row, Col, Input, message, Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withRouter } from 'react-router'
import { fetchInterfaceColList } from '../../../../../reducer/modules/interfaceCol'

const { TextArea } = Input;
const Panel = Collapse.Panel;

@connect(
  state => ({
    interfaceColList: state.interfaceCol.interfaceColList
  }),
  {
    fetchInterfaceColList
  }
)
@withRouter
export default class AddColModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    interfaceColList: PropTypes.array,
    fetchInterfaceColList: PropTypes.func,
    match: PropTypes.object,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    caseName: PropTypes.string
  }

  state = {
    visible: false,
    addColName: '',
    addColDesc: '',
    id: 0,
    caseName: ''
  }

  constructor(props) {
    super(props)
  }

  componentWillMount() {

    this.props.fetchInterfaceColList(this.props.match.params.id)
    this.setState({caseName: this.props.caseName})
  }

  componentWillReceiveProps(nextProps) {

    this.setState({id: nextProps.interfaceColList[0]._id})
    this.setState({caseName: nextProps.caseName})
  }

  addCol = async () => {
    const { addColName: name, addColDesc: desc } = this.state;
    const project_id = this.props.match.params.id
    const res = await axios.post('/api/col/add_col', { name, desc, project_id })
    if (!res.data.errcode) {
      message.success('Successfully Added Collection');
      await this.props.fetchInterfaceColList(project_id);

      this.setState({id: res.data.data._id});
    } else {
      message.error(res.data.errmsg);
    }
  }

  select = (id) => {
    this.setState({id})
  }

  render() {
    const { interfaceColList = [] } = this.props;
    const { id } = this.state;
    return (
      <Modal
        className="add-col-modal"
        title="Add to Collection"
        visible={this.props.visible}
        onOk={() => this.props.onOk(id, this.state.caseName)}
        onCancel={this.props.onCancel}
      >
        <Row gutter={6} className="modal-input">
          <Col span="5"><div className="label">API name：</div></Col>
          <Col span="15">
            <Input
              placeholder="Enter API name"
              value={this.state.caseName}
              onChange={e => this.setState({caseName: e.target.value})}></Input>
          </Col>
        </Row>
        <p>Choose which collection to add to: </p>
        <ul className="col-list">
          {
            interfaceColList.length ? interfaceColList.map(col =>
              <li
                key={col._id}
                className={`col-item ${col._id === id ? 'selected' : ''}`}
                onClick={() => this.select(col._id)}
              >
                <Icon type="folder-open" style={{marginRight: 6}} />{col.name}
              </li>
            ) : <span>No collection yet, please add one firs</span>
          }
        </ul>
        <Collapse>
          <Panel header="New Collection">
            <Row gutter={6} className="modal-input">
              <Col span="5"><div className="label">Collection Name: </div></Col>
              <Col span="15">
                <Input
                  placeholder="Enter Collection name"
                  value={this.state.addColName}
                  onChange={e => this.setState({addColName: e.target.value})}></Input>
              </Col>
            </Row>
            <Row gutter={6} className="modal-input">
              <Col span="5"><div className="label">Description: </div></Col>
              <Col span="15">
                <TextArea
                  rows={3}
                  placeholder="Enter description"
                  value={this.state.addColDesc}
                  onChange={e => this.setState({addColDesc: e.target.value})}></TextArea>
              </Col>
            </Row>
            <Row type="flex" justify="end">
              <Button style={{float: 'right'}} type="primary" onClick={this.addCol}>Add</Button>
            </Row>
          </Panel>
        </Collapse>
      </Modal>
    )
  }
}
