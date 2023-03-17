---
title: SpringBoot
date: 2021-11-13
categories:
  - WebApp
tags:
  - Java
---

## Annotation

### Bean

> 在@Component或@Controller中注入

@Autowired

变量注入（不推荐）

~~~java
@Autowired
JdbcTemplate jdbcTemplate
~~~

构造器注入

~~~java
final UserDao userDao;

@Autowired
public UserServiceImpl(UserDao userDao) {
    this.userDao = userDao;
}
~~~

set方法注入

~~~java
//set方法注入
private JdbcTemplate jdbcTemplate;
@Autowired
public void setJdbcTemplate(JdbcTemplate jdbcTemplate){
    this.jdbcTemplate = jdbcTemplate;
}
~~~

@Bean



### Test

@SpringBootTest

@Test

`junit`测试单元

### Configuration

@Configuration

### Controller

@RestController

- == @Controller+@ResponseBody

@Controller

@RequestMapping

- @PathVariable
- @RequestParam

@GetMapping

## Thymeleaf

引入

```html
<html lang="en" xmlns:th="http://www.thymeleaf.org"></html>
```

~~~xml
<!--thymeleaf依赖  -->
<dependency>
    <groupId>org.thymeleaf</groupId>
    <artifactId>thymeleaf-spring5</artifactId>
</dependency>
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-java8time</artifactId>
</dependency>
~~~

设置不缓存，修改立即生效，否则缓存将影响测试，部署时可改回

~~~yml
spring:
  thymeleaf:
    cache: false
~~~

判断并打印

~~~html
<div th:text="${msg}"><h1>cnm</h1></div>
~~~

提取公共元素

~~~html
<div th:insert="${commons/commons.html:topbar}"></div>
<div th:replace="${commons/commons.html:topbar}"></div>
~~~

传值

~~~html
<a th:href="@{/drop/}+${p.getMail().getNum()}" class="card-more" data-toggle="read" data-id="1"><i class="ion-ios-arrow-left"></i>删除<i class="ion-ios-arrow-right"></i></a>
~~~

## SpringDate

### MySQL

application.yml 配置 mysql：密码是数字要加双引号

- Hikari 默认，更快
- druid，自带日志监控
- mysql驱动问题：其中 Drive 在 mysql8.x 版本要加上 cj

~~~yml
spring:
  application:
    name: PostOffice
  datasource:
    username: root
    password: "011026"
    url: jdbc:mysql://39.106.160.174:3306/PostOffice?serverTimezone=UTC&useUnicode=true&characterEncoding=utf-8
    driver-class-name: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
    filters: stat,wall,log4j
~~~

pom.xml

~~~xml
<!--SpringDate-->
<!--jdbc-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>
<!--MySQL-->
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <scope>runtime</scope>
</dependency>
<!--日志log4j-->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>

<!--druid德鲁伊数据源-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.21</version>
</dependency>

<!--测试-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
</dependency>
~~~

配置后台监控页面

~~~java
@Configuration
public class DruidConfig {

    @ConfigurationProperties(prefix = "spring.datasource")
    @Bean
    public DataSource druidDataSource(){
        return new DruidDataSource();
    }

    //后台监控
    //相当于web.xml
    @Bean
    public ServletRegistrationBean servlet(){
        ServletRegistrationBean bean = new ServletRegistrationBean<>(new StatViewServlet(), "/druid/*");

        Map<String, String> properties = new HashMap<>();
        properties.put("loginUsername", "admin");
        properties.put("loginPassword", "011026");

        //允许谁能访问
        properties.put("allow", "");
        //禁止谁能访问
        //properties.put("NorthBoat", "39.106.160.174");

        bean.setInitParameters(properties);
        return bean;
    }
}
~~~

log4j报错

~~~bash
log4j:WARN No appenders could be found for logger (org.apache.ibatis.logging.LogFactory).
log4j:WARN Please initialize the log4j system properly.
log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
~~~

原因：未配置log4j.properties

~~~properties
log4j.rootLogger=debug, stdout, R

log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout

# Pattern to output the caller's file name and line number.
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] (%F:%L) - %m%n

log4j.appender.R=org.apache.log4j.RollingFileAppender
log4j.appender.R.File=example.log

log4j.appender.R.MaxFileSize=100KB
# Keep one backup file
log4j.appender.R.MaxBackupIndex=5

log4j.appender.R.layout=org.apache.log4j.PatternLayout
log4j.appender.R.layout.ConversionPattern=%p %t %c - %m%n
~~~

使用原生jdbc进行CRUD

注意全局查找返回结果类型`List<Map<String, Object>>`，以及插入列名用飘号括起防止关键字造成sql语句报错

~~~java
@RestController
public class JDBCController {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @GetMapping("/list")
    public List<Map<String, Object>> list(){
        String sql = "select * from Postman";
        return jdbcTemplate.queryForList(sql);
    }
    
    @GetMapping("/add")
    public String add(){
        String sql = "insert into PostOffice.Postman(num,`count`,`name`,`to`,`subject`,`text`) values (3,0,'xzt','1543625674@qq.com','hello','hahaha')";
        jdbcTemplate.update(sql);
        return "add ok";
    }
}
~~~

### MyBatis

> MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射，并且免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作，转而通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO（Plain Old Java Objects，普通老式 Java 对象）为数据库中的记录

整合mybatis

~~~xml
<!--mybatis-->
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.1.1</version>
</dependency>
~~~

@Mapper

~~~java
//这个注解表示这是一个mybatis的mapper类
@Mapper
@Repository
public interface MailMapper {
    List<Postman> queryPostmanList();
    int removePostman(int num);
    int addPostman(Postman postman);
}
~~~

在启动类中 @MapperScan

~~~java
@SpringBootApplication
@MapperScan("com.northboat.shadow.mapper")
public class PostOfficeApplication {
    public static void main(String[] args) {
        SpringApplication.run(PostOfficeApplication.class, args);
    }
}
~~~

application.yml

~~~yml
#整合mybatis
mybatis:
  type-aliases-package: com.postoffice.vo
  mapper-locations: classpath:mybatis/mapper/*.xml
~~~

MailMapper

~~~java
//这个注解表示这是一个mybatis的mapper类
@Mapper
@Repository
public interface MailMapper {

    List<Mail> queryMailList();

    void removeMail(int num);

    void addMail(Mail mail);

    void updateMailCount(Map<String, Integer> map);
}
~~~

MailMapper.xml，位于resources/mybatis/mapper：传递多个参数用Map封装，用`#{key}`取值

~~~xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.postoffice.mapper.MailMapper">
    <select id="queryMailList" resultType="Mail">
        select * from `mail`
    </select>

    <delete id="removeMail" parameterType="int">
        delete from mail where `num` = #{num}
    </delete>

    <insert id="addMail" parameterType="Mail">
        insert into mail(`num`, `count`, `name`, `to`, `from`, `subject`, `text`) values(#{num}, #{count}, #{name}, #{to}, #{from}, #{subject}, #{text})
    </insert>

    <update id="updateMailCount" parameterType="java.util.Map">
        update `mail` set `count`=#{count} where `num`=#{num}
    </update>
</mapper>
~~~

字段映射

resultMap

~~~xml
<!-- 通用查询映射结果 -->
<resultMap id="BaseResultMap" type="com.seckill.pojo.User">
    <id column="id" property="id" />
    <result column="nickname" property="nickname" />
    <result column="password" property="password" />
    <result column="slat" property="slat" />
    <result column="head" property="head" />
    <result column="register_date" property="registerDate" />
    <result column="last_login_date" property="lastLoginDate" />
    <result column="login_count" property="loginCount" />
</resultMap>
~~~

sql id

~~~xml
<!-- 通用查询结果列 -->
<sql id="Base_Column_List">
    id, nickname, password, slat, head, register_date, last_login_date, login_count
</sql>
~~~

### Redis

引入依赖

```xml
<!-- Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

redis 配置

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: "011026"
```

编写自己的 redis template：RedisConfig.java

```java
package com.northboat.remotecontrollerserver.config;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.impl.LaissezFaireSubTypeValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.net.UnknownHostException;

@Configuration
public class RedisConfig {

    //一个固定的模板，在企业中可以直接使用，几乎包含了所有场景
    //编写我们自己的RedisTemplate
    @Bean
    @SuppressWarnings("all")
    public RedisTemplate<String, Object> myRedisTemplate(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);

        //Json序列化配置
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        //objectMapper.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        objectMapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(objectMapper);

        //String序列化配置
        StringRedisSerializer stringSerializer = new StringRedisSerializer();

        // key和Hash的key使用String序列化
        template.setKeySerializer(stringSerializer);
        template.setHashKeySerializer(stringSerializer);

        // value和Hash的value使用Jackson序列化
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.setHashValueSerializer(jackson2JsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }
}
```

RedisUtil.java

```java
package com.northboat.shadow.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;


// 待完善
@Component
@SuppressWarnings("all")
public class RedisUtil {

    private RedisTemplate myRedisTemplate;
    @Autowired
    public void setMyRedisTemplate(RedisTemplate myRedisTemplate){
        this.myRedisTemplate = myRedisTemplate;
    }


    //设置有效时间，单位秒
    public boolean expire(String key, long time){
        try{
            if(time > 0){
                myRedisTemplate.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    //获取剩余有效时间
    public long getExpire(String key){
        return myRedisTemplate.getExpire(key);
    }

    //判断键是否存在
    public boolean hasKey(String key){
        try{
            return myRedisTemplate.hasKey(key);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    //批量删除键
    public void del(String... key){
        if(key != null && key.length > 0){
            if(key.length == 1){
                myRedisTemplate.delete(key[0]);
            } else {
                myRedisTemplate.delete(CollectionUtils.arrayToList(key));
            }
        }
    }

    //获取普通值
    public Object get(String key){
        return key == null ? null : myRedisTemplate.opsForValue().get(key);
    }

    //放入普通值
    public boolean set(String key, Object val){
        try{
            myRedisTemplate.opsForValue().set(key, val);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    //放入普通缓存并设置时间
    public boolean set(String key, Object val, long time){
        try{
            if(time > 0){
                myRedisTemplate.opsForValue().set(key, val, time, TimeUnit.SECONDS);
            } else { // 若时间小于零直接调用普通设置的方法放入
                this.set(key, val);
            }
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }


    //值增
    public long incr(String key, long delta){
        if(delta < 0){
            throw new RuntimeException("递增因子必须大于零");
        }
        return myRedisTemplate.opsForValue().increment(key, delta);
    }




    //============Map=============

    // 获取key表中itme对应的值
    public Object hget(String key, String item){
        return myRedisTemplate.opsForHash().get(key, item);
    }

    // 获取整个Hash表
    public Map hmget(String key){
        return myRedisTemplate.opsForHash().entries(key);
    }

    // 简单设置一个Hash
    public boolean hmset(String key, Map<String, Object> map){
        try{
            myRedisTemplate.opsForHash().putAll(key, map);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    // 设置一个Hash，并设置生效时间，调用上面的设置key生效时间的方法
    public boolean hmset(String key, Map<String, Object> map, long time){
        try{
            myRedisTemplate.opsForHash().putAll(key, map);
            if(time > 0){
                this.expire(key, time);
            }
            return true;
        }catch (Exception e){
            return false;
        }
    }


    // 像一张Hash表中添加键值，若表不存在将创建
    public boolean hset(String key, String item, Object val){
        try{
            myRedisTemplate.opsForHash().put(key, item, val);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    //=================List==============
    public boolean lpush(String key, Object val){
        try{
            myRedisTemplate.opsForList().leftPush(key, val);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    public boolean rpush(String key, Object val){
        try{
            myRedisTemplate.opsForList().rightPush(key, val);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }


    public List lget(String key){
        try{
            Long length = myRedisTemplate.opsForList().size(key);
            List list = myRedisTemplate.opsForList().range(key, 0, length);
            return list;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    public boolean lldel(String key, String val){
        try{
            myRedisTemplate.opsForList().remove(key, 1, val);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    // 弹出list第一个元素
    public Object lpop(String key){
        try{
            return key == null ? null : myRedisTemplate.opsForList().leftPop(key);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    // 弹出list最后一个元素
    public Object rpop(String key){
        try{
            return key == null ? null : myRedisTemplate.opsForList().rightPop(key);
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    // 删除list所有元素
    public boolean ldel(String key){
        try{
            myRedisTemplate.opsForList().trim(key, 1, 0);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    // 从list最右边开始检索val
    public boolean lrget(String key, String val){
        try{
            myRedisTemplate.opsForList().remove(key, -1, val);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

    //=================Set=================
    // 添加
    public boolean sadd(String key, String val){
        try{
            myRedisTemplate.opsForSet().add(key, val);
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    // 删除
    public boolean srem(String key, String val){
        try{
            myRedisTemplate.opsForSet().remove(key, val);
            return true;
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    // 判存
    public boolean sexist(String key, String val){
        try{
            return myRedisTemplate.opsForSet().isMember(key, val);
        } catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
    // 返回集合
    public Set sget(String key){
        try{
            return myRedisTemplate.opsForSet().members(key);
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
```

## Middleware

### Mail

邮件发送

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

### WebSocket

sockets 通信

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
```

### RabbitMQ

消息队列

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-amqp</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.amqp</groupId>
    <artifactId>spring-rabbit-test</artifactId>
    <scope>test</scope>
</dependency>
```

