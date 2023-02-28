---
title: Manjaro
date: 2022-4-12
tags:
  - Linux
---

## 本地安装

安装双系统

### Ubuntu

> 准备

制作启动盘及本地硬盘分区

- 下载镜像和U盘制作工具
- 分盘
- 使用Ultraiso制作U盘（写入方式：`USB-HDD+`）

> 安装

跳过wifi选项，在安装界面选择：something else

点击+号对ubuntu系统进行分区

- primary，挂在目录选择`/`，该分区类似于win的c盘
- logical，use as为`swap area`，为内存大小，以电脑为准
- logical，挂在目录选择`/boot`目录，为启动盘，`300MB`即可；若启动方式为`uefi`，该处需要选择`/efi`目录
- logical，Mount point选择 /home，你的所有软件将下在该目录

选中boot区，continue

选择时区、设置密码，等待安装

> 网卡驱动

检查是否有驱动

~~~bash
ifconfig -a
~~~

若出现 l0 字样，则为驱动缺失

首先，在终端输入如下内容，查看网卡型号

~~~bash
lspci
~~~

下载对应驱动，船船为 rtl8821ce ，解压驱动压缩文件，修改文件 Makefile

~~~
export TopDIR ?= /home/rtl8821ce
~~~

在 /home/rtl8821ce 目录下分别执行

~~~bash
make
sudo make install
sudo modprobe -a 8821ce
~~~

有时提示找不到 package，尝试使用以下命令更新软件源

~~~bash
sudo apt-get update
sudo apt-get upgrade
~~~

### Manjaro

> 基于Arch：[安装教程](https://blog.csdn.net/qq_27525611/article/details/109269569)

准备

- 下载镜像，需要去官网下载，速度并不慢
- 下载`Rufus`
- 制作启动盘

安装

熟悉的安装以及分区，注意可以像那篇博文一样分的很细，也可以只分`/home、/boot、/、/swap`分区，其余会自动分好

Surface

- 下载驱动：[github/linux-surface](https://github.com/linux-surface/linux-surface/releases/tag/arch-5.10.10-1)
- B乎教程：[在Surface上安装Manjaro系统](https://zhuanlan.zhihu.com/p/345302643)

关闭`bitlocker`，选择`usb`启动，扩展坞显得尤为重要

## 半小时搭建学习环境

### System

initPacman.sh：初始化包管理，更换 pacman 源，同步库，下载 yay

```bash
sudo pacman-mirrors -c China
sudo pacman -Syy
sudo pacman -Sy yay
```

在软件与安装中勾选AUR源

更换`pacman`下载源

~~~bash
sudo pacman-mirrors -c China
~~~

会跳出一个gui框让你选择

或可直接修改配置文件`/etc/pacman.d/mirrorlist`

~~~
# China
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.zju.edu.cn/archlinux/$repo/os/$arch
Server = http://mirrors.cpu.edu.cn/archlinux/$repo/os/$arch
Server = http://mirrors.163.com/archlinux/$repo/os/$arch
Server = http://mirrors.dgut.edu.cn/archlinux/$repo/os/$arch
#东软牌面
Server = http://mirrors.neusoft.edu.cn/archlinux/$repo/os/$arch
Server = http://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
Server = http://mirror.lzu.edu.cn/archlinux/$repo/os/$arch
Server = http://mirror.redrock.team/archlinux/$repo/os/$arch
~~~

下载`yay`

~~~bash
pacman -Sy yay
~~~

yay的配置文件在`~/.config/yay/config.json`

这里不要换清华源，很多资源都已失效，不如不换

自动生成合适的 grub.cfg 文件，让 manjaro 读到 win 的引导

```bash
sudo update-grub
```

修改 grub 设置

```bash
# 查看
sudo cat /etc/default/grub

GRUB_DEFAULT=saved
GRUB_TIMEOUT=5
GRUB_TIMEOUT_STYLE=hidden
GRUB_DISTRIBUTOR="Manjaro"
GRUB_CMDLINE_LINUX_DEFAULT="quiet apparmor=1 security=apparmor resume=UUID=75c1c3b5-d413-4ca6-8946-15a0fc7ef18b udev.log_priority=3"
GRUB_CMDLINE_LINUX=""

# 删除 quiet 加上 loglever=5
GRUB_CMDLINE_LINUX_DEFAULT="apparmor=1 security=apparmor resume=UUID=75c1c3b5-d413-4ca6-8946-15a0fc7ef18b udev.log_priority=3 loglever=5"

# 使 grub.cfg 文件生效
sudo grub-mkconfig -o /boot/grub/grub.cfg
# 这里要找一下 grub.cfg 的位置，可以在 /boot/efi/ 里
```

校正时间

```bash
timedatectl set-local-rtc 1 --adjust-system-clock
timedatectl set-ntp 0
```

brightness.sh：亮度调节

```bash
echo "------start."
read -p "Enter the bright_lever: " lever
case $lever in
  1) let bright=9000;;
  2) let bright=15000;;
  3) let bright=20000;;
  4) let bright=25000;;
esac
sudo su << EOF # 后续为子进程或子 shell 的输入
cd /sys/class/backlight/intel_backlight/
echo $bright > brightness
EOF
echo "--------end."
```

面板排布

<img src="./assets/panel.png">

### Chinese

changeInput.sh：中文输入法

```bash
# 下载vim
yay -S vim

# 下载fcitx
sudo pacman -S fcitx-im
pacman -S fcitx-configtool
pacman -S fcitx-googlepinyin

# 创建fcitx配置文件
vim ~/.xprofile

# 文件填写以下内容
export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
```

changeDir.sh：更改目录名为英文，因为安装时选择的中文系统，默认 home 下的目录名将是中文

```bash
sudo pacman -S xdg-user-dirs-gtk
export LANG=en_US
xdg-user-dirs-gtk-update

export LANG=zh_CN.UTF-8
```

### Software

installSoftware.sh：常用软件下载

vscode

```bash
# vscode和gdb
yay -S visual-studio-code-bin
yay -S gdb
```

休闲

```bash
yay -S netease-cloud-music # 网易云
yay -S microsoft-edge-dev-bin # edge
```

qq

```bash
yay -S deepin-wine-qq # wine版
# electron 新版，腾讯，我真的哭死
yay -S linuxqq-new
```

- Typora 解压使用
- 使用 AppImage 版本的度盘

官网下载 natapp 用于内网穿透：[natapp](https://natapp.cn/)

- 执行命令为

```bash
./natapp -authtoken=xxxxx
```

### Developer

initGit.sh：初始化 git

```bash
git config --global user.name "NorthBoat" 设置 git #全局用户名
git config --global user.email "northboat@163.com" #设置 git 全局邮箱
ssh-keygen -t rsa -C "northboat@163.com" #生成秘钥

cat /home/northboat/.ssh/id.rsa.pub
```

installAnaconda.sh：配置 Python 环境

```bash
yay -S anaconda

# 换源
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
conda config --set show_channel_urls yes

# 加载配置文件
source /opt/anaconda/bin/activate root
```

- 解压 dataspell

installJava.sh：配置 Java 环境

```bash
yay -S jdk8-openjdk
yay -S jdk11-openjdk

archlinux-java status # 查看 java 版本
archlinux-java set java-11-openjdk # 切换默认java版本
```

- 解压 IDEA，学生帐号激活
- 解压 Maven，手动建 repo 文件夹装包

installMysql.sh

```bash
yay -S mysql

# 初始化MySQL，记住输出的root密码
mysqld --initialize --user=mysql --basedir=/usr --datadir=/var/lib/mysql
# 设置开机启动MySQL服务
systemctl enable mysqld.service
systemctl daemon-reload
systemctl start mysqld.service
# 使用MySQL前必须修改root密码，MySQL 8.0.15不能使用set password修改密码
mysql -u root -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '新密码';

# 图形化界面
yay -S mysql-workbench
```

installRedis.sh：安装 Redis，解压后进入目录

```bash
yay -S gcc g++
yay -S make
yay -S pkg-config

# 编译
make && make install

# 新建文件夹并将配置文件复制到此处
cd /usr/local/bin
mkdir config
cp /home/northboat/tool/redis-6.2.6/redis.conf config
vim config/redis.config

# 通过配置文件启动 redis-server
./redis-server config/redis.conf
```

- 使用 another-redis-desktop-manager 的 AppImage 版本作为 redis 可视化工具

installRabbitMQ.sh：下载 rabbitmq

```bash
yay -S rabbitmq rabbitmqadmin

# 启动管理模块
sudo rabbitmq-plugins enable rabbitmq_management
# 启动
sudo rabbitmq-server
```

- 管理界面默认端口：15672
- 客户端默认端口：5672

magic.sh：科学上网

```bash
yay -S v2ray # 下载 v2ray 内核
```

- 使用 appimage 形式的 qv2ray
- 保存有祖传版内核，在 qv2ray 首选项中配置使用

### Repo

blog.sh：下载 npm、hexo、vuepress 等以及插件

```bash
yay -S nodejs
yay -S npm

npm config set registry https://registry.taobao.org
npm config get registry

sudo npm install cnpm -g
cnpm install -g hexo-cli

# hexo
npm install --save hexo-theme-fluid # 主题
npm install --save hexo-tag-aplayer # 播放器

# vuepress
sudo npm install vue -g
sudo npm install vuepress -g

npm install @vuepress-reco/vuepress-plugin-bgm-player --save # 播放器
```

pull.sh：拉取仓库脚本

```bash
echo "-------start"
cd Blog
git pull
echo -e "blog pull end!\n" # -e 启用转义字符
cd ..
cd Docs
git pull
echo -e "docs pull end!\n"
cd ..
cd Index
git pull
echo -e "index pull end!\n"
echo "---------end"
```


## 杂项

### 调整时间

[Manjaro配置准确时间](https://www.jianshu.com/p/92a2de6d9862)

~~~bash
timedatectl set-local-rtc 1 --adjust-system-clock
timedatectl set-ntp 0
~~~

显示系统的当前时间和日期

~~~bash
timedatectl status
~~~

- 结果中RTC time就是硬件时钟的时间

Linux系统上的time总是通过系统的timezone设置的，查看当前时区：

~~~bash
timedatectl | grep Time
~~~

查看所有可用的时区：

~~~bash
timedatectl list-timezones
~~~

根据地理位置找到本地的时区：

~~~bash
timedatectl list-timezones | egrep -o “Asia/B.*”
timedatectl list-timezones | egrep -o “Europe/L.*”
timedatectl list-timezones | egrep -o “America/N.*”
~~~

在Linux中设置本地时区，使用set-timezone开关：

~~~bash
timedatectl set-timezone “Asia/shagnhai”
~~~

### 桌面

用`*.desktop`创建桌面快捷方式

~~~
#godotengine.desktop
[Desktop Entry]
Name=godot engine
GenericName=Game Engine
Exec=~/tool/godotengine/godotengine
Icon=godot.png
Terminal=false
Type=Application
StartupNotify=false
Categories=Development;
~~~

### Timeshift 快照

使用 timeshift 创建 rsync 快照，将在第一次储存的基础上不断更新，一个快照大概7-9G

### 添加环境变量

在`~/.bashrc`中添加

~~~bash
export PATH=/opt/anaconda/bin:$PATH
~~~

### 更改启动项

查看启动项

~~~
sudo efibootmgr //显示efi的启动项
~~~

删除多余启动项

~~~
efibootmgr -b 000C -B
~~~

其中 000C是要删除的引导项编号，通过 efibootmgr命令可以直接查看

- 没有屁用，还得是格式化引导分区

发生了其他的问题，就是说我把引导分区格了之后，uuid变了，从manjaro进不了windows，这个时候要修改`/boot/grub/grub.cfg`文件的windows启动设置

将`set=root uuid=`后的内容改成新的uuid保存退出即可

查看分区信息（包括但不限于uuid）

~~~
blkid
~~~

- 改得头疼

有智能的方法

~~~
sudo update-grub
~~~

让linux系统自动生成合适的grub.cfg文件

### 虚拟控制台

`ctrl alt f2-f6`可以开启虚拟控制台，即黑框框的 linux，f7 为图形界面

## 更多命令

### 解压缩

压缩成 zip

```bash
zip -q -r [压缩文件名如:lexer.zip] [要压缩的文件]
```

tar 压缩

```bash
tar -czvf lexer.tar.gz lexer # lexer 是文件夹
```

tar 解压

```bash
tar -xzvf lexer.tar.gz # 解压到当前目录
```

### 博客部署

部署 vuepress-reco 博客

```bash
npm run build
cd public
git init
git add .
git commit -m "reco"
git push -f git@github.com:NorthBoat/NorthBoat.github.io.git master
```

拉取更新 Blog&Docs

```bash
echo "-------start"
cd /home/northboat/File/reco/Blog
git pull
echo -e "blog pull ok!\n" # -e 启用转义字符
cd ..
cd Docs
git pull
echo -e "docs pull ok!\n"

echo "---------end"
```

### 亮度

修改 manjaro-kde 亮度

```bash
echo "------start."

read -p "Enter the max_bright: " bright

sudo su << EOF # 后续为子进程或子 shell 的输入

cd /sys/class/backlight/intel_backlight/

echo $bright > brightness

EOF

echo "--------end."
```

更自动化，一键更改，使用 case 语句条件选择和 let 语句赋值

```bash
echo "------start."
read -p "Enter the bright_lever: " lever

case $lever in
  1) let bright=9000;;
  2) let bright=15000;;
  3) let bright=20000;;
  4) let bright=25000;;
esac

sudo su << EOF # 后续为子进程或子 shell 的输入

cd /sys/class/backlight/intel_backlight/
echo $bright > brightness

EOF
echo "--------end."
```

### 软连接

`ln -s a b`，将 a 软连接到 b，相当于创建快捷方式

```bash
sudo ln -s /usr/local/bin/redis-server /home/northboat/Desktop/redis-server
sudo ln -s /usr/local/bin/redis-cli /home/northboat/Desktop/redis-cli
```

## Termux

> 安卓 linux 模拟器，非虚拟机，在 chroot 作用下可在非 root 环境下工作运行，类似于 wsl

### PKG

在 F-Droid 中进行下载安装

获取存储权限

```bash
termux-setup-storage
```

换 pkg 下载源

```bash
termux-change-repo
```

pkg：termux 包管理工具

常见包下载

```
pkg install vim
pkg install git
```

建立软连接

```bash
ln -s ~/storage/shared/northboat ~/northboat
```

### GIt

设置昵称邮箱

```bash
git config --global user.name "Northboat"
git config --global user.email "northboat@163.com"
```

下载 ssl / ssh，生成密匙和连接要用

```bash
pkg install openssl
pkg install openssh
```

生成密匙

```bash
ssh-keygen -t rsa -C "northboat@163.com"
```

设置安全目录

```bash
git config --global --add safe.directory /storage/emulated/0/northboat/repo/Docs

# 或者编辑文件配置 git global
git config --global -e
```

然后就可以快乐的 git 辣

### MySQL

下载

```bash
pkg install mariadb
```

启动

```bash
nohup mysqld &
#查看运行进程
ps
```

登录并配置

```mysql
mysql -h localhost -u root -p
# 初始密码为空，直接回车

# 配置
use mysql;
# 设置密码
set password for 'root'@'localhost' = password('123456')
# 刷新权限
flush privileges
# 退出
exit
```

重新登陆

```bash
mysql -u root -p
```

mysqld 启动脚本 start_mysql.sh

```shell
echo 'start mysqld'
nohup mysqld > mysql.log &
```

赋权并执行

```bash
chmod +x start_mysql.sh
sh start_mysql.sh
```

碰到一个问题：mysqld 启动报错 Unknown / unsupported storage engine: InnoDB

解决办法：删除`usr/var/lib/mysql`目录下一些日志文件再重启

```bash
rm -rf aria_log*
rm -rf ib_logfile*
rm -rf ibdata1
```

问题解决

### Andronix

在安装 manjaro 之前记得更新 pkg 的库

```bash
pkg update
```

使用 andronix ＋ termux 安装 manjaro

通过 andronix 生成 pkg 下载命令

```bash
pkg update -y && pkg install wget curl proot tar -y && wget https://raw.githubusercontent.com/AndronixApp/AndronixOrigin/master/Installer/Manjaro/manjaro.sh -O manjaro.sh && chmod +x manjaro.sh && bash manjaro.sh 
```

赋予 termux 存储权限后修改`start-manjaro.sh`，挂载 sdcard 目录

运行`./start-manjaro.sh`启动 manjaro

```
pacman -Syy
```

配置环境

```bash
pacman -S python-pip
pip install numpy pandas scipy matplotlib
pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu
```

pytorch 下载命令生成：[pytorch.org](https://pytorch.org/get-started/locally/)

