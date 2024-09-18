# Git 常用命令

## Git 全局设置

- 设置用户信息

  ```bash
  git config --global user.name “zwh”
  git config --global user.email “zwh@zwhid.online”
  ```

- 查看配置信息

```bash
git config --list
```

## 获取 Git 仓库

- 本地初始化仓库
  - `git init`
- 远程克隆仓库
  - `git clone [url]`

## 本地仓库

- 查看文件状态

  - `git status`

  > untracked 未跟踪（未被纳入版本控制）
  > tracked 已跟踪（被纳入版本控制）
  > 1.Unmodified 未修改状态
  > 2.Modified 已修改状态
  > 3.Staged 已暂存状态

- 将文件的修改加入暂存区

  - 将工作区的所有文件加入暂存区: `git add .`

  - 将工作区指定的文件加入暂存区: `git add [fileName1] [fileName2]`

- 将暂存区的文件修改提交到版本库
  - 将暂存区的所有文件提交到版本库: `git commit -m [text]`
  - 将暂存区指定的文件提交到版本库: `git commit -m [text] [fileName1] [fileName2]`
- 查看日志
  - 查看提交日志: `git log`
  - 查看所有的操作日志(包括回退和合并): `git reflog`
- 取消暂存或切换版本
  - 将暂存区的指定或所有文件取消暂存: `git reset [fileName1]` or `git reset`
  - 切换版本到指定 commit 的版本: `git reset --hard [commit-id]`

​

## 远程仓库操作

- 从远程仓库克隆
  - 克隆整个仓库: `git clone [url]`
  - 克隆指定分支: `git clone -b [branch-name] [url]`
- 查看远程仓库
  - 查看远程仓库名称: `git remote`
  - 查看远程仓库地址: `git remote -v`

```bash
zwh:test zwh$ git remote
origin
origin2
zwh:test zwh$ git remote -v
origin	https://gitee.com/eueni/test.git (fetch)
origin	https://gitee.com/eueni/test.git (push)
origin2	https://gitee.com/eueni/test2.git (fetch)
origin2	https://gitee.com/eueni/test2.git (push)
```

- 添加远程仓库
  - `git remote add [short-name] [url]`
- 推送至远程仓库

  - 指定远程仓库的指定分支: `git push [remote-name] [branch-name]`

- 从远程仓库拉取

  - 指定远程仓库的指定分支: `git pull [remote-name] [branch-name]`

> 1. `git push origin dev:master`
>
>    `git push origin master`相当于`git push origin master:master`的简写，遵循的格式为`git push [远程主机名] [本地分支名]:[远程分支名]`
>
> 2. `git push -u origin master`
>    push 的时候加上-u 可以设置上游参数，将仓库链接到一个中央仓库。下次 push 和 pull 就可以不用带上[remote-name]和 [branch-name]
>
> 3. `git push --force origin master`
>
>    如果本地版本与远程版本有差异，但又要强制推送可以使用 --force 参数，慎用！
>
> 4. `git pull --allow-unrelated-histories origin master`
>
>    如果当前本地仓库不是从远程仓库克隆，而是本地创建的仓库，并且仓库中存在文件，此时再从远程仓库拉取文件的时候会报错（fatal: refusing to merge unrelated histories ）,加上--allow-unrelated-histories 即可

## 分支操作

- 查看分支
  - 列出所有本地分支: `git branch`
  - 列出所有远程分支: `git branch -r`
  - 列出所有本地分支和远程分支: `git branch -a`
- 创建分支
  - `git branch [branch-name]`
- 切换分支
  - `git checkout [branch-name]`
- 创建并切换分支
  - `git checkout -b [branch-name]`
- 删除分支
  - `git branch -D [branch-name]`
- 推送至远程仓库分支
  - `git push [remote-name] [branch-name]`
- 合并分支
  - 将指定分支合并到当前分支: `git merge [branch-name]`

## 标签操作

- 列出已有的标签
  - `git tag`
- 创建标签
  - `git tag [tag-name]`
- 将标签推送至远程仓库
  - `git push [remote-name] [tag-name]`
- 检出标签到新分支
  - `git checkout -b [new-branch-name] [tag-name]`

> 标签的实质就是分支
