> **yum 拓展知识:**
>
> ​ 1). 如果在不更改软件来源的情况下，是需要联网才能使用 yum 的，那么我们安装的软件是从哪儿下载的呢，这里就涉及到一个概念： yum 源。
>
> ​
>
> ​ 2). 我们可以通过一个指令，来检查当前的 yum 源
>
> ​ ![image-20210816192200749](file:///Users/zwh/Downloads/day47_Linux/01_%E7%AC%94%E8%AE%B0/%E8%AE%B2%E4%B9%89/day02/assets/image-20210816192200749.png?lastModify=1652145578)
>
> ​ 从图中，我们可以看到我们安装的 CentOS7 采用的是网易的 163yum 源。
>
> ​
>
> ​ 3). 网络 yum 源配置文件位于 /etc/yum.repos.d/ 目录下，文件扩展名为"\*.repo"
>
> ​ ![image-20210816193941094](file:///Users/zwh/Downloads/day47_Linux/01_%E7%AC%94%E8%AE%B0/%E8%AE%B2%E4%B9%89/day02/assets/image-20210816193941094.png?lastModify=1652145578)
>
> ​ 可以看到，该目录下有 7 个 yum 配置文件，通常情况下 CentOS-Base.repo 文件生效。
>
> ​
>
> ​ 4). 添加阿里云 yum 源
>
> ​ A. 先通过 `yum install wget` ,安装 wget 命令
>
> ​ B. 备份默认的网易 163 的 yum 源，执行指令 ：
>
> ​ 切换目录: cd /etc/yum.repos.d/
>
> ​ 创建备份目录: mkdir bak
>
> ​ 移动现有的 yum 源文件到 bak: mv \*.repo bak/
>
> ​ C. 下载阿里云的 yum 源
>
> ​ wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
>
> ​ D. 执行命令，重新生成 cache
>
> ​ yum clean all
>
> ​ yum makecache
>
> ​ E. 再次查看 yum 源
>
> ​ ![image-20210816214230609](https://zwhid.oss-cn-shenzhen.aliyuncs.com/blog/05-10-njtIKl.png)
>
> ​ 之后，我们通过 yum 指令安装软件，就是从阿里云下载的。
