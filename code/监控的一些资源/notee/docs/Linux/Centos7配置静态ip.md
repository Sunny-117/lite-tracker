# Centos7配置静态ip



#### 0.当前配置

当前ip: `192.168.1.12`

查看当前网卡配置

```bash
cat /etc/sysconfig/network-scripts/ifcfg-ens33
```

```bash
TYPE="Ethernet"		# 网卡类型：为以太网
PROXY_METHOD="none"		# 代理方式：关闭状态
BROWSER_ONLY="no"		# 只是浏览器：否
BOOTPROTO="dhcp"	# 网卡的引导协议：DHCP[中文名称: 动态主机配置协议]
DEFROUTE="yes"	# 默认路由：是, 不明白的可以百度关键词 `默认路由` 
IPV4_FAILURE_FATAL="no"	# 是否开启IPV4致命错误检测：否
IPV6INIT="yes"	# IPV6是否自动初始化: 是[不会有任何影响, 现在还没用到IPV6]
IPV6_AUTOCONF="yes"	# IPV6是否自动配置：是[不会有任何影响, 现在还没用到IPV6]
IPV6_DEFROUTE="yes"	# IPV6是否可以为默认路由：是[不会有任何影响, 现在还没用到IPV6]
IPV6_FAILURE_FATAL="no"	# 是否开启IPV6致命错误检测：否
IPV6_ADDR_GEN_MODE="stable-privacy"	# IPV6地址生成模型：stable-privacy [这只一种生成IPV6的策略]
NAME="ens33"	# 网卡物理设备名称
UUID="430c2de5-30db-459d-920b-2857b6b8a3d3"	# 通用唯一识别码, 每一个网卡都会有, 不能重复
DEVICE="ens33"	# 网卡设备名称, 必须和 `NAME` 值一样
ONBOOT="yes"	# 是否开机启动， 要想网卡开机就启动或通过 `systemctl restart network`控制网卡,必须设置为 `yes` 
```



#### 1.编辑网卡配置

```bash
vi /etc/sysconfig/network-scripts/ifcfg-ens33
```

```bash
# 修改
BOOTPROTO=static

# 新增
IPADDR=192.168.1.100
NETMASK=255.255.255.0
GATEWAY=192.168.1.1
```



#### 2.重启网卡

```bash
systemctl restart network
```

完成



### 3.双IP

dhcp模式，如果你想再增加一个ip，直接在末尾加上就可以。重启网卡。

```bash
# 新增
IPADDR=192.168.1.110
NETMASK=255.255.255.0
```

