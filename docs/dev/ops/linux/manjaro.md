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

## 包管理

Pacman & Yay

### 同步库及配置源

同步数据库

~~~
sudo pacman -Syy
~~~

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

### 常用软件下载

下载vim

~~~
yay -S vim
~~~

中文输入法

~~~
sudo pacman -S fcitx-im
pacman -S fcitx-configtool
pacman -S fcitx-googlepinyin
~~~

添加配置

~~~
vim ~/.xprofile

export GTK_IM_MODULE=fcitx
export QT_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"
~~~

保存退出重启即可

将主目录下文件夹名称改为英文

~~~
sudo pacman -S xdg-user-dirs-gtk
export LANG=en_US
xdg-user-dirs-gtk-update
~~~

此时将文件夹全改为英文，再将默认语言改回中文

~~~
export LANG=zh_CN.UTF-8
~~~

下载vscode

~~~bash
yay -S visual-studio-code-bin
~~~

下载网易云音乐

~~~
yay -S netease-cloud-music 
~~~

下载edge

~~~
yay -S microsoft-edge-dev-bin
~~~

下载QQ/Wechat

~~~
yay -S com.qq.weixin.deepin
~~~

使用这一命令下载的qq只能扫码登陆因为版本过低

~~~
yay -S com.qq.im.deepin
~~~

据说需要桌面依赖

~~~
yay -S cinnamon-settings-daemon
~~~

QQ版本过低下载以下安装包进行安装

~~~
yay -S deepin-wine-qq
~~~

git初始化

~~~
git config --global user.name "name" 设置 git 全局用户名
git config --global user.email "emai@qq.com" 设置 git 全局邮箱
git init 初始化本地库
ssh-keygen -t rsa -C "email@qq.com" 生成秘钥
~~~

用cat命令或去id.rsa.pub的内容并复制添加到github的ssh-key

下载钉钉

~~~
yay -S dingtalk-electron
~~~

- 我真的是服了，linux的钉钉没有直播功能

下载截屏工具并设置快捷键

~~~
yay -S deepin-screenshot
~~~

- 在键盘设置中有图形界面以供设置快捷键

下载uget

~~~
yay -S uget
~~~

下载pdf阅读器

~~~
yay -S foxitreader
~~~

下载ifconfig

~~~bash
yay -S net-tools
~~~

临时修改ip，改了之后断网了草，要加一个网关

~~~bash
ifconfig [网卡名] [要改的ip]
~~~

### 博客环境搭建

下载mysql，即mariadb（mysql的archlinux封装）

~~~bash
yay -S nodejs
yay -S npm

npm config set registry https://registry.taobao.org
npm config get registry

sudo npm install cnpm -g

sudo npm install vue -g
~~~

博客

~~~bash
sudo npm install vuepress -g
sudo npm install @vuepress-reco/theme-cli -g
~~~

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

## 一些命令

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
pkg install python
pkg install python-pip
pkg install openjdk17
```

建立软连接

```bash
ln -s ~/storage/emulated/0/northboat ~/northboat
```

### GIt

设置昵称邮箱

```bash
git config --global user.name "Northboat"
git config --global user.email "northboat@163.com"
```

下载 ssl / ssh，生成密匙和连接要用

```bash
pkg install ssl
pkg install ssh
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
