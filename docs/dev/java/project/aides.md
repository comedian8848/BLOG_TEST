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
  application:
    name: Bear-Chat
  datasource:
    username: root
    password: "011026"
    url: jdbc:mysql://localhost:3306/aides?useUnicode=true&characterEncoding=utf-8
    driver-class-name: com.mysql.cj.jdbc.Driver
  thymeleaf:
    cache: false
  data:
    redis:
      host: localhost
      port: 6379
      password: "011026"
  mail:
    host: smtp.qq.com
    username: "northboat@qq.com"
    password: "cckrfidlqckzeabb"
    default-encoding: UTF-8


#整合mybatis
mybatis:
  type-aliases-package: com.northboat.aides.pojo
  # classpath 指 resources 目录
  mapper-locations: classpath:/mapper/*.xml

server:
  port: 8080
```

依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.amqp</groupId>
        <artifactId>spring-rabbit-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.mybatis.spring.boot</groupId>
        <artifactId>mybatis-spring-boot-starter</artifactId>
        <version>3.0.1</version>
    </dependency>



    <!--mail-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>

    <!--WebSocket-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
</dependencies>
```

报错

```bash
Unsatisfied dependency expressed through field 'userMapper'
```

检查 scan mapper 是否路径写错

```java
@MapperScan("com.northboat.aides.mapper")
```

