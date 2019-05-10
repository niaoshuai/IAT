#-*-coding:utf-8-*-
import unittest

from runTest import runJmeterTest1

class TestRunJmeterTest(unittest.TestCase):

    def test_import(self):
        fileName = 'TestData.jmx'
        runJmeterTest1(fileName)


if __name__ == '__main__':
    unittest.main()