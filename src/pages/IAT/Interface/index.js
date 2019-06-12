/* eslint-disable react/prefer-stateless-function,no-return-assign,no-param-reassign,no-var,prefer-destructuring,react/destructuring-assignment,react/no-access-state-in-setstate,prefer-const */
/* eslint-disable no-useless-escape */
import React, { Component } from 'react';
import {
  Layout,
  Tree,
  Select,
  Icon,
  Menu,
  message,
  Input,
  Card,
  Divider,
  Col,
  Button,
  Radio,
  Spin,
  Switch,
  Tooltip,
  Empty,
} from 'antd';
import AceEditor from 'react-ace';
import { connect } from 'dva';
import JSONPretty from 'react-json-pretty';
import { setTage, getTage } from '@/services/tags';
import Resizable from 're-resizable';
import styles from './index.less';

import 'brace/mode/java';
import 'brace/theme/dracula';

const { Content, Sider } = Layout;
const { TreeNode } = Tree;
const { Option } = Select;
const InputGroup = Input.Group;
const { TextArea } = Input;

@connect(({ system, interfaceCase, loading }) => ({
  system,
  interfaceCase,
  loading: loading.effects['interfaceCase/queryTreeInfo'],
  debugLoading: loading.effects['interfaceCase/queryDebugSample'],
}))
class Interface extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      projectList: [],
      project: null,
      clickId: null,
      caseId: null,
      treeList: [],
      extractList: [],
      rightClickItem: null,
      debugDomain: 'http://192.168.11.206:8081',
      selectNoteType: null,
      infoParamsFormatType: null,
      infoName: '',
      infoPath: '',
      infoMethod: 'GET',
      infoParams: null,
      infoAssertData: null,
      infoExtractData: null,
      autoExpandParent: true,
      showAddHeader: false,
      hasPreShell: false,
      hasPostShell: false,
      debugHeader: [],
      info: {
        name: '',
        path: '',
        method: 'GET',
        paramType: 1,
        params: [],
        asserts: {
          assertsType: 1,
          assertData: [],
        },
        extract: {
          extractType: 0,
          extractData: [],
        },
        preShellType: 0,
        preShellData: '',
        postShellType: 0,
        postShellData: '',
      },
      debugData: {},
      debugParams: [],
      debugResult: 0,
    };
    this.setDomTreeBoxRef = ref => (this.treeBox = ref);
  }

  componentWillMount() {
    const params = this.props.location.search;
    if (params.indexOf('?') !== -1) {
      const caseId = params.substr(1);
      if (caseId) {
        this.setState({ caseId });
      }
      this.queryProjectList(caseId);
    } else {
      this.queryProjectList();
    }
  }

  getNodeTreeMenu() {
    const { pageX, pageY, noteType } = { ...this.state.rightClickItem };
    const tmpStyle = {
      position: 'absolute',
      boxShadow: '3px 3px 1px #ecf0f1',
      border: '1px solid #ecf0f1',
      left: `${pageX}px`,
      top: `${pageY - 2}px`,
      zIndex: 999,
    };

    const menu =
      noteType === 1 ? (
        <Menu onClick={this.handleRightMenuClick} style={tmpStyle} className={styles.RightMenu}>
          <Menu.Item key="1">
            <Icon type="plus-circle" />
            {'添加用例'}
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="folder-add" />
            {'添加子目录'}
          </Menu.Item>
          <Menu.Item key="4">
            <Icon type="minus-square-o" />
            {'删除目录'}
          </Menu.Item>
        </Menu>
      ) : (
        <Menu onClick={this.handleRightMenuClick} style={tmpStyle} className={styles.RightMenu}>
          <Menu.Item key="5">
            <Icon type="copy" />
            {'复制用例'}
          </Menu.Item>
          <Menu.Item key="6">
            <Icon type="minus-square-o" />
            {'删除用例'}
          </Menu.Item>
        </Menu>
      );
    return this.state.rightClickItem && menu;
  }

  handleRightMenuClick = e => {
    const code = e.key;
    switch (code) {
      case '1':
        this.handleAddCase();
        break;
      case '2':
        this.handleAddSubFolder();
        break;
      case '4':
        this.handleDeleteSubFolder();
        break;
      case '5':
        this.handleCopyCase();
        break;
      case '6':
        this.hanldeDeleteCase();
        break;
      default:
        message.warning('出现了什么鬼');
    }
  };

  treeToList = tree => {
    const listData = [
      {
        id: tree[0].id,
        name: tree[0].name,
        noteType: tree[0].noteType,
        index_id: tree[0].index_id,
        pid: 0,
      },
    ];
    const loop = (data, fatherPid) =>
      data.children.forEach(item => {
        listData.push({
          id: item.id,
          name: item.name,
          noteType: item.noteType,
          index_id: item.index_id,
          pid: fatherPid,
        });
        if (item.children && item.children.length > 0) {
          loop(item, item.id);
        }
      });
    loop(tree[0], tree[0].id);
    return listData;
  };

  onChangeTest = newValue => {
    this.setState({ preShellData: newValue }, () => {});
    // const editor = this.ace.editor; // The editor object is from Ace's API
    // console.log(editor.getValue()); // Outputs the value of the editor
  };

  handleAddCase = () => {
    const clickId = this.state.rightClickItem.dataRef.id;
    const { treeList } = this.state;
    const listData = this.treeToList(treeList);
    listData.push({
      id: null,
      name: '',
      type: 'case',
      noteType: 0,
      index_id: 99,
      pid: clickId,
    });
    const listToTree = pid => {
      const result = [];
      listData.forEach(item => {
        if (pid !== null && item.pid === pid) {
          result.push({
            id: item.id,
            name: item.name,
            index_id: item.index_id,
            type: item.type,
            noteType: item.noteType,
            children: listToTree(item.id),
          });
        }
      });
      return result;
    };
    const newTree = listToTree(0);
    this.setState(
      {
        treeList: newTree,
        expandedKeys: [clickId.toString()],
        clickId,
        autoExpandParent: true,
      },
      () => this.clearMenu()
    );
  };

  handleAddSubFolder = () => {
    const clickId = this.state.rightClickItem.dataRef.id;
    const { treeList } = this.state;
    const listData = this.treeToList(treeList);
    listData.push({
      id: null,
      name: '',
      type: 'folder',
      noteType: 0,
      index_id: 99,
      pid: clickId,
    });
    const listToTree = pid => {
      const result = [];
      listData.forEach(item => {
        if (pid !== null && item.pid === pid) {
          result.push({
            id: item.id,
            name: item.name,
            index_id: item.index_id,
            type: item.type,
            noteType: item.noteType,
            children: listToTree(item.id),
          });
        }
      });
      return result;
    };
    const newTree = listToTree(0);
    this.setState(
      {
        treeList: newTree,
        expandedKeys: [clickId.toString()],
        clickId,
        autoExpandParent: true,
      },
      () => this.clearMenu()
    );
  };

  handleDeleteSubFolder = () => {
    const deleteId = this.state.rightClickItem.dataRef.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryDeleteFolder',
      payload: {
        id: this.state.rightClickItem.dataRef.id,
      },
    }).then(() => {
      this.queryTreeList(this.state.project);
      this.clearMenu();
      this.clearSelect(deleteId);
    });
  };

  hanldeDeleteCase = () => {
    const deleteId = this.state.rightClickItem.dataRef.id;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryDeleteCase',
      payload: {
        id: deleteId,
      },
    }).then(() => {
      this.queryTreeList(this.state.project);
      this.clearMenu();
      this.clearSelect(deleteId);
    });
  };

  handleCopyCase = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryCopyCase',
      payload: {
        id: this.state.rightClickItem.dataRef.id,
      },
    }).then(() => {
      this.queryTreeList(this.state.project);
      this.clearMenu();
    });
  };

  queryProjectList = (caseId = null) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'system/queryProjectList',
      payload: {
        status: '1',
      },
    }).then(() => {
      const { system } = this.props;
      this.setState(
        {
          projectList: system.projectList,
        },
        () => {
          if (caseId) {
            this.querySampleInfo(caseId, true);
          } else {
            const localStorage = getTage();
            if (localStorage) {
              const project = localStorage.projectId;
              this.setState({ project }, () => {
                this.handleProjectChange(this.state.project);
              });
            }
          }
        }
      );
    });
  };

  queryExtractList = projectId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryExtractList',
      payload: {
        id: projectId,
      },
    }).then(() => {
      const { interfaceCase } = this.props;
      this.setState({
        extractList: interfaceCase.extractList,
      });
    });
  };

  queryTreeList = (id, isRef = false) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryTreeList',
      payload: {
        id,
      },
    }).then(() => {
      const { interfaceCase } = this.props;
      this.setState({ treeList: interfaceCase.treeList }, () => {
        if (isRef) {
          this.setState({
            selectedKeys: [this.state.caseId],
            expandedKeys: [this.state.caseId],
          });
        }
      });
    });
  };

  querySampleInfo = (id, isRef = false) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/querySampleInfo',
      payload: {
        id,
      },
    }).then(() => {
      const { interfaceCase } = this.props;
      if (interfaceCase.sampleInfo) {
        this.setState(
          {
            info: interfaceCase.sampleInfo,
            selectNoteType: 2,
            infoName: interfaceCase.sampleInfo.name,
            project: interfaceCase.sampleInfo.projectId,
            infoPath: interfaceCase.sampleInfo.path,
            infoMethod: interfaceCase.sampleInfo.method,
            infoParams: interfaceCase.sampleInfo.params,
            infoParamsFormatType: interfaceCase.sampleInfo.paramType,
            infoAssertType: interfaceCase.sampleInfo.asserts.assertsType,
            infoExtractType: interfaceCase.sampleInfo.extract.extractType,
            infoAssertData: interfaceCase.sampleInfo.asserts.assertData,
            infoExtractData: interfaceCase.sampleInfo.extract.extractData,
            hasPreShell: interfaceCase.sampleInfo.preShellType === 1 || false,
            preShellData: interfaceCase.sampleInfo.preShellData,
            hasPostShell: interfaceCase.sampleInfo.postShellType === 1 || false,
            postShellData: interfaceCase.sampleInfo.postShellData,
          },
          () => {
            if (isRef) {
              setTage({ projectId: this.state.project });
              this.queryTreeList(this.state.project, true);
              this.queryExtractList(this.state.project);
            }
          }
        );
      } else {
        this.setState({
          info: {
            name: '',
            path: '',
            method: 'GET',
            paramType: 1,
            params: [],
            asserts: {
              assertsType: 1,
              assertData: [],
            },
            extract: {
              extractType: 0,
              extractData: [],
            },
            preShellType: 0,
            preShellData: '',
            postShellType: 0,
            postShellData: '',
          },
        });
      }
    });
  };

  queryTreeInfo = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryTreeInfo',
      payload: {
        id,
      },
    }).then(() => {
      const { interfaceCase } = this.props;
      let { info } = this.state;
      info.name = interfaceCase.infoData.name;
      this.setState({ info, infoName: interfaceCase.infoData.name });
    });
  };

  handleProjectChange = value => {
    this.setState({ project: value }, () => {
      setTage({ projectId: this.state.project });
      this.queryTreeList(value);
      this.queryExtractList(value);
    });
  };

  onDrop = info => {
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateTreeIndex',
      payload: {
        dropKey,
        dragKey,
      },
    }).then(() => {
      this.queryTreeList(this.state.project);
    });
  };

  onSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      this.setState(
        {
          selectedKeys,
          selectNoteType: info.node.props.dataRef.noteType,
          infoName: '',
          infoPath: '',
          infoMethod: 'GET',
          infoParams: null,
          infoAssertType: 1,
          infoExtractType: 0,
          infoAssertData: null,
          infoExtractData: null,
          hasPreShell: false,
          preShellData: '',
          hasPostShell: false,
          postShellData: '',
        },
        () => {
          this.queryTreeInfo(this.state.selectedKeys[0]);
          if (this.state.selectNoteType === 2) {
            this.querySampleInfo(this.state.selectedKeys[0]);
            this.queryExtractList(this.state.project);
          }
        }
      );
    }
  };

  onCheck = () => {};

  getXY = ele => {
    const scrollTop = this.treeBox.scrollTop;
    var top = ele.offsetTop - scrollTop;
    var left = ele.offsetLeft;
    while (ele.offsetParent) {
      ele = ele.offsetParent;
      if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
        top += ele.offsetTop;
        left += ele.offsetLeft;
      } else {
        top += ele.offsetTop + ele.clientTop;
        left += ele.offsetLeft + ele.clientLeft;
      }
    }
    return { x: left, y: top };
  };

  handleOnRightClick = e => {
    const xy = this.getXY(e.event.currentTarget);
    const x = xy.x;
    const y = xy.y;
    this.setState({
      rightClickItem: {
        // pageX: x + e.event.currentTarget.clientWidth,
        pageX: x + 50,
        pageY: y + 12,
        id: e.node.props.eventKey,
        noteType: e.node.props.noteType,
        dataRef: e.node.props.dataRef,
      },
    });
  };

  clearMenu = () => {
    this.setState({ rightClickItem: null });
  };

  clearSelect = id => {
    if (this.state.selectedKeys) {
      if (this.state.selectedKeys[0] === id.toString()) {
        this.setState({ selectedKeys: null });
      }
    }
  };

  submitAddFolder = value => {
    if (!value) {
      message.warning('名称不可为空');
      this.queryTreeList(this.state.project);
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryAddSubFolder',
      payload: {
        id: this.state.clickId,
        name: value,
      },
    }).then(() => {
      this.queryTreeList(this.state.project);
    });
  };

  submitAddCase = value => {
    if (!value) {
      message.warning('名称不可为空');
      this.queryTreeList(this.state.project);
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryAddCase',
      payload: {
        id: this.state.clickId,
        name: value,
      },
    }).then(() => {
      this.queryTreeList(this.state.project);
    });
  };

  hanldeNameChange = e => {
    this.setState({ infoName: e.target.value }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'interfaceCase/queryUpdateFolderName',
        payload: {
          id: this.state.selectedKeys[0],
          name: this.state.infoName,
        },
      }).then(() => {
        this.queryTreeList(this.state.project);
      });
    });
  };

  handleMethodChange = value => {
    let { info } = this.state;
    info.method = value;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  handleAssertTypeChange = e => {
    let { info } = this.state;
    info.asserts.assertsType = e.target.value;
    if (e.target.value === 2) {
      info.asserts.assertData = [
        {
          id: new Date().getTime(),
          key: '',
          value: '',
        },
      ];
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  handleParamsFormatTypeChange = e => {
    let { info } = this.state;
    info.paramType = e.target.value;

    // if(e.target.value ===2){
    //   info.asserts.assertData = [
    //     {
    //       id:new Date().getTime(),
    //       key:'',
    //       value:'',
    //     }
    //   ];
    // }
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  handleExtractTypeChange = e => {
    let { info } = this.state;
    info.extract.extractType = e.target.value;
    if (e.target.value === 1) {
      info.extract.extractData = [
        {
          id: new Date().getTime(),
          key: '',
          value: '',
        },
      ];
    } else {
      // clear extractData
      info.extract.extractData = [];
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  handleAssertDataChange = () => {
    let { info } = this.state;
    info.asserts.assertData = this.state.infoAssertData;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  handleExtractDataChange = () => {
    let { info } = this.state;
    info.extract.extractData = this.state.infoExtractData;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  queryUpdateSample = (key, value) => {
    let { info } = this.state;
    info[key] = value;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  hanldePathChange = e => {
    let { info } = this.state;
    info.path = e.target.value;
    const { dispatch } = this.props;
    dispatch({
      type: 'interfaceCase/queryUpdateSample',
      payload: {
        id: this.state.selectedKeys[0],
        info,
      },
    }).then(() => {
      this.querySampleInfo(this.state.selectedKeys[0]);
    });
  };

  handleAddParams = () => {
    const emptyItem = {
      id: new Date().getTime(),
      type: false,
      key: '',
      value: '',
    };
    if (this.state.infoParams) {
      const newAttr = this.state.infoParams.concat(emptyItem);
      this.setState(
        {
          infoParams: newAttr,
        },
        () => this.queryUpdateSample('params', this.state.infoParams)
      );
    } else {
      this.setState(
        {
          infoParams: [emptyItem],
        },
        () => this.queryUpdateSample('params', this.state.infoParams)
      );
    }
  };

  handeExtractData = () => {
    const emptyItem = {
      id: new Date().getTime(),
      key: '',
      value: '',
    };
    if (this.state.infoExtractData) {
      const newAttr = this.state.infoExtractData.concat(emptyItem);
      this.setState(
        {
          infoExtractData: newAttr,
        },
        () => this.handleExtractDataChange()
      );
    } else {
      this.setState(
        {
          infoExtractData: [emptyItem],
        },
        () => this.handleExtractDataChange()
      );
    }
  };

  handleDeleteExtractSection = index => {
    const oldAttr = this.state.infoExtractData;
    if (index === 0 && oldAttr.length === 1) {
      this.setState(
        {
          infoExtractData: [],
        },
        () => this.handleExtractDataChange()
      );
    } else {
      oldAttr.splice(index, 1);
      this.setState(
        {
          infoExtractData: oldAttr,
        },
        () => this.handleExtractDataChange()
      );
    }
  };

  handleAddHeader = () => {
    const emptyItem = {
      id: new Date().getTime(),
      key: '',
      value: '',
    };
    if (this.state.debugHeader) {
      const newAttr = this.state.debugHeader.concat(emptyItem);
      this.setState({
        debugHeader: newAttr,
      });
    } else {
      this.setState({
        debugHeader: [emptyItem],
      });
    }
  };

  handeAssertData = () => {
    const emptyItem = {
      id: new Date().getTime(),
      value: '',
    };
    if (this.state.infoAssertData) {
      const newAttr = this.state.infoAssertData.concat(emptyItem);
      this.setState(
        {
          infoAssertData: newAttr,
        },
        () => this.handleAssertDataChange()
      );
    } else {
      this.setState(
        {
          infoAssertData: [emptyItem],
        },
        () => this.handleAssertDataChange()
      );
    }
  };

  handleParamsKeyChange = (e, index) => {
    const { infoParams } = this.state;
    infoParams[index].key = e.target.value;
    this.setState({ infoParams });
  };

  handleAssertJsonKeyChange = (e, index) => {
    const { infoAssertData } = this.state;
    infoAssertData[index].key = e.target.value;
    this.setState({ infoAssertData });
  };

  handleExtractJsonKeyChange = (e, index) => {
    const { infoExtractData } = this.state;
    infoExtractData[index].key = e.target.value;
    this.setState({ infoExtractData });
  };

  handleHeaderKeyChange = (e, index) => {
    const { debugHeader } = this.state;
    debugHeader[index].key = e.target.value;
    this.setState({ debugHeader });
  };

  handleParamsValueChange = (e, index) => {
    const { infoParams } = this.state;
    infoParams[index].value = e.target.value;
    this.setState({ infoParams });
  };

  handleParamsSelectValueChange = (e, index) => {
    const { infoParams } = this.state;
    infoParams[index].value = e;
    this.setState({ infoParams }, () => this.queryUpdateSample('params', this.state.infoParams));
  };

  handleSetPreShellChange = () => {
    const { hasPreShell } = this.state;
    this.setState({ hasPreShell: !hasPreShell }, () =>
      this.queryUpdateSample('preShellType', this.state.hasPreShell ? 1 : 0)
    );
  };

  handleSetPostShellChange = () => {
    const { hasPostShell } = this.state;
    this.setState({ hasPostShell: !hasPostShell }, () =>
      this.queryUpdateSample('postShellType', this.state.hasPostShell ? 1 : 0)
    );
  };

  handleParamsTypeChange = (e, index) => {
    const { infoParams } = this.state;
    infoParams[index].type = e;
    infoParams[index].value = '';
    this.setState({ infoParams }, () => this.queryUpdateSample('params', this.state.infoParams));
  };

  handleAssertJsonValueChange = (e, index) => {
    const { infoAssertData } = this.state;
    infoAssertData[index].value = e.target.value;
    this.setState({ infoAssertData });
  };

  handleExtractJsonValueChange = (e, index) => {
    const { infoExtractData } = this.state;
    infoExtractData[index].value = e.target.value;
    this.setState({ infoExtractData });
  };

  handleHeaderValueChange = (e, index) => {
    const { debugHeader } = this.state;
    debugHeader[index].v;
    alue = e.target.value;
    this.setState({ debugHeader });
  };

  onAssertDataChange = (e, index) => {
    const { infoAssertData } = this.state;
    infoAssertData[index].value = e.target.value;
    this.setState({ infoAssertData });
  };

  handleDeleteParams = index => {
    const oldAttr = this.state.infoParams;
    if (index === 0 && oldAttr.length === 1) {
      this.setState(
        {
          infoParams: null,
        },
        () => {
          this.queryUpdateSample('params', this.state.infoParams);
        }
      );
    } else {
      oldAttr.splice(index, 1);
      this.setState(
        {
          infoParams: oldAttr,
        },
        () => {
          this.queryUpdateSample('params', this.state.infoParams);
        }
      );
    }
  };

  handleDeleteHeader = index => {
    const oldAttr = this.state.debugHeader;
    if (index === 0 && oldAttr.length === 1) {
      this.setState({
        debugHeader: null,
      });
    } else {
      oldAttr.splice(index, 1);
      this.setState({
        debugHeader: oldAttr,
      });
    }
  };

  handleDeleteSection = index => {
    const oldAttr = this.state.infoAssertData;
    if (index === 0 && oldAttr.length === 1) {
      this.setState(
        {
          infoAssertData: [],
        },
        () => this.handleAssertDataChange()
      );
    } else {
      oldAttr.splice(index, 1);
      this.setState(
        {
          infoAssertData: oldAttr,
        },
        () => this.handleAssertDataChange()
      );
    }
  };

  handlePreShellChange = e => {
    if (e) {
      this.queryUpdateSample('preShellData', this.state.preShellData);
    }
  };

  handlePostShellChange = e => {
    if (e) {
      this.queryUpdateSample('postShellData', this.state.postShellData);
    }
  };

  onExpandTree = expandedKeys => {
    this.setState({ expandedKeys, autoExpandParent: false });
  };

  handleDebug = () => {
    const { dispatch } = this.props;
    let headers = {};
    if (this.state.debugHeader && this.state.debugHeader.length > 0) {
      this.state.debugHeader.forEach(item => {
        headers[item.key] = item.value;
      });
    }
    dispatch({
      type: 'interfaceCase/queryDebugSample',
      payload: {
        id: this.state.selectedKeys[0],
        domain: this.state.debugDomain,
        headers,
      },
    }).then(() => {
      const { interfaceCase } = this.props;
      this.setState({
        debugData: interfaceCase.debugInfo.debugData,
        debugParams: interfaceCase.debugInfo.debugParams,
        debugResult: interfaceCase.debugInfo.debugResult,
      });
    });
  };

  handleShowAddDebugHeader = () => {
    this.setState({ showAddHeader: !this.state.showAddHeader, debugHeader: [] });
  };

  render() {
    const {
      projectList,
      project,
      treeList,
      rightClickItem,
      expandedKeys,
      hasPreShell,
      hasPostShell,
      selectedKeys,
      autoExpandParent,
      selectNoteType,
      infoName,
      infoPath,
      preShellData,
      postShellData,
      infoMethod,
      infoParams,
      infoAssertType,
      infoExtractType,
      infoAssertData,
      infoParamsFormatType,
      infoExtractData,
      debugDomain,
      debugData,
      debugParams,
      showAddHeader,
      debugHeader,
      debugResult,
      extractList,
    } = this.state;
    const { loading, debugLoading } = this.props;
    const loop = data =>
      data.map(item => {
        if (item.noteType === 1) {
          return (
            <TreeNode
              icon={<Icon type="folder" theme="filled" style={{ color: '#3498db' }} />}
              key={item.id}
              dataRef={item}
              title={item.name}
              noteType={item.noteType}
            >
              {item.children && loop(item.children)}
            </TreeNode>
          );
        }
        if (item.noteType === 0) {
          if (item.type === 'folder') {
            return (
              <TreeNode
                icon={<Icon type="folder" theme="filled" style={{ color: '#3498db' }} />}
                selectable={false}
                title={
                  <Input
                    size="small"
                    style={{ width: 100 }}
                    autoFocus
                    onBlur={e => this.submitAddFolder(e.target.value)}
                    onPressEnter={e => this.submitAddFolder(e.target.value)}
                  />
                }
                key="0-0-1"
              />
            );
          }
          if (item.type === 'case') {
            return (
              <TreeNode
                icon={<Icon type="api" theme="filled" />}
                selectable={false}
                title={
                  <Input
                    size="small"
                    style={{ width: 100 }}
                    autoFocus
                    onBlur={e => this.submitAddCase(e.target.value)}
                    onPressEnter={e => this.submitAddCase(e.target.value)}
                  />
                }
                key="0-0-1"
              />
            );
          }
        }
        return (
          <TreeNode
            icon={<Icon type="api" theme="filled" />}
            key={item.id}
            dataRef={item}
            title={item.name}
            noteType={item.noteType}
          />
        );
      });
    // const Empty = (
    //   <div>
    //     <Card bordered={false} className={styles.right_empty_container}>
    //       <img src={empty} alt="empty" className={styles.empty_image} />
    //     </Card>
    //   </div>
    // );
    const Folder = (
      <Card loading={loading} bordered={false}>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>目录名称：</span>
          </div>
          <div className={styles.item_content_container}>
            <Input
              placeholder="标题名称"
              size="small"
              value={infoName}
              onChange={e => {
                this.setState({ infoName: e.target.value });
              }}
              onBlur={e => this.hanldeNameChange(e)}
              className={styles.item_item}
            />
          </div>
        </div>
        <Divider />
      </Card>
    );
    const Case = (
      <Card loading={loading} bordered={false}>
        <Divider orientation="left">基本信息</Divider>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>用例名称：</span>
          </div>
          <div className={styles.item_content_container}>
            <Input
              placeholder="标题名称"
              size="small"
              value={infoName}
              onChange={e => {
                this.setState({ infoName: e.target.value });
              }}
              onBlur={e => this.hanldeNameChange(e)}
              className={styles.item_item}
            />
          </div>
        </div>
        <Divider orientation="left">请求设置</Divider>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>前置shell：</span>
          </div>
          <div className={styles.item_content_container}>
            <Switch
              size="small"
              checked={hasPreShell}
              onChange={() => this.handleSetPreShellChange()}
            />
          </div>
        </div>
        {hasPreShell && (
          <div className={styles.item_container}>
            <div className={styles.item_label_container}>
              <span />
            </div>
            <div className={styles.item_content_container}>
              <AceEditor
                mode="java"
                theme="dracula"
                name="preShellInput"
                editorProps={{ $blockScrolling: true }}
                defaultValue={preShellData}
                value={preShellData || undefined}
                height="300px"
                onChange={newValue => this.setState({ preShellData: newValue })}
                onBlur={newValue => this.handlePreShellChange(newValue)}
              />
            </div>
          </div>
        )}
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>请求路径：</span>
          </div>
          <div className={styles.item_content_container}>
            <InputGroup className={styles.item_item} compact>
              <Select
                placeholder="method"
                size="small"
                value={infoMethod}
                style={{ width: '20%' }}
                onChange={value => this.handleMethodChange(value)}
              >
                <Option value="POST">POST</Option>
                <Option value="GET">GET</Option>
              </Select>
              <Input
                style={{ width: '80%' }}
                placeholder="请求路径eg:/path/path"
                size="small"
                value={infoPath}
                onChange={e => {
                  this.setState({ infoPath: e.target.value });
                }}
                onBlur={e => this.hanldePathChange(e)}
              />
            </InputGroup>
          </div>
        </div>
        {infoMethod === 'POST' && (
          <div className={styles.item_container}>
            <div className={styles.item_label_container}>
              <span>参数类型：</span>
            </div>
            <div className={styles.item_content_container}>
              <Radio.Group
                value={infoParamsFormatType}
                onChange={e => this.handleParamsFormatTypeChange(e)}
              >
                <Radio value={1}>x-www-form-urlencoded</Radio>
                <Radio value={2}>
                  <Tooltip title="设置该类型参数后，将不支持任务中的全局默认参数设置">
                    <a>json</a>
                  </Tooltip>
                </Radio>
                <Radio value={3}>form-data</Radio>
              </Radio.Group>
            </div>
          </div>
        )}
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>请求参数：</span>
          </div>
          <div className={styles.item_content_container}>
            {infoParams &&
              infoParams.map((item, index) => (
                <InputGroup size="small" key={item.id} className={styles.item_attrs_container}>
                  <Col span={6}>
                    <Input
                      placeholder="属性名"
                      value={item.key}
                      onChange={e => this.handleParamsKeyChange(e, index)}
                      onBlur={() => this.queryUpdateSample('params', this.state.infoParams)}
                    />
                  </Col>
                  <Col span={10}>
                    {item.type && (
                      <Select
                        placeholder="选择自定义参数"
                        value={item.value}
                        style={{ width: '100%' }}
                        size="small"
                        onChange={e => this.handleParamsSelectValueChange(e, index)}
                      >
                        {extractList &&
                          extractList.map(extractItem => {
                            const extractKey = extractItem.extractKey
                              .replace('${', '')
                              .replace('}', '');
                            return (
                              <Option
                                key={extractItem.id}
                                value={`$\{${extractItem.extractKey}\}`}
                                title={extractItem.caseName}
                                disabled={
                                  infoExtractData.length > 0 &&
                                  extractKey === infoExtractData[0].key
                                }
                              >
                                <span
                                  style={
                                    infoExtractData.length > 0 &&
                                    extractKey === infoExtractData[0].key
                                      ? {}
                                      : { color: 'blue' }
                                  }
                                >
                                  {extractKey}
                                </span>
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                    {!item.type && (
                      <Input
                        placeholder="属性值"
                        value={item.value}
                        onChange={e => this.handleParamsValueChange(e, index)}
                        onBlur={() => this.queryUpdateSample('params', this.state.infoParams)}
                      />
                    )}
                  </Col>
                  <Col span={2}>
                    <Tooltip
                      title={`开启后，可下拉选择已定义的参数。(shell中定义的参数无需开启，直接输入： \${xxx} 获取)`}
                    >
                      <Switch
                        size="small"
                        checked={item.type}
                        onChange={e => this.handleParamsTypeChange(e, index)}
                      />
                    </Tooltip>
                  </Col>
                  <Col span={1}>
                    <Icon type="minus-circle" onClick={() => this.handleDeleteParams(index)} />
                  </Col>
                </InputGroup>
              ))}
            <Button
              type="dashed"
              size="small"
              onClick={() => this.handleAddParams()}
              className={styles.item_item}
            >
              <Icon type="plus" /> Add field
            </Button>
          </div>
        </div>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>后置shell：</span>
          </div>
          <div className={styles.item_content_container}>
            <Switch
              size="small"
              checked={hasPostShell}
              onChange={() => this.handleSetPostShellChange()}
            />
          </div>
        </div>
        {hasPostShell && (
          <div className={styles.item_container}>
            <div className={styles.item_label_container}>
              <span />
            </div>
            <div className={styles.item_content_container}>
              <AceEditor
                mode="java"
                theme="dracula"
                name="postShellInput"
                editorProps={{ $blockScrolling: true }}
                defaultValue={postShellData}
                value={postShellData || undefined}
                height="300px"
                onChange={newValue => this.setState({ postShellData: newValue })}
                onBlur={newValue => this.handlePostShellChange(newValue)}
              />
            </div>
          </div>
        )}
        <Divider orientation="left">返回校验</Divider>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>校验类型：</span>
          </div>
          <div className={styles.item_content_container}>
            <Radio.Group value={infoAssertType} onChange={e => this.handleAssertTypeChange(e)}>
              <Radio value={0}>不断言</Radio>
              <Radio value={1}>响应断言</Radio>
              <Radio value={2}>JSON断言</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>校验值：</span>
          </div>
          <div className={styles.item_content_container}>
            {infoAssertType === 1 && (
              <div>
                <div className={styles.item_item}>
                  {infoAssertData &&
                    infoAssertData.map((item, index) => (
                      <div
                        style={{ marginBottom: 10, display: 'flex', flexDirection: 'row' }}
                        key={item.id}
                      >
                        <TextArea
                          placeholder={`需要校验的返回值.eg: "code":0 `}
                          value={item.value}
                          autosize={{ minRows: 2, maxRows: 6 }}
                          onChange={e => this.onAssertDataChange(e, index)}
                          onBlur={() => this.handleAssertDataChange()}
                        />
                        <div className={styles.section_delete}>
                          <Icon
                            type="minus-circle"
                            onClick={() => this.handleDeleteSection(index)}
                          />
                        </div>
                      </div>
                    ))}
                </div>
                <Button
                  type="dashed"
                  onClick={() => this.handeAssertData()}
                  className={styles.item_item}
                  style={{ height: 60 }}
                >
                  <Icon type="plus" /> 添加
                </Button>
              </div>
            )}
            {infoAssertType === 2 && (
              <div>
                {infoAssertData &&
                  infoAssertData.map((item, index) => (
                    <InputGroup size="small" className={styles.item_attrs_container} key={item.id}>
                      <Col span={10}>
                        <Input
                          placeholder="json路径.eg: content.testdata.xxx "
                          value={item.key}
                          onChange={e => this.handleAssertJsonKeyChange(e, index)}
                          onBlur={() => this.handleAssertDataChange()}
                        />
                      </Col>
                      <Col span={10}>
                        <Input
                          placeholder="字段值"
                          value={item.value}
                          onChange={e => this.handleAssertJsonValueChange(e, index)}
                          onBlur={() => this.handleAssertDataChange()}
                        />
                      </Col>
                      <div className={styles.section_delete}>
                        <Icon type="minus-circle" onClick={() => this.handleDeleteSection(index)} />
                      </div>
                    </InputGroup>
                  ))}
                <Button
                  type="dashed"
                  onClick={() => this.handeAssertData()}
                  className={styles.item_item}
                  style={{ height: 60 }}
                >
                  <Icon type="plus" /> 添加
                </Button>
              </div>
            )}
          </div>
        </div>
        <Divider orientation="left">参数化设置</Divider>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>提取方式：</span>
          </div>
          <div className={styles.item_content_container}>
            <Radio.Group value={infoExtractType} onChange={e => this.handleExtractTypeChange(e)}>
              <Radio value={0}>不提取</Radio>
              <Radio value={1}>JSON提取</Radio>
            </Radio.Group>
          </div>
        </div>
        <div className={styles.item_container}>
          <div className={styles.item_label_container}>
            <span>定义参数：</span>
          </div>
          <div className={styles.item_content_container}>
            {infoExtractType === 1 && (
              <div>
                {infoExtractData &&
                  infoExtractData.map((item, index) => (
                    <InputGroup size="small" className={styles.item_attrs_container} key={item.id}>
                      <Col span={10}>
                        <Input
                          placeholder="参数名称"
                          style={{ color: 'blue' }}
                          value={item.key}
                          onChange={e => this.handleExtractJsonKeyChange(e, index)}
                          onBlur={() => this.handleExtractDataChange()}
                        />
                      </Col>
                      <Col span={10}>
                        <Input
                          placeholder="json路径.eg: content.testdata.xxx "
                          value={item.value}
                          onChange={e => this.handleExtractJsonValueChange(e, index)}
                          onBlur={() => this.handleExtractDataChange()}
                        />
                      </Col>
                      <Icon
                        type="minus-circle"
                        onClick={() => this.handleDeleteExtractSection(index)}
                      />
                    </InputGroup>
                  ))}
                <Button
                  type="dashed"
                  onClick={() => this.handeExtractData()}
                  className={styles.item_item}
                  style={{ height: 60 }}
                >
                  <Icon type="plus" /> Add field
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
    const Debug = (
      <Spin spinning={debugLoading || false}>
        <Card bordered={false}>
          <div className={styles.debug_label_container}>
            <span>调试域名：</span>
          </div>
          <div className={styles.item_container}>
            <div className={styles.debug_content_container}>
              <Input
                placeholder="eg:https://app.xxxx.com"
                size="small"
                value={debugDomain}
                onChange={e => {
                  this.setState({ debugDomain: e.target.value });
                }}
              />
            </div>
            <Button type="primary" size="small" onClick={() => this.handleDebug()}>
              调试
            </Button>
          </div>
          <div className={styles.debug_header_container}>
            <div className={styles.debug_add_header}>
              <a onClick={() => this.handleShowAddDebugHeader()}>请求头设置</a>
            </div>
          </div>
          {showAddHeader && (
            <div className={styles.debug_header_content}>
              {debugHeader &&
                debugHeader.map((item, index) => (
                  <InputGroup size="small" key={item.id} className={styles.item_attrs_container}>
                    <Col span={8}>
                      <Input
                        placeholder="属性名"
                        value={item.key}
                        onChange={e => this.handleHeaderKeyChange(e, index)}
                      />
                    </Col>
                    <Col span={10}>
                      <Input
                        placeholder="属性值"
                        value={item.value}
                        onChange={e => this.handleHeaderValueChange(e, index)}
                      />
                    </Col>
                    <div className={styles.action_icon}>
                      <Icon type="minus-circle" onClick={() => this.handleDeleteHeader(index)} />
                    </div>
                  </InputGroup>
                ))}
              <Button
                type="dashed"
                size="small"
                onClick={() => this.handleAddHeader()}
                className={styles.item_item}
              >
                <Icon type="plus" /> Add field
              </Button>
            </div>
          )}
          <div className={styles.debug_label_container}>
            <span>响应信息：</span>
          </div>
          <div className={styles.item_container}>
            <div className={styles.debug_response_container}>
              {debugResult !== 0 && <JSONPretty id="json-pretty" data={debugData} />}
            </div>
          </div>
          <div className={styles.debug_label_container}>
            <span>校验结果：</span>
          </div>
          <div className={styles.item_container}>
            <div className={styles.debug_assert_container}>
              {debugResult === 1 && (
                <div className={styles.success}>
                  <Icon type="check-circle" theme="filled" style={{ fontSize: 22 }} />
                  <div>测试通过</div>
                </div>
              )}
              {debugResult === 2 && (
                <div className={styles.fail}>
                  <Icon type="close-circle" theme="filled" style={{ fontSize: 22 }} />
                  <div>测试失败</div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.debug_label_container}>
            <span>参数化结果：</span>
          </div>
          <div className={styles.item_container}>
            <div className={styles.debug_response_container}>
              {debugResult !== 0 && <JSONPretty id="json-pretty" data={debugParams} />}
            </div>
          </div>
        </Card>
      </Spin>
    );
    return (
      <Content>
        <Layout
          style={{ background: '#fff', borderRadius: '5px' }}
          onClick={() => this.clearMenu()}
        >
          <Sider style={{ background: '#fff', height: '80vh', zIndex: 2 }}>
            <Resizable
              className={styles.left_res_container}
              enable={{ right: true }}
              defaultSize={{ height: '80vh' }}
              size={{ height: '80vh' }}
            >
              <Select
                placeholder="请选择项目"
                value={project || undefined}
                style={{ width: '100%' }}
                size="small"
                onChange={this.handleProjectChange}
              >
                {projectList &&
                  projectList.map(item => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
              </Select>
              <div className={styles.left_container} ref={this.setDomTreeBoxRef}>
                <Tree
                  showIcon
                  draggable
                  // expandAction="doubleClick"
                  autoExpandParent={autoExpandParent}
                  defaultExpandAll
                  selectedKeys={selectedKeys}
                  expandedKeys={expandedKeys}
                  onSelect={this.onSelect}
                  onDrop={this.onDrop}
                  onCheck={this.onCheck}
                  onExpand={this.onExpandTree}
                  onRightClick={e => this.handleOnRightClick(e)}
                >
                  {treeList && loop(treeList)}
                </Tree>
              </div>
            </Resizable>
          </Sider>
          <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
            <Content
              style={{
                background: '#fff',
                padding: 10,
                height: '80vh',
                width: '70%',
                borderRight: '1px solid #e8e8e8',
              }}
            >
              <div className={styles.right_container}>
                {!(selectedKeys && selectedKeys.length > 0) && <Empty />}
                {selectedKeys && selectNoteType === 1 && Folder}
                {selectedKeys && selectNoteType === 2 && Case}
              </div>
            </Content>
            <Content style={{ background: '#fff', padding: 10, height: '80vh', width: '30%' }}>
              <div className={styles.right_container}>
                {selectedKeys && selectNoteType === 2 && Debug}
              </div>
            </Content>
          </div>
        </Layout>
        {rightClickItem && this.getNodeTreeMenu()}
      </Content>
    );
  }
}

export default Interface;
