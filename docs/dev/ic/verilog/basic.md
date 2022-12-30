---
title: Verilog 基础
date: 2022-12-29
---

> Integrated Circuit, IC：集成电路，芯片

## 环境搭配

### Vivado 安装

[Downloads (xilinx.com)](https://www.xilinx.com/support/download.html)

官网下载安装包，需要登陆注册 AMD 账号（密码要求大小写、特殊字符以及数字）

这里老师强烈推荐版本 2019.2，不知为何，下载安装包后双击安装包运行

一路 continue / next，途中需要输入一次 AMD 账号，选择产品时勾选 VIVADO，Devices 默认即可，安装路径可自定义

总共大小二十多 GB，约需下载安装两个多小时

### Vivado 使用

新建项目或打开项目（.xpr 文件）

新建文件

- 设计代码
- 测试代码

仿真：将需要仿真的测试代码 set as top 后 Run Simulation

仿真设置：设置仿真时间和 log_all_signals

停止仿真：右键 Run Simulation 或叉掉正上方 Simulation 的提示框停止仿真

## 电路设计

### 组合逻辑电路设计

### 时序逻辑电路设计
