(window['webpackJsonp'] = window['webpackJsonp'] || []).push([
  [10],
  {
    '5p4Y': function(e, t, a) {
      'use strict';
      var n = a('g09b'),
        l = a('tAuX');
      Object.defineProperty(t, '__esModule', { value: !0 }), (t.default = void 0), a('R9oj');
      var r = n(a('ECub'));
      a('T2oS');
      var d = n(a('W9HT'));
      a('+L6B');
      var s = n(a('2/Rp'));
      a('jCWc');
      var i = n(a('kPKH'));
      a('5Dmo');
      var u = n(a('3S7+'));
      a('7Kak');
      var c = n(a('9yH6'));
      a('BoS7');
      var o = n(a('Sdc0'));
      a('IzEo');
      var f = n(a('bx4M'));
      a('/zsF');
      var m = n(a('PArb'));
      a('lUTK');
      var p = n(a('BvKs'));
      a('Pwec');
      var h = n(a('CtXQ')),
        y = n(a('p0pE'));
      a('miYZ');
      var g = n(a('tsqr')),
        v = n(a('2Taf')),
        E = n(a('vZ4D')),
        S = n(a('l4Ni')),
        _ = n(a('ujKo')),
        C = n(a('MhPg'));
      a('5NDa');
      var x = n(a('5rEg'));
      a('OaEy');
      var b = n(a('2fM7'));
      a('ozfa');
      var D = n(a('MJZm'));
      a('B9cy');
      var T,
        N,
        P,
        k = n(a('Ol7k')),
        I = l(a('q1tI')),
        q = n(a('lc5D')),
        A = a('MuoO'),
        K = n(a('nZsZ')),
        j = a('mj9/'),
        L = n(a('WGjm')),
        w = n(a('GicG'));
      a('OWmA'), a('0Gcn');
      var H = k.default.Content,
        R = k.default.Sider,
        M = D.default.TreeNode,
        z = b.default.Option,
        U = x.default.Group,
        B = x.default.TextArea,
        F = ((T = (0, A.connect)(function(e) {
          var t = e.system,
            a = e.interfaceCase,
            n = e.loading;
          return {
            system: t,
            interfaceCase: a,
            loading: n.effects['interfaceCase/queryTreeInfo'],
            debugLoading: n.effects['interfaceCase/queryDebugSample'],
          };
        })),
        T(
          ((P = (function(e) {
            function t(e) {
              var a;
              return (
                (0, v.default)(this, t),
                (a = (0, S.default)(this, (0, _.default)(t).call(this, e))),
                (a.handleRightMenuClick = function(e) {
                  var t = e.key;
                  switch (t) {
                    case '1':
                      a.handleAddCase();
                      break;
                    case '2':
                      a.handleAddSubFolder();
                      break;
                    case '4':
                      a.handleDeleteSubFolder();
                      break;
                    case '5':
                      a.handleCopyCase();
                      break;
                    case '6':
                      a.hanldeDeleteCase();
                      break;
                    default:
                      g.default.warning('\u51fa\u73b0\u4e86\u4ec0\u4e48\u9b3c');
                  }
                }),
                (a.treeToList = function(e) {
                  var t = [
                      {
                        id: e[0].id,
                        name: e[0].name,
                        noteType: e[0].noteType,
                        index_id: e[0].index_id,
                        pid: 0,
                      },
                    ],
                    a = function e(a, n) {
                      return a.children.forEach(function(a) {
                        t.push({
                          id: a.id,
                          name: a.name,
                          noteType: a.noteType,
                          index_id: a.index_id,
                          pid: n,
                        }),
                          a.children && a.children.length > 0 && e(a, a.id);
                      });
                    };
                  return a(e[0], e[0].id), t;
                }),
                (a.onChangeTest = function(e) {
                  a.setState({ preShellData: e }, function() {});
                }),
                (a.handleAddCase = function() {
                  var e = a.state.rightClickItem.dataRef.id,
                    t = a.state.treeList,
                    n = a.treeToList(t);
                  n.push({ id: null, name: '', type: 'case', noteType: 0, index_id: 99, pid: e });
                  var l = function e(t) {
                      var a = [];
                      return (
                        n.forEach(function(n) {
                          null !== t &&
                            n.pid === t &&
                            a.push({
                              id: n.id,
                              name: n.name,
                              index_id: n.index_id,
                              type: n.type,
                              noteType: n.noteType,
                              children: e(n.id),
                            });
                        }),
                        a
                      );
                    },
                    r = l(0);
                  a.setState(
                    { treeList: r, expandedKeys: [e.toString()], clickId: e, autoExpandParent: !0 },
                    function() {
                      return a.clearMenu();
                    }
                  );
                }),
                (a.handleAddSubFolder = function() {
                  var e = a.state.rightClickItem.dataRef.id,
                    t = a.state.treeList,
                    n = a.treeToList(t);
                  n.push({ id: null, name: '', type: 'folder', noteType: 0, index_id: 99, pid: e });
                  var l = function e(t) {
                      var a = [];
                      return (
                        n.forEach(function(n) {
                          null !== t &&
                            n.pid === t &&
                            a.push({
                              id: n.id,
                              name: n.name,
                              index_id: n.index_id,
                              type: n.type,
                              noteType: n.noteType,
                              children: e(n.id),
                            });
                        }),
                        a
                      );
                    },
                    r = l(0);
                  a.setState(
                    { treeList: r, expandedKeys: [e.toString()], clickId: e, autoExpandParent: !0 },
                    function() {
                      return a.clearMenu();
                    }
                  );
                }),
                (a.handleDeleteSubFolder = function() {
                  var e = a.state.rightClickItem.dataRef.id,
                    t = a.props.dispatch;
                  t({
                    type: 'interfaceCase/queryDeleteFolder',
                    payload: { id: a.state.rightClickItem.dataRef.id },
                  }).then(function() {
                    a.queryTreeList(a.state.project), a.clearMenu(), a.clearSelect(e);
                  });
                }),
                (a.hanldeDeleteCase = function() {
                  var e = a.state.rightClickItem.dataRef.id,
                    t = a.props.dispatch;
                  t({ type: 'interfaceCase/queryDeleteCase', payload: { id: e } }).then(function() {
                    a.queryTreeList(a.state.project), a.clearMenu(), a.clearSelect(e);
                  });
                }),
                (a.handleCopyCase = function() {
                  var e = a.props.dispatch;
                  e({
                    type: 'interfaceCase/queryCopyCase',
                    payload: { id: a.state.rightClickItem.dataRef.id },
                  }).then(function() {
                    a.queryTreeList(a.state.project), a.clearMenu();
                  });
                }),
                (a.queryProjectList = function() {
                  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                    t = a.props.dispatch;
                  t({ type: 'system/queryProjectList', payload: { status: '1' } }).then(function() {
                    var t = a.props.system;
                    a.setState({ projectList: t.projectList }, function() {
                      if (e) a.querySampleInfo(e, !0);
                      else {
                        var t = (0, j.getTage)();
                        if (t) {
                          var n = t.projectId;
                          a.setState({ project: n }, function() {
                            a.handleProjectChange(a.state.project);
                          });
                        }
                      }
                    });
                  });
                }),
                (a.queryExtractList = function(e) {
                  var t = a.props.dispatch;
                  t({ type: 'interfaceCase/queryExtractList', payload: { id: e } }).then(
                    function() {
                      var e = a.props.interfaceCase;
                      a.setState({ extractList: e.extractList });
                    }
                  );
                }),
                (a.queryTreeList = function(e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    n = a.props.dispatch;
                  n({ type: 'interfaceCase/queryTreeList', payload: { id: e } }).then(function() {
                    var e = a.props.interfaceCase;
                    a.setState({ treeList: e.treeList }, function() {
                      t &&
                        a.setState({
                          selectedKeys: [a.state.caseId],
                          expandedKeys: [a.state.caseId],
                        });
                    });
                  });
                }),
                (a.querySampleInfo = function(e) {
                  var t = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                    n = a.props.dispatch;
                  n({ type: 'interfaceCase/querySampleInfo', payload: { id: e } }).then(function() {
                    var e = a.props.interfaceCase;
                    e.sampleInfo
                      ? a.setState(
                          {
                            info: e.sampleInfo,
                            selectNoteType: 2,
                            infoName: e.sampleInfo.name,
                            project: e.sampleInfo.projectId,
                            infoPath: e.sampleInfo.path,
                            infoMethod: e.sampleInfo.method,
                            infoParams: e.sampleInfo.params,
                            infoParamsFormatType: e.sampleInfo.paramType,
                            infoAssertType: e.sampleInfo.asserts.assertsType,
                            infoExtractType: e.sampleInfo.extract.extractType,
                            infoAssertData: e.sampleInfo.asserts.assertData,
                            infoExtractData: e.sampleInfo.extract.extractData,
                            hasPreShell: 1 === e.sampleInfo.preShellType || !1,
                            preShellData: e.sampleInfo.preShellData,
                            hasPostShell: 1 === e.sampleInfo.postShellType || !1,
                            postShellData: e.sampleInfo.postShellData,
                          },
                          function() {
                            t &&
                              ((0, j.setTage)({ projectId: a.state.project }),
                              a.queryTreeList(a.state.project, !0),
                              a.queryExtractList(a.state.project));
                          }
                        )
                      : a.setState({
                          info: {
                            name: '',
                            path: '',
                            method: 'GET',
                            paramType: 1,
                            params: [],
                            asserts: { assertsType: 1, assertData: [] },
                            extract: { extractType: 0, extractData: [] },
                            preShellType: 0,
                            preShellData: '',
                            postShellType: 0,
                            postShellData: '',
                          },
                        });
                  });
                }),
                (a.queryTreeInfo = function(e) {
                  var t = a.props.dispatch;
                  t({ type: 'interfaceCase/queryTreeInfo', payload: { id: e } }).then(function() {
                    var e = a.props.interfaceCase,
                      t = a.state.info;
                    (t.name = e.infoData.name), a.setState({ info: t, infoName: e.infoData.name });
                  });
                }),
                (a.handleProjectChange = function(e) {
                  a.setState({ project: e }, function() {
                    (0, j.setTage)({ projectId: a.state.project }),
                      a.queryTreeList(e),
                      a.queryExtractList(e);
                  });
                }),
                (a.onDrop = function(e) {
                  var t = e.node.props.eventKey,
                    n = e.dragNode.props.eventKey,
                    l = a.props.dispatch;
                  l({
                    type: 'interfaceCase/queryUpdateTreeIndex',
                    payload: { dropKey: t, dragKey: n },
                  }).then(function() {
                    a.queryTreeList(a.state.project);
                  });
                }),
                (a.onSelect = function(e, t) {
                  e.length > 0 &&
                    a.setState(
                      {
                        selectedKeys: e,
                        selectNoteType: t.node.props.dataRef.noteType,
                        infoName: '',
                        infoPath: '',
                        infoMethod: 'GET',
                        infoParams: null,
                        infoAssertType: 1,
                        infoExtractType: 0,
                        infoAssertData: null,
                        infoExtractData: null,
                        hasPreShell: !1,
                        preShellData: '',
                        hasPostShell: !1,
                        postShellData: '',
                      },
                      function() {
                        a.queryTreeInfo(a.state.selectedKeys[0]),
                          2 === a.state.selectNoteType &&
                            (a.querySampleInfo(a.state.selectedKeys[0]),
                            a.queryExtractList(a.state.project));
                      }
                    );
                }),
                (a.onCheck = function() {}),
                (a.getXY = function(e) {
                  var t = a.treeBox.scrollTop,
                    n = e.offsetTop - t,
                    l = e.offsetLeft;
                  while (e.offsetParent)
                    (e = e.offsetParent),
                      window.navigator.userAgent.indexOf('MSTE 8') > -1
                        ? ((n += e.offsetTop), (l += e.offsetLeft))
                        : ((n += e.offsetTop + e.clientTop), (l += e.offsetLeft + e.clientLeft));
                  return { x: l, y: n };
                }),
                (a.handleOnRightClick = function(e) {
                  var t = a.getXY(e.event.currentTarget),
                    n = t.x,
                    l = t.y;
                  a.setState({
                    rightClickItem: {
                      pageX: n + 50,
                      pageY: l + 12,
                      id: e.node.props.eventKey,
                      noteType: e.node.props.noteType,
                      dataRef: e.node.props.dataRef,
                    },
                  });
                }),
                (a.clearMenu = function() {
                  a.setState({ rightClickItem: null });
                }),
                (a.clearSelect = function(e) {
                  a.state.selectedKeys &&
                    a.state.selectedKeys[0] === e.toString() &&
                    a.setState({ selectedKeys: null });
                }),
                (a.submitAddFolder = function(e) {
                  if (!e)
                    return (
                      g.default.warning('\u540d\u79f0\u4e0d\u53ef\u4e3a\u7a7a'),
                      void a.queryTreeList(a.state.project)
                    );
                  var t = a.props.dispatch;
                  t({
                    type: 'interfaceCase/queryAddSubFolder',
                    payload: { id: a.state.clickId, name: e },
                  }).then(function() {
                    a.queryTreeList(a.state.project);
                  });
                }),
                (a.submitAddCase = function(e) {
                  if (!e)
                    return (
                      g.default.warning('\u540d\u79f0\u4e0d\u53ef\u4e3a\u7a7a'),
                      void a.queryTreeList(a.state.project)
                    );
                  var t = a.props.dispatch;
                  t({
                    type: 'interfaceCase/queryAddCase',
                    payload: { id: a.state.clickId, name: e },
                  }).then(function() {
                    a.queryTreeList(a.state.project);
                  });
                }),
                (a.hanldeNameChange = function(e) {
                  a.setState({ infoName: e.target.value }, function() {
                    var e = a.props.dispatch;
                    e({
                      type: 'interfaceCase/queryUpdateFolderName',
                      payload: { id: a.state.selectedKeys[0], name: a.state.infoName },
                    }).then(function() {
                      a.queryTreeList(a.state.project);
                    });
                  });
                }),
                (a.handleMethodChange = function(e) {
                  var t = a.state.info;
                  t.method = e;
                  var n = a.props.dispatch;
                  n({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: t },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.handleAssertTypeChange = function(e) {
                  var t = a.state.info;
                  (t.asserts.assertsType = e.target.value),
                    2 === e.target.value &&
                      (t.asserts.assertData = [{ id: new Date().getTime(), key: '', value: '' }]);
                  var n = a.props.dispatch;
                  n({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: t },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.handleParamsFormatTypeChange = function(e) {
                  var t = a.state.info;
                  t.paramType = e.target.value;
                  var n = a.props.dispatch;
                  n({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: t },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.handleExtractTypeChange = function(e) {
                  var t = a.state.info;
                  (t.extract.extractType = e.target.value),
                    1 === e.target.value
                      ? (t.extract.extractData = [{ id: new Date().getTime(), key: '', value: '' }])
                      : (t.extract.extractData = []);
                  var n = a.props.dispatch;
                  n({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: t },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.handleAssertDataChange = function() {
                  var e = a.state.info;
                  e.asserts.assertData = a.state.infoAssertData;
                  var t = a.props.dispatch;
                  t({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: e },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.handleExtractDataChange = function() {
                  var e = a.state.info;
                  e.extract.extractData = a.state.infoExtractData;
                  var t = a.props.dispatch;
                  t({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: e },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.queryUpdateSample = function(e, t) {
                  var n = a.state.info;
                  n[e] = t;
                  var l = a.props.dispatch;
                  l({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: n },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.hanldePathChange = function(e) {
                  var t = a.state.info;
                  t.path = e.target.value;
                  var n = a.props.dispatch;
                  n({
                    type: 'interfaceCase/queryUpdateSample',
                    payload: { id: a.state.selectedKeys[0], info: t },
                  }).then(function() {
                    a.querySampleInfo(a.state.selectedKeys[0]);
                  });
                }),
                (a.handleAddParams = function() {
                  var e = { id: new Date().getTime(), type: !1, key: '', value: '' };
                  if (a.state.infoParams) {
                    var t = a.state.infoParams.concat(e);
                    a.setState({ infoParams: t }, function() {
                      return a.queryUpdateSample('params', a.state.infoParams);
                    });
                  } else
                    a.setState({ infoParams: [e] }, function() {
                      return a.queryUpdateSample('params', a.state.infoParams);
                    });
                }),
                (a.handeExtractData = function() {
                  var e = { id: new Date().getTime(), key: '', value: '' };
                  if (a.state.infoExtractData) {
                    var t = a.state.infoExtractData.concat(e);
                    a.setState({ infoExtractData: t }, function() {
                      return a.handleExtractDataChange();
                    });
                  } else
                    a.setState({ infoExtractData: [e] }, function() {
                      return a.handleExtractDataChange();
                    });
                }),
                (a.handleDeleteExtractSection = function(e) {
                  var t = a.state.infoExtractData;
                  0 === e && 1 === t.length
                    ? a.setState({ infoExtractData: [] }, function() {
                        return a.handleExtractDataChange();
                      })
                    : (t.splice(e, 1),
                      a.setState({ infoExtractData: t }, function() {
                        return a.handleExtractDataChange();
                      }));
                }),
                (a.handleAddHeader = function() {
                  var e = { id: new Date().getTime(), key: '', value: '' };
                  if (a.state.debugHeader) {
                    var t = a.state.debugHeader.concat(e);
                    a.setState({ debugHeader: t });
                  } else a.setState({ debugHeader: [e] });
                }),
                (a.handeAssertData = function() {
                  var e = { id: new Date().getTime(), value: '' };
                  if (a.state.infoAssertData) {
                    var t = a.state.infoAssertData.concat(e);
                    a.setState({ infoAssertData: t }, function() {
                      return a.handleAssertDataChange();
                    });
                  } else
                    a.setState({ infoAssertData: [e] }, function() {
                      return a.handleAssertDataChange();
                    });
                }),
                (a.handleParamsKeyChange = function(e, t) {
                  var n = a.state.infoParams;
                  (n[t].key = e.target.value), a.setState({ infoParams: n });
                }),
                (a.handleAssertJsonKeyChange = function(e, t) {
                  var n = a.state.infoAssertData;
                  (n[t].key = e.target.value), a.setState({ infoAssertData: n });
                }),
                (a.handleExtractJsonKeyChange = function(e, t) {
                  var n = a.state.infoExtractData;
                  (n[t].key = e.target.value), a.setState({ infoExtractData: n });
                }),
                (a.handleHeaderKeyChange = function(e, t) {
                  var n = a.state.debugHeader;
                  (n[t].key = e.target.value), a.setState({ debugHeader: n });
                }),
                (a.handleParamsValueChange = function(e, t) {
                  var n = a.state.infoParams;
                  (n[t].value = e.target.value), a.setState({ infoParams: n });
                }),
                (a.handleParamsSelectValueChange = function(e, t) {
                  var n = a.state.infoParams;
                  (n[t].value = e),
                    a.setState({ infoParams: n }, function() {
                      return a.queryUpdateSample('params', a.state.infoParams);
                    });
                }),
                (a.handleSetPreShellChange = function() {
                  var e = a.state.hasPreShell;
                  a.setState({ hasPreShell: !e }, function() {
                    return a.queryUpdateSample('preShellType', a.state.hasPreShell ? 1 : 0);
                  });
                }),
                (a.handleSetPostShellChange = function() {
                  var e = a.state.hasPostShell;
                  a.setState({ hasPostShell: !e }, function() {
                    return a.queryUpdateSample('postShellType', a.state.hasPostShell ? 1 : 0);
                  });
                }),
                (a.handleParamsTypeChange = function(e, t) {
                  var n = a.state.infoParams;
                  (n[t].type = e),
                    (n[t].value = ''),
                    a.setState({ infoParams: n }, function() {
                      return a.queryUpdateSample('params', a.state.infoParams);
                    });
                }),
                (a.handleAssertJsonValueChange = function(e, t) {
                  var n = a.state.infoAssertData;
                  (n[t].value = e.target.value), a.setState({ infoAssertData: n });
                }),
                (a.handleExtractJsonValueChange = function(e, t) {
                  var n = a.state.infoExtractData;
                  (n[t].value = e.target.value), a.setState({ infoExtractData: n });
                }),
                (a.handleHeaderValueChange = function(e, t) {
                  var n = a.state.debugHeader;
                  n[t].v, (alue = e.target.value), a.setState({ debugHeader: n });
                }),
                (a.onAssertDataChange = function(e, t) {
                  var n = a.state.infoAssertData;
                  (n[t].value = e.target.value), a.setState({ infoAssertData: n });
                }),
                (a.handleDeleteParams = function(e) {
                  var t = a.state.infoParams;
                  0 === e && 1 === t.length
                    ? a.setState({ infoParams: null }, function() {
                        a.queryUpdateSample('params', a.state.infoParams);
                      })
                    : (t.splice(e, 1),
                      a.setState({ infoParams: t }, function() {
                        a.queryUpdateSample('params', a.state.infoParams);
                      }));
                }),
                (a.handleDeleteHeader = function(e) {
                  var t = a.state.debugHeader;
                  0 === e && 1 === t.length
                    ? a.setState({ debugHeader: null })
                    : (t.splice(e, 1), a.setState({ debugHeader: t }));
                }),
                (a.handleDeleteSection = function(e) {
                  var t = a.state.infoAssertData;
                  0 === e && 1 === t.length
                    ? a.setState({ infoAssertData: [] }, function() {
                        return a.handleAssertDataChange();
                      })
                    : (t.splice(e, 1),
                      a.setState({ infoAssertData: t }, function() {
                        return a.handleAssertDataChange();
                      }));
                }),
                (a.handlePreShellChange = function(e) {
                  e && a.queryUpdateSample('preShellData', a.state.preShellData);
                }),
                (a.handlePostShellChange = function(e) {
                  e && a.queryUpdateSample('postShellData', a.state.postShellData);
                }),
                (a.onExpandTree = function(e) {
                  a.setState({ expandedKeys: e, autoExpandParent: !1 });
                }),
                (a.handleDebug = function() {
                  var e = a.props.dispatch,
                    t = {};
                  a.state.debugHeader &&
                    a.state.debugHeader.length > 0 &&
                    a.state.debugHeader.forEach(function(e) {
                      t[e.key] = e.value;
                    }),
                    e({
                      type: 'interfaceCase/queryDebugSample',
                      payload: {
                        id: a.state.selectedKeys[0],
                        domain: a.state.debugDomain,
                        headers: t,
                      },
                    }).then(function() {
                      var e = a.props.interfaceCase;
                      a.setState({
                        debugData: e.debugInfo.debugData,
                        debugParams: e.debugInfo.debugParams,
                        debugResult: e.debugInfo.debugResult,
                      });
                    });
                }),
                (a.handleShowAddDebugHeader = function() {
                  a.setState({ showAddHeader: !a.state.showAddHeader, debugHeader: [] });
                }),
                (a.state = {
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
                  autoExpandParent: !0,
                  showAddHeader: !1,
                  hasPreShell: !1,
                  hasPostShell: !1,
                  debugHeader: [],
                  info: {
                    name: '',
                    path: '',
                    method: 'GET',
                    paramType: 1,
                    params: [],
                    asserts: { assertsType: 1, assertData: [] },
                    extract: { extractType: 0, extractData: [] },
                    preShellType: 0,
                    preShellData: '',
                    postShellType: 0,
                    postShellData: '',
                  },
                  debugData: {},
                  debugParams: [],
                  debugResult: 0,
                }),
                (a.setDomTreeBoxRef = function(e) {
                  return (a.treeBox = e);
                }),
                a
              );
            }
            return (
              (0, C.default)(t, e),
              (0, E.default)(t, [
                {
                  key: 'componentWillMount',
                  value: function() {
                    var e = this.props.location.search;
                    if (-1 !== e.indexOf('?')) {
                      var t = e.substr(1);
                      t && this.setState({ caseId: t }), this.queryProjectList(t);
                    } else this.queryProjectList();
                  },
                },
                {
                  key: 'getNodeTreeMenu',
                  value: function() {
                    var e = (0, y.default)({}, this.state.rightClickItem),
                      t = e.pageX,
                      a = e.pageY,
                      n = e.noteType,
                      l = {
                        position: 'absolute',
                        boxShadow: '3px 3px 1px #ecf0f1',
                        border: '1px solid #ecf0f1',
                        left: ''.concat(t, 'px'),
                        top: ''.concat(a - 2, 'px'),
                        zIndex: 999,
                      },
                      r =
                        1 === n
                          ? I.default.createElement(
                              p.default,
                              {
                                onClick: this.handleRightMenuClick,
                                style: l,
                                className: w.default.RightMenu,
                              },
                              I.default.createElement(
                                p.default.Item,
                                { key: '1' },
                                I.default.createElement(h.default, { type: 'plus-circle' }),
                                '\u6dfb\u52a0\u7528\u4f8b'
                              ),
                              I.default.createElement(
                                p.default.Item,
                                { key: '2' },
                                I.default.createElement(h.default, { type: 'folder-add' }),
                                '\u6dfb\u52a0\u5b50\u76ee\u5f55'
                              ),
                              I.default.createElement(
                                p.default.Item,
                                { key: '4' },
                                I.default.createElement(h.default, { type: 'minus-square-o' }),
                                '\u5220\u9664\u76ee\u5f55'
                              )
                            )
                          : I.default.createElement(
                              p.default,
                              {
                                onClick: this.handleRightMenuClick,
                                style: l,
                                className: w.default.RightMenu,
                              },
                              I.default.createElement(
                                p.default.Item,
                                { key: '5' },
                                I.default.createElement(h.default, { type: 'copy' }),
                                '\u590d\u5236\u7528\u4f8b'
                              ),
                              I.default.createElement(
                                p.default.Item,
                                { key: '6' },
                                I.default.createElement(h.default, { type: 'minus-square-o' }),
                                '\u5220\u9664\u7528\u4f8b'
                              )
                            );
                    return this.state.rightClickItem && r;
                  },
                },
                {
                  key: 'render',
                  value: function() {
                    var e = this,
                      t = this.state,
                      a = t.projectList,
                      n = t.project,
                      l = t.treeList,
                      p = t.rightClickItem,
                      y = t.expandedKeys,
                      g = t.hasPreShell,
                      v = t.hasPostShell,
                      E = t.selectedKeys,
                      S = t.autoExpandParent,
                      _ = t.selectNoteType,
                      C = t.infoName,
                      T = t.infoPath,
                      N = t.preShellData,
                      P = t.postShellData,
                      A = t.infoMethod,
                      j = t.infoParams,
                      F = t.infoAssertType,
                      O = t.infoExtractType,
                      G = t.infoAssertData,
                      J = t.infoParamsFormatType,
                      V = t.infoExtractData,
                      X = t.debugDomain,
                      Y = t.debugData,
                      W = t.debugParams,
                      Z = t.showAddHeader,
                      $ = t.debugHeader,
                      Q = t.debugResult,
                      ee = t.extractList,
                      te = this.props,
                      ae = te.loading,
                      ne = te.debugLoading,
                      le = function t(a) {
                        return a.map(function(a) {
                          if (1 === a.noteType)
                            return I.default.createElement(
                              M,
                              {
                                icon: I.default.createElement(h.default, {
                                  type: 'folder',
                                  theme: 'filled',
                                  style: { color: '#3498db' },
                                }),
                                key: a.id,
                                dataRef: a,
                                title: a.name,
                                noteType: a.noteType,
                              },
                              a.children && t(a.children)
                            );
                          if (0 === a.noteType) {
                            if ('folder' === a.type)
                              return I.default.createElement(M, {
                                icon: I.default.createElement(h.default, {
                                  type: 'folder',
                                  theme: 'filled',
                                  style: { color: '#3498db' },
                                }),
                                selectable: !1,
                                title: I.default.createElement(x.default, {
                                  size: 'small',
                                  style: { width: 100 },
                                  autoFocus: !0,
                                  onBlur: function(t) {
                                    return e.submitAddFolder(t.target.value);
                                  },
                                  onPressEnter: function(t) {
                                    return e.submitAddFolder(t.target.value);
                                  },
                                }),
                                key: '0-0-1',
                              });
                            if ('case' === a.type)
                              return I.default.createElement(M, {
                                icon: I.default.createElement(h.default, {
                                  type: 'api',
                                  theme: 'filled',
                                }),
                                selectable: !1,
                                title: I.default.createElement(x.default, {
                                  size: 'small',
                                  style: { width: 100 },
                                  autoFocus: !0,
                                  onBlur: function(t) {
                                    return e.submitAddCase(t.target.value);
                                  },
                                  onPressEnter: function(t) {
                                    return e.submitAddCase(t.target.value);
                                  },
                                }),
                                key: '0-0-1',
                              });
                          }
                          return I.default.createElement(M, {
                            icon: I.default.createElement(h.default, {
                              type: 'api',
                              theme: 'filled',
                            }),
                            key: a.id,
                            dataRef: a,
                            title: a.name,
                            noteType: a.noteType,
                          });
                        });
                      },
                      re = I.default.createElement(
                        f.default,
                        { loading: ae, bordered: !1 },
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u76ee\u5f55\u540d\u79f0\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(x.default, {
                              placeholder: '\u6807\u9898\u540d\u79f0',
                              size: 'small',
                              value: C,
                              onChange: function(t) {
                                e.setState({ infoName: t.target.value });
                              },
                              onBlur: function(t) {
                                return e.hanldeNameChange(t);
                              },
                              className: w.default.item_item,
                            })
                          )
                        ),
                        I.default.createElement(m.default, null)
                      ),
                      de = I.default.createElement(
                        f.default,
                        { loading: ae, bordered: !1 },
                        I.default.createElement(
                          m.default,
                          { orientation: 'left' },
                          '\u57fa\u672c\u4fe1\u606f'
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u7528\u4f8b\u540d\u79f0\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(x.default, {
                              placeholder: '\u6807\u9898\u540d\u79f0',
                              size: 'small',
                              value: C,
                              onChange: function(t) {
                                e.setState({ infoName: t.target.value });
                              },
                              onBlur: function(t) {
                                return e.hanldeNameChange(t);
                              },
                              className: w.default.item_item,
                            })
                          )
                        ),
                        I.default.createElement(
                          m.default,
                          { orientation: 'left' },
                          '\u8bf7\u6c42\u8bbe\u7f6e'
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u524d\u7f6eshell\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(o.default, {
                              size: 'small',
                              checked: g,
                              onChange: function() {
                                return e.handleSetPreShellChange();
                              },
                            })
                          )
                        ),
                        g &&
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.item_label_container },
                              I.default.createElement('span', null)
                            ),
                            I.default.createElement(
                              'div',
                              { className: w.default.item_content_container },
                              I.default.createElement(q.default, {
                                mode: 'java',
                                theme: 'dracula',
                                name: 'preShellInput',
                                editorProps: { $blockScrolling: !0 },
                                defaultValue: N,
                                value: N || void 0,
                                height: '300px',
                                onChange: function(t) {
                                  return e.setState({ preShellData: t });
                                },
                                onBlur: function(t) {
                                  return e.handlePreShellChange(t);
                                },
                              })
                            )
                          ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u8bf7\u6c42\u8def\u5f84\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(
                              U,
                              { className: w.default.item_item, compact: !0 },
                              I.default.createElement(
                                b.default,
                                {
                                  placeholder: 'method',
                                  size: 'small',
                                  value: A,
                                  style: { width: '20%' },
                                  onChange: function(t) {
                                    return e.handleMethodChange(t);
                                  },
                                },
                                I.default.createElement(z, { value: 'POST' }, 'POST'),
                                I.default.createElement(z, { value: 'GET' }, 'GET')
                              ),
                              I.default.createElement(x.default, {
                                style: { width: '80%' },
                                placeholder: '\u8bf7\u6c42\u8def\u5f84eg:/path/path',
                                size: 'small',
                                value: T,
                                onChange: function(t) {
                                  e.setState({ infoPath: t.target.value });
                                },
                                onBlur: function(t) {
                                  return e.hanldePathChange(t);
                                },
                              })
                            )
                          )
                        ),
                        'POST' === A &&
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.item_label_container },
                              I.default.createElement(
                                'span',
                                null,
                                '\u53c2\u6570\u7c7b\u578b\uff1a'
                              )
                            ),
                            I.default.createElement(
                              'div',
                              { className: w.default.item_content_container },
                              I.default.createElement(
                                c.default.Group,
                                {
                                  value: J,
                                  onChange: function(t) {
                                    return e.handleParamsFormatTypeChange(t);
                                  },
                                },
                                I.default.createElement(
                                  c.default,
                                  { value: 1 },
                                  'x-www-form-urlencoded'
                                ),
                                I.default.createElement(
                                  c.default,
                                  { value: 2 },
                                  I.default.createElement(
                                    u.default,
                                    {
                                      title:
                                        '\u8bbe\u7f6e\u8be5\u7c7b\u578b\u53c2\u6570\u540e\uff0c\u5c06\u4e0d\u652f\u6301\u4efb\u52a1\u4e2d\u7684\u5168\u5c40\u9ed8\u8ba4\u53c2\u6570\u8bbe\u7f6e',
                                    },
                                    I.default.createElement('a', null, 'json')
                                  )
                                ),
                                I.default.createElement(c.default, { value: 3 }, 'form-data')
                              )
                            )
                          ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u8bf7\u6c42\u53c2\u6570\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            j &&
                              j.map(function(t, a) {
                                return I.default.createElement(
                                  U,
                                  {
                                    size: 'small',
                                    key: t.id,
                                    className: w.default.item_attrs_container,
                                  },
                                  I.default.createElement(
                                    i.default,
                                    { span: 6 },
                                    I.default.createElement(x.default, {
                                      placeholder: '\u5c5e\u6027\u540d',
                                      value: t.key,
                                      onChange: function(t) {
                                        return e.handleParamsKeyChange(t, a);
                                      },
                                      onBlur: function() {
                                        return e.queryUpdateSample('params', e.state.infoParams);
                                      },
                                    })
                                  ),
                                  I.default.createElement(
                                    i.default,
                                    { span: 10 },
                                    t.type &&
                                      I.default.createElement(
                                        b.default,
                                        {
                                          placeholder: '\u9009\u62e9\u81ea\u5b9a\u4e49\u53c2\u6570',
                                          value: t.value,
                                          style: { width: '100%' },
                                          size: 'small',
                                          onChange: function(t) {
                                            return e.handleParamsSelectValueChange(t, a);
                                          },
                                        },
                                        ee &&
                                          ee.map(function(e) {
                                            var t = e.extractKey.replace('${', '').replace('}', '');
                                            return I.default.createElement(
                                              z,
                                              {
                                                key: e.id,
                                                value: '${'.concat(e.extractKey, '}'),
                                                title: e.caseName,
                                                disabled: V.length > 0 && t === V[0].key,
                                              },
                                              I.default.createElement(
                                                'span',
                                                {
                                                  style:
                                                    V.length > 0 && t === V[0].key
                                                      ? {}
                                                      : { color: 'blue' },
                                                },
                                                t
                                              )
                                            );
                                          })
                                      ),
                                    !t.type &&
                                      I.default.createElement(x.default, {
                                        placeholder: '\u5c5e\u6027\u503c',
                                        value: t.value,
                                        onChange: function(t) {
                                          return e.handleParamsValueChange(t, a);
                                        },
                                        onBlur: function() {
                                          return e.queryUpdateSample('params', e.state.infoParams);
                                        },
                                      })
                                  ),
                                  I.default.createElement(
                                    i.default,
                                    { span: 2 },
                                    I.default.createElement(
                                      u.default,
                                      {
                                        title:
                                          '\u5f00\u542f\u540e\uff0c\u53ef\u4e0b\u62c9\u9009\u62e9\u5df2\u5b9a\u4e49\u7684\u53c2\u6570\u3002(shell\u4e2d\u5b9a\u4e49\u7684\u53c2\u6570\u65e0\u9700\u5f00\u542f\uff0c\u76f4\u63a5\u8f93\u5165\uff1a ${xxx} \u83b7\u53d6)',
                                      },
                                      I.default.createElement(o.default, {
                                        size: 'small',
                                        checked: t.type,
                                        onChange: function(t) {
                                          return e.handleParamsTypeChange(t, a);
                                        },
                                      })
                                    )
                                  ),
                                  I.default.createElement(
                                    i.default,
                                    { span: 1 },
                                    I.default.createElement(h.default, {
                                      type: 'minus-circle',
                                      onClick: function() {
                                        return e.handleDeleteParams(a);
                                      },
                                    })
                                  )
                                );
                              }),
                            I.default.createElement(
                              s.default,
                              {
                                type: 'dashed',
                                size: 'small',
                                onClick: function() {
                                  return e.handleAddParams();
                                },
                                className: w.default.item_item,
                              },
                              I.default.createElement(h.default, { type: 'plus' }),
                              ' Add field'
                            )
                          )
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u540e\u7f6eshell\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(o.default, {
                              size: 'small',
                              checked: v,
                              onChange: function() {
                                return e.handleSetPostShellChange();
                              },
                            })
                          )
                        ),
                        v &&
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.item_label_container },
                              I.default.createElement('span', null)
                            ),
                            I.default.createElement(
                              'div',
                              { className: w.default.item_content_container },
                              I.default.createElement(q.default, {
                                mode: 'java',
                                theme: 'dracula',
                                name: 'postShellInput',
                                editorProps: { $blockScrolling: !0 },
                                defaultValue: P,
                                value: P || void 0,
                                height: '300px',
                                onChange: function(t) {
                                  return e.setState({ postShellData: t });
                                },
                                onBlur: function(t) {
                                  return e.handlePostShellChange(t);
                                },
                              })
                            )
                          ),
                        I.default.createElement(
                          m.default,
                          { orientation: 'left' },
                          '\u8fd4\u56de\u6821\u9a8c'
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u6821\u9a8c\u7c7b\u578b\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(
                              c.default.Group,
                              {
                                value: F,
                                onChange: function(t) {
                                  return e.handleAssertTypeChange(t);
                                },
                              },
                              I.default.createElement(
                                c.default,
                                { value: 0 },
                                '\u4e0d\u65ad\u8a00'
                              ),
                              I.default.createElement(
                                c.default,
                                { value: 1 },
                                '\u54cd\u5e94\u65ad\u8a00'
                              ),
                              I.default.createElement(c.default, { value: 2 }, 'JSON\u65ad\u8a00')
                            )
                          )
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u6821\u9a8c\u503c\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            1 === F &&
                              I.default.createElement(
                                'div',
                                null,
                                I.default.createElement(
                                  'div',
                                  { className: w.default.item_item },
                                  G &&
                                    G.map(function(t, a) {
                                      return I.default.createElement(
                                        'div',
                                        {
                                          style: {
                                            marginBottom: 10,
                                            display: 'flex',
                                            flexDirection: 'row',
                                          },
                                          key: t.id,
                                        },
                                        I.default.createElement(B, {
                                          placeholder:
                                            '\u9700\u8981\u6821\u9a8c\u7684\u8fd4\u56de\u503c.eg: "code":0 ',
                                          value: t.value,
                                          autosize: { minRows: 2, maxRows: 6 },
                                          onChange: function(t) {
                                            return e.onAssertDataChange(t, a);
                                          },
                                          onBlur: function() {
                                            return e.handleAssertDataChange();
                                          },
                                        }),
                                        I.default.createElement(
                                          'div',
                                          { className: w.default.section_delete },
                                          I.default.createElement(h.default, {
                                            type: 'minus-circle',
                                            onClick: function() {
                                              return e.handleDeleteSection(a);
                                            },
                                          })
                                        )
                                      );
                                    })
                                ),
                                I.default.createElement(
                                  s.default,
                                  {
                                    type: 'dashed',
                                    onClick: function() {
                                      return e.handeAssertData();
                                    },
                                    className: w.default.item_item,
                                    style: { height: 60 },
                                  },
                                  I.default.createElement(h.default, { type: 'plus' }),
                                  ' \u6dfb\u52a0'
                                )
                              ),
                            2 === F &&
                              I.default.createElement(
                                'div',
                                null,
                                G &&
                                  G.map(function(t, a) {
                                    return I.default.createElement(
                                      U,
                                      {
                                        size: 'small',
                                        className: w.default.item_attrs_container,
                                        key: t.id,
                                      },
                                      I.default.createElement(
                                        i.default,
                                        { span: 10 },
                                        I.default.createElement(x.default, {
                                          placeholder: 'json\u8def\u5f84.eg: content.testdata.xxx ',
                                          value: t.key,
                                          onChange: function(t) {
                                            return e.handleAssertJsonKeyChange(t, a);
                                          },
                                          onBlur: function() {
                                            return e.handleAssertDataChange();
                                          },
                                        })
                                      ),
                                      I.default.createElement(
                                        i.default,
                                        { span: 10 },
                                        I.default.createElement(x.default, {
                                          placeholder: '\u5b57\u6bb5\u503c',
                                          value: t.value,
                                          onChange: function(t) {
                                            return e.handleAssertJsonValueChange(t, a);
                                          },
                                          onBlur: function() {
                                            return e.handleAssertDataChange();
                                          },
                                        })
                                      ),
                                      I.default.createElement(
                                        'div',
                                        { className: w.default.section_delete },
                                        I.default.createElement(h.default, {
                                          type: 'minus-circle',
                                          onClick: function() {
                                            return e.handleDeleteSection(a);
                                          },
                                        })
                                      )
                                    );
                                  }),
                                I.default.createElement(
                                  s.default,
                                  {
                                    type: 'dashed',
                                    onClick: function() {
                                      return e.handeAssertData();
                                    },
                                    className: w.default.item_item,
                                    style: { height: 60 },
                                  },
                                  I.default.createElement(h.default, { type: 'plus' }),
                                  ' \u6dfb\u52a0'
                                )
                              )
                          )
                        ),
                        I.default.createElement(
                          m.default,
                          { orientation: 'left' },
                          '\u53c2\u6570\u5316\u8bbe\u7f6e'
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u63d0\u53d6\u65b9\u5f0f\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            I.default.createElement(
                              c.default.Group,
                              {
                                value: O,
                                onChange: function(t) {
                                  return e.handleExtractTypeChange(t);
                                },
                              },
                              I.default.createElement(
                                c.default,
                                { value: 0 },
                                '\u4e0d\u63d0\u53d6'
                              ),
                              I.default.createElement(c.default, { value: 1 }, 'JSON\u63d0\u53d6')
                            )
                          )
                        ),
                        I.default.createElement(
                          'div',
                          { className: w.default.item_container },
                          I.default.createElement(
                            'div',
                            { className: w.default.item_label_container },
                            I.default.createElement('span', null, '\u5b9a\u4e49\u53c2\u6570\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_content_container },
                            1 === O &&
                              I.default.createElement(
                                'div',
                                null,
                                V &&
                                  V.map(function(t, a) {
                                    return I.default.createElement(
                                      U,
                                      {
                                        size: 'small',
                                        className: w.default.item_attrs_container,
                                        key: t.id,
                                      },
                                      I.default.createElement(
                                        i.default,
                                        { span: 10 },
                                        I.default.createElement(x.default, {
                                          placeholder: '\u53c2\u6570\u540d\u79f0',
                                          style: { color: 'blue' },
                                          value: t.key,
                                          onChange: function(t) {
                                            return e.handleExtractJsonKeyChange(t, a);
                                          },
                                          onBlur: function() {
                                            return e.handleExtractDataChange();
                                          },
                                        })
                                      ),
                                      I.default.createElement(
                                        i.default,
                                        { span: 10 },
                                        I.default.createElement(x.default, {
                                          placeholder: 'json\u8def\u5f84.eg: content.testdata.xxx ',
                                          value: t.value,
                                          onChange: function(t) {
                                            return e.handleExtractJsonValueChange(t, a);
                                          },
                                          onBlur: function() {
                                            return e.handleExtractDataChange();
                                          },
                                        })
                                      ),
                                      I.default.createElement(h.default, {
                                        type: 'minus-circle',
                                        onClick: function() {
                                          return e.handleDeleteExtractSection(a);
                                        },
                                      })
                                    );
                                  }),
                                I.default.createElement(
                                  s.default,
                                  {
                                    type: 'dashed',
                                    onClick: function() {
                                      return e.handeExtractData();
                                    },
                                    className: w.default.item_item,
                                    style: { height: 60 },
                                  },
                                  I.default.createElement(h.default, { type: 'plus' }),
                                  ' Add field'
                                )
                              )
                          )
                        )
                      ),
                      se = I.default.createElement(
                        d.default,
                        { spinning: ne || !1 },
                        I.default.createElement(
                          f.default,
                          { bordered: !1 },
                          I.default.createElement(
                            'div',
                            { className: w.default.debug_label_container },
                            I.default.createElement('span', null, '\u8c03\u8bd5\u57df\u540d\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.debug_content_container },
                              I.default.createElement(x.default, {
                                placeholder: 'eg:https://app.xxxx.com',
                                size: 'small',
                                value: X,
                                onChange: function(t) {
                                  e.setState({ debugDomain: t.target.value });
                                },
                              })
                            ),
                            I.default.createElement(
                              s.default,
                              {
                                type: 'primary',
                                size: 'small',
                                onClick: function() {
                                  return e.handleDebug();
                                },
                              },
                              '\u8c03\u8bd5'
                            )
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.debug_header_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.debug_add_header },
                              I.default.createElement(
                                'a',
                                {
                                  onClick: function() {
                                    return e.handleShowAddDebugHeader();
                                  },
                                },
                                '\u8bf7\u6c42\u5934\u8bbe\u7f6e'
                              )
                            )
                          ),
                          Z &&
                            I.default.createElement(
                              'div',
                              { className: w.default.debug_header_content },
                              $ &&
                                $.map(function(t, a) {
                                  return I.default.createElement(
                                    U,
                                    {
                                      size: 'small',
                                      key: t.id,
                                      className: w.default.item_attrs_container,
                                    },
                                    I.default.createElement(
                                      i.default,
                                      { span: 8 },
                                      I.default.createElement(x.default, {
                                        placeholder: '\u5c5e\u6027\u540d',
                                        value: t.key,
                                        onChange: function(t) {
                                          return e.handleHeaderKeyChange(t, a);
                                        },
                                      })
                                    ),
                                    I.default.createElement(
                                      i.default,
                                      { span: 10 },
                                      I.default.createElement(x.default, {
                                        placeholder: '\u5c5e\u6027\u503c',
                                        value: t.value,
                                        onChange: function(t) {
                                          return e.handleHeaderValueChange(t, a);
                                        },
                                      })
                                    ),
                                    I.default.createElement(
                                      'div',
                                      { className: w.default.action_icon },
                                      I.default.createElement(h.default, {
                                        type: 'minus-circle',
                                        onClick: function() {
                                          return e.handleDeleteHeader(a);
                                        },
                                      })
                                    )
                                  );
                                }),
                              I.default.createElement(
                                s.default,
                                {
                                  type: 'dashed',
                                  size: 'small',
                                  onClick: function() {
                                    return e.handleAddHeader();
                                  },
                                  className: w.default.item_item,
                                },
                                I.default.createElement(h.default, { type: 'plus' }),
                                ' Add field'
                              )
                            ),
                          I.default.createElement(
                            'div',
                            { className: w.default.debug_label_container },
                            I.default.createElement('span', null, '\u54cd\u5e94\u4fe1\u606f\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.debug_response_container },
                              0 !== Q &&
                                I.default.createElement(K.default, { id: 'json-pretty', data: Y })
                            )
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.debug_label_container },
                            I.default.createElement('span', null, '\u6821\u9a8c\u7ed3\u679c\uff1a')
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.debug_assert_container },
                              1 === Q &&
                                I.default.createElement(
                                  'div',
                                  { className: w.default.success },
                                  I.default.createElement(h.default, {
                                    type: 'check-circle',
                                    theme: 'filled',
                                    style: { fontSize: 22 },
                                  }),
                                  I.default.createElement('div', null, '\u6d4b\u8bd5\u901a\u8fc7')
                                ),
                              2 === Q &&
                                I.default.createElement(
                                  'div',
                                  { className: w.default.fail },
                                  I.default.createElement(h.default, {
                                    type: 'close-circle',
                                    theme: 'filled',
                                    style: { fontSize: 22 },
                                  }),
                                  I.default.createElement('div', null, '\u6d4b\u8bd5\u5931\u8d25')
                                )
                            )
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.debug_label_container },
                            I.default.createElement(
                              'span',
                              null,
                              '\u53c2\u6570\u5316\u7ed3\u679c\uff1a'
                            )
                          ),
                          I.default.createElement(
                            'div',
                            { className: w.default.item_container },
                            I.default.createElement(
                              'div',
                              { className: w.default.debug_response_container },
                              0 !== Q &&
                                I.default.createElement(K.default, { id: 'json-pretty', data: W })
                            )
                          )
                        )
                      );
                    return I.default.createElement(
                      H,
                      null,
                      I.default.createElement(
                        k.default,
                        {
                          style: { background: '#fff', borderRadius: '5px' },
                          onClick: function() {
                            return e.clearMenu();
                          },
                        },
                        I.default.createElement(
                          R,
                          { style: { background: '#fff', height: '80vh', zIndex: 2 } },
                          I.default.createElement(
                            L.default,
                            {
                              className: w.default.left_res_container,
                              enable: { right: !0 },
                              defaultSize: { height: '80vh' },
                              size: { height: '80vh' },
                            },
                            I.default.createElement(
                              b.default,
                              {
                                placeholder: '\u8bf7\u9009\u62e9\u9879\u76ee',
                                value: n || void 0,
                                style: { width: '100%' },
                                size: 'small',
                                onChange: this.handleProjectChange,
                              },
                              a &&
                                a.map(function(e) {
                                  return I.default.createElement(
                                    z,
                                    { value: e.id, key: e.id },
                                    e.name
                                  );
                                })
                            ),
                            I.default.createElement(
                              'div',
                              { className: w.default.left_container, ref: this.setDomTreeBoxRef },
                              I.default.createElement(
                                D.default,
                                {
                                  showIcon: !0,
                                  draggable: !0,
                                  autoExpandParent: S,
                                  defaultExpandAll: !0,
                                  selectedKeys: E,
                                  expandedKeys: y,
                                  onSelect: this.onSelect,
                                  onDrop: this.onDrop,
                                  onCheck: this.onCheck,
                                  onExpand: this.onExpandTree,
                                  onRightClick: function(t) {
                                    return e.handleOnRightClick(t);
                                  },
                                },
                                l && le(l)
                              )
                            )
                          )
                        ),
                        I.default.createElement(
                          'div',
                          { style: { display: 'flex', flexDirection: 'row', width: '100%' } },
                          I.default.createElement(
                            H,
                            {
                              style: {
                                background: '#fff',
                                padding: 10,
                                height: '80vh',
                                width: '70%',
                                borderRight: '1px solid #e8e8e8',
                              },
                            },
                            I.default.createElement(
                              'div',
                              { className: w.default.right_container },
                              !(E && E.length > 0) && I.default.createElement(r.default, null),
                              E && 1 === _ && re,
                              E && 2 === _ && de
                            )
                          ),
                          I.default.createElement(
                            H,
                            {
                              style: {
                                background: '#fff',
                                padding: 10,
                                height: '80vh',
                                width: '30%',
                              },
                            },
                            I.default.createElement(
                              'div',
                              { className: w.default.right_container },
                              E && 2 === _ && se
                            )
                          )
                        )
                      ),
                      p && this.getNodeTreeMenu()
                    );
                  },
                },
              ]),
              t
            );
          })(I.Component)),
          (N = P))
        ) || N),
        O = F;
      t.default = O;
    },
    GicG: function(e, t, a) {
      e.exports = {
        left_res_container: 'antd-pro-pages-i-a-t-interface-index-left_res_container',
        left_container: 'antd-pro-pages-i-a-t-interface-index-left_container',
        RightMenu: 'antd-pro-pages-i-a-t-interface-index-RightMenu',
        right_container: 'antd-pro-pages-i-a-t-interface-index-right_container',
        item_container: 'antd-pro-pages-i-a-t-interface-index-item_container',
        item_label_container: 'antd-pro-pages-i-a-t-interface-index-item_label_container',
        debug_label_container: 'antd-pro-pages-i-a-t-interface-index-debug_label_container',
        section_delete: 'antd-pro-pages-i-a-t-interface-index-section_delete',
        action_icon: 'antd-pro-pages-i-a-t-interface-index-action_icon',
        debug_content_container: 'antd-pro-pages-i-a-t-interface-index-debug_content_container',
        debug_response_container: 'antd-pro-pages-i-a-t-interface-index-debug_response_container',
        debug_assert_container: 'antd-pro-pages-i-a-t-interface-index-debug_assert_container',
        success: 'antd-pro-pages-i-a-t-interface-index-success',
        fail: 'antd-pro-pages-i-a-t-interface-index-fail',
        debug_header_container: 'antd-pro-pages-i-a-t-interface-index-debug_header_container',
        debug_header_content: 'antd-pro-pages-i-a-t-interface-index-debug_header_content',
        debug_add_header: 'antd-pro-pages-i-a-t-interface-index-debug_add_header',
        item_content_container: 'antd-pro-pages-i-a-t-interface-index-item_content_container',
        item_item: 'antd-pro-pages-i-a-t-interface-index-item_item',
        item_editor: 'antd-pro-pages-i-a-t-interface-index-item_editor',
        right_empty_container: 'antd-pro-pages-i-a-t-interface-index-right_empty_container',
        empty_image: 'antd-pro-pages-i-a-t-interface-index-empty_image',
      };
    },
    'mj9/': function(e, t, a) {
      'use strict';
      function n() {
        return JSON.parse(localStorage.getItem('iat-tage')) || '';
      }
      function l(e) {
        var t = JSON.stringify(e);
        return localStorage.setItem('iat-tage', t);
      }
      Object.defineProperty(t, '__esModule', { value: !0 }), (t.getTage = n), (t.setTage = l);
    },
  },
]);
