#-*-coding:utf-8-*-
import unittest

from runAutoBuildFromJmx import runbuild

class TestRunAutoBuildFromJmx(unittest.TestCase):

    def test_import(self):
        fileName = '/media/niaoshuai/NIAOSHUAI/归档/从业数据/环球优路/新技术文档/自动化/性能测试/常用jmeter脚本/二建刷题宝-模拟考试模块.jmx'
        projectId = 7
        userId = 50
        runbuild(userId,projectId,fileName)


if __name__ == '__main__':
    unittest.main()