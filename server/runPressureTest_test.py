#-*-coding:utf-8-*-
import unittest,json
import docker
from datetime import datetime

from runPressureTest import makeResultPath,read_demo,set_data,indent,readResult,runJmeterTestDocker

class TestRunJmeterTest(unittest.TestCase):

  
    # def test_file(self):
    #   data = json.load(open("x.json"))
    #   now = datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
    #   reulstPath = makeResultPath(now)
    #   tree = read_demo('templete-pressure.jmx')
    #   pressureData = {"rps":1000,"time":10,"up":10}
    #   tree = set_data(tree,data=data,pressureData=pressureData)
    #   indent(tree.getroot())
    #   tree.write(reulstPath+'/test.jmx', encoding="utf-8")

    def test_runJmeterTestDocker(self):
        # runJmeterTestDocker('',1,1)
        client = docker.DockerClient(base_url='tcp://192.168.11.207:1234')
        client.containers.run('busybox')
        client.close



if __name__ == '__main__':
    unittest.main()