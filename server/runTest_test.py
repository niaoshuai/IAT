#-*-coding:utf-8-*-
import unittest

from runTest import runJmeterTestDocker

class TestRunJmeterTest(unittest.TestCase):

    # def test_import(self):
    #     fileName = 'TestData.jmx'
    #     runJmeterTest1(fileName)

    def test_import(self):
        fileName = '/jmeter_log/'
        runJmeterTestDocker(fileName)


if __name__ == '__main__':
    unittest.main()