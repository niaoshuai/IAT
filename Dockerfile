FROM alpine:3.9

LABEL maintainer="niaoshuai <niao.shuai123@163.com>"

# 修改源
RUN echo "http://mirrors.aliyun.com/alpine/latest-stable/main/" > /etc/apk/repositories && \
    echo "http://mirrors.aliyun.com/alpine/latest-stable/community/" >> /etc/apk/repositories

WORKDIR /usr/local/src/iat-h5/

# 安装NODE 环境
# RUN apk add --no-cache nodejs
RUN apk add nodejs \
    && apk add npm 

# 复制文件
COPY ./ ./

# 安装依赖
# RUN npm install --silent --no-cache  --registry=https://registry.npm.taobao.org
RUN npm install --registry=https://registry.npm.taobao.org

# 构建
RUN npm run build

# 安装nginx
RUN apk add nginx

# 配置nginx
RUN mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.orig
RUN cp docker/nginx.conf /etc/nginx/

# 开放80端口
EXPOSE 80

# 启动nginx命令
CMD ["rc-service", "nginx", "start"]