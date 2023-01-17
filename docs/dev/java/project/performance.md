---
title: 基于 SpringBoot 的成绩分析系统
date: 2021-11-15
tags:
  - Web
  - Java
categories:
  - WebApp
---

> 基于bootstrap、thymeleaf、springboot的成绩管理系统

功能：登录注销，班级成绩基础信息展示，分科目的成绩排名展示，CRUD单个学生信息，分科目的排名文件生成，界面美观实用

## 登录实现

登录主体

~~~java
package com.PerformanceAnalysisSystem.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Teacher {
    String account;
    String password;
}
~~~

### Dao

~~~java
package com.PerformanceAnalysisSystem.dao;

import com.PerformanceAnalysisSystem.pojo.Teacher;
import java.util.HashMap;
import java.util.Map;

public class TeacherDao {
    private static Map<String, Teacher> teachers = null;

    static{
        teachers = new HashMap<>();
        teachers.put("NorthBoat", new Teacher("NorthBoat", "011026"));
        teachers.put("hahaha", new Teacher("hahaha", "123456"));
        teachers.put("sad", new Teacher("sad", "123456"));
    }

    public static Map getTeachers(){
        return teachers;
    }
}
~~~

### Controller

登录和注销，session的设置和删除

~~~java
@RequestMapping("/login")
public String login(@RequestParam("username") String username,
                    @RequestParam("password") String pwd,
                    Model model, HttpSession session){

    Map<String, Teacher> teachers = TeacherDao.getTeachers();
    //具体业务
    if(teachers.containsKey(username) && teachers.get(username).getPassword().equals(pwd)){

        StudentService studentService = new StudentService();
        //主页信息
        MainInfo mainInfo = studentService.getMainInfo();
        model.addAttribute("mainInfo", mainInfo);

        session.setAttribute("loginUser", username);
        return "main";
    }

    model.addAttribute("msg", "用户名或者密码错误");
    return "index";
}

@RequestMapping("logout")
public String logout(HttpSession session){
    session.removeAttribute("loginUser");
    return "index";
}
~~~

### 拦截器

> 在未登录情况下拒接直接通过url访问，注意放行css、js、img等资源

HandlerInterceptor

~~~java
package com.PerformanceAnalysisSystem.config;

import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginHandlerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        //登录成功之后session中有用户信息，据此判断
        Object loginUser = request.getSession().getAttribute("loginUser");
        if(loginUser == null){
            request.setAttribute("msg", "没有权限，请先登录！");
            request.getRequestDispatcher("/index.html").forward(request, response);
            return false;
        } else{
            return true;
        }
    }
}
~~~

mvc配置

~~~java
package com.PerformanceAnalysisSystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


//用mvc扩展实现页面展示
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //登录页
        registry.addViewController("/").setViewName("index");
        registry.addViewController("/index.html").setViewName("index");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginHandlerInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/index.html", "/", "/login",
                                    "/css/**", "/fonts/**", "/img/**",
                                    "/js/**", "/lib/**");
    }
}
~~~

### 前端

图方便写在一个html中，jquery和md5并未用上，省略了 css 文件，主要考虑交互问题

- 通过 th:text 的形式传出后端值
- 在 form 中通过 th:action 调用函数，同时将 form 里的参数传入后端
- `th:href="@{/save/all}`也可以调用函数，通常一个按钮调用，无需传参

~~~html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" th:href="@{css/login.css}">
    <script th:src="@{js/jquery-3.6.0.min.js}"></script>
    <script th:src="@{js/md5.js}"></script>
</head>

<body>

<div id="login_box">

    <h2>LOGIN</h2>
    <form th:action="@{/login}" method="post">

        <!--如果msg值不为空为，才显示错误-->
        <p style="color: white" th:text="${msg}" th:if="${not #strings.isEmpty(msg)}"></p>

        <div id="input_box">
            <input type="text" placeholder="请输入用户名" required="required" id="id" name="username">
        </div>
        <br>
        <div class="input_box">
            <input type="password" placeholder="请输入密码" required="required" id="pwd" name="password">
        </div>
        <button type="submit">登录</button>
    </form>

</div>


</body>
</html>
~~~

## 主要功能实现

主要就是调用dao取出学生数据，service处理，再展示到前端

### 主页实现

> 查

显示主体：Student

~~~java
package com.PerformanceAnalysisSystem.pojo;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Student {
    private Integer id;
    private String name;
    private Integer gender; //0为女，1为男
    private Grades grade;
    private Ranks rank;

    public boolean failed(){
        if(grade.getAllSum() < 630){
            return true;
        }
        if(grade.getChinese() < 90 || grade.getMath() < 90 || grade.getEnglish() < 90 ||
           grade.getPhysics() < 60 || grade.getChemistry() < 60 || grade.getBiology() < 60 ||
           grade.getPolitics() < 60 || grade.getHistory() < 60 || grade.getGeography() < 60){
            return true;
        }
        return false;
    }

    public Student(Integer id, String name, Integer gender, Grades grade) {
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.grade = grade;
    }
}
~~~

Grades，注意构造函数

~~~java
package com.PerformanceAnalysisSystem.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grades {

    private Integer chinese;
    private Integer math;
    private Integer english;
    private Integer physics;
    private Integer chemistry;
    private Integer biology;
    private Integer politics;
    private Integer history;
    private Integer geography;
    private Integer mainSum;
    private Integer scienceSum;
    private Integer liberalSum;
    private Integer allSum;

    private Integer scienceMainSum;
    private Integer liberalMainSum;

    public Grades(Integer chinese, Integer math, Integer english, Integer physics, Integer chemistry,
                  Integer biology, Integer politics, Integer history, Integer geography) {
        this.chinese = chinese;
        this.math = math;
        this.english = english;
        this.physics = physics;
        this.chemistry = chemistry;
        this.biology = biology;
        this.politics = politics;
        this.history = history;
        this.geography = geography;
        mainSum = chinese + english + math;
        scienceSum = physics + chemistry + biology;
        liberalSum = politics + history + geography;
        scienceMainSum = mainSum + scienceSum;
        liberalMainSum = mainSum + liberalSum;
        allSum = chinese + math + english + physics + chemistry + biology + politics + history + geography;
    }
}
~~~

Ranks，储存排名信息，默认为空

~~~java
package com.PerformanceAnalysisSystem.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ranks {
    private Integer chi;
    private Integer math;
    private Integer en;
    private Integer phy;
    private Integer chem;
    private Integer bio;
    private Integer pol;
    private Integer his;
    private Integer geo;
    private Integer main;
    private Integer liberal;
    private Integer science;
    private Integer mainLib;
    private Integer mainSci;

    private Integer all;
}
~~~

MainInfo，主页信息

~~~java
package com.PerformanceAnalysisSystem.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MainInfo {
    Integer join_num;
    //平均分
    Double average;
    Integer failed_num;
    //及格率
    Double not_failed_percent;
    //最高分
    Integer top_grade;
    //三科最高分
    Integer top_main_grade;
    //理综最高分
    Integer top_science_grade;
    //文综最高分
    Integer top_liberal_grade;
    //优秀人数
    Integer good_num;
    //优秀率
    Double good_percent;
}
~~~

SubjectInfo，各科基本信息，方便实现总览页面

~~~java
package com.PerformanceAnalysisSystem.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectInfo {

    String subject;
    Integer level1;
    Integer level2;
    Integer level3;
    Integer level4;
    Integer level5;
    Integer topNum;
    Integer baseNum;
    Integer sum;
    Double average;

    public SubjectInfo(String subject) {
        this.subject = subject;
        level1 = 0;
        level2 = 0;
        level3 = 0;
        level4 = 0;
        level5 = 0;
        topNum = 0;
        baseNum = 150;
        sum = 0;
        average = 0.0;
    }

    public void updateInfo(Student stu){
        int grade = -1;
        if(subject.equals("语文"))    grade = stu.getGrade().getChinese();
        if(subject.equals("数学"))    grade = stu.getGrade().getMath();
        if(subject.equals("英语"))    grade = stu.getGrade().getEnglish();
        if(subject.equals("物理"))    grade = stu.getGrade().getPhysics();
        if(subject.equals("化学"))    grade = stu.getGrade().getChemistry();
        if(subject.equals("生物"))    grade = stu.getGrade().getBiology();
        if(subject.equals("政治"))    grade = stu.getGrade().getPolitics();
        if(subject.equals("历史"))    grade = stu.getGrade().getHistory();
        if(subject.equals("地理"))    grade = stu.getGrade().getGeography();

        if(grade < 60){
            this.level1++;
        } else if(grade < 70){
            this.level2++;
        } else if(grade < 80){
            this.level3++;
        } else if(grade < 90){
            this.level4++;
        } else{
            this.level5++;
        }
        if(grade > this.topNum){
            this.topNum = grade;
        }
        if(grade < this.baseNum){
            this.baseNum = grade;
        }
        this.sum += grade;
        //保留两位小数
        average = Double.valueOf(String.format("%.1f", sum/(level1+level2+level3+level4+level5+0.0)));
    }
}
~~~

TopInfo，与SubjectInfo一样，为了储存总览页面信息

~~~java
package com.PerformanceAnalysisSystem.pojo;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TopInfo {

    private String chinese_topStu_name;
    private String math_topStu_name;
    private String english_topStu_name;
    private String physics_topStu_name;
    private String chemistry_topStu_name;
    private String biology_topStu_name;
    private String politics_topStu_name;
    private String history_topStu_name;
    private String geography_topStu_name;

}
~~~

#### Dao

StudentDao，操作学生数据

~~~java
package com.PerformanceAnalysisSystem.dao;
import com.PerformanceAnalysisSystem.pojo.*;
import java.util.*;



public class StudentDao {

    //模拟数据库
    private static Map<Integer, Student> students = null;

    static{
        students = new HashMap<>();
        students.put(1, new Student(1,"球吊",1, new Grades(136,148,136,100,100,96,98,97,92)));
        students.put(2, new Student(2,"郭郭",1, new Grades(107,115,129,93,81,73,72,78,70)));
        students.put(3, new Student(3,"戴某",1, new Grades(112,112,132,103,87,80,88,82,66)));
        students.put(4, new Student(4,"熊熊",1, new Grades(112,112,136,104,83,79,60,66,59)));
        students.put(5, new Student(5,"强哥",1, new Grades(112,112,121,105,85,81,60,60,72)));
        students.put(6, new Student(6,"涂涂",1, new Grades(101,118,132,83,86,76,77,77,77)));
        students.put(7, new Student(7,"陶末",1, new Grades(118,114,137,88,86,82,85,90,89)));
        students.put(8, new Student(8,"彭奇",1, new Grades(98,118,119,84,74,72,80,80,80)));
        students.put(9, new Student(9,"兴根",1, new Grades(108,113,120,76,77,69,83,87,90)));
    }

    //ID作为主键自增
    private static Integer initId = 10;
    //增加学生，当stu.id为空时，将initId自动赋值
    public static void add(Student stu){
        if(stu.getId() == null) {
            stu.setId(initId++);
        }
        if(students.containsKey(stu.getId())){
            update(stu.getId(), stu.getGrade());
            return;
        }
        students.put(stu.getId(), stu);
    }

    public static Map<Integer, Student> getStudentMap(){
        return students;
    }

    //获取全部学生信息
    public static Collection<Student> getStudents(){
        return students.values();
    }

    //通过id获取单个学生
    public static Student getStudentById(Integer id){
        return students.get(id);
    }

    //通过name获取单个学生
    public static Collection<Student> getStudentsByName(String name){
        Collection<Student> student = new ArrayList<>();
        for(Student stu: students.values()){
            if(stu.getName().equals(name)) {
                student.add(stu);
            }
        }
        return student;
    }

    //删除学生
    public static void delete(Integer id){
        students.remove(id);
    }

    //修改学生信息
    public static void update(Integer id, Grades grades){
        Student stu = students.get(id);
        Student student = new Student(id, stu.getName(), stu.getGender(), grades);
        students.put(id, student);
    }
}
~~~

#### Service

StudentService，集合了所有的业务需求

~~~java
package com.PerformanceAnalysisSystem.service;

        import com.PerformanceAnalysisSystem.dao.StudentDao;
        import com.PerformanceAnalysisSystem.pojo.*;
        import com.PerformanceAnalysisSystem.utils.SortUtils;
        import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;

        import java.util.ArrayList;
        import java.util.List;


public class StudentService {

    private List<Student> students = null;

    public StudentService(){
        students = new ArrayList<>(StudentDao.getStudents());
    }

    //获取总览页面各科基本信息
    public List<SubjectInfo> getSubjectsInfo(){
        List<SubjectInfo> subjectInfos = new ArrayList<>();

        SubjectInfo chinese = new SubjectInfo("语文");
        SubjectInfo math = new SubjectInfo("数学");
        SubjectInfo english = new SubjectInfo("英语");
        SubjectInfo physics = new SubjectInfo("物理");
        SubjectInfo chemistry = new SubjectInfo("化学");
        SubjectInfo biology = new SubjectInfo("生物");
        SubjectInfo politics = new SubjectInfo("政治");
        SubjectInfo history = new SubjectInfo("历史");
        SubjectInfo geography = new SubjectInfo("地理");

        for(Student stu: students){
            chinese.updateInfo(stu);
            math.updateInfo(stu);
            english.updateInfo(stu);
            physics.updateInfo(stu);
            chemistry.updateInfo(stu);
            biology.updateInfo(stu);
            politics.updateInfo(stu);
            history.updateInfo(stu);
            geography.updateInfo(stu);
        }

        subjectInfos.add(chinese);
        subjectInfos.add(math);
        subjectInfos.add(english);
        subjectInfos.add(physics);
        subjectInfos.add(chemistry);
        subjectInfos.add(biology);
        subjectInfos.add(politics);
        subjectInfos.add(history);
        subjectInfos.add(geography);

        return subjectInfos;
    }

    //获取主页信息
    public MainInfo getMainInfo(){
        int join_num = students.size();
        int sum = 0;
        int failed_num = 0;
        int not_failed_num = 0;
        int top_grade = 0;
        int top_main_grade = 0;
        int top_science_grade = 0;
        int top_liberal_grade = 0;
        int good_num = 0;


        for(Student stu: students){
            if(stu.failed()){
                failed_num++;
            } else{
                not_failed_num++;
            }
            sum += stu.getGrade().getAllSum();
            if(stu.getGrade().getAllSum() > top_grade){
                top_grade = stu.getGrade().getAllSum();
                if(stu.getGrade().getAllSum() >= 840){
                    good_num++;
                }
            }
            if(stu.getGrade().getMainSum() > top_main_grade){
                top_main_grade = stu.getGrade().getMainSum();
            }
            if(stu.getGrade().getScienceSum() > top_science_grade){
                top_science_grade = stu.getGrade().getScienceSum();
            }
            if(stu.getGrade().getLiberalSum() > top_liberal_grade){
                top_liberal_grade = stu.getGrade().getLiberalSum();
            }
        }

        //保留三位小数
        double average = Double.parseDouble(String.format("%.3f", (double)sum/join_num));
        double good_percent = Double.parseDouble(String.format("%.3f", (double)good_num/join_num));
        double not_failed_percent = Double.parseDouble(String.format("%.3f", (double)not_failed_num/join_num));



        return new MainInfo(join_num, average, failed_num, not_failed_percent,
                top_grade, top_main_grade, top_science_grade,
                top_liberal_grade, good_num, good_percent);
    }

    //获取当前各科第一名
    public TopInfo getTopInfo(){
        int[] tops = new int[9];
        String[] names = new String[9];
        for(Student s: students){
            if(s.getGrade().getChinese() > tops[0]){
                tops[0] = s.getGrade().getChinese();
                names[0] = s.getName();
            }
            if(s.getGrade().getMath() > tops[1]){
                tops[1] = s.getGrade().getMath();
                names[1] = s.getName();
            }
            if(s.getGrade().getEnglish() > tops[2]){
                tops[2] = s.getGrade().getEnglish();
                names[2] = s.getName();
            }
            if(s.getGrade().getPhysics() > tops[3]){
                tops[3] = s.getGrade().getPhysics();
                names[3] = s.getName();
            }
            if(s.getGrade().getChemistry() > tops[4]){
                tops[4] = s.getGrade().getChemistry();
                names[4] = s.getName();
            }
            if(s.getGrade().getBiology() > tops[5]){
                tops[5] = s.getGrade().getBiology();
                names[5] = s.getName();
            }
            if(s.getGrade().getPolitics() > tops[6]){
                tops[6] = s.getGrade().getPolitics();
                names[6] = s.getName();
            }
            if(s.getGrade().getHistory() > tops[7]){
                tops[7] = s.getGrade().getHistory();
                names[7] = s.getName();
            }
            if(s.getGrade().getGeography() > tops[8]){
                tops[8] = s.getGrade().getGeography();
                names[8] = s.getName();
            }
        }


        return new TopInfo(names[0], names[1], names[2], names[3],
                names[4], names[5], names[6], names[7], names[8]);
    }

    //获取"当前顺序"下所有学生信息
    public List<Student> getStudents(){
        return students;
    }

    //获取尖子生（总分前九）信息，根据总分排序
    public List<Student> getTopStudent(){
        SortUtils.sortStuBySum(students, 0, students.size()-1);
        List<Student> topStu = new ArrayList<>();
        int count = 0;
        for(Student stu: students){
            topStu.add(stu);
            count++;
            if(count == 9){
                break;
            }
        }
        return topStu;
    }

    //获取三科排名
    public List<Student> getStudentsSortedByMainSubjects(){
        SortUtils.sortStuByMainSum(students);
        return students;
    }

    //获取理科排名
    public List<Student> getStudentsSortedByScienceSubjects(){
        SortUtils.sortStuByScienceMain(students);
        return students;
    }

    //获取文科排名
    public List<Student> getStudentSortedByLiberalSubjects(){
        SortUtils.sortStuByLiberalMain(students, 0, students.size()-1);
        return students;
    }

    //获取理综排名
    public List<Student> getStudentSortedByScience(){
        SortUtils.sortStuByScience(students);
        return students;
    }

    //获取文综排名
    public List<Student> getStudentSortedByLiberal(){
        SortUtils.sortStuByLiberal(students);
        return students;
    }

    //获取单科排名
    public List<Student> getStudentSortedBySingleSubject(String subject){
        SortUtils.sortStuBySingleSubject(students, 0, students.size()-1, subject);
        return students;
    }

    //获取排名信息
    private int[] getRanks(Student stu){
        int[] ranks = new int[15];
        for(int i = 0; i < 15; i++){
            ranks[i] = 1;
        }
        for(Student s: students){
            if(s.getGrade().getChinese() > stu.getGrade().getChinese()){
                ranks[0]++;
            }
            if(s.getGrade().getMath() > stu.getGrade().getMath()){
                ranks[1]++;
            }
            if(s.getGrade().getEnglish() > stu.getGrade().getEnglish()){
                ranks[2]++;
            }
            if(s.getGrade().getPhysics() > stu.getGrade().getPhysics()){
                ranks[3]++;
            }
            if(s.getGrade().getChemistry() > stu.getGrade().getChemistry()){
                ranks[4]++;
            }
            if(s.getGrade().getBiology() > stu.getGrade().getBiology()){
                ranks[5]++;
            }
            if(s.getGrade().getPolitics() > stu.getGrade().getPolitics()){
                ranks[6]++;
            }
            if(s.getGrade().getHistory() > stu.getGrade().getHistory()){
                ranks[7]++;
            }
            if(s.getGrade().getGeography() > stu.getGrade().getGeography()){
                ranks[8]++;
            }
            if(s.getGrade().getMainSum() > stu.getGrade().getMainSum()){
                ranks[9]++;
            }
            if(s.getGrade().getLiberalSum() > stu.getGrade().getLiberalSum()){
                ranks[10]++;
            }
            if(s.getGrade().getScienceSum() > stu.getGrade().getScienceSum()){
                ranks[11]++;
            }
            if(s.getGrade().getLiberalMainSum() > stu.getGrade().getLiberalMainSum()){
                ranks[12]++;
            }
            if(s.getGrade().getScienceMainSum() > stu.getGrade().getScienceMainSum()){
                ranks[13]++;
            }
            if(s.getGrade().getAllSum() > stu.getGrade().getAllSum()){
                ranks[14]++;
            }
        }

        return ranks;
    }
    //设置学生排名
    public void setRanks(Student stu){
        int[] ranks = getRanks(stu);
        Ranks rank = new Ranks(ranks[0], ranks[1], ranks[2], ranks[3], ranks[4], ranks[5], ranks[6], ranks[7], ranks[8],
                ranks[9], ranks[10], ranks[11], ranks[12], ranks[13], ranks[14]);
        stu.setRank(rank);
    }
}
~~~

#### Utils

SortUtils，各种排序

~~~java
package com.PerformanceAnalysisSystem.utils;

import com.PerformanceAnalysisSystem.dao.StudentDao;
import com.PerformanceAnalysisSystem.pojo.Student;

import java.util.ArrayList;
import java.util.List;

public class SortUtils {

    //交换两学生在表中位置
    public static void swap(List<Student> students, int i, int j){
        Student temp = students.get(i);
        students.set(i, students.get(j));
        students.set(j, temp);
    }

    //按照总分从大往小排序：快排
    public static void sortStuBySum(List<Student> students, int left, int right){
        if(left >= right){
            return;
        }
        int mid = (left+right)/2;
        int cur = students.get(mid).getGrade().getAllSum();
        swap(students, mid, right);
        int position = left;
        for(int i = left; i < right; i++){
            if(students.get(i).getGrade().getAllSum() >= cur){
                swap(students, position, i);
                position++;
            }
        }
        swap(students, position, right);
        sortStuBySum(students, left, position-1);
        sortStuBySum(students, position+1, right);
    }

    //按照三科总分排序：二分插入
    public static void sortStuByMainSum(List<Student> students){
        int n = students.size();
        for(int i = 1; i < n; i++){
            //初始左边界和右边界，记录当前元素
            int left = 0, right = i-1;
            Student cur = students.get(i);
            while(right>=left){
                //记录中间元素
                int mid = (right+left)/2;
                //当中间元素大于当前元素，将右边界记为中间-1
                if(students.get(mid).getGrade().getMainSum() <= cur.getGrade().getMainSum()){
                    right = mid-1;;
                }else{ //当中间元素小于等于当前元素，将左边界记为中间+1
                    left = mid+1;
                }
            }
            //此时left>right，已然满足条件left右侧全小于等于cur，左侧全大于cur
            //将left右侧元素向右移一位，给cur腾出位置用于插入
            for(int j = i; j > left; j--){
                students.set(j, students.get(j-1));
            }
            //将第i位元素插入left位，实现一次插入
            students.set(left, cur);
        }
    }

    //按照理科排序：堆排序
    public static void sortStuByScienceMain(List<Student> students){
        int n = students.size() - 1;
        //构造小顶堆，一定要从后往前构造
        //这样在树中为从下层向上层构造，逐步将大根上移，防止漏移
        for (int i = n / 2; i >= 0; i--) {
            heapAdjust(students, i, n);
        }

        //将最小元素移到最后，再对前i-1个元素进行调整，构造新的小顶堆
        for(int i = n; i > 0; i--){
            swap(students, 0, i);
            heapAdjust(students, 0, i-1);
        }
    }
    //调整小顶堆
    public static void heapAdjust(List<Student> students, int parent, int length){
        int child = parent*2+1;
        while(child <= length){

            if(child+1 <= length &&
               students.get(child).getGrade().getScienceMainSum() >
               students.get(child+1).getGrade().getScienceMainSum()){
                child++;
            }

            if(students.get(parent).getGrade().getScienceMainSum() <
               students.get(child).getGrade().getScienceMainSum()){
                break;
            }
            swap(students, parent, child);
            parent = child;
            child = parent*2+1;
        }
    }


    //按照文科排序：归并排序
    private static List<Student> temp = new ArrayList<>(StudentDao.getStudents());
    public static void sortStuByLiberalMain(List<Student> students, int left, int right){
        if(left >= right){
            return;
        }
        int mid = (left+right)/2;
        sortStuByLiberalMain(students, left, mid);
        sortStuByLiberalMain(students, mid+1, right);
        int i = left, j = mid+1, count = 0;
        while(i <= mid && j <= right){
            if(students.get(i).getGrade().getLiberalMainSum() >
               students.get(j).getGrade().getLiberalMainSum()){
                temp.set(count++, students.get(i++));
            } else{
                temp.set(count++, students.get(j++));
            }
        }
        while(i <= mid){
            temp.set(count++, students.get(i++));
        }
        while(j <= right){
            temp.set(count++, students.get(j++));
        }
        for(int k = 0; k <= right-left; k++){
            students.set(k+left, temp.get(k));
        }
    }


    //按照理综排序：选择
    public static void sortStuByScience(List<Student> students){
        int n = students.size();
        for(int i = 0; i < n; i++){
            int maxIndex = i;
            for(int j = i+1; j < n; j++){
                if(students.get(j).getGrade().getScienceSum() >
                   students.get(maxIndex).getGrade().getScienceSum()){
                    maxIndex = j;
                }
            }
            swap(students, i, maxIndex);
        }
    }

    //按照文综排序：冒泡
    public static void sortStuByLiberal(List<Student> students){
        int n = students.size();
        for(int i = 0; i < n; i++){
            for(int j = i+1; j < n; j++){
                if(students.get(j).getGrade().getLiberalSum() > students.get(i).getGrade().getLiberalSum()){
                    swap(students, i, j);
                }
            }
        }
    }

    //按照单科排序：快排
    //根据String获取单科成绩
    public static int getGrade(int index, String subject, List<Student> students){
        if(subject.equals("chi")){ return students.get(index).getGrade().getChinese(); }
        if(subject.equals("math")){ return students.get(index).getGrade().getMath(); }
        if(subject.equals("en")){ return students.get(index).getGrade().getEnglish(); }
        if(subject.equals("phy")){ return students.get(index).getGrade().getPhysics(); }
        if(subject.equals("chem")){ return students.get(index).getGrade().getChemistry(); }
        if(subject.equals("bio")){ return students.get(index).getGrade().getBiology(); }
        if(subject.equals("pol")){ return students.get(index).getGrade().getPolitics(); }
        if(subject.equals("his")){ return students.get(index).getGrade().getHistory(); }
        if(subject.equals("geo")){ return students.get(index).getGrade().getGeography(); }
        return -1;
    }
    public static void sortStuBySingleSubject(List<Student> students, int left, int right, String subject){
        if(left >= right){
            return;
        }
        int mid = (left+right)/2;
        int cur = getGrade(mid, subject, students);

        swap(students, mid, right);
        int position = left;
        for(int i = left; i < right; i++){
            int grade = getGrade(i, subject, students);
            if(grade >= cur){
                swap(students, position, i);
                position++;
            }
        }
        swap(students, position, right);
        sortStuBySingleSubject(students, left, position-1, subject);
        sortStuBySingleSubject(students, position+1, right, subject);
    }
}
~~~

#### Controller

~~~java
@RequestMapping("/main")
public String main(Model model, HttpSession session){

    //生成文件反馈消息
    String message = (String)session.getAttribute("message");
    //System.out.println(message);
    if(message != null){
        model.addAttribute("message", message);
        session.removeAttribute("message");
    }
    StudentService studentService = new StudentService();
    //主页信息
    MainInfo mainInfo = studentService.getMainInfo();
    model.addAttribute("mainInfo", mainInfo);
    return "main";
}
~~~

剩余功能其实和主页大同小异

### 搜索实现

函数写在StudentDao中，根据name搜索时遍历是为了避免重名情况

~~~java
//通过id获取单个学生
public static Student getStudentById(Integer id){
    return students.get(id);
}

//通过name获取单个学生
public static Collection<Student> getStudentsByName(String name){
    Collection<Student> student = new ArrayList<>();
    for(Student stu: students.values()){
        if(stu.getName().equals(name)) {
            student.add(stu);
        }
    }
    return student;
}
~~~

controller

~~~java
//搜索功能：根据id或name进行搜索，用Character.isDigit判断搜索内容
@RequestMapping("/search")
public String search(@RequestParam("searchContent") String content,
                     Model model){

    boolean flag = false;
    for(char c: content.toCharArray()){
        if(!Character.isDigit(c)){
            flag = true;
            break;
        }
    }
    if(flag){
        Collection<Student> students = StudentDao.getStudentsByName(content);
        if(students.size() == 0){
            model.addAttribute("msg", "查无此人");
            return "display/404";
        }
        StudentService studentService = new StudentService();
        for(Student stu: students){
            studentService.setRanks(stu);
        }
        model.addAttribute("students", students);
        return "display/search";
    } else{
        List<Student> students = new ArrayList<>();
        Student student = StudentDao.getStudentById(Integer.valueOf(content));
        if(student == null){
            //System.out.println("nmsl");
            model.addAttribute("msg", "查无此人");
            return "display/404";
        }
        StudentService studentService = new StudentService();
        studentService.setRanks(student);
        students.add(student);
        model.addAttribute("students", students);
        return "display/search";
    }
}
~~~

将导航栏提取到公共页面commons.html，通过thymeleaf插入或置换 th:replace/th:insert，实践证明这样会降低效率

~~~html
<!-- 导航框 -->
<nav class="navbar navbar-expand navbar-light navbar-bg" th:fragment="topbar">
    <a class="sidebar-toggle d-flex">
        <i class="hamburger align-self-center"></i>
    </a>

    <!--搜索框-->
    <form style="width: 500px;" class="d-none d-sm-inline-block" th:action="@{/search}" method="get">
        <div class="input-group input-group-navbar">
            <input type="text" name="searchContent" class="form-control" placeholder="Search Student By Id/Name..." aria-label="Search">
            <button class="btn" type="submit">
                <i class="align-middle" data-feather="search"></i>
            </button>
        </div>
    </form>
    <div style="width: 400px; text-align: center; height: 40px; line-height: 40px;">
        <p th:text="${message}" th:if="${not #strings.isEmpty(message)}"></p>
    </div>


    <!--生成文件和退出登录-->
    <div class="navbar-collapse collapse">
        <ul class="navbar-nav navbar-align">
            <li>
                <div class="position-relative" style="margin-right: 7px;">
                    <!--生成文件按钮-->
                    <a th:href="@{/save/all}">
                        <button type="submit" class="btn btn-primary">生成文件</button>
                    </a>
                </div>
            </li>

            <li>
                <div class="position-relative">
                    <a th:href="@{/logout}">
                        <button type="submit" class="btn btn-primary">注销账号</button>
                    </a>
                </div>
            </li>
        </ul>

    </div>
</nav>
~~~

设置：th:fragment

~~~html
<nav class="navbar navbar-expand navbar-light navbar-bg" th:fragment="topbar"></nav>
~~~

插入：th:replace/th:insert

~~~html
<div th:replace="~{commons/commons::topbar}"></div>
<div th:insert="~{commons/commons::topbar}"></div>
~~~

commons.html

~~~html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">


<link th:href="@{css/app.css}" rel="stylesheet">


<!-- 导航框 -->
<nav class="navbar navbar-expand navbar-light navbar-bg" th:fragment="topbar">
    <a class="sidebar-toggle d-flex">
        <i class="hamburger align-self-center"></i>
    </a>

    <form style="width: 500px;" class="d-none d-sm-inline-block" th:action="@{/search}" method="get">
        <div class="input-group input-group-navbar">
            <input type="text" name="searchContent" class="form-control" placeholder="Search Student By Id/Name..." aria-label="Search">
            <button class="btn" type="submit">
                <i class="align-middle" data-feather="search"></i>
            </button>
        </div>
    </form>
    <div style="width: 400px; text-align: center; height: 40px; line-height: 40px;">
        <p th:text="${message}" th:if="${not #strings.isEmpty(message)}"></p>
    </div>


    <!--生成文件和退出登录-->
    <div class="navbar-collapse collapse">
        <ul class="navbar-nav navbar-align">
            <li>
                <div class="position-relative" style="margin-right: 7px;">
                    <!--生成文件按钮-->
                    <a th:href="@{/save/all}">
                        <button type="submit" class="btn btn-primary">生成文件</button>
                    </a>
                </div>
            </li>

            <li>
                <div class="position-relative">
                    <a th:href="@{/logout}">
                        <button type="submit" class="btn btn-primary">注销账号</button>
                    </a>
                </div>
            </li>
        </ul>

    </div>
</nav>

<!-- 侧边栏 -->
<nav id="sidebar" class="sidebar" th:fragment="sidebar">
    <div class="sidebar-content js-simplebar">
        <a class="sidebar-brand" th:href="@{/main}">
            <!--从session中获取用户昵称-->
            <span class="align-middle">[[${session.loginUser}]]</span>
        </a>

        <ul class="sidebar-nav">
            <li class="sidebar-header">
                综合分析
            </li>
            <li th:class="${active=='main.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/main}">
                    <i class="align-middle" data-feather="sliders"></i>
                    <span class="align-middle">概况</span>
                </a>
            </li>

            <li th:class="${active=='allSubjects.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/allSubjects}">
                    <i class="align-middle" data-feather="user"></i>
                    <span class="align-middle">总览</span>
                </a>
            </li>

            <li th:class="${active=='scienceSubjects.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/scienceSubjects}">
                    <i class="align-middle" data-feather="settings"></i>
                    <span class="align-middle">理科</span>
                </a>
            </li>

            <li th:class="${active=='liberalSubjects.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/liberalSubjects}">
                    <i class="align-middle" data-feather="credit-card"></i>
                    <span class="align-middle">文科</span>
                </a>
            </li>

            <li th:class="${active=='mainSubjects.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/mainSubjects}">
                    <i class="align-middle" data-feather="book"></i>
                    <span class="align-middle">三科</span>
                </a>
            </li>

            <li th:class="${active=='science.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/science}">
                    <i class="align-middle" data-feather="map"></i>
                    <span class="align-middle">理综</span>
                </a>
            </li>

            <li th:class="${active=='liberal.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/liberal}">
                    <i class="align-middle" data-feather="coffee"></i>
                    <span class="align-middle">文综</span>
                </a>
            </li>

            <li class="sidebar-header">
                单科分析
            </li>
            <li th:class="${not #strings.isEmpty(subject)?'sidebar-item active':'sidebar-item'}">
                <a data-target="#ui" data-toggle="collapse" class="sidebar-link collapsed">
                    <i class="align-middle" data-feather="briefcase"></i>
                    <span class="align-middle">选择科目</span>
                    <span class="align-middle" th:text="'：'+${subject}" th:if="${not #strings.isEmpty(subject)}"></span>
                </a>

                <ul id="ui" class="sidebar-dropdown list-unstyled collapse" data-parent="#sidebar">

                    <li th:class="${subject=='语文'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/chinese}">语文</a>
                    </li>

                    <li th:class="${subject=='数学'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/math}">数学</a>
                    </li>

                    <li th:class="${subject=='英语'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/english}">英语</a>
                    </li>

                    <li th:class="${subject=='物理'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/physics}">物理</a>
                    </li>

                    <li th:class="${subject=='化学'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/chemistry}">化学</a>
                    </li>

                    <li th:class="${subject=='生物'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/biology}">生物</a>
                    </li>

                    <li th:class="${subject=='政治'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/politics}">政治</a>
                    </li>

                    <li th:class="${subject=='历史'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/history}">历史</a>
                    </li>

                    <li th:class="${subject=='地理'?'sidebar-item active':'sidebar-item'}">
                        <a class="sidebar-link" th:href="@{/geography}">地理</a>
                    </li>
                </ul>
            </li>


            <li class="sidebar-header">
                信息管理
            </li>

            <li th:class="${active=='form.html'?'sidebar-item active':'sidebar-item'}">
                <a class="sidebar-link" th:href="@{/form}">
                    <i class="align-middle" data-feather="bar-chart-2"></i>
                    <span class="align-middle">录入&合并信息</span>
                </a>
            </li>
        </ul>
    </div>
</nav>

<!--页脚-->
<footer class="footer" th:fragment="footer">
    <div class="container-fluid">
        <div class="row text-muted">
            <div class="col-6 text-left">
                <p class="mb-0">
                    <strong>I'll be Glad if you like it ———— NorthBoat's Performance Analysis System</strong> &copy;
                    <strong>好好睡觉，天天摸鱼</strong>
                </p>
            </div>
            <div class="col-6 text-right">
                <ul class="list-inline">
                    <li class="list-inline-item">
                        <a class="text-muted" href="https://northboat.github.io/Blog/programing/java/">Support</a>
                    </li>
                    <li class="list-inline-item">
                        <a class="text-muted" href="https://northboat.github.io/Blog/guide/">Guide</a>
                    </li>
                    <li class="list-inline-item">
                        <a class="text-muted" href="https://northboat.github.io/Blog/my_project/">More</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</footer>


<script th:src="@{js/app.js}"></script>
</html>
~~~

### 增删改

Update

~~~java
//修改学生信息
public static void update(Integer id, Grades grades){
    Student stu = students.get(id);
    Student student = new Student(id, stu.getName(), stu.getGender(), grades);
    students.put(id, student);
}
~~~

controller

首先在展示页面通过url路径获取该学生id，在/update/{path}/{id}的服务中拿取该学生，存到session，跳转到/update（html页面），真正的修改页面

再在修改页面中设置修改按钮，提交到/updateInfo，在这先从session拿到当前学生，，从update.html拿到新的成绩数据，更新后存入Map，删除session

~~~java
//修改功能
//获取信息，跳转
@GetMapping("/update/{path}/{id}")
public String update(@PathVariable("id") Integer id,
                     @PathVariable("path") String path,
                     HttpSession session){

    session.setAttribute("id", id);
    session.setAttribute("student", StudentDao.getStudentById(id));
    session.setAttribute("path", path);
    //System.out.println(student);
    //System.out.println(request);
    return "redirect:/update";
}

//获取学生信息
@RequestMapping("/updateInfo")
public String update(HttpSession session, @RequestParam("chi") String chi,
                     @RequestParam("math") String math, @RequestParam("en") String en,
                     @RequestParam("phy") String phy, @RequestParam("chem") String chem,
                     @RequestParam("bio") String bio, @RequestParam("pol") String pol,
                     @RequestParam("his") String his, @RequestParam("geo") String geo){

    String path = (String)session.getAttribute("path");
    int id = (Integer)session.getAttribute("id");

    StudentDao.update(id, new Grades(Integer.valueOf(chi), Integer.valueOf(math), Integer.valueOf(en),
                                     Integer.valueOf(phy), Integer.valueOf(chem), Integer.valueOf(bio), Integer.valueOf(pol),
                                     Integer.valueOf(his), Integer.valueOf(geo)));

    System.out.println("已修改：" + StudentDao.getStudentById(id));

    session.removeAttribute("id");
    session.removeAttribute("path");
    return "redirect:/" + path;
}
~~~

- 删除和修改同理

录入学生信息

controller，通过model传递msg到前端页面给予用户反馈

~~~java
//添加功能，添加成功后仍停留在form页面，提示用户添加成功
@RequestMapping("/add")
public String add(@RequestParam("id") String id, @RequestParam("name") String name,
                  @RequestParam("gender") String gender, @RequestParam("chi") String chi,
                  @RequestParam("math") String math, @RequestParam("en") String en,
                  @RequestParam("phy") String phy, @RequestParam("chem") String chem,
                  @RequestParam("bio") String bio, @RequestParam("pol") String pol,
                  @RequestParam("his") String his, @RequestParam("geo") String geo, Model model){

    if(name.equals("") || gender.equals("") || chi.equals("") || math.equals("") || en.equals("") ||
       phy.equals("") || chem.equals("") || bio.equals("") || pol.equals("") || his.equals("") || geo.equals("")) {

        model.addAttribute("msg", "请按照格式填写信息");
        return "manage/form";
    }

    if(!id.equals("")){
        for(char c: id.toCharArray()){
            if(!Character.isDigit(c)){
                model.addAttribute("msg", "请按照格式填写学号");
                return "manage/form";
            }
        }
    }

    Integer ID = null;
    if(!id.equals("")){
        ID = Integer.parseInt(id);
    }
    try{
        StudentDao.add(new Student(ID, name, Integer.valueOf(gender),
                                   new Grades(Integer.valueOf(chi), Integer.valueOf(math), Integer.valueOf(en),
                                              Integer.valueOf(phy), Integer.valueOf(chem), Integer.valueOf(bio),
                                              Integer.valueOf(pol), Integer.valueOf(his), Integer.valueOf(geo))));
        System.out.println("已添加：" + StudentDao.getStudentById(ID));
    }catch (NumberFormatException e){
        model.addAttribute("msg", "请按照格式填写信息");
        return "manage/form";
    }
    model.addAttribute("msg", "录入成功!");
    return "manage/form";
}

~~~

dao

~~~java
//ID作为主键自增
private static Integer initId = 10;
//增加学生，当stu.id为空时，将initId自动赋值
public static void add(Student stu){
    if(stu.getId() == null) {
        stu.setId(initId++);
    }
    if(students.containsKey(stu.getId())){
        update(stu.getId(), stu.getGrade());
        return;
    }
    students.put(stu.getId(), stu);
}
~~~

### 生成文件

utils，简单的io流

~~~java
package com.PerformanceAnalysisSystem.utils;

import com.PerformanceAnalysisSystem.pojo.Student;
import com.PerformanceAnalysisSystem.service.StudentService;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;

public class IOUtils {

    private static BufferedWriter bufferedWriter;
    private static BufferedReader bufferedReader;

    //根据理科排名写文件
    public static void write(String subject) throws IOException {
        bufferedWriter = new BufferedWriter(new FileWriter("D:\\" + subject + ".txt"));
        List<Student> studentList = new StudentService().getStudents();
        if(subject.equals("all")){
            SortUtils.sortStuBySum(studentList, 0, studentList.size()-1);
        } else if(subject.equals("sciMain")){
            SortUtils.sortStuByScienceMain(studentList);
        } else if(subject.equals("libMain")){
            SortUtils.sortStuByLiberalMain(studentList, 0, studentList.size()-1);
        } else if(subject.equals("main")) {
            SortUtils.sortStuByMainSum(studentList);
        } else if(subject.equals("sci")){
            SortUtils.sortStuByScience(studentList);
        } else if(subject.equals("lib")){
            SortUtils.sortStuByLiberal(studentList);
        } else{
            SortUtils.sortStuBySingleSubject(studentList, 0, studentList.size()-1, subject);
        }

        for(Student stu: studentList) {
            bufferedWriter.write("学号:" + stu.getId() + "\t姓名:" + stu.getName() + "\t性别:" + stu.getGender()
                    + "\n单科成绩: " + "语:" + stu.getGrade().getChinese() + "\t数:" + stu.getGrade().getMath()
                    + "\t英:" + stu.getGrade().getEnglish() + "\t物:" + stu.getGrade().getPhysics()
                    + "\t化:" + stu.getGrade().getChemistry() + "\t生:" + stu.getGrade().getBiology()
                    + "\t政:" + stu.getGrade().getPolitics() + "\t史:" + stu.getGrade().getHistory()
                    + "\t地:" + stu.getGrade().getGeography() + "\n综合成绩: 文综:" + stu.getGrade().getLiberalSum()
                    + "\t理综:" + stu.getGrade().getScienceSum() + "\t文科:" + stu.getGrade().getLiberalMainSum()
                    + "\t理科:" + stu.getGrade().getScienceMainSum() + "\t总分:" + stu.getGrade().getAllSum() +
                    "\r\n\n");
        }
        bufferedWriter.flush();
        bufferedWriter.close();
    }


    public static void merge(MultipartFile file) throws Exception{
        bufferedReader = new BufferedReader((Reader) file);
        String str = bufferedReader.readLine();
        System.out.println(str);
    }
}
~~~

controller

~~~java
//生成文件
@GetMapping("/save/{subject}")
public String save(@PathVariable("subject")String subject,
                   HttpSession session){
    try{
        IOUtils.write(subject);
        session.setAttribute("message", "生成文件成功，路径为D:\\" + subject + ".txt");
    }catch (IOException e){
        session.setAttribute("message", "生成文件失败");
    }
    return "redirect:/main";
}
~~~

前端接口

~~~html
<!--生成文件和退出登录-->
<div class="navbar-collapse collapse">
    <ul class="navbar-nav navbar-align">
        <li>
            <div class="position-relative" style="margin-right: 7px;">
                <!--生成文件按钮-->
                <a th:href="@{/save/all}">
                    <button type="submit" class="btn btn-primary">生成文件</button>
                </a>
            </div>
        </li>

        <li>
            <div class="position-relative">
                <a th:href="@{/logout}">
                    <button type="submit" class="btn btn-primary">注销账号</button>
                </a>
            </div>
        </li>
    </ul>

</div>
~~~

## 一些细节和排错

1、高亮显示

thymeleaf用括号传参和判断语句实现高亮显示

传参

~~~
<div th:replace="~{commons/commons::sidebar(active='main.html')}"></div>
~~~

判断

~~~html
<li th:class="${active=='main.html'?'sidebar-item active':'sidebar-item'}">
~~~

2、IncreaseNumber

用于排名展示，当num==list.size()时调用rebootNum函数重置，重复使用num

~~~java
package com.PerformanceAnalysisSystem.utils;

public class IncreaseNumber {
    static int num = 1;

    public int getNum(){
        return num;
    }

    public int getIncreaseNum(){
        return num++;
    }

    public int rebootNum(){
        int temp = num;
        num = 1;
        return temp;
    }
}
~~~

3、展示页面跳转

跳转页面分两步进行

~~~java
@RequestMapping("/mainSubjects")
public String mainSubjects(Model model){
    StudentService studentService = new StudentService();
    Collection<Student> students = studentService.getStudentsSortedByMainSubjects();
    IncreaseNumber num = new IncreaseNumber();
    model.addAttribute("num", num);
    model.addAttribute("students", students);
    return "display/mainSubjects";
}

@RequestMapping("/scienceSubjects")
public String scienceSubjects(Model model){
    StudentService studentService = new StudentService();
    Collection<Student> students = studentService.getStudentsSortedByScienceSubjects();
    IncreaseNumber num = new IncreaseNumber();
    model.addAttribute("num", num);
    model.addAttribute("students", students);
    return "display/scienceSubjects";
}
~~~

4、排错

500错误：通过@ResponseBod检查跳转，再检查html的命名空间和src、href路径

415错误：试图传输文件到后端报错媒体文件不符错误，尚未解决