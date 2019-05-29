#-*-coding:utf-8-*-
import unittest,json
from datetime import datetime

from runPressureTest import makeResultPath,read_demo,set_data,indent,readResult

class TestRunJmeterTest(unittest.TestCase):

    # def test_import(self):
    #     fileName = 'TestData.jmx'
    #     runJmeterTest1(fileName)

    # def test_import(self):
    #     fileName = '/jmeter_log/'
    #     runJmeterTestDocker(fileName)
    def test_file(self):
      data = json.load(open("x.json"))
      now = datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
      reulstPath = makeResultPath(now)
      tree = read_demo('templete-pressure.jmx')
      pressureData = {"rps":1000,"time":10,"up":10}
      tree = set_data(tree,data=data,pressureData=pressureData)
      indent(tree.getroot())
      tree.write(reulstPath+'/test.jmx', encoding="utf-8")

    # def test_read(self):
    #   print(readResult("/var/lib/docker/volumes/iat_iat_data/_data/2019-05-21_09_21_37/result.csv"))



if __name__ == '__main__':
    unittest.main()