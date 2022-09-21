---
title: Hexo
date: 2021-2-14
tags:
  - Wheel
  - FrontEnd
---

## 搭建

### nodejs

下载 nodejs: [nodejs官网](https://nodejs.org/en/)

arch linx / manjaro 中

~~~bash
yay -S nodejs
~~~

### cnpm和hexo

~~~bash
#查看版本号：检查node是否安装成功
node -v

#检查npm是否安装成功
npm -v

#下载cnpm
npm install -g cnpm --registry=https://registry.npm.taobao.org

#检查cnpm是否安装成功
cnpm -v

#下载hexo
cnpm install -g hexo-cli
 
#查看hexo版本号
hexo -v   
   
#用cnpm在blog目录下安装git插件
cnpm install --save hexo-deployer-git
      
#配置_config.yml文件
deploy:
  type: git
  repo: https://github.com/NorthBoat/NorthBoat.github.io
  branch: master
      
//更换主题
将主题下载在themes文件夹，修改_config.yml文件themes为新主题文件夹名字(无后缀)
~~~

## hexo使用

~~~bash
#初始化博客
hexo init
    
#启动预览 start
hexo s

#创建文章 new
hexo n "我的第一篇博客文章"

#清理缓存
hexo clean
   
#生成 html 文件 generate
hexo g
    
#将本地博客布署在GitHub(配置好插件以及_config后)
hexo d
~~~

在配置文件`_config.yml`中如果仓库写错了，在部署时将报错10054

## 更换主题

### 安装主题

查看各主题官方文档教程

如 butterfly: [hexo butterfly](https://butterfly.js.org/)

又如 fluid: [hexo fluid](https://fluid-dev.github.io/hexo-fluid-docs/start/)
