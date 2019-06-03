/* eslint-disable react/sort-comp,react/no-typos */
import React, { PureComponent } from 'react';
import {
  Layout,
  Table,
  Badge,
  Icon,
  Popconfirm,
  message,
  InputNumber,
  Card,
  Divider,
  Col,
  Button,
  Radio,
  Spin,
  Modal,
  Form,
} from 'antd';
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const PressureTaskForm = Form.create({
  name: 'form_in_modal',
})(
  // eslint-disable-next-line
  class extends React.Component {
    state = {
      data: [],
    };

    //表单修改事件
    handleFormChange = () => {
      // 改变图
      // 获取变量的值
      const form = this.props.form;
      //获取 rps
      const rps = form.getFieldValue('rps');
      const time = form.getFieldValue('time');
      const up = form.getFieldValue('up');
      // const ins_count = form.getFieldValue('ins_count');

      if (rps != undefined && time != undefined && up != undefined) {
        const dataTmp = [];
        //开始计算
        for (var i = 0; i < time; i++) {
          const dataItem = {
            minutes: '' + i,
            value: parseInt(((rps * up) / 100) * (i + 1)),
          };
          dataTmp[i] = dataItem;
        }
        // 最后面一小段
        const dataItem = {
          minutes: '' + time,
          value: parseInt(((rps * up) / 100) * time),
        };
        dataTmp[time] = dataItem;
        //设置
        this.setState({ data: dataTmp });
      }
    };

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      // const data = [
      //   {
      //     minutes: "1",
      //     value: 1
      //   },
      // ];
      const cols = {
        minutes: {
          range: [0, 1],
        },
      };
      return (
        <Modal
          visible={visible}
          title="压测配置"
          okText="启动压测"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical" onChange={this.handleFormChange}>
            <Form.Item label="压力机个数">
              {getFieldDecorator('ins_count', {
                rules: [{ required: true, message: '压力机个数' }],
              })(<InputNumber formatter={value => `${value}`} min={1} max={100} />)}
            </Form.Item>
            <Form.Item label="选择输入RPS(每秒请求数)">
              {getFieldDecorator('rps', {
                rules: [{ required: true, message: '选择输入RPS' }],
              })(<InputNumber min={1} step={1000} autoFocus />)}
            </Form.Item>
            <Form.Item label="选择输入总压测时长(单位分钟)">
              {getFieldDecorator('time', {
                rules: [{ required: true, message: '选择输入总压测时长' }],
              })(<InputNumber min={1} />)}
            </Form.Item>
            <Form.Item label="每分钟递增(单位 %)">
              {getFieldDecorator('up', {
                rules: [{ required: true, message: '每分钟递增' }],
              })(<InputNumber formatter={value => `${value}%`} min={1} max={100} />)}
            </Form.Item>
            <Form.Item label="压力预估图">
              <Chart height={250} data={this.state.data} scale={cols} forceFit>
                <Axis name="minutes" />
                <Axis name="value" />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom type="line" position="minutes*value" size={2} shape={'hv'} />
              </Chart>
            </Form.Item>
            注意: 默认使用500个虚拟用户来完成上面的总RPS压测
          </Form>
        </Modal>
      );
    }
  }
);

@connect(({ system, task, loading }) => ({
  system,
  task,
  loading: loading.effects['task/queryTaskList'],
}))
class Immediate extends PureComponent {
  state = {
    taskList: [],
    addPressureTaskVisible: false,
  };

  componentWillMount() {
    this.queryTaskList();
  }

  componentWillUnMount() {
    clearInterval(this.timer);
  }

  queryTaskList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/queryTaskList',
      payload: {
        taskType: 1,
      },
    }).then(() => {
      const { task } = this.props;
      this.setState({ taskList: task.taskList });
    });
  };

  handleGoAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/goAddPage',
    });
  };

  handleRunTask = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/queryTaskExcute',
      payload: {
        id,
      },
    }).then(() => {
      this.queryTaskList();
      this.timer = setInterval(() => this.queryTaskList(), 10000);
    });
  };

  handleDelTask = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'task/queryTaskDelete',
      payload: {
        id,
      },
    }).then(() => {
      this.queryTaskList();
    });
  };

  /* 打开压测配置 */
  handleAddPressureTask = id => {
    this.setState({
      addPressureTaskVisible: true,
      taskId: id,
    });
  };

  /** 取消压测 */
  handleCancelPressureTask = () => {
    this.setState({
      addPressureTaskVisible: false,
    });
  };

  /** 保存压测配置 */
  handleAddPressureTaskForm = e => {
    const form = this.formRef.props.form;
    const taskId = this.state.taskId;
    const { dispatch } = this.props;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'task/queryAddPressureTask',
          payload: {
            taskId: taskId,
            info: values,
          },
        }).then(() => {
          // const { task } = this.props;
          // this.setState({ taskList: task.taskList });
          form.resetFields();
          this.setState({ addPressureTaskVisible: false });
        });
      }
    });
  };

  handleAddPressureTaskFormRef = formRef => {
    this.formRef = formRef;
  };

  renderStatus = status => {
    let result;
    switch (status) {
      case 1:
        result = <Badge status="processing" text="获取任务信息" />;
        break;
      case 2:
        result = <Badge status="processing" text="生成测试脚本" />;
        break;
      case 3:
        result = <Badge status="success" text="执行完成" />;
        break;
      case 4:
        result = <Badge status="error" text="获取任务信息失败" />;
        break;
      case 5:
        result = <Badge status="error" text="执行任务失败" />;
        break;
      default:
        result = <Badge status="default" text="新任务" />;
    }
    return result;
  };

  render() {
    const { taskList, addPressureTaskVisible } = this.state;
    const { loading } = this.props;
    const columns = [
      {
        title: '任务名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <a
            href={`#/task/immediate/detail?${record.id}`}
            style={{ color: '#2e86de', fontWeight: 'bold' }}
          >
            {text}
          </a>
        ),
      },
      {
        title: '任务描述',
        dataIndex: 'taskDesc',
        key: 'taskDesc',
      },
      {
        title: '新建人',
        dataIndex: 'add_user',
        key: 'add_user',
      },
      {
        title: '新建时间',
        dataIndex: 'add_time',
        key: 'add_time',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => this.renderStatus(record.status),
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => (
          <div>
            {record.status === 0 && <a onClick={() => this.handleRunTask(record.id)}>开始执行</a>}
            {record.status === 3 && (
              <a
                style={{ color: '#2e86de', fontWeight: 'bold' }}
                href={`#/task/immediate/report?${record.id}`}
              >
                查看报告
              </a>
            )}
            {[0, 3].indexOf(record.status) > -1 && <Divider type="vertical" />}
            {!([1, 2].indexOf(record.status) > -1) && (
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.handleDelTask(record.id)}>
                <a style={{ color: '#eb2f06' }}>删除</a>
              </Popconfirm>
            )}

            <Divider type="vertical" />

            <a
              onClick={() => this.handleAddPressureTask(record.id)}
              style={{ color: 'red', fontWeight: 'bold' }}
            >
              发起压测
            </a>
          </div>
        ),
      },
    ];
    return (
      <PageHeaderWrapper>
        <PressureTaskForm
          wrappedComponentRef={this.handleAddPressureTaskFormRef}
          visible={addPressureTaskVisible}
          onCancel={this.handleCancelPressureTask}
          onCreate={this.handleAddPressureTaskForm}
        />

        <Card bordered={false}>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={() => this.handleGoAdd()}>
              <Icon type="plus" />
              新建任务
            </Button>
          </div>
          <Table
            rowKey={record => record.id}
            dataSource={taskList}
            columns={columns}
            loading={loading}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default Immediate;
