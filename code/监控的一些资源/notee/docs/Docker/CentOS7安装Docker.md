# CentOS7 安装 Docker

Docker 分为 CE 和 EE 两大版本。CE 即社区版（免费，支持周期 7 个月），EE 即企业版，强调安全，付费使用，支持周期 24 个月。

## 1.0 卸载（可选）

如果之前安装过旧版本的 Docker，可以使用下面命令卸载：

```bash
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine \
                  docker-ce
```

## 1.1 安装 docker

```bash
# 1.安装yum等一些必要的系统工具
sudo yum install -y yum-utils device-mapper-persistent-data lvm2

# 2. 设置本地docker镜像源
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sed -i 's/download.docker.com/mirrors.aliyun.com\/docker-ce/g' /etc/yum.repos.d/docker-ce.repo

# 3. 更新并安装 Docker-CE
sudo yum makecache fast
sudo yum -y install docker-ce
```

> docker-ce 为社区免费版本

## 1.2 启动 docker

```bash
service docker start
```

## 1.3 测试安装

```bash
docker -v
```

##### 其他命令

```bash
systemctl start docker  # 启动docker服务
systemctl stop docker  # 停止docker服务
systemctl restart docker  # 重启docker服务
```

## 1.4 配置镜像加速

针对 Docker 客户端版本大于 1.10.0 的用户

可以通过修改 daemon 配置文件/etc/docker/daemon.json 来使用加速器

```bash
# 创建目录
sudo mkdir -p /etc/docker

# 编辑daemon配置文件
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://opjwdioa.mirror.aliyuncs.com"]
}
EOF

#刷新daemon配置和重启 doeker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

```bash
# 这是腾讯云加速器
vim /etc/docker/daemon.json
{
  "registry-mirrors": ["https://mirror.ccs.tencentyun.com"]
}
```

# 2. CentOS7 安装 DockerCompose

## 2.1 下载 DockerCompose

下载`docker-compose`文件到`/usr/local/bin/`目录

```bash
curl -L https://github.com/docker/compose/releases/download/1.23.1/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
```

> 如果无法下载，这里下载后上传到`/usr/local/bin/`目录
>
> http://gofile.me/6R0LC/kPCmrcB03

## 2.2 修改文件权限

```bash
chmod +x /usr/local/bin/docker-compose
```

## 2.3 Base 自动补全命令

这一步可省略

```bash
curl -L https://raw.githubusercontent.com/docker/compose/1.29.1/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

> 如果这里出现连接错误，修改 hosts 文件：
>
> ```sh
> echo "199.232.68.133 raw.githubusercontent.com" >> /etc/hosts
> ```

## 2.4 测试是否安装成功：

```shell
docker-compose --version
```
