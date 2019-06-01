## 删除所有的.pyc文件
find . -name "*.pyc" | xargs rm -rf
## 安装依赖

pip3 install requests -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com
### 加速 (https://mirrors.tuna.tsinghua.edu.cn/help/pypi/,https://opsx.alibaba.com/mirror)
python3 -m pip install requirements.txt  -i http://mirrors.aliyun.com/pypi/simple/ --trusted-host mirrors.aliyun.com

pip install -r requirements.txt
pip install --no-cache-dir -r requirements.txt (docker)
## pandas
python3 -m pip install --upgrade pandas

## 常见问题以及解决方案
https://www.jianshu.com/p/6232f0a14f3a

openssl/ssl.h: 没有那个文件或目录

sudo apt install libssl-dev


## 数据库
docker run -it -p 3306:3306/tcp -p 33060:33060/tcp -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=IAT 192.168.13.129:23456/mysql:5 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci