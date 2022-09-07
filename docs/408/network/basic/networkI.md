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

ICMP、IGMP 向上层传输层提供服务，ARP 向下网络接口层调取服务，IP 工作在二者之间

## IP 地址

