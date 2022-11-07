---
title: 文件管理
date: 2022-11-6
tags:
  - OperatingSystem
---

## 文件

### 文件概述

文件：存放于外存，具有文件名的相关信息的集合；长久存放于外存；文件是输入输出的基本单位，对文件的操作由操作系统的文件系统提供

文件系统的基本概念（相当于一个数据表）

- 数据项：字段，列
  - 基本数据项
  - 组合数据项
- 记录：行
- 属性：文件（表）的属性
  - 文件名：字符型，由用户命名，包括主文件名和扩展名
  - 标识符：用于系统识别文件
  - 类型：扩展名体现
  - 大小：以字节计量
  - 位置：外存地址
  - 建立 / 修改时间
  - 存放方式：权限，读写等

文件分类

按用途分类

- 系统文件
- 用户文件
- 库文件：如 C 的`std.io.h`，本质上也属于系统文件，为用户变成提供方便

按文件中的数据类型分类

- 源文件：.cpp
- 目标文件：.obj
- 可执行文件：.exe

按存取控制属性分类

- 只执行文件
- 只读文件
- 读写文件
- 可读可写可执行文件

按组织形式和处理方式分类

- 普通文件：用于存储信息/程序
- 目录文件：用于检索
- 特殊文件：IO 设备对应文件，用于设备管理（硬件软化）

### 元数据和索引结点

#### 元数据

元数据：文件的属性类数据（另一类为文件内容对应的数据），元数据主要用于编制目录，方便检索文件，**用户操作文件前必须获得该文件的元数据**

元数据的更改保存于**日志文件**

- 系统重启时去查日志而非文件系统，缩短系统恢复时间
- 日志文件还可以用于回滚文件数据

元数据的管理方式

- 集中式管理
- 分布式管理

集中式管理：将所有元数据存储在存储管理节点所在的存储设备，集群文件系统常采用集中式管理

- 管理简单；一致性维护容易
- 可靠性差，管理节点失效会造成整个系统瘫痪；操作频率受限，若操作过于频繁将制约系统性能

分布式管理：元数据可存放于系统的任意节点且运行动态迁移

- 可靠性高且操作频率不受限
- 管理实现复杂，一致性维护较难

#### FCB

FCB：文件控制块，用于描述和控制文件的数据结构（参考进程控制模块 PCB，作业控制模块 JCB），文件管理程序借助 FCB 的信息对文件施以各种操作

FCB 包含以下信息

- 基本信息：文件名；物理位置（外存位置，外村设备名，起始盘块号、所用盘块数、长度）；文件逻辑结构；文件物理结构
- 存取控制信息：文件主；核准用户；一般用户读、写、执行权限
- 使用信息：文件建立时间；修改时间；当前使用信息（打开该文件的进程数、是否被所著、是否在内存已被修改未同步至外存）

通过 FCB 可以感知文件在外存的所有状态，如微软 DOS 的文件控制块（占用 32 B）

| 主文件名 | 扩展名 | 属性 | 备用 | 时间 | 日期 | 第一块号 | 盘快数 |
| -------- | ------ | ---- | ---- | ---- | ---- | -------- | ------ |

#### 索引结点

> 基于 FCB

多级目录允许文件重名，解决了难命名问题，但也意味着一个目录文件中可能要存放大量的 FCB 文件，如一个目录下 100 个文件，这个目录文件就要存 100 个 FCB，3.2 KB

在检索文件时，需要

- 将目录文件调入内存
- 在目录中通过文件名查找指定文件
- 根据 FCB 将文件从外存调入内存

用于减少目录所占空间，同时提升检索 FCB 速度，于是引入**索引结点**

- FCB 文件只存储文件名和指向该文件索引结点的指针
- 索引结点中存储 FCB 中除了文件名的其余属性

相当于多建立一张索引表，纵向分表存储，将键和属性分开，用指针链接，提高检索效率

- 文件目录下只存文件名和指针的索引表，索引结点可以存放在任意位置

  于是减少了目录所占空间

磁盘索引结点

- 主标识符
- 类型
- 存取权限
- 物理地址
- 长度
- 链接次数：文件系统中指向该文件的指针数
- 存取时间

内存索引结点

- 索引结点编号
- 状态：是否上锁、修改
- 访问计数：进程访问结点计数
- 逻辑设备号
- 链接指针

### 文件操作

创建

- 为文件建立目录表项（登记）
  - 在目录表新增一行
  - 建立索引结点
- 分配外存空间等

删除：在目录文件下文件对应的记录增加删除标记；在需要时（空间不够或需要移动）回收文件所占外存空间

打开：通过系统调用完成，如函数`open(file_name, open_pattern)`

- 打开时，首先将文件属性复制到内存的**打开文件表**的一个条目中
- 将该条目的编号返回给用户
- 用户通过内存中的打开文件表访问文件属性，以显著提高操作速度

读 / 写：通过文件名检索目录，获取文件的外存地址，实施读写

关闭：将该文件在**打开文件表**中的条目删除，撤销文件的数据结构

属性操作

- 普通文件：修改文件名、文件拥有者、改变文件访问权和查询文件状态等
- 目录文件：创建目录、删除目录和改变当前目录等

### 文件保护

对内存的保护：上下界寄存器，越界非法地址等

外存同样需要保护

- 首先不能越界
- 防止非法操作或物理损坏对文件数据造成的破坏

影响文件安全的因素

- 人为因素：如误删
- 系统因素：如磁盘故障
- 自然因素：磁盘数据会随时间的推移逐渐消失，消磁







逻辑结构

物理结构

目录：也是文件，用于管理（检索）文件

- 基本概念
- 树形目录
- 目录操作
- 硬链接和软链接

文件系统

- 全局结构
- 外存空闲空间管理方法（重点）
- 虚拟文件系统
- 文件系统挂载