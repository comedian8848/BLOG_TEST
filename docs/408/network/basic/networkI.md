---
title: 网络层
date: 2021-9-7
tags:
  - Network
---

## 概述

### 网络层概述

> 网络层是最重要的章节

网络层向上只提供简单灵活的、无连接的、尽最大努力交付的数据报服务

网络在发送分组时不需要先建立连接，每个分组（IP 数据报）独立发送，与其他分组无关，也不进行编号

不提供服务质量的保证，分组有可能出错、丢失、重复和失序，以及时限

分组在互联网中传递，常会经过许多异构的网络

### 网际协议：IP 协议簇

与 IP 配套的有三个协议

- 地址解析协议 ARP：Address Resolution Protocol
- 网际控制报文协议 ICMP：Internet Control Message Protocol
- 网际组管理协议 IGMP：Internet Group Management Protocol

ICMP、IGMP 向上层传输层提供服务，ARP 向下网络接口层调取服务，IP 工作在二者之间1

## IP 地址

网络层连接异构网络，需要一种方案来标识异构网络，这种标识符也就是 IP 地址

- 上一种标识符是 MAC 地址，用于标识硬件，IP 地址用于标识一整块网络

分类的 IP 地址：最基本的编址方法

改进方案：

- 子网的划分
- CIDR
- 私有 IP
- IPv6

### 分类 IP

将 IP 地址划分成若干个固定类

- 每一类地址都由两个固定长度的字段组成，其中一个是网络号 net-id，标志主机/路由器连接到的网络；另一个是主机号 host-id，标志该主机，共 32 位二进制代码
- 网络号和主机号的组合在指定网络范围内必须是唯一的
- 一个 IP 地址在整个互联网范围内是唯一的，一个 IP 对应一个主机

根据网络号和主机号所占位数不同，分为以下 5 类地址

- A 类地址：8+24
- B 类地址：16+16
- C 类地址：24+8
- D 类地址：1110+多播地址
- E 类地址：1111+保留为今后使用

32 位二进制代码书写并不方便，于是我们将其 8 位分为一组，然后化为十进制
——> 点分十进制

一些特殊的 IP 地址：

- 0.0.0.0
  - 代表本网络
  - 代表 DHCP 请求的源 IP 地址
  - OSPF 的根区域
- 255.255.255.255
  - 代表全网广播
  - 代表 DHCP 请求的目的 IP 地址
- 127.0.0.0：环回地址
- 网络地址：主机位全为 0
- 广播地址：主机位全为 1

#### 有效 IP 地址

以 c 类 IP 为例，hots-ip 共 8 位，于是有 2^8 = 256 种编号，但是要去掉两种特殊 IP

- 网络地址：0.0.0.0
- 广播地址：255.255.255.255

于是有效 IP 地址为 254 个 ——> 推广到一般，若主机地址 n 位，那么有效 IP 共 2^n-2 个

#### 分类 IP 特点

管理机构只分配网络号，主机号由单位分配，注意数据在互联网中的转发只考虑网络号

一个网络对应一个 IP 地址，这意味着，若一个主机连接有两个网络，那么他就有两个不同的 IP 地址；路由器至少连接有两个网络，也就意味着他至少有两个 IP 地址

用转发器/网桥连接的局域网仍属于同一个网络，共用一个网络号

### 子网划分

由于主机号太多了，特别在a、b网络中，24位和16位的主机号，很多单位根本用不上这么多 IP 地址，于是我们采用子网（subnet）的方式对 IP 地址进行分组

如 172.24.12.52（这是一个b类网络，因为首字节位于128-191），我们将其第三个字节作为子网IP，划分为

- 172.24.9.xx
- 172.24.12.xx
- 172.24.24.xx

这样就大大提供了IP地址的利用率

#### 子网掩码

划分子网的过程中出现了新的问题，就是无法区分哪是子网IP，就比如 172.24.12.52，我怎么知道那个 12 是代表子网ip还是主机ip的一部分

于是我们引入子网掩码

其长度和完整的ip地址保持一致，即 32 位，从左往右是一串连续的 1，从右往左是一串连续的 0，1 对应的位置的就是网络号和子网号，相应 0 对应的位置就是主机号

- a类的标准子网掩码：255.0.0.0
- b类的标准子网掩码：255.255.0.0
- c类的标准子网掩码：255.255.255.0

再通过首字节范围判断网络类型，确认网络号长度，于是将三个部分分开

- a类：0-127
- b类：128-191
- c类：192-225

#### 网络地址和IP地址

如何将IP地址转为网络地址？

- 根据子网掩码和首字节范围确定网络号、子网号和主机号
- 将IP地址和子网掩码位做与操作（全为1才为1）
  - 这也意味着网络位保持不变（网络位的子网掩码处全为1）
  - 但子网位很有可能变化，因为子网位借的主机位，主机位的子网掩码为0，有可能发生变化
- 将主机位全置零，网络位保留，得到网络地址

注意：在规范的IP地址中，主机号不能全为0或1

子网掩码（十进制）转二进制

- 128 一个 1
- 192 两个 1
- 224 三个 1
- 240 四个 1
- 248 五个 1
- 252 六个 1
- 254 七个 1
- 255 八个 1

子网数量：2^子网位数（子网位编号）

每个子网的有效IP数：2^主机位数-2（主机位编号-网络/广播地址）

重点在于：确定网络类别，确定子网借了几位，与操作写就行了

#### 无分类编址 CIDR

> 无类别，子网掩码的变种

CIDR消除了传统的a、b、c类地址以及划分子网的概念

CIDR使用网络前缀（network-profix）代替分类地址中的网络号和子网号，相当于**子网掩码**

IP地址 = 网络前缀+主机号，在表示的时候使用斜线法

如 128.14.32.0/20 表示有 20 位的网络前缀，12 位的主机号，在分配的时候，网络前缀是始终不变的，即只改变主机号，于是这个网络共有 2^12 个有效IP地址

- 在 CIDR 中，主机位可以全为 0/1

当主机位 2 位，前缀/网络尾 30 位，只有两个有效 ip，常应用于串行线路，两个机器一对一连在一起

判断 ip 地址是否处于同一网络的两种方法：

- 将所有 ip 二进制展开，逐位对比
- 将网络地址的范围写出，判断每 8 位是否在范围内（因为存在子网号借位）

<img src="../../../.vuepress/public/img/inonesubnet.png">

重点在于，同一网络的前缀一定相同，这里的前缀指网络号（包括子网号）

<img src="../../../.vuepress/public/img/moreprefix.png">

#### 路由聚合

将前缀相同的网络聚合在一起，路由聚合也成为**构成超网**

如何聚合？

- 取出公共前缀
- 将非公共前缀置零，即得到这几个网络的超网

#### 网络分配问题

网络优先：当每个子网所需的主机数相同时，优先考虑分配子网数量，即 2^n 个子网数，n 为子网位数量，然后根据网络类别考虑主机位数

- 网络优先分得的各个网络都是等大的，没有最小/大的概念

主机优先：适用于每个子网中主机数不同

<img src="../../../.vuepress/public/img/hostfirst.png">

- 从地址要求多的网络开始划分主机位数
- 每向后划分一位，都会将原网络一分为二；划分两位（等分四份），即一分为四
- 当划分到最后需求都不多时采用等分的方式

主机优先的分配方式也叫下楼梯，网络位逐位向后扩展，呈阶梯状

需要注意的是，当一个网络被分好后，以这个网络为前缀的网络都不可有再分了

比如需要 150 个主机，分配 8 个主机位，网络位 24 位，此时固定前 24 个网络位，算作已分配，若想继续分配其他 ip，需要把第 24 位从 0 改成 1，算作新的网络号继续分配

- 为什么是第 24 位而不是更前面呢，因为我们在主机优先分配时，先从主机需求大的网络进行分配，即继续分配时不会超过上一次的阀值

<img src="../../../.vuepress/public/img/step.png">

尽可能提高 ip 地址利用率：使用主机优先，首先去分大号主机，再向下延伸

若要求分得最大子网或最小子网，需要使用逐层阶梯下降主机优先方法

### 私有 IP

> 局部性原理

私有地址也叫专用地址、本地地址，仅在机构内部使用的IP地址，可由本机构自行分配而不需要申请

全球地址，全球唯一的IP地址，需要买

- 就像在学校里用学号，而很少用身份证，但出门在外得用身份证

三个专用私有IP地址块

- A类：10.0.0.0-10.255.255.255，记为10.0.0.0/8
- B类：172.16.0.0-172.31.255.255，记为172.16.0.0/12
- C类：192.168.0.0-192.168.255.255，记为192.168.0.0/16

IP是收钱的，使用专用IP仅在内部使用节约成本，专用IP地址也叫做**可重用地址**

#### 网络地址转换 NAT

私有IP无法出现在互联网上（出校了不能用学号）

需要在路由器上安装软件 NAT，network address transform，这样的路由器叫做 NAT路由器，它至少有一个有效的全球IP地址

NAT 的作用是将私用IP翻译成路由器所拥有的IP，出入多经过一层，在 NAT 种有一张手动配置的表格，将公用地址对应内部的私有dizhi

- 离开专用网时，替换源地址，将内部地址替换为全球地址
- 进入专用网时，替换目的地址，将全球地址替换为内部地址

#### NATP

多个私有IP映射到同一个公有IP的不同端口，以此实现公用对私有的一对多

### IPv6

IPv4顶破天只有 2^32 个IP地址，总有一天会用完，于是使用 IPv6 规则，将 32 位扩展到 128 位，共 2^128 个IP地址（据说一个树叶一个IP都够用）

8 字节对齐

#### 首部格式

首部长度固定为 40 字节，首部字段数为 8 位二进制数，占第一个分组的前半部

#### 冒号十六进制记法

用冒号分隔十六进制，将共 128 位分成 8 组，每组为 16 位二进制，用十六进制表示，即每四位二进制表示为一个十六进制数，每组四个

简写：0000 ——> 0，0001 ——> 1

零压缩，将连续的 0 压缩成两个冒号

#### IPv6 的地址

类型：

- 单播：点对点播
- 多播：一对多播
- 任播：将数据报交付给距离最近的一组计算机

特殊地址：

- 未指明地址：::/128
- 环回地址：::1/128
- 多播地址：FF00::/8（首部全为1）
- 本地链路单播：FE80::/10（前十位为1111111010）

#### 从 IPv4 到 IPv6 过渡

双协议栈，自动在 IPv4/IPv6 之间切换，要在主机上多装一个协议栈

隧道技术：将 IPv6 封装到 IPv4 中，通过 IPv4 传输，传输到了之后再拆封成 IPv6

## 地址解析协议 ARP