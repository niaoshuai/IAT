#-*-coding:utf-8-*-
from xml.etree import ElementTree as ET
import sys,requests,json,time,random,importlib
importlib.reload(sys)
# sys.setdefaultencoding("utf8")

def addCase(projectId,name):
  data = {"id":projectId,"name":name}
  headers = {'Content-Type': 'application/json'}
  url = 'http://127.0.0.1:5000/api/IAT/addCase'
  res = requests.post(url, headers=headers, data=json.dumps(data))
  response = res.json()
  if response["code"] == 0:
    return response["content"]["id"]
  return None

def addSample(caseId,info):
  data = {
    "id": caseId,
    "info": info
  }
  headers = {'Content-Type': 'application/json'}
  url = 'http://127.0.0.1:5000/api/IAT/updateSample'
  res = requests.post(url, headers=headers, data=json.dumps(data))
  try:
    response = res.json()
    print(response["msg"])
  except Exception as e:

    print(e)
    print("数据异常：",data)

def runbuild(userId,projectId,fileName):
  # 解析XML文件
  tree=ET.parse(fileName)
  root = tree.getroot()
  # 循环所有的HTTP请求

  # 首先处理线程组

  # 定位到
  # root = root.getElementsByTagName('hashTree')[0].getElementsByTagName('hashTree')[0]

  # for json in root.iter("JSONPostProcessor"):
  #   for childNode in json.getchildren():
  #     if childNode.attrib['name'] == 'JSONPostProcessor.referenceNames':
  #       print(childNode.text)

  for index,hashTreeTmp1 in enumerate(root.iter("hashTree")):
    # 获取所有的hashTree
    allChildren = list(hashTreeTmp1)
    for index1,childNode1 in enumerate(allChildren):
      if childNode1.tag == 'HTTPSamplerProxy':
        path = ''
        method = ''
        testname = childNode1.attrib['testname']
        params = []
        paramType = 1

        for childNode in list(childNode1):
          if childNode.tag == 'elementProp':
            for paramsContainerNode in list(childNode):
              for paramsNode in list(paramsContainerNode):
                key = ''
                value = ''
                for paramsNodeChildren in list(paramsNode):
                  if paramsNodeChildren.attrib['name'] == 'Argument.name':
                    key = paramsNodeChildren.text
                  if paramsNodeChildren.attrib['name'] == 'Argument.value':
                    value = paramsNodeChildren.text

                params.append({
                  "id":int(round(time.time() * 1000))+random.randint(1, 20),
                  "key":key,
                  "value":value,
                  "type": False,
                })
          if childNode.attrib['name'] == 'HTTPSampler.path':
            path = childNode.text
          if childNode.attrib['name'] == 'HTTPSampler.method':
            method = childNode.text
          if childNode.attrib['name'] == 'HTTPSampler.DO_MULTIPART_POST':
            if childNode.text == 'true':
              paramType = 3

        # 读取 断言 jsonPath
        assertData = []
        assertsType = 0  
        extractData = []
        extractType = 0

        for index2,childNode2 in enumerate(list(allChildren[index1+1])):
          if childNode2.tag == 'JSONPostProcessor':
            jsonPathExprs=''
            referenceNames=''
            for jsonPost in list(childNode2):
              if jsonPost.attrib['name'] == 'JSONPostProcessor.jsonPathExprs':
                jsonPathExprs=jsonPost.text
              if jsonPost.attrib['name'] == 'JSONPostProcessor.referenceNames':
                referenceNames=jsonPost.text
              
            extractData.append({
              "id":int(round(time.time() * 1000)),
              "key":referenceNames,
              "value":jsonPathExprs
            })
            extractType =1
          elif childNode2.tag == 'JSONPathAssertion':
            jsonPath1=""
            expectValue=""
            for jsonPath in list(childNode2):
              if jsonPath.attrib['name'] == 'JSON_PATH':
                jsonPath1=jsonPath.text
              if jsonPath.attrib['name'] == 'EXPECTED_VALUE':
                expectValue=jsonPath.text
                if(expectValue.startswith("$.")):
                  expectValue=expectValue[2:]

            assertData.append({
              "id":int(round(time.time() * 1000)),
              "key":jsonPath1,
              "value":expectValue,
            })
            # assertsType=2
        
        info = {
          "asserts": {
            "assertData": assertData,
            "assertsType": 2
          },
          "extract": {
            "extractData": extractData,
            "extractType": extractType
          },
          "method": method,
          "name": testname,
          "params": params,
          "paramType": paramType,
          "path": path,
          "user_id": userId,
          "preShellType": 0,
          "preShellData": "",
          "postShellType": 0,
          "postShellData": "",
        }

        # print(info)
        caseId = addCase(projectId, testname)
        if caseId:
          addSample(caseId, info)
  
  # 遍历得到所有的HTTP
  # for httpSamplerProxy in tree.iter("HTTPSamplerProxy"):
  #   path = ''
  #   method = ''
  #   testname = httpSamplerProxy.attrib['testname']
  #   params = []
  #   paramType = 1
   
  #   for childNode in httpSamplerProxy.getchildren():
  #     if childNode.tag == 'elementProp':
  #       for paramsContainerNode in childNode.getchildren():
  #         for paramsNode in paramsContainerNode.getchildren():
  #           key = ''
  #           value = ''
  #           for paramsNodeChildren in paramsNode.getchildren():
  #             if paramsNodeChildren.attrib['name'] == 'Argument.name':
  #               key = paramsNodeChildren.text
  #             if paramsNodeChildren.attrib['name'] == 'Argument.value':
  #               value = paramsNodeChildren.text

  #           params.append({
  #             "id":int(round(time.time() * 1000))+random.randint(1, 20),
  #             "key":key,
  #             "value":value,
  #             "type": False,
  #           })
  #     if childNode.attrib['name'] == 'HTTPSampler.path':
  #       path = childNode.text
  #     if childNode.attrib['name'] == 'HTTPSampler.method':
  #       method = childNode.text
  #     if childNode.attrib['name'] == 'HTTPSampler.DO_MULTIPART_POST':
  #       if childNode.text == 'true':
  #         paramType = 3
    # info = {
    #   "asserts": {
    #     "assertData": [{
    #       "id": int(round(time.time() * 1000)),
    #       "value": "\"code\":0"
    #     }],
    #     "assertsType": 1
    #   },
    #   "extract": {
    #     "extractData": [],
    #     "extractType": 0
    #   },
    #   "method": method,
    #   "name": testname,
    #   "params": params,
    #   "paramType": paramType,
    #   "path": path,
    #   "user_id": userId,
    #   "preShellType": 0,
    #   "preShellData": "",
    #   "postShellType": 0,
    #   "postShellData": "",
    # }
    # caseId = addCase(projectId, testname)
    # if caseId:
    #   addSample(caseId, info)

    # print testname
    # print method
    # print paramType
    # print path
    # print params
    # print "==============="

if "__main__" == __name__:
  # fileName = 'testData.jmx'
  # projectId = 66
  # userId = 44
  userId = sys.argv[1]
  projectId = sys.argv[2]
  fileName = sys.argv[3]
  runbuild(userId,projectId,fileName)
