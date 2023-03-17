---
title: Python 简单开发
date: 2023-2-21
tags:
  - Python
  - Dev
---

> [服务端](https://northboat.netlify.app/dev/java/project/aides.html)

## 命令行

### I/O 流处理

只读

```python
with open(path+"shadow.conf", 'r') as f:
    for line in f.readlines():
        info = line.strip().split(":")
        tag = info[0].strip()
        content = info[1].strip()
        if(tag == "name"):
            name = content
        elif tag == "email":
            email = content
        elif tag == "password":
            pwd = content
```

重写

```python
def write_conf(self, name, email, pwd):
    with open(path+"shadow.conf", 'w') as f:
        f.write("name: " + name + "\n")
        f.write("email: " + email + "\n")
        f.write("password: " + pwd + "\n")
```

追加

```python
def log(content):
    with open(path+"shadow.log", 'a') as f:
        f.write(content)
```

### 直接执行并返回结果

执行命令并获得返回结果，有失败返回

```python
import subprocess

def subprocess_popen(statement):
    p = subprocess.Popen(statement, shell=True, stdout=subprocess.PIPE)
    while p.poll() is None:
        if p.wait() != 0:
            return "命令执行失败"
        else:
            re = p.stdout.readlines()
            result = ''
            for i in range(len(re)):
                line = re[i].decode('utf-8').strip(' ')
                result += line
            return result

print(subprocess_popen("s"))
```

### 阻塞的连续执行

这里的 stdout 和 stderr 都是阻塞的，开启两条线程去专门读这个阻塞内容，在主线程中写入命令

```python
import subprocess

p = subprocess.Popen("/bin/bash", shell=True, stdin=subprocess.PIPE, stderr=subprocess.PIPE, stdout=subprocess.PIPE)
def stdout():
    global p
    while True:
        setback(p.stdout.readline().decode('utf8').strip() + " ")

def stderr():
    global p
    while True:
        setback(p.stderr.readline().decode('utf8').strip() + " ")

cmd_back = ""

def setback(str):
    global cmd_back
    global back_finished
    cmd_back += str

def getback():
    global cmd_back
    global back_finished
    result = cmd_back
    cmd_back = ""
    return result.strip()

import threading
out = threading.Thread(target=stdout)
out.daemon = True
err = threading.Thread(target=stderr)
err.daemon = True
out.start()
err.start()

import os
import time
# 执行命令行
def cmd(statement):
    global p   
    global back_finished
    statement += os.linesep
    p.stdin.write(statement.encode('utf8'))
    p.stdin.flush()
    time.sleep(1)
    return getback()
```

## 中间件

### RabbitMQ & Redis

> 通过 rabbitmq 和 redis 实现消息接收和回送

安装

```bash
pip install pika
pip install redis
```

实现代码

```python
import pika
import redis
# import os
import subprocess
import requests
import urllib

# redis 连接池
pool = redis.ConnectionPool(host='localhost', port=6379, decode_responses=True, max_connections=4)   # host是redis主机，需要redis服务端和客户端都起着 redis默认端口是6379

# 准备必要数据
path = "./shadow/"
name = ""
email = ""
pwd = ""
with open(path+"shadow.conf", 'r') as f:
    for line in f.readlines():
        info = line.strip().split(":")
        tag = info[0].strip()
        content = info[1].strip()
        if(tag == "name"):
            name = content
        elif tag == "email":
            email = content
        elif tag == "password":
            pwd = content
            
def redis_format(str):
    return '\"' + str + '\"'


# 通过 redis 共享内存回送消息
def send_back(msg):
    # 从池子中拿一个链接
    conn = redis.Redis(connection_pool=pool, decode_responses=True)
    conn.set(name, msg);
    conn.close()

    
# 连接 rabbitmq 开始监听，处理函数为 exec
def shadow():
    # 用于判断是否已登录，防止用户手动键入 login 命令引发错误
    #login = False

    # 统一消息处理函数，执行完成才说明接收完成，此时才可以接收下一条，串行
    def exec(v1, v2, v3, bodyx):
        #global login
        # 将从消息队列接收的字符串格式化
        command = str(bodyx,'utf-8')
        print("收到询问: " + command)
        # 处理命令并获取结果
        if command[0] == '/':
            if command[1:]  == "cache":
                # print("进来了")
                result = get_history()
            elif command[1:].split(" ")[0] == "login":
                result = login(command[1:].split(" ")[1].strip())
            else:
                result = subprocess_popen(command[1:])
        else:
            result = chat(command)
    
        print("处理结果: ", result)
        # 返回结果
        send_back(redis_format(result))
        # 记录缓存
        cache(command, result)

    # mq建立连接
    userx = pika.PlainCredentials("guest","guest")
    conn = pika.BlockingConnection(pika.ConnectionParameters("127.0.0.0",5672,'/',credentials=userx))
    # 开辟管道
    channelx = conn.channel()
    #声明队列，参数为队列名
    channelx.queue_declare(queue = name)


    # 初始化消息队列
    channelx.basic_consume(queue = name, #队列名
                        on_message_callback = exec, #收到消息的回调函数
                        auto_ack = True #是否发送消息确认
                        )

    print("-------- 开始接收数据 -----------")
    # 开始接收消息
    log("\n" + str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")) + "\n")
    channelx.start_consuming()
```

### MySQL

安装

```bash
pip install pymysql
```

基本使用

```python
import pymysql

conn = pymysql.connect(host = '127.0.0.1' # 连接名称，默认127.0.0.1
            ,user = 'root' # 用户名
            ,passwd='011026' # 密码
            ,port= 3306 # 端口，默认为3306
            ,db='aides' # 数据库名称
            ,charset='utf8' # 字符编码
        )
cur = conn.cursor() # 生成游标对象
sql = "select * from `user` where `name`= " + '\'' + name + '\'' # SQL语句
#print(sql)
cur.execute(sql) # 执行SQL语句
data = cur.fetchall() # 通过fetchall方法获得数据
cur.close()
conn.close()
```

## PyQt5

安装

```bash
pip install PyQt5
```

### 窗口 UI 设计

```python
from PyQt5 import QtCore, QtGui, QtWidgets

path = "./shadow/"
def read_conf():
    with open(path+"shadow.conf", 'r') as f:
        for line in f.readlines():
            info = line.strip().split(":")
            tag = info[0].strip()
            content = info[1].strip()
            if(tag == "name"):
                name = content
            elif tag == "email":
                email = content
            elif tag == "password":
                pwd = content
        return [name, email, pwd]


class Ui_Dialog_Main(object):
    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(400, 300)

        self.appBox = QtWidgets.QGroupBox(Dialog)
        self.appBox.setGeometry(QtCore.QRect(5, 7, 391, 241))
        self.appBox.setObjectName("appBox")
        self.appLabel = QtWidgets.QLabel(self.appBox)
        self.appLabel.setGeometry(QtCore.QRect(117, 12, 200, 44))
        self.appLabel.setObjectName("appLabel")

        self.textEdit = QtWidgets.QTextEdit(self.appBox)
        self.textEdit.setGeometry(QtCore.QRect(40, 61, 311, 151))
        self.textEdit.setObjectName("textEdit")

        self.askBtn = QtWidgets.QPushButton(Dialog)
        self.askBtn.setGeometry(QtCore.QRect(60, 257, 75, 23))
        self.askBtn.setMaximumSize(QtCore.QSize(75, 16777215))
        self.askBtn.setObjectName("ask")

        self.closeBtn = QtWidgets.QPushButton(Dialog)
        self.closeBtn.setGeometry(QtCore.QRect(270, 257, 75, 23))
        self.closeBtn.setMaximumSize(QtCore.QSize(75, 16777215))
        self.closeBtn.setObjectName("close")

        self.retranslateUi(Dialog)
        self.closeBtn.clicked.connect(Dialog.close)
        self.askBtn.clicked.connect(Dialog.ask)
        QtCore.QMetaObject.connectSlotsByName(Dialog)
    
    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Dialog", "Shadow"))
        self.appLabel.setText(_translate("Dialog", "Your Shadow is Running"))
        self.closeBtn.setText(_translate("Dialog", "退出"))
        self.askBtn.setText(_translate("Dialog", "询问"))



class Ui_Dialog_Login(object):
    def setupUi(self, Dialog):
        Dialog.setObjectName("Dialog")
        Dialog.resize(400, 300)

        self.appBox = QtWidgets.QGroupBox(Dialog)
        self.appBox.setGeometry(QtCore.QRect(5, 7, 391, 241))
        self.appBox.setObjectName("appBox")
        self.appLabel = QtWidgets.QLabel(self.appBox)
        self.appLabel.setGeometry(QtCore.QRect(150, 20, 200, 27))
        self.appLabel.setObjectName("appLabel")

        self.nameLabel = QtWidgets.QLabel(self.appBox)
        self.nameLabel.setGeometry(QtCore.QRect(30, 70, 61, 21))
        self.nameLabel.setObjectName("nameLabel")

        self.name = QtWidgets.QLineEdit(self.appBox)
        self.name.setGeometry(QtCore.QRect(100, 70, 200, 27))
        self.name.setObjectName("name")


        self.emailLabel = QtWidgets.QLabel(self.appBox)
        self.emailLabel.setGeometry(QtCore.QRect(30, 120, 61, 21))
        self.emailLabel.setObjectName("emailLabel")

        self.email = QtWidgets.QLineEdit(self.appBox)
        self.email.setGeometry(QtCore.QRect(100, 120, 200, 27))
        self.email.setObjectName("email")


        self.pwdLabel = QtWidgets.QLabel(self.appBox)
        self.pwdLabel.setGeometry(QtCore.QRect(30, 170, 61, 21))
        self.pwdLabel.setObjectName("pwd_label")

        self.pwd = QtWidgets.QLineEdit(self.appBox)
        self.pwd.setGeometry(QtCore.QRect(100, 170, 200, 27))
        self.pwd.setObjectName("pwd")


        self.loginBtn = QtWidgets.QPushButton(Dialog)
        self.loginBtn.setGeometry(QtCore.QRect(60, 257, 75, 23))
        self.loginBtn.setMaximumSize(QtCore.QSize(75, 16777215))
        self.loginBtn.setObjectName("loginBtn")

        self.clearBtn = QtWidgets.QPushButton(Dialog)
        self.clearBtn.setGeometry(QtCore.QRect(270, 257, 75, 23))
        self.clearBtn.setMaximumSize(QtCore.QSize(75, 16777215))
        self.clearBtn.setObjectName("clearBtn")
        
        self.retranslateUi(Dialog)
        self.loginBtn.clicked.connect(Dialog.start)
        self.clearBtn.clicked.connect(Dialog.clear)
        QtCore.QMetaObject.connectSlotsByName(Dialog)
    
    def retranslateUi(self, Dialog):
        _translate = QtCore.QCoreApplication.translate
        Dialog.setWindowTitle(_translate("Dialog", "Shadow"))
        # self.appBox.setTitle(_translate("Dialog", "Shadow 登陆器"))
        self.appLabel.setText(_translate("Dialog", "Shadow 登陆器"))

        self.nameLabel.setText(_translate("Dialog", "昵称"))
        self.emailLabel.setText(_translate("Dialog", "邮箱"))
        self.pwdLabel.setText(_translate("Dialog", "设置密码"))

        self.pwd.setEchoMode(QtWidgets.QLineEdit.Password)
        conf = read_conf()
        self.name.setText(conf[0])
        self.email.setText(conf[1])
        self.pwd.setText(conf[2])


        self.loginBtn.setText(_translate("Dialog", "启动"))
        self.clearBtn.setText(_translate("Dialog", "清空"))
```

### 封装 UI 和绑定函数

```python
class MainDialog(QDialog):

    switch_window = QtCore.pyqtSignal()

    def __init__(self, parent=None):
        super(QDialog, self).__init__(parent)
        self.ui = window.Ui_Dialog_Main()
        self.setWindowIcon(QIcon(path + "logo.ico"))
        self.ui.setupUi(self)

    # 传递信号，调用新一层函数
    def close(self):
        self.switch_window.emit()

    def ask(self):
        query = self.ui.textEdit.toPlainText().strip()
        print("收到询问: " + query)
        from shadow import chat
        back = chat(query)
        print("处理结果: " + back)
        self.ui.textEdit.setText(back)



class LoginDialog(QDialog):

    switch_window = QtCore.pyqtSignal()

    def __init__(self, parent=None):
        super(QDialog, self).__init__(parent)
        self.ui = window.Ui_Dialog_Login()
        self.setWindowIcon(QIcon(path + "logo.ico"))
        self.ui.setupUi(self)


    def verily(self, name, email):
        conn = pymysql.connect(host = '127.0.0.1' # 连接名称，默认127.0.0.1
            ,user = 'root' # 用户名
            ,passwd='011026' # 密码
            ,port= 3306 # 端口，默认为3306
            ,db='aides' # 数据库名称
            ,charset='utf8' # 字符编码
        )
        cur = conn.cursor() # 生成游标对象
        sql = "select * from `user` where `name`= " + '\'' + name + '\'' # SQL语句
        #print(sql)
        cur.execute(sql) # 执行SQL语句
        data = cur.fetchall() # 通过fetchall方法获得数据
        if len(data) == 0:
            print("用户不存在")
            cur.close() # 关闭游标
            conn.close() # 关闭连接
            return False
        if data[0][1] != email:
            print("昵称和邮箱不匹配")
            cur.close() # 关闭游标
            conn.close() # 关闭连接
            return False
        #print("验证成功")
        cur.close() # 关闭游标
        conn.close() # 关闭连接
        return True

    
    def write_conf(self, name, email, pwd):
        with open(path+"shadow.conf", 'w') as f:
            f.write("name: " + name + "\n")
            f.write("email: " + email + "\n")
            f.write("password: " + pwd + "\n")

    def start(self):
        name = self.ui.name.text()
        email = self.ui.email.text()
        pwd = self.ui.pwd.text()
        
        if self.verily(name, email):
            self.write_conf(name, email, pwd)
            # 跳转主页面
            self.switch_window.emit()


    
    def clear(self):
        self.ui.name.clear()
        self.ui.email.clear()
        self.ui.pwd.clear()
```

### 窗口跳转处理

使用 Controller 封装多个窗口，用 close / show 函数实现窗口开关，emit 函数实现消息传递（通知上层函数执行对应函数） 

```python
switch_window = QtCore.pyqtSignal()
self.switch_window.emit()
```

Contrller

```python
# coding:utf-8

import sys
import window
from PyQt5.QtWidgets import QApplication, QDialog
from PyQt5.QtGui import QIcon
from PyQt5 import QtCore
import pymysql
import threading

path = "./shadow/"

class Controller:
    def __init__(self):
        pass

    def show_login(self):
        self.login = LoginDialog()
        self.login.switch_window.connect(self.show_main)
        self.login.show()

    def show_main(self):
        self.login.close()
        self.window = MainDialog()
        self.window.switch_window.connect(self.shutdown)
        self.window.show()
        import shadow;
        self.p = threading.Thread(target=shadow.shadow)
        # 设置为守护进程，当父进程结束时，将被强制终止
        self.p.daemon = True
        self.p.start()

    def shutdown(self):
        print("-------- 结束接收数据 -----------")
        sys.exit()
```

主函数

```python
if __name__ == '__main__':
    myapp = QApplication(sys.argv)
    myDlg = Controller()
    myDlg.show_login()
    sys.exit(myapp.exec_())
```

### 打包可执行文件

安装 pyinstaller

```bash
pip install pyinstaller
```

打包命令

```bash
pyinstaller -D app.py # --onedir
pyinstaller --onefile app.py # -F
pyinstaller -w app.py # --windowed --noconsolc
```

## Spider

> 简单爬虫

就是一个网络请求（get / post）回 html 然后过滤所需信息

```python
import requests
from bs4 import BeautifulSoup

r = requests.get('https://www.baidu.com/')
print(r.status_code)
# print(r.text)
# print(r.json())

# 添加headers
# headers = {'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit'}
# r = requests.get('https://www.baidu.com/', headers=headers)
# print(r.text)

data = {'user': 'northboat', 'password': '123456'}
r_post = requests.post('https://www.weibo.com/', data=data)
print(r_post.status_code)
# print(r_post.text)

html = """
<html><head><title>The Dormouse's story</title></head>
<body>
<p class="title" name="dromouse"><b>The Dormouse's story</b></p>
<p class="story">Once upon a time there were three little sisters; and their names were
<a href="http://example.com/elsie" class="sister" id="link1"><!-- Elsie --></a>,
<a href="http://example.com/lacie" class="sister" id="link2">Lacie</a> and
<a href="http://example.com/tillie" class="sister" id="link3">Tillie</a>;
and they lived at the bottom of a well.</p>
<p class="story">...</p>
"""
soup = BeautifulSoup(html, 'lxml')
print(soup.title)
print(soup.title.text)
# 根据标签定位
print(soup.find_all('a'))
# 根据属性定位，这里即为找到id为link1的标签
print(soup.find_all(attrs={'id': 'link1'}))
# 根据标签加属性进行定位
print(soup.find_all('a', id='link2'))
```

## Flask

轻量 WEB 框架

```bash
from flask import Flask, request
import openai
import os

app = Flask(__name__)
openai.api_key = os.environ["OPENAI_API_KEY"]

@app.route('/chat', methods=['POST'])
def chat():
    prompt = request.form['text']
    response = openai.Completion.create(
        engine="davinci",
        prompt=prompt,
        max_tokens=2048,
        n=1,
        stop=None,
        temperature=0.7,
    )
    message = response.choices[0].text
    return message

if __name__ == '__main__':
    app.run(debug=True)
```

