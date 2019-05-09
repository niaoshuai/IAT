/* eslint-disable react/prefer-stateless-function */
import React, { PureComponent } from 'react';
import { Card, Table, Button, Icon, Modal, Input } from 'antd';
import { connect } from 'dva';

@connect(({ jmeter, loading }) => ({
  jmeter,
  loading: loading.effects['jmeter/queryJmeterList'],
}))
class Jmeter extends PureComponent {
  state = {
    showAddModal: false,
    jmeterList: [],
    name: '',
  };

  componentWillMount() {
    this.queryJmeterList();
  }

  showAddModal = () => {
    this.setState({ showAddModal: true });
  };

  handleAdd = () => {
    const { name } = this.state;
    const { dispatch } = this.props;
    if (!name) {
      return;
    }
    dispatch({
      type: 'system/queryAddProject',
      payload: {
        name,
      },
    }).then(() => {
      this.queryJmeterList();
      this.handleCancel();
    });
  };

  queryJmeterList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'jmeter/queryJmeterList',
      payload: {
        status: '',
      },
    }).then(() => {
      const { jmeter } = this.props;
      this.setState({
        jmeterList: jmeter.jmeterList,
      });
    });
  };

  handleCancel = () => {
    this.setState({ showAddModal: false, name: '' });
  };

  querySetProjectStatus = (id, statusCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/querySetProjectStatus',
      payload: {
        id,
        status: statusCode,
      },
    }).then(() => {
      this.queryJmeterList();
    });
  };

  handleSetClassStatus = record => {
    if (record.status === 1) {
      this.querySetProjectStatus(record.id, 0);
    } else {
      this.querySetProjectStatus(record.id, 1);
    }
  };

  render() {
    const { jmeterList, showAddModal, name } = this.state;
    const { loading } = this.props;

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '用例数量',
        dataIndex: 'count',
        key: 'count',
      },
      {
        title: '创建人',
        dataIndex: 'add_user',
        key: 'add_user',
      },
      {
        title: '创建时间',
        dataIndex: 'add_time',
        key: 'add_time',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
      },
    ];
    return (
      <div>
        <Card bordered={false}>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={this.showAddModal}>
              <Icon type="plus" />
              新增项目
            </Button>
          </div>
          <Table loading={loading} dataSource={jmeterList} columns={columns} size="small" />
        </Card>
        <Modal
          visible={showAddModal}
          title="新增项目"
          onOk={() => this.handleAdd()}
          onCancel={() => this.handleCancel()}
        >
          <Input
            placeholder="输入项目名称"
            autoFocus
            value={name}
            onChange={e => this.setState({ name: e.target.value })}
          />
        </Modal>
      </div>
    );
  }
}
export default Jmeter;
