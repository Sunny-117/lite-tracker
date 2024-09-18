```shell
set -e
timestamp=`date '+%Y%m%d%H%M%S'`

node -v
npm -v

npm install -g cnpm --registry=https://registry.npm.taobao.org

cnpm install

npm run build

# 编译docker镜像
# Nexus制品库地址=172.16.137.137:8082
docker build -t 172.16.137.137:8082/fe/nginx-fe-$timestamp .

# 推送docker镜像到制品库
docker push 172.16.137.137:8082/fe/nginx-fe-$timestamp

# 远程执行命令部署镜像
# nginx地址=172.16.137.132
ssh -o StrictHostKeyChecking=no root@172.16.137.132 "docker pull 172.16.137.137:8082/fe/nginx-fe-$timestamp && \
docker stop jenkins-test && \
docker rm jenkins-test && \
docker run -p 80:80 -itd \
--name jenkins-test \
--restart always \
172.16.137.137:8082/fe/nginx-fe-$timestamp"
```

