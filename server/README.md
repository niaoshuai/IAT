## 删除所有的.pyc文件
find . -name "*.pyc" | xargs rm -rf
## 安装依赖
pip install -r requirements.txt
pip install --no-cache-dir -r requirements.txt (docker)
## pandas
python3 -m pip install --upgrade pandas

## 常见问题以及解决方案
https://www.jianshu.com/p/6232f0a14f3a

openssl/ssl.h: 没有那个文件或目录

sudo apt install libssl-dev