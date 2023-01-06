---
title: 基于 Servlet/JSP 的小贴吧
date: 2021-6-15
tags:
  - Web
  - Java
categories:
  - WebApp
---

<img src="./assets/tomcat.png">

## 数据库

### DBCP

数据库连接池

~~~java
package DBUtils;

import com.mchange.v2.c3p0.ComboPooledDataSource;

public class DBCP {

    static public ComboPooledDataSource users = new ComboPooledDataSource("users");

    static public ComboPooledDataSource searchers = new ComboPooledDataSource("ques&ans");
}
~~~

### DBUtilsForQuesAndRes

问题查询

~~~java
package DBUtils;


import java.sql.*;
import java.util.*;

public class DBUtilsForQuesAndRes {

    private Connection con = null;

    public HashMap<String, List<String>> getAns(String ques) throws SQLException {
        //获取一个连接
        con = DBCP.searchers.getConnection();
        HashMap<String, List<String>> res = new HashMap<>();
        //一个连接对应一条语句！如果中途执行第二条语句，第一条语句的set将被销毁
        Statement sql1 = con.createStatement();
        Statement sql2 = con.createStatement();
        String SQL = "select * from questions where question like '%" + ques + "%'";
        ResultSet question = sql1.executeQuery(SQL);
        while(question.next()){
            String num = question.getString("num");
            String q = question.getString("question");
            res.put(num+". "+q, new ArrayList<String>());
            SQL = "select * from answers where num = " + num;
            ResultSet ans = sql2.executeQuery(SQL);
            while(ans.next()){
                res.get(num+". "+q).add((ans.getString("answer")));
            }
        }
        if(res.keySet().size() == 0){
            con.close();
            return null;
        }
        con.close();
        return res;
    }

    public List<String> getPointedAns(String num) throws SQLException{
        //获取一个连接
        con = DBCP.searchers.getConnection();
        Statement sql = con.createStatement();
        String SQL = "select * from answers where num = '" + num + "'";
        ResultSet ans = sql.executeQuery(SQL);
        List<String> res = new ArrayList<>();
        while(ans.next()){
            res.add(ans.getString("answer"));
        }
        con.close();
        return res;
    }

    public boolean releaseQues(String ques, String type) throws SQLException{
        //获取一个连接
        con = DBCP.searchers.getConnection();
        //获取问题序号
        //设置连接属性：可滚动，可修改数据库
        Statement sql = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_UPDATABLE);
        String SQL = "select * from questions";
        ResultSet question = sql.executeQuery(SQL);
        question.last();
        int num = Integer.parseInt(question.getString("num")) + 1;
        //向后插入数据
        String record = "('" + num + "', '" + ques + "', " + "'" + "', '" + type + "')";
        SQL = "insert into questions values " + record;
        int ok = sql.executeUpdate(SQL);
        if(ok == 0){
            con.close();
            return false;
        }
        con.close();
        return true;
    }

    public boolean releaseAns(String num, String ans) throws SQLException{
        con = DBCP.searchers.getConnection();
        Statement sql = con.createStatement();
        String record = "('" + num + "', '" + ans + "', '', '', '')";
        String SQL = "insert into answers values" + record;
        int ok = sql.executeUpdate(SQL);
        if(ok == 0){
            con.close();
            return false;
        }
        con.close();
        return true;
    }

    public List<String> getQues(String type) throws SQLException{
        con = DBCP.searchers.getConnection();
        List<String> questions = new ArrayList<>();
        Statement sql = con.createStatement();
        String SQL = "select * from questions where type = '" + type +"'";
        ResultSet set = sql.executeQuery(SQL);
        while(set.next()){
            questions.add(set.getString("num") + ". " + set.getString("question"));
        }
        con.close();
        return questions;
    }
}
~~~

### DBUtilsForUser

学生登录等；管理员登陆与此同理

~~~java
package DBUtils;

import Controller.Account;
import Controller.Student;
import Controller.Teacher;


import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;


/**
 * 要注意注册、登录、修改密码的顺序，连接在各个函数中均有关闭命令（遇挫则关闭）
 */
public class DBUtilsForUser {

    private Connection con = null;


    //判断账号（account）是否存在，存在则返回数据库连接，不存在则返回null
    protected Connection isExist(String nums) throws SQLException {
        con = DBCP.users.getConnection();
        Statement sql = con.createStatement();
        String SQL = "select * from account where num = '" + nums + "'";
        ResultSet set = sql.executeQuery(SQL);
        if(!set.next()){
            con.close();
            return null;
        }
        return con;
    }


    /**登录验证
    * 若账号不存在，返回null，输出账号不存在
    * 若账号存在但未注册，返回null，输出尚未注册
    * 若账号已注册但密码错误，返回null，输出密码错误
    * 登录成功，返回账户信息
     */
    public ResultSet verify(Account a) throws SQLException{
        Connection con = isExist(a.getNums());
        if(con == null){
            System.out.println("账户不存在");
            return null;
        }
        Statement sql = con.createStatement();
        String SQL = "select * from " + a.getTable() + " where nums = '" + a.getNums() + "'";
        ResultSet set = sql.executeQuery(SQL);
        if(!set.next()){
            System.out.println("该账户未注册，请先注册");
            con.close();
            return null;
        }
        String p = set.getString("password");
        //比较字符串用equals()方法
        if(!a.getPassword().equals(p))
        {
            con.close();
            System.out.println("密码错误");
            return null;
        }
        return set;
    }


    /**学生用户注册
    * 账号不存在，返回false，输出账号不存在
    * 账号存在但已注册，返回false，输出账号已注册
    * 账号存在且未注册，录入学生信息，未报错，返回true
    * 账号、密码、名字为必填项
     */
    public boolean registerForStudent(Student stu) throws SQLException{
        Connection con = isExist(stu.getAccount().getNums());
        if(con == null){
            System.out.println("账号不存在");
            return false;
        }
        Statement sql = con.createStatement();
        String SQL = "select * from student where nums = " + stu.getAccount().getNums();
        ResultSet set = sql.executeQuery(SQL);
        if(set.next()){
            System.out.println("账号已被注册");
            con.close();
            return false;
        }

        //获取用户名字
        SQL = "select * from account where num = " + stu.getAccount().getNums();
        ResultSet getName = sql.executeQuery(SQL);
        getName.next();
        String name = getName.getString("name");

        //在数据库中注册信息
        String record = "('" + stu.getAccount().getNums() + "', '" + stu.getAccount().getPassword() + "', '"
                + name + "', '" + stu.getMajor() + "', '" + stu.getGrade() + "', '" +  stu.getGender() + "')";
        SQL = "insert into student values " + record;
        int ok = sql.executeUpdate(SQL);
        if(ok == 0){
            System.out.println("注册失败，请重试");
            con.close();
            return false;
        }
        System.out.println("注册成功,请登录");
        con.close();
        return true;
    }


    /**老师用户注册
    * 账号不存在，返回false，输出账号不存在
    * 账号存在但已注册，返回false，输出账号已注册
    * 账号存在且未注册，录入学生信息，未报错，返回true
    * 账号、密码、名字为必填项
     */
    public boolean registerForTeacher(Teacher tea) throws SQLException{
        Connection con = isExist(tea.getAccount().getNums());
        if(con == null){
            System.out.println("账号不存在");
            return false;
        }
        Statement sql = con.createStatement();
        String SQL = "select * from student where nums = " + tea.getAccount().getNums();
        ResultSet set = sql.executeQuery(SQL);
        if(set.next()){
            System.out.println("账号已被注册");
            con.close();
            return false;
        }

        //获取用户名字
        SQL = "select * from account where num = " + tea.getAccount().getNums();
        ResultSet getName = sql.executeQuery(SQL);
        getName.next();

        String name = getName.getString("name");
        String record = "('" + tea.getAccount().getNums() + "', '" + tea.getAccount().getPassword() + "', '"
                + name + "', '" + tea.getMajor() + "', '" + tea.getGender() + "', '" +  tea.getPosition() + "')";
        SQL = "insert into teacher values " + record;
        int ok = sql.executeUpdate(SQL);
        if(ok == 0){
            System.out.println("注册失败，请重试");
            con.close();
            return false;
        }
        System.out.println("注册成功,请登录");
        con.close();
        return true;
    }


    /**修改密码
     * 从表中拿到账号对应密码，与输入旧密码对比
     * 若匹配，修改旧密码为新密码，返回true；反之返回false
     */
    public boolean modifyPassword(String table, String nums, String oldPassword, String newPassword) throws  SQLException{
        Connection con = isExist(nums);
        if(con==null){
            System.out.println("账号错误");
            return false;
        }
        Statement sql = con.createStatement();
        String SQL = "select * from " + table + " where nums = " + nums;
        ResultSet set = sql.executeQuery(SQL);
        set.next();
        String realPassword = set.getString("password");
        if(!oldPassword.equals(realPassword)){
            System.out.println("旧密码错误");
            con.close();
            return false;
        }
        SQL = "update " + table + " set password = '" + newPassword + "'where nums = '" + nums + "'";
        int ok = sql.executeUpdate(SQL);
        if(ok == 0){
            System.out.println("更新数据失败，请重试");
            con.close();
            return false;
        }
        System.out.println("修改密码成功");
        con.close();
        return true;
    }

    public void exit(){
        try{
            con.close();
        }catch (SQLException e){
            e.printStackTrace();
        }
    }
}
~~~

## 控制层

> Controller

#### Account

帐号管理；Admin 与此同理

~~~java
package Controller;

public class Account{
    private String table;
    private String nums;
    private String password;

    public Account(String table, String nums, String password) {
        this.table = table;
        this.nums = nums;
        this.password = password;
    }

    public Account(String table) {
        this.table = table;
    }

    public String getTable() {
        return table;
    }

    public String getNums() {
        return nums;
    }

    public void setNums(String nums) {
        this.nums = nums;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
~~~

#### Info

信息返回

~~~java
package Controller;

public class Info {
    private String nums;
    private String gender;
    private String major;

    public Info(String nums, String major, String gender) {
        this.nums = nums;
        this.gender = gender;
        this.major = major;
    }

    public String getNums() {
        return nums;
    }

    public String getMajor() {
        return major;
    }

    public String getGender() {
        return gender;
    }

    @Override
    public String toString() {
        return getNums()+"\t"+getMajor()+"\t"+getGender();
    }
}
~~~

#### Releaser

~~~java
package Controller;

import DBUtils.DBUtilsForQuesAndRes;

import java.sql.SQLException;


public class Releaser {

    private DBUtilsForQuesAndRes jdbc;

    public Releaser(){
        jdbc = new DBUtilsForQuesAndRes();
    }

    public boolean releaseQues(String ques, String type) throws SQLException{
        return jdbc.releaseQues(ques, type);
    }

    public boolean releaseAns(String num, String ans) throws SQLException{
        return jdbc.releaseAns(num, ans);
    }
}
~~~

#### Searcher

~~~java
package Controller;

import DBUtils.DBUtilsForQuesAndRes;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;

public class Searcher {

    private DBUtilsForQuesAndRes jdbc;

    public Searcher() throws SQLException{
        jdbc = new DBUtilsForQuesAndRes();
    }

    public HashMap<String, List<String>> getAns(String question) throws SQLException {
        return jdbc.getAns(question);
    }

    public List<String> getQues(String type) throws SQLException{
        return jdbc.getQues(type);
    }

    public List<String> getPointedAns(String num) throws SQLException{
        return jdbc.getPointedAns(num);
    }
}
~~~

#### Student

学生信息控制

~~~java
package Controller;

import DBUtils.DBUtilsForUser;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Student{
    private Account account;
    private String name;
    private String major;
    private String grade;
    private String gender;
    private DBUtilsForUser jdbc = new DBUtilsForUser();

    public Student(Account a){
        account = a;
    }

    public Student(Account account, String name, String major, String grade, String gender) {
        this.account = account;
        this.name = name;
        this.major = major;
        this.grade = grade;
        this.gender = gender;
    }

    public Account getAccount() { return account; };

    public String getName() {
        return name;
    }

    public String getMajor() {
        return major;
    }

    public String getGrade() {
        return grade;
    }

    public String getGender() {
        return gender;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public ResultSet login() throws SQLException{
        return jdbc.verify(this.account);
    }

    public boolean register() throws SQLException{
        return jdbc.registerForStudent(this);
    }

    public boolean change(String newPassword) throws SQLException{
        return jdbc.modifyPassword("student", this.account.getNums(), this.account.getPassword(), newPassword);
    }

    public void exit(){
        jdbc.exit();
    }
}
~~~

## 前后端交互

### Servlet

一些例子，主要就是前后端数据交互，没啥其他讲的

#### ChangePassword

~~~java
package Servlet;

import Controller.Account;
import Controller.Student;
import Controller.Teacher;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

public class ChangePassword extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("utf-8");
        String table = req.getParameter("table");
        String nums = req.getParameter("username");
        String password = req.getParameter("password");
        String newPassword = req.getParameter("newPassword");
        boolean resetSuccessfully = false;
        Account acc = new Account(table, nums, password);
        if(table.equals("student")){
            try{
                Student stu = new Student(acc);
                resetSuccessfully = stu.change(newPassword);
            }catch (SQLException e){
                e.printStackTrace();
            }
        }
        else if(table.equals("teacher")){
            try{
                Teacher tea = new Teacher(acc);
                resetSuccessfully = tea.change(newPassword);
            }catch (SQLException e){
                e.printStackTrace();
            }
        }
        if(resetSuccessfully){
            resp.sendRedirect("/NEUQHelper/hello/Login.jsp");
        }else{
            resp.sendRedirect("/NEUQHelper/hello/ChangePassword.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
~~~

#### Distribute

~~~java
package Servlet;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class Distribute extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        req.setCharacterEncoding("utf-8");
        String modular = req.getParameter("option");
        //用cookie判断用户是否登录，若未登录，返回登录界面
        String isLogin = null;
        Cookie[] cookies = req.getCookies();
        for(Cookie c: cookies){
            if(c.getName().equals("isLogin")){
                isLogin = c.getValue();
            }
        }
        //判断是否登录，排除直接通过url进入的用户
        if(modular == null || isLogin.equals("no") || isLogin == null){
            System.out.println("请先登录");
            resp.sendRedirect("/NEUQHelper/hello/Login.jsp");
        }
        else{
            if(modular.equals("<h2>校内外美食推荐</h2>")){
                req.getSession().setAttribute("type", "Eating");
            }
            else if(modular.equals("<h2>对缺德地图说NO</h2>")){
                req.getSession().setAttribute("type", "Outing");
            }
            else if(modular.equals("<h2>就是玩儿</h2>")){
                req.getSession().setAttribute("type", "Entertainment");
            }
            else if(modular.equals("<h2>住寝、修电脑...</h2>")){
                req.getSession().setAttribute("type", "DailyLife");
            }
            else if(modular.equals("<h2>图书馆、实验室...</h2>")){
                req.getSession().setAttribute("type", "Study");
            }
            else if(modular.equals("<h2>社团活动、体育赛事...</h2>")){
                req.getSession().setAttribute("type", "Sports");
            }
            resp.sendRedirect("/NEUQHelper/hello/ShowQuesInfo.jsp");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
~~~

#### SetAcc

~~~java
package Servlet;

import Controller.Admin;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

public class SetAcc extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        //用cookie判断用户是否登录，若未登录，返回登录界面
        String isLogin = null;
        Cookie[] cookies = req.getCookies();
        for(Cookie c: cookies){
            if(c.getName().equals("isLogin")){
                isLogin = c.getValue();
            }
        }
        if(isLogin.equals("no") || isLogin==null){
            resp.sendRedirect("/NEUQHelper/hello/Login.jsp");
        }
        else{
            boolean setSuccessfully = false;
            try{
                req.setCharacterEncoding("utf-8");
                resp.setCharacterEncoding("utf-8");
                String setInfo = req.getParameter("setInfo");
                if(!setInfo.equals("") && setInfo!=null && setInfo.contains(":")){
                    String nums = setInfo.substring(0, setInfo.indexOf(':'));
                    String name = setInfo.substring(nums.length()+1);
                    Admin admin = (Admin)req.getSession().getAttribute("admin");
                    setSuccessfully = admin.setAccount(nums, name);
                }
            }catch (SQLException e){
                e.printStackTrace();
                System.out.println("数据库错误");;
            }
            if(setSuccessfully){
                resp.sendRedirect("/NEUQHelper/hello/SetSuccessfully.jsp");
            }else{
                resp.sendRedirect("/NEUQHelper/hello/SetFailed.jsp");
            }
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }
}
~~~

### JSP

同样是一个数据交互问题，以及前端设计

#### index.jsp

~~~html
<!DOCTYPE html>
<html>

<body style="text-align:center" marginheight="300px">
<meta charset="UTF-8">
<title>Hello NEUQer</title>
<h1>Hello NEUQer</h1><br>
<a href="hello/Login.jsp" target="_self"><h2>Login</h2></a>
<a href="hello/Register.jsp" target="_self"><h2>Register</h2></a>
</body>

</html>
~~~

#### AdminPage

~~~html
<%@ page import="Controller.Admin" %>
<%@ page import="java.util.Iterator" %>
<%@ page import="Controller.Info" %>
<%@ page import="Controller.Student" %><%--
  Created by IntelliJ IDEA.
  User: NorthBoat
  Date: 2021/6/9
  Time: 20:10
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>AdminPage</title>

    <style>
        .div-stu{float:left;width:35%}
        .div-tea{float:right;width:35%}
    </style>
</head>
<body marginheight="100px">

<div style="text-align: center">
    <h1>欢迎进入管理员界面</h1>

    <%--搜索账号--%>
    <form action="${pageContext.request.contextPath}/hello/SearchUsr">
        <input type="text" name="usrInfo" placeholder="usrType:usrNums"><input type="submit" value="搜索用户" name="tab"><br>
    </form>

    <%--注销账号，跳转到Logout（servlet）清空session--%>
    <form action="${pageContext.request.contextPath}/hello/Logout">
        <input type="submit" value="注销管理员">
    </form>
</div>
<br>

<div style="text-align: center">
    <h3>新建账号</h3>
    <form action="${pageContext.request.contextPath}/hello/SetAcc" method="post">
        <input type="text" placeholder="nums:name" name="setInfo"><input type="submit" value="新建">
    </form>
</div>

<div class="div-stu" style="text-align: right">
    <h3><h2>学生信息</h2><br>
        <%
            Admin admin = (Admin) session.getAttribute("admin");
            request.setCharacterEncoding("utf-8");
            response.setContentType("text/html");
            response.setCharacterEncoding("utf-8");
            if(admin != null){
                Iterator<Info> stu = admin.showStuInfo();
                while(stu.hasNext()){
                    out.write(stu.next().toString());

        %>
        <%--重置按钮--%>
        <form action="${pageContext.request.contextPath}/hello/ResetAcc" method="post">
            <input type="submit" value="重置学生密码" name="tableInfo"><input type="text" name="resetInfo" placeholder="usrNums/usrName">
        </form>
        <br>

        <% }} %>
    </h3>
</div>

<div class="div-tea">
    <h3><h2>老师信息</h2><br>
        <%
            if(admin != null){
                Iterator<Info> tea = admin.showTeaInfo();
                while(tea.hasNext()){
                    out.write(tea.next().toString());
        %>
        <%--重置按钮--%>
        <form action="${pageContext.request.contextPath}/hello/ResetAcc" method="post">
            <input type="text" name="resetInfo" placeholder="usrNums/usrName"><input type="submit" value="重置老师密码" name="tableInfo">
        </form>
        <br>

        <%  }} %>
    </h3>
</div>


</body>
</html>
~~~

#### ShowUsrInfo

~~~html
<%@ page import="java.util.HashMap" %><%--
  Created by IntelliJ IDEA.
  User: NorthBoat
  Date: 2021/6/17
  Time: 0:36
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>ShowInfo</title>
</head>
<body marginheight="225px">
<div style="text-align: center">
    <h2>
        <%
            HashMap<String, String> usrInfo = (HashMap<String, String>) session.getAttribute("usr");
            if(usrInfo != null) {
                for (String key : usrInfo.keySet()) {
                    out.write(key + ":" + usrInfo.get(key) + "<br><br>");
                }
            }
        %>
    </h2>
    <%--重置按钮--%>
    <form action="${pageContext.request.contextPath}/hello/ResetAccAfterSearch" method="post">
        <input type="text" name="resetInfo" placeholder="usrName"><input type="submit" value="重置密码"><br>
    </form>
    <a href="${pageContext.request.contextPath}/hello/AdminPage.jsp">go back</a>
</div>
</body>
</html>
~~~

## 一些问题

### Java 获取时间

~~~java
long time = System.currentTimeMills();
java.util.Date date = new Date(time);
int hours = date.getHours();
~~~

### HTML

#### html设置居中

style="text-align:center"：放置在行的中央

marginherght="300px"：设置页边宽度，单位像素，放置在列的中央

~~~html
<body style="text-align:center" marginheight="300px"></body>
~~~

#### JSP获取项目路径

~~~html
<form action="${pageContext.request.contextPath}/hello/Login" method="post"></form>
~~~

#### 重定向问题

不能在一个servlet中存在两个可能都可以执行到的重定向，将报错500，即使指向同一个页面

#### 在jsp中获取ServletContextAttribute

~~~html
<%
    ServletContext sc = this.getServletConfig().getServletContext();
    String name = (String)sc.getAttribute("name");
%>

<h1 style="text-align: center">你好啊  ${name}</h1> <br>
~~~

#### 将div设置在同一行

用css将div设置为漂浮元素

~~~css
<head>
    <title>Main</title>
    <style>
        .div-a{ float:left;width:33%}
        .div-b{ float:right;width:35%}
    </style>
</head>
<body marginheight="125px">
    <div class="div-a">
        <a href="Eating.jsp"><h1 style="text-align: right">食</h1></a><br><br>
        <a href="Outing.jsp"><h1 style="text-align: right">出行</h1></a><br><br>
        <a href="Entertainment.jsp"><h1 style="text-align: right">文娱</h1></a>
    </div>

    <div class="div-b">
        <a href="Dormitory.jsp"><h1>住</h1></a><br><br>
        <a href="Study.jsp"><h1>学习</h1></a><br><br>
        <a href="Sports.jsp"><h1>体育</h1></a>
    </div>
</body>
~~~

### 数据库和容器

#### 找不到c3p0类

将c3p0的jar包打包成lib文件夹添加到webapp/WEB-INF下，并且在project structure->Module->dependencies下，将lib选中。

#### Operation not allowed after ResultSet closed

一个Connection对应一个ResultSet，也就是说，你的这一个Connection创建的Statement只能同时做一个SQL操作，在进行另一次查询时，将覆盖上一次的查询（上一次查询得到的ResultSet也将关闭）

#### 编码问题

全局设置编码

~~~java
resp.setCharacterEncoding("utf-8");
resp.setContentType("text/html");
req.setCharacterEncoding("utf-8");
~~~

设置单个字符串编码

~~~java
//将str转化为指定编码，返回一个String
URLEncoder.encode(String str, String encodeType);
~~~

#### writer换行

~~~java
out.write("<br>");
~~~

#### c3p0的xml的分号问题

~~~html
&amp;
~~~

#### 数据库中文识别为???

在连接的url后加上

~~~xml
?characterEncoding=utf8
~~~

即为

~~~xml
jdbc:mysql://39.106.160.174:3306/users?characterEncoding=utf8
~~~

#### too much connections

修改mysql最大连接数（初始默认为151）

~~~SQL
//查看最大连接数
mysql> show variables like '%max_connection%'; 
| Variable_name   | Value | 
max_connections | 151   |  
mysql> set global max_connections=1;Query OK, 0 rows affected (0.00 sec) 

//尝试连接时报错:1040:too many connections
[root@node4 ~]# mysql -uzs -p123456 -h 192.168.56.132 
ERROR 1040 (00000): Too many connections 
~~~

修改最大连接数

~~~SQL
set global max_connections=10000;
~~~

但这样调整会有很大隐患，因为我们无法确认数据库是否可以承担这么大的连接压力，就好比原来一个人只能吃一个馒头，但现在却非要让他吃 10 个，他肯定接受不了。反应到服务器上面，就有可能会出现宕(dang)机的可能。

#### 修改容器时间

**以root身份进入容器**

docker exec -it -u root 24795ac94ae7 /bin/sh

可以使用date -R 查看时间

<img src="./assets/1301684-20201217164239479-2106515367.png">

**在容器中创建文件**

mkdir -p /usr/share/zoneinfo/Asia

<img src="./assets/1301684-20201217164505021-1963467622.png">

**回到宿主机，复制宿主机里的文件到容器中**

docker cp /usr/share/zoneinfo/Asia/Shanghai 容器ID或容器名:/usr/share/zoneinfo/Asia

<img src="./assets/1301684-20201217164456178-542310198.png">

**进入容器docker exec -it -u root 容器Id或容器名 bash**

执行命令 cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

<img src="./assets/1301684-20201217164442047-1076229095.png">

**执行date -R 查看时区显示时间是否正确**

<img src="./assets/1301684-20201217164530636-733019213.png">

搞定

