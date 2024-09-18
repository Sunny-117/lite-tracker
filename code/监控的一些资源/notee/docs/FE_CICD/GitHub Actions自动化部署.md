# GitHub Actions 自动化部署

Github Actions 是 Github 的持续集成服务，点击 Actions 在你 Github 上的项目上创建配置文件，实际也就是保存在`.github/workflows`下的以`.yml`结尾的文件。

## 1.新建 workflow 文件

GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库的`.github/workflows`目录。

GitHub 只要发现`.github/workflows`目录里面有`.yml`文件，就会自动运行该文件。

##### 配置文件的基本术语结构

（1）**workflow** （工作流程）：持续集成一次运行的过程，就是一个 workflow。

（2）**job** （任务）：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。

（3）**step**（步骤）：每个 job 由多个 step 构成，一步步完成。

（4）**action** （动作）：每个 step 可以依次执行一个或多个命令（action）。

## 2.1 部署到 GitHub Pages

##### 1.yml 文件

```yaml
# cicd.yml

name: cicd github-pages  # 配置名称

on: # 触发条件，main分支push代码后触发workflow
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest # 构建运行环境
    steps:
    - name: Checkout  # 拉取代码到环境，如果用checkout@v2，最好配置 persist
      uses: actions/checkout@v2
      with:	# with 是 这个 action 的传参
        persist-credentials: false

    - name: Install Node.js # 安装指定Node版本，使用actions/setup-node@v1
      uses: actions/setup-node@v1
      with:
        node-version: '14.x'

    - name: Install & Build # 安装依赖和打包
      run: |
        npm install
        npm run build

    - name: Deploy to GithubPages # 部署到GithubPages，使用peaceiris/actions-gh-pages@v3
      uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.CICD_TOKEN }}
          publish_dir: ./dist
```

##### 2.生成 GitHub token

部署到 Github Pages，因此需要 GitHub token，生成 token

个人头像 => Settings => Developer settings => Personal access tokens

<img src="https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/09-22-31-BLu9gy.gif" alt="选择令牌作用域" style="zoom:80%;" />

##### 3.绑定 token 到 secrets

仓库 => Settings => Secrets。可以保存各种常量，在 `.yml` 中使用。

对应 `.yml` 中的`${{ secrets.CICD_TOKEN }}`

> shell 脚本文件是严格缩进的，因为它需要根据空格个数来区分数据结构。如果你的脚本运行报错了，首先检查一下 shell 的缩进是否正确。

> 如果部署成功但 GitHub Pages 出现页面空白，检查 Settings-GitHub Pages 的信息是否正确

## 2.2 部署到云服务器

```bash
name: cicd cloud  # 配置名称

on: # 触发条件，main分支push代码后触发workflow
  push:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest # 构建运行环境
    steps:
    - name: Checkout  # 拉取代码到环境，如果用checkout@v2，最好配置 persist
      uses: actions/checkout@v2
      with:	# with 是 这个 action 的传参
        persist-credentials: false

    - name: Install Node.js # 安装指定Node版本，使用actions/setup-node@v1
      uses: actions/setup-node@v1
      with:
        node-version: '14.x'

    - name: Install & Build # 安装依赖和打包
      run: |
        npm install
        npm run build

    - name: Deploy to Server # 部署到云服务器，使用easingthemes/ssh-deploy@v2.1.1，通过ssh的方式连接
      uses: easingthemes/ssh-deploy@v2.1.1
      env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}  # 私钥，公钥拷贝到服务器在/root/.ssh/authorized_keys中中
          ARGS: "-avz --delete" # 对于任何初始/必需的rsync标志，默认-avzr --delete，如果目录下有其他不可删除文件或文件夹可以用--exclude忽略，如--exclude /uploads/
          SOURCE: "dist/" # 源目录
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }} # 服务器地址
          REMOTE_PORT: ${{ secrets.REMOTE_PORT }} # ssh连接端口号
          REMOTE_USER: root # 连接用户名
          TARGET: ${{ secrets.REMOTE_TARGET }} # 目标部署目录
```

参考

https://docs.github.com/cn/actions/quickstart

http://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html

http://www.ruanyifeng.com/blog/2019/12/github_actions.html

https://juejin.cn/post/6844903974122815501
