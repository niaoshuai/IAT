#-*-coding:utf-8-*-
import unittest,json
from datetime import datetime

# //makeResultPath,read_demo,set_data,indent,
from runTest import readResult

class TestRunJmeterTest(unittest.TestCase):

    # def test_import(self):
    #     fileName = 'TestData.jmx'
    #     runJmeterTest1(fileName)

    # def test_import(self):
    #     fileName = '/jmeter_log/'
    #     runJmeterTestDocker(fileName)
    # def test_file(self):
    #   data = json.load(open("x.json"))
    #   now = datetime.now().strftime('%Y-%m-%d_%H_%M_%S')
    #   reulstPath = makeResultPath(now)
    #   tree = read_demo('templete.jmx')
    #   tree = set_data(tree,data=data)
    #   indent(tree.getroot())
    #   tree.write(reulstPath+'/test.jmx', encoding="utf-8")

    def test_read(self):
      print(readResult("/home/niaoshuai/桌面/result(1).csv"))
     




if __name__ == '__main__':
    unittest.main()