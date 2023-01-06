---
title: 基于 RabbitMQ 的私人电脑助手
date: 2022-2-24
tags:
  - Web
  - Java
categories:
  - WebApp
---

## 前期准备

环境搭建

```bash
yay -S rabbitmq rabbitmqadmin
```

springboot 配置

```yaml
spring:
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: northboat
    password: 011026
```

```xml
<!--RabbitMQ-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
```

