# -*-coding:utf-8-*-
from flask import Blueprint, jsonify, make_response, session, request
from app.tables.IAT import Project, Tree, Sample, Task, TaskCount, TaskPressure
from app.tables.User import users
import os,hashlib,subprocess, json, requests, time,datetime,random
from sqlalchemy import extract
from app import db, app

api = Blueprint('api', __name__)


def addTreeNote(project_id, pid, name, type, user_id, index_id):
  '''
  :param pid: 父节点id
  :param name: 节点名称
  :param type: 节点属性:1.目录 2.用例
  :param user_id: 用户id
  :return: 节点 id
  '''
  data = Tree(project_id, pid, name, type, user_id, index_id)
  db.session.add(data)
  db.session.commit()
  return data.id


@api.route('/addProject', methods=['POST'])
def addProject():
  user_id = session.get('user_id')
  name = request.json.get("name")
  try:
    data = Project(name, 1, user_id)
    db.session.add(data)
    db.session.commit()
    addTreeNote(data.id, 0, name, 1, user_id, 0)
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'新建成功!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'新建失败!'}))


@api.route('/projectList', methods=['GET'])
def projectList():
  user_id = session.get('user_id')
  status = request.values.get("status")
  if not status:
    status = 3
  if status != 3:
    projectList = Project.query.filter(db.and_(Project.status == status)).order_by(
      db.desc(Project.add_time)).all()
  else:
    projectList = Project.query.order_by(
      db.desc(Project.add_time)).all()
  content = []
  if projectList:
    for item in projectList:
      caseCount = Sample.query.filter(db.and_(Sample.project_id == item.id)).count()
      row_data = users.query.filter(db.and_(users.id == user_id)).first()
      username = ""
      if row_data:
        username = row_data.username
      content.append({
        "id": item.id,
        "name": item.name,
        "add_time": item.add_time.strftime('%Y-%m-%d %H:%M:%S'),
        "add_user": username,
        "count": caseCount,
        "status": item.status,
      })
  return make_response(jsonify({'code': 0, 'msg': '', 'content': content}))


@api.route('/setProjectStatus', methods=['POST'])
def setProjectStatus():
  user_id = session.get('user_id')
  id = request.json.get("id")
  status = request.json.get("status")
  data = {'status': status}
  row_data = Project.query.filter(db.and_(Project.id == id))
  if row_data.first():
    row_data.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': []}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': 'no such Project', 'content': []}))

@api.route('/updateTreeIndex', methods=['POST'])
def updateTreeIndex():
  user_id = session.get('user_id')
  dropKey = request.json.get("dropKey")
  dragKey = request.json.get("dragKey")
  dropData = Tree.query.filter_by(id=dropKey).first()
  if dropData.type == 1:
    pid = dropKey
  if dropData.type == 2:
    pid = dropData.pid
  data = {'pid': pid}
  row_data = Tree.query.filter(db.and_(Tree.id == dragKey))
  if row_data.first():
    row_data.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': []}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': 'no such Project', 'content': []}))


@api.route('/treeList')
def treeList():
  user_id = session.get('user_id')
  id = request.values.get("id")
  listData = Tree.query.filter(db.and_(Tree.project_id == id)).order_by(db.asc(Tree.index_id)).all()

  def getChild(pid):
    result = []
    for obj in listData:
      if obj.pid == pid:
        result.append({
          "id": obj.id,
          "name": obj.name,
          "index_id": obj.index_id,
          "noteType": obj.type,
          "children": getChild(obj.id),
        })
    return result

  content = getChild(0)

  return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': content}))


@api.route('/projectCaseList', methods=['POST'])
def projectCaseList():
  user_id = session.get('user_id')
  id = request.json.get("id")
  listData = Tree.query.filter(db.and_(Tree.project_id == id, Tree.type == 2)).order_by(db.asc(Tree.index_id)).all()
  content = []
  for case in listData:
    sampleData = Sample.query.filter_by(pid=case.id).first()
    if sampleData:
      content.append({
        "key": case.id,
        "name": case.name,
      })
  return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': content}))


@api.route('/addSubFolder', methods=['POST'])
def addSubFolder():
  user_id = session.get('user_id')
  id = request.json.get("id")
  name = request.json.get("name")
  try:
    project_id = Tree.query.filter_by(id=id).first().project_id
    index_id = Tree.query.filter(db.and_(Tree.project_id == project_id, )).order_by(
      db.desc(Tree.index_id)).first().index_id
    data = Tree(project_id, id, name, 1, user_id, index_id + 1)
    db.session.add(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'新建成功!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'新建失败!'}))


@api.route('/deleteFolder', methods=['POST'])
def deleteFolder():
  user_id = session.get('user_id')
  id = request.json.get("id")
  try:
    rowData = Tree.query.filter(db.and_(Tree.id == id)).first()
    if rowData.pid == 0:
      return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'根目录不可删除，如不使用请关闭项目!'}))
    rowSub = Tree.query.filter(db.and_(Tree.pid == id)).all()
    if rowData and len(rowSub) == 0:
      db.session.delete(rowData)
      db.session.commit()
      return make_response(jsonify({'code': 0, 'content': None, 'msg': u'删除成功!'}))
    else:
      return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'非空目录不可删除!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'删除失败!'}))


@api.route('/deleteCase', methods=['POST'])
def deleteCase():
  user_id = session.get('user_id')
  id = request.json.get("id")
  try:
    rowData = Tree.query.filter(db.and_(Tree.id == id)).first()
    sampleData = Sample.query.filter_by(pid=id).first()
    if rowData:
      db.session.delete(rowData)
      if sampleData:
        db.session.delete(sampleData)
      db.session.commit()
      return make_response(jsonify({'code': 0, 'content': None, 'msg': u'删除成功!'}))
    else:
      return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'删除失败!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'删除失败!'}))


@api.route('/copyCase', methods=['POST'])
def copyCase():
  user_id = session.get('user_id')
  id = request.json.get("id")
  try:
    rowData = Tree.query.filter(db.and_(Tree.id == id)).first()
    sampleData = Sample.query.filter_by(pid=id).first()
    data = Tree(rowData.project_id, rowData.pid, rowData.name, rowData.type, rowData.user_id, rowData.index_id)
    db.session.add(data)
    db.session.commit()
    if sampleData:
      addData = Sample(data.id, sampleData.path, sampleData.method,sampleData.param_type, sampleData.params, sampleData.asserts_type,
                       sampleData.asserts_data, sampleData.extract_type, sampleData.extract_key_name,
                       sampleData.extract_data, user_id, sampleData.project_id,sampleData.pre_shell_type,sampleData.pre_shell_data,sampleData.post_shell_type,sampleData.post_shell_data)
      db.session.add(addData)
      db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'复制成功!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'复制成功!'}))


@api.route('/addCase', methods=['POST'])
def addCase():
  user_id = session.get('user_id')
  id = request.json.get("id")
  name = request.json.get("name")
  try:
    project_id = Tree.query.filter_by(id=id).first().project_id
    index_id = Tree.query.filter(db.and_(Tree.project_id == project_id, )).order_by(
      db.desc(Tree.index_id)).first().index_id
    data = Tree(project_id, id, name, 2, user_id, index_id + 1)
    db.session.add(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': {"id":data.id}, 'msg': u'新建成功!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'新建失败!'}))


@api.route('/addTask', methods=['POST'])
def addTask():
  user_id = session.get('user_id')
  info = request.json.get("info")
  try:
    task_desc = info["taskDesc"]
  except:
    task_desc = ""
  try:
    proxy = info["proxy"]
  except:
    proxy = ""
  try:
    headers = json.dumps(info["headers"])
  except:
    headers = json.dumps([])
  try:
    params = json.dumps(info["params"])
  except:
    params = json.dumps([])
  try:
    case = json.dumps(info["case"])
  except:
    case = json.dumps([])
  try:
    addData = Task(info["name"], task_desc, info["project"], info["taskType"], info["runTime"],
                   info["domain"], headers, params,proxy, case, user_id, 0)
    db.session.add(addData)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'添加成功!'}))
  except:
    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'新建失败!'}))


@api.route('/updateTaskInfo', methods=['POST'])
def updateTaskInfo():
  user_id = session.get('user_id')
  info = request.json.get("info")
  id = request.json.get("id")
  taskData = Task.query.filter_by(id=id)
  if not taskData.first():
    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'没有该任务!'}))
  if taskData.first().status != 0 and taskData.first().task_type == 1:
    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'任务已执行，不可修改!'}))
  if taskData.first().task_type == 2:
    if taskData.first().status not in [0, 4]:
      return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'定时任务正在执行，不可修改!'}))
  try:
    task_desc = info["taskDesc"]
  except:
    task_desc = ""
  try:
    headers = json.dumps(info["headers"])
  except:
    headers = json.dumps([])
  try:
    params = json.dumps(info["params"])
  except:
    params = json.dumps([])
  try:
    case = json.dumps(info["case"])
  except:
    case = json.dumps([])
  try:
    data = {
      "name": info["name"],
      "task_type": info["taskType"],
      "run_time": info["runTime"],
      "task_desc": task_desc,
      "domain": info["domain"],
      "headers": headers,
      "params": params,
      "proxy": info["proxy"],
      "case": case,
      "user_id": user_id,
    }
    taskData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'更新成功!'}))
  except:
    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'更新失败!'}))


@api.route('/updateRunTime', methods=['POST'])
def updateRunTime():
  user_id = session.get('user_id')
  runTime = request.json.get("runTime")
  id = request.json.get("id")
  taskData = Task.query.filter_by(id=id)
  if not taskData.first():
    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'没有该任务!'}))
  if taskData.first().status != 0 and taskData.first().task_type == 1:
    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'任务已执行，不可修改!'}))
  if taskData.first().task_type == 2:
    if taskData.first().status not in [0, 4]:
      return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'定时任务正在执行，不可修改!'}))
  try:
    data = {
      "run_time": runTime,
    }
    taskData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'更新成功!'}))
  except:
    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u'更新失败!'}))


@api.route('/taskList', methods=['POST'])
def taskList():
  user_id = session.get('user_id')
  taskType = request.json.get("taskType")
  listData = Task.query.filter(db.and_(Task.task_type == taskType, )).order_by(db.desc(Task.add_time)).all()
  content = []
  for task in listData:
    row_data = users.query.filter(db.and_(users.id == task.user_id)).first()
    username = ""
    if row_data:
      username = row_data.username
    update_time = ""
    if task.update_time:
      update_time = task.update_time.strftime('%Y-%m-%d %H:%M:%S')
    content.append({
      "id": task.id,
      "name": task.name,
      "runTime": task.run_time,
      "taskDesc": task.task_desc,
      "add_time": task.add_time.strftime('%Y-%m-%d %H:%M:%S'),
      "add_user": username,
      "update_time": update_time,
      "status": task.status,
    })

  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/taskInfo')
def taskInfo():
  id = request.values.get("id")
  taskData = Task.query.filter(db.and_(Task.id == id, )).first()
  sampleIds = json.loads(taskData.case)
  samples = []
  caseIds = []
  for id in sampleIds:
    sampleData = Sample.query.filter_by(pid=id).first()
    sampleName = Tree.query.filter_by(id=id).first().name
    if sampleData:
      caseIds.append(sampleData.pid)
      samples.append({
        "id": sampleData.id,
        "name": sampleName,
        "path": sampleData.path,
        "method": sampleData.method,
        "paramType": sampleData.param_type,
        "params": json.loads(sampleData.params),
        "asserts": {
          "assertType": sampleData.asserts_type,
          "assertData": json.loads(sampleData.asserts_data),
        },
        "extract": {
          "extractType": sampleData.extract_type,
          "extractData": json.loads(sampleData.extract_data),
        },
        "preShellType":sampleData.pre_shell_type,
        "preShellData":sampleData.pre_shell_data,
        "postShellType":sampleData.post_shell_type,
        "postShellData":sampleData.post_shell_data,
      })
  content = {
    "testname": taskData.name,
    "domain": taskData.domain,
    "headers": json.loads(taskData.headers),
    "params": json.loads(taskData.params),
    "proxy": taskData.proxy,
    "taskDesc": taskData.task_desc,
    "taskType": taskData.task_type,
    "runTime": taskData.run_time,
    "project": taskData.project_id,
    "samples": samples,
    "caseIds": caseIds,
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/taskPressureInfo')
def taskPressureInfo():
  id = request.values.get("id")
  # 获取 Pressure
  taskPressureData = TaskPressure.query.filter(db.and_(TaskPressure.id == id, )).first()

  taskData = Task.query.filter(db.and_(Task.id == taskPressureData.task_id, )).first()
  sampleIds = json.loads(taskData.case)
  samples = []
  caseIds = []
  for id in sampleIds:
    sampleData = Sample.query.filter_by(pid=id).first()
    sampleName = Tree.query.filter_by(id=id).first().name
    if sampleData:
      caseIds.append(sampleData.pid)
      samples.append({
        "id": sampleData.id,
        "name": sampleName,
        "path": sampleData.path,
        "method": sampleData.method,
        "paramType": sampleData.param_type,
        "params": json.loads(sampleData.params),
        "asserts": {
          "assertType": sampleData.asserts_type,
          "assertData": json.loads(sampleData.asserts_data),
        },
        "extract": {
          "extractType": sampleData.extract_type,
          "extractData": json.loads(sampleData.extract_data),
        },
        "preShellType":sampleData.pre_shell_type,
        "preShellData":sampleData.pre_shell_data,
        "postShellType":sampleData.post_shell_type,
        "postShellData":sampleData.post_shell_data,
      })

  taskPressureDataJson = {
    "id":taskPressureData.id,
    "rps":taskPressureData.rps,
    "task_id":taskPressureData.task_id,
    "time":taskPressureData.time,
    "up":taskPressureData.up,
    "ins_count":taskPressureData.ins_count,
    "user_id":taskPressureData.user_id,
    "status":taskPressureData.status,
    "gmt_create":taskPressureData.gmt_create,
  }
  
  content = {
    "testname": taskData.name,
    "domain": taskData.domain,
    "headers": json.loads(taskData.headers),
    "params": json.loads(taskData.params),
    "proxy": taskData.proxy,
    "taskDesc": taskData.task_desc,
    "taskType": taskData.task_type,
    "runTime": taskData.run_time,
    "project": taskData.project_id,
    "samples": samples,
    "caseIds": caseIds,
    "pressureData":taskPressureDataJson,
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/getTaskStatus')
def getTaskStatus():
  id = request.values.get("id")
  taskData = Task.query.filter(db.and_(Task.id == id, )).first()
  if taskData:
    content = {
      "status": taskData.status,
      "runTime": taskData.run_time,
    }
    return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))
  else:
    return make_response(jsonify({'code': 10002, 'content': None, 'msg': u''}))


@api.route('/taskResult')
def taskResult():
  id = request.values.get("id")
  taskData = Task.query.filter(db.and_(Task.id == id, )).first()
  try:
    caseIds = json.loads(taskData.case)
  except:
    caseIds = []
  try:
    results = json.loads(taskData.result)
  except:
    results = []
  try:
    daily_result = json.loads(taskData.daily_result)
  except:
    daily_result = []
  sucess = []
  fail = []
  for index in range(len(results)):
    results[index]["id"] = caseIds[index]
    if "success" not in results[index].keys():
      continue
    if results[index]["success"] == "True":
      sucess.append(caseIds[index])
      results[index]["failureMessage"] = "success"
    if results[index]["success"] == "False":
      fail.append(caseIds[index])
  if len(results) > 0 and "timeStamp" in results[0].keys():
    startTime = results[0]["timeStamp"]
  else:
    startTime = 0
  if len(results) > 1 and "timeStamp" in results[len(results) - 1].keys():
    endTime = results[len(results) - 1]["timeStamp"]
  else:
    endTime = startTime
  content = {
    "testname": taskData.name,
    "testDesc": taskData.task_desc,
    "startTime": int(startTime),
    "endTime": int(endTime),
    "total": len(caseIds),
    "sucess": len(sucess),
    "fail": len(fail),
    "result": results,
    "daily_result": daily_result,
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/taskPrew')
def taskPrew():
  id = request.values.get("id")
  taskData = Task.query.filter(db.and_(Task.id == id, )).first()
  caseIds = []
  for caseId in json.loads(taskData.case):
    caseIds.append(caseId)
  content = {
    "id": taskData.id,
    "testname": taskData.name,
    "domain": taskData.domain,
    "headers": json.loads(taskData.headers),
    "params": json.loads(taskData.params),
    "proxy": taskData.proxy,
    "taskDesc": taskData.task_desc,
    "taskType": taskData.task_type,
    "runTime": taskData.run_time,
    "project": taskData.project_id,
    "caseIds": caseIds,
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/taskExcute', methods=['POST'])
def taskExcute():
  user_id = session.get('user_id')
  id = request.json.get("id")
  data = {'status': 1}
  taskData = Task.query.filter_by(id=id)
  if taskData.first():
    taskData.update(data)
    db.session.commit()
    taskType = taskData.first().task_type
    if taskType == 2:
      subprocess.Popen('python3 runTiming.py %s' % id, shell=True)
    else:
      subprocess.Popen('python3 runTest.py %s' % id, shell=True)
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'开始执行!'}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': u'执行失败!', 'content': None}))


@api.route('/taskDelete', methods=['POST'])
def taskDelete():
  user_id = session.get('user_id')
  id = request.json.get("id")
  try:
    taskData = Task.query.filter(db.and_(Task.id == id, )).first()
    db.session.delete(taskData)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'删除成功!'}))
  except Exception as e:
    print(e)

    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'删除失败!'}))

# 新增压力任务
@api.route('/addPressureTask', methods=['POST'])
def taskPressureExcute():
  user_id = session.get('user_id')
  # 任务ID
  taskId = request.json.get("taskId") 
  # 压测配置
  info = request.json.get("info") 

  taskPressureData = TaskPressure.query.filter_by(task_id=taskId)
  if taskPressureData.first():
    status = taskPressureData.first().status
    if status != 3 and status != 39:
      return make_response(jsonify({'code': 10001, 'msg': u'已经有一个压测任务在执行了!', 'content': None}))
  # 保存压测配置(持久化)
  addPressureData = TaskPressure(taskId, info["rps"], info["time"], info["up"], user_id, 0,info["ins_count"])
  db.session.add(addPressureData)
  db.session.commit()

  # 执行压测
  subprocess.Popen('python3 runPressureTest.py %s' % addPressureData.id, shell=True)

  return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': []}))

# 更新压力任务状态
@api.route('/updatePressureTaskStatus', methods=['POST'])
def updatePressureTaskStatus():
  id = request.json.get("id")
  status = request.json.get("status")
  data = {'status': status}
  taskData = TaskPressure.query.filter_by(id=id)
  if taskData.first():
    taskData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': []}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': 'fail', 'content': []}))
  # taskType = taskData.first().task_type
  # if taskType == 2:
  #   # subprocess.Popen('python3 runTiming.py %s' % id, shell=True)
  # else:
  subprocess.Popen('python3 runPressureTest.py %s' % addPressureData.id, shell=True)
  return make_response(jsonify({'code': 0, 'content': None, 'msg': u'开始执行!'}))
    


@api.route('/getTreeInfo', methods=['POST'])
def getTreeInfo():
  user_id = session.get('user_id')
  id = request.json.get("id")
  folderData = Tree.query.filter_by(id=id).first()
  content = {
    "id": folderData.id,
    "name": folderData.name,
    "add_time": folderData.add_time,
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/getSampleInfo', methods=['POST'])
def getSampleInfo():
  user_id = session.get('user_id')
  id = request.json.get("id")
  sampleData = Sample.query.filter_by(pid=id).first()
  if not sampleData:
    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'需补充信息'}))
  treeData = Tree.query.filter_by(id=id).first()
  content = {
    "name": treeData.name,
    "path": sampleData.path,
    "projectId": sampleData.project_id,
    "method": sampleData.method,
    "paramType": sampleData.param_type,
    "params": json.loads(sampleData.params),
    "asserts": {
      "assertsType": sampleData.asserts_type,
      "assertData": json.loads(sampleData.asserts_data),
    },
    "extract": {
      "extractType": sampleData.extract_type,
      "extractData": json.loads(sampleData.extract_data),
    },
    "preShellType": sampleData.pre_shell_type,
    "preShellData": sampleData.pre_shell_data,
    "postShellType": sampleData.post_shell_type,
    "postShellData": sampleData.post_shell_data,
    "user_id": sampleData.user_id,
    "add_time": sampleData.add_time.strftime('%Y-%m-%d %H:%M:%S'),
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/getExtractList', methods=['POST'])
def getExtractList():
  user_id = session.get('user_id')
  id = request.json.get("id")
  extractList = Sample.query.filter(db.and_(Sample.project_id == id, Sample.extract_type != 0)).all()
  if not extractList:
    return make_response(jsonify({'code': 0, 'content': [], 'msg': u'暂无参数化信息'}))
  content = []
  for item in extractList:
    if item.extract_key_name:
      caseData = Tree.query.filter_by(id=item.pid).first()
      if caseData:
        caseName = caseData.name
        content.append({
          "id": item.id,
          "caseName": caseName,
          "extractKey": item.extract_key_name,
        })
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))


@api.route('/updateFolderName', methods=['POST'])
def updateFolderName():
  user_id = session.get('user_id')
  id = request.json.get("id")
  name = request.json.get("name")
  data = {'name': name}
  folderData = Tree.query.filter_by(id=id)
  if folderData.first():
    folderData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': []}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': 'fail', 'content': []}))


@api.route('/updateTaskStatus', methods=['POST'])
def updateTaskStatus():
  id = request.json.get("id")
  status = request.json.get("status")
  data = {'status': status}
  taskData = Task.query.filter_by(id=id)
  if taskData.first():
    taskData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': 'sucess', 'content': []}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': 'fail', 'content': []}))

def formatUnixDay(day):
  thisYear = datetime.datetime.now().year
  thisMonth = datetime.datetime.now().month
  timestr = '%s-%s-%s 01:00:00'%(thisYear,thisMonth,day)
  timeArray = time.strptime(timestr, "%Y-%m-%d %H:%M:%S")
  timeStamp = int(time.mktime(timeArray))
  return timeStamp

def formatMounthResult(dayDatas):
  thisYear = datetime.datetime.now().year
  thisMonth = datetime.datetime.now().month
  thisDays = (datetime.datetime(thisYear, thisMonth + 1, 1) - datetime.datetime(thisYear, thisMonth, 1)).days
  monthResult = []
  for day in range(1,thisDays+1):
    oneDayData = {
      "day":day,
      "total":0,
      "dayTime":formatUnixDay(day),
      "sucess":0,
      "fail":0,
    }
    for data in dayDatas:
      if data["day"] == day:
        oneDayData['total'] += data['total']
        oneDayData['sucess'] += data['sucess']
        oneDayData['fail'] += data['fail']
    monthResult.append(oneDayData)
  return monthResult

@api.route('/getHomeData')
def getHomeData():
  user_id = session.get('user_id')
  caseCount = Sample.query.filter().count()
  projectCount = Project.query.filter(db.and_(Project.status == 1)).count()
  immTaskCount = Task.query.filter(db.and_(Task.task_type == 1)).count()
  timTaskCount = Task.query.filter(db.and_(Task.task_type == 2)).count()
  nearTasks = Task.query.filter().order_by(db.desc(Task.add_time)).limit(20).all()
  historys = TaskCount.query.filter(
    db.and_(
      extract('year', TaskCount.add_time) == datetime.datetime.now().year,
      extract('month', TaskCount.add_time) == datetime.datetime.now().month
    )).all()
  dayDatas = []
  for item in historys:
    dayDatas.append({
      "day":item.add_time.day,
      "total":item.task_total,
      "sucess":item.sucess,
      "fail":item.fail,
    })
  mounthTask = formatMounthResult(dayDatas)
  nearTask = []
  for index,task in enumerate(nearTasks):
    nearTask.append({
      "index":index+1,
      "id": task.id,
      "taskType": task.task_type,
      "name": task.name,
      "addTime":task.add_time.strftime('%Y%m%d %H:%M'),
      "status":task.status,
    })
  content = {
    "caseCount": caseCount,
    "projectCount": projectCount,
    "immTaskCount": immTaskCount,
    "timTaskCount": timTaskCount,
    "mounthTask":mounthTask,
    "nearTask":nearTask,
  }
  return make_response(jsonify({'code': 0, 'content': content, 'msg': u''}))

def setTaskCount(result):
  failCount = 0
  sucessCount = 0
  jsonResult = json.loads(result)
  total = len(jsonResult)
  for item in jsonResult:
    if "success" not in item.keys():
      continue
    if item["success"] == "False":
      failCount += 1
    else:
      sucessCount += 1
  addData = TaskCount(total, sucessCount, failCount)
  db.session.add(addData)
  db.session.commit()

@api.route('/updateTaskResult', methods=['POST'])
def updateTaskResult():
  id = request.json.get("id")
  result = request.json.get("result")
  setTaskCount(result)
  taskData = Task.query.filter_by(id=id)
  if taskData.first().task_type == 1:
    data = {'result': result}
  else:
    try:
      oldDailyResult = json.loads(taskData.first().daily_result)
      if not oldDailyResult:
        oldDailyResult = []
    except:
      oldDailyResult = []
    failCount = 0
    Elapsed = 0
    jsonResult = json.loads(result)
    print(jsonResult)
    for item in jsonResult:
      Elapsed += int(item["elapsed"])
     
      if "success" not in item.keys():
        continue
    
      if item["success"] == "False":
        failCount += 1

    avrageElapsed = Elapsed / len(jsonResult)
    oldDailyResult.append({
      "day": time.strftime("%Y%m%d", time.localtime(float(int(jsonResult[0]["timeStamp"]) / 1000))),
      "taskCount": len(jsonResult),
      "runTime": int(jsonResult[0]["timeStamp"]),
      "failCount": failCount,
      "avrageElapsed": avrageElapsed,
    })
    dailyResult = json.dumps(oldDailyResult)
    data = {'result': result, 'daily_result': dailyResult}
  if taskData.first():
    taskData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': 'update sucess', 'content': []}))
  else:
    return make_response(jsonify({'code': 10001, 'msg': 'update fail', 'content': []}))

@api.route('/updateSample', methods=['POST'])
def updateSample():
  user_id = session.get('user_id')
  id = request.json.get("id")
  info = request.json.get("info")
  if info["extract"]["extractType"] == 1 and len(info["extract"]["extractData"]) == 1:
    extract_key_name = info["extract"]["extractData"][0]["key"]
  else:
    extract_key_name = None
  data = {
    "pid": id,
    "path": info["path"],
    "method": info["method"],
    "params": json.dumps(info["params"]),
    "asserts_type": info["asserts"]["assertsType"],
    "param_type": info["paramType"],
    "asserts_data": json.dumps(info["asserts"]["assertData"]),
    "extract_type": info["extract"]["extractType"],
    "extract_key_name": extract_key_name,
    "extract_data": json.dumps(info["extract"]["extractData"]),
    "pre_shell_type": info["preShellType"],
    "pre_shell_data": info["preShellData"],
    "post_shell_type": info["postShellType"],
    "post_shell_data": info["postShellData"],
    "user_id": user_id,
  }

  sampleData = Sample.query.filter_by(pid=id)

  if sampleData.first():
    sampleData.update(data)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'msg': u'sucess', 'content': []}))
  else:
    project_id = Tree.query.filter_by(id=id).first().project_id
    addData = Sample(id, info["path"], info["method"],info["paramType"], json.dumps(info["params"]),info["asserts"]["assertsType"] ,
                     json.dumps(info["asserts"]["assertData"]), info["extract"]["extractType"], '',
                     json.dumps(info["extract"]["extractData"]), user_id, project_id,info["preShellType"],info["preShellData"],info["postShellType"],info["postShellData"])
    db.session.add(addData)
    db.session.commit()
    return make_response(jsonify({'code': 0, 'content': None, 'msg': u'添加成功!'}))

## 判断返回结果是否为json
def isJson(jsonstr):
    try:
        yield json.loads(jsonstr)
    except:
        return False
    return True
    

@api.route('/debugSample', methods=['POST'])
def debugSample():
  user_id = session.get('user_id')
  id = request.json.get("id")
  domain = request.json.get("domain")
  headers = request.json.get("headers")
  rowData = Sample.query.filter_by(pid=id).first()

  debugParams1=request.cookies.get('debugParams')
  if debugParams1:
    # 处理缓存参数
    debugParams1Json=json.loads(debugParams1)


  if not domain:
    return make_response(jsonify({'code': 10001, 'content': None, 'msg': u'调试域名必填!'}))
  if rowData:
    req_params = {}
    ## 处理rowData.path
    basePath = rowData.path
    ## 获取前置shell 注入数据 [字符串]
    if rowData.pre_shell_data:
      preShellData = rowData.pre_shell_data
      if preShellData:
        preShellDataArr = preShellData.split("\n")
        for i in range(len(preShellDataArr)):
          line = preShellDataArr[i].strip().replace('\n', '')  
          if line.find('=') > 0:  
                  lineArr = line.split('=')  
                  lineArr[1]= line[len(lineArr[0])+1:] 
          basePath = basePath.replace("${"+lineArr[0]+"}",lineArr[1])
   
    url = domain + basePath
    if rowData.params:
      paramsStr = json.loads(rowData.params)
      if paramsStr:
        formParams = {}
        for item in paramsStr:
          paramsValueStr= item["value"]
          ## 处理参数化值
          if item['type']:
             tmpVar = "${"+item['key']+"}"
             if paramsValueStr.find(tmpVar) >= 0:
               if 'debugParams1Json' in locals():
                paramsValueStr=paramsValueStr.replace(tmpVar,debugParams1Json[0][item['key']])
          else:
           
            if 'debugParams1Json' in locals():
              # if item["key"] in debugParams1Json :
                # paramsValueStr=debugParams1Json[item["key"]]
                if len(debugParams1Json) > 0:
                  for debugParams1JsonKey in debugParams1Json[0].keys():
                    tmpVar = "${"+debugParams1JsonKey+"}"
                    tmpVarVal = debugParams1Json[0][debugParams1JsonKey]
                    if paramsValueStr.find(tmpVar) >= 0:
                      paramsValueStr=paramsValueStr.replace(tmpVar,tmpVarVal)
                    # if paramsValueStr.find(tmpVar) >= 0:
                    #   paramsValueStr=paramsValueStr.replace(tmpVar,tmpVarVal)
          req_params[item["key"]] = paramsValueStr
          formParams[item["key"]] = (None,paramsValueStr)
    try:
      if rowData.method == 'POST':
        if rowData.param_type == 3:
          formartHeaders = headers
          formatParams = formParams
          res = requests.post(url, headers=formartHeaders, files=formatParams, verify=False,timeout=5)
        elif rowData.param_type == 2:
          headers["content-type"] = "application/json;"
          formartHeaders = headers
          formatParams = json.dumps(req_params)
          res = requests.post(url, headers=formartHeaders, data=formatParams, verify=False,timeout=5)
        else:
          formartHeaders = headers
          formatParams = req_params
          res = requests.post(url, headers=formartHeaders, data=formatParams, verify=False,timeout=5)
      elif rowData.method == 'GET':
        res = requests.get(url, headers=headers, params=req_params, verify=False)
      else:
        return make_response(jsonify({'code': 10001, 'content': None, 'msg': '不支持你的请求类型!'}))
      # 验证错误代码
      if res.status_code != 200:
        print(res.text)
        return make_response(jsonify({'code': 10001, 'content': None, 'msg': '到API的连接有问题'}))
     
      ## 处理请求结果json的问题
      print (res.text)
      # print(isJson(res.text))
      isJsonB = isJson(res.text)

      if isJsonB == True :
        response = res.json()

        # 验证错误代码
        # if response.:
        #   print(res.text)
        #   return make_response(jsonify({'code': 10001, 'content': None, 'msg': '到API的连接有问题'}))
      
        debugResult = 3
        asserts_data = json.loads(rowData.asserts_data)
        if len(asserts_data) > 0:
          if rowData.asserts_type == 1:
            for item in asserts_data:
              debugResult = 2
              delSpace = item["value"]
              if delSpace and delSpace in res.text:
                debugResult = 1
          if rowData.asserts_type == 2:
            ## JSON 断言
            for item in asserts_data:
              debugResult = 2
              assertPathList = item["key"] ## 校验key
              ## 排除$.
              if(assertPathList.startswith('$.')):
                assertPathList = assertPathList[2:] ## 截取前两位
              assertPathList = assertPathList.split('.')
              pathLen = len(assertPathList)
              need_data = res.json()
              for i in range(0, pathLen):
                key = assertPathList[i]
                if key == '0':
                  key = 0
                need_data = need_data[key]

              if str(need_data) == item["value"]:
                debugResult = 1
        
        # 断言通过
        # 定义参数化值获取
        debugParams=[]
        if debugResult == 1:
          extract_data = json.loads(rowData.extract_data)
          if len(asserts_data) > 0:
            for item in extract_data:

              extractPathList = item["value"] ## 校验value
              ## 排除$.
              if(extractPathList.startswith('$.')):
                extractPathList = extractPathList[2:] ## 截取前两位
              extractPathList = extractPathList.split('.')
              pathLen = len(extractPathList)
              need_data = res.json()
              for i in range(0, pathLen):
                  key = extractPathList[i]
                  if key == 'data[*]':
                    key = "data[0]"
                    tmpLen = len(need_data["data"])
                    if tmpLen > 0 :
                      tmpIndexRan = random.randint(0,tmpLen-1)
                      need_data = need_data["data"][tmpIndexRan]
                    continue
                  elif key == '0':
                    key = 0
                  if key not in need_data:
                    need_data = {}
                    break
                  need_data = need_data[key]
              # need_data=need_data[key]
              debugParams.append({item["key"]:need_data})

        content = {
          "debugData": response,
          "debugResult": debugResult,
          "debugParams":debugParams,
        }
        # 缓存结果
        response = make_response(jsonify({'code': 0, 'content': content, 'msg': ''}))

        if len(debugParams) > 0:
          ## 多次test集合
          if 'debugParams1Json' in locals():
            # debugParams1Json[0][debugParams[0]]
            # for dk in debugParams[0].keys():
            #   debugParams1Json[0][dK]=debugParams[0][dk]
            for debugParamsItem in debugParams:
              debugParams1Json[0].update(debugParamsItem)
            response.set_cookie('debugParams',json.dumps(debugParams1Json))
        return response
      ## HTML
      elif isJsonB == False:
        # print (res.text)
        content = {
          "debugData": "HTML",
          "debugResult": 1,
          "debugParams":[],
        }
        return make_response(jsonify({'code': 0, 'content': content, 'msg': 'HTML is OK'}))
    except Exception as e:
      print(e)
      return make_response(jsonify({'code': 10002, 'content': None, 'msg': '服务器异常'}))

def encrypt_name(name, salt=None, encryptlop=30):
  if not salt:
    # salt = os.urandom(16).encode('hex')  # length 32
    salt = os.urandom(16).hex()  # length 32
  for i in range(encryptlop):
    name = hashlib.sha1((name + salt).encode('utf8')).hexdigest()  # length 64
  return name

@api.route('/uploadFile',methods=['POST'])
def uploadFile():
  user_id = session.get('user_id')
  upload_file = request.files["file"]
  id = request.form["id"]
  if upload_file:
    fileHash = encrypt_name(upload_file.filename)
    fileType = upload_file.filename.split('.')[-1]
    fileName = fileHash + '.' + fileType

    fileRealPath = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], fileName)
    upload_file.save(fileRealPath)

    # filePath = app.root_path+'/'+app.config['UPLOAD_FOLDER']+fileName
    projectRootId = Tree.query.filter_by(project_id=id,pid=0).first().id
    if fileType == 'har':
      print("开始导入har")
      subprocess.Popen('python3 runAutoBuild.py %s %s %s'%(user_id,projectRootId,fileRealPath),shell=True)
      # os.remove(fileRealPath)
    if fileType == 'jmx':
      print('开始导入jmx')
      subprocess.Popen('python3 runAutoBuildFromJmx.py %s %s %s' % (user_id,projectRootId, fileRealPath), shell=True)
      # os.remove(fileRealPath)
    return make_response(jsonify({'code': 0, 'content':None, 'msg': 'upload sucess'}))
  else:
    return make_response(jsonify({'code': 10002, 'content':None, 'msg': 'upload fail!'}))
