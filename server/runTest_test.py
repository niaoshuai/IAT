#-*-coding:utf-8-*-
import unittest,json
from datetime import datetime

from runTest import makeResultPath,read_demo,set_data,indent

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
      tree = read_demo('templete.jmx')
      tree = set_data(tree,data=data)
      indent(tree.getroot())
      tree.write(reulstPath+'/test.jmx', encoding="utf-8")


if __name__ == '__main__':
    unittest.main()