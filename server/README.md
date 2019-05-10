## 删除所有的.pyc文件
find . -name "*.pyc" | xargs rm -rf
## 安装依赖
pip install -r requirements.txt
pip install --no-cache-dir -r requirements.txt (docker)
## pandas
python3 -m pip install --upgrade pandas