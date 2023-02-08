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

### cnpm 和 hexo

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
~~~

git/github 操作请参照: [git手册](https://northboat-docs.netlify.app/dev/ops/tool/git.html)

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

配合 netlify 搭建博客，将源文件传在 github 上，在 netlify 中导入仓库建站

## 更换主题

> 查看各主题官方文档教程
>
> [hexo butterfly](https://butterfly.js.org/)
>
> [hexo fluid](https://fluid-dev.github.io/hexo-fluid-docs/start/)

### _config.yml

自动更新所有依赖

```bash
npm install -g npm-check-updates
# 在 package.json 目录下执行
ncu -u
npm install
```

Fluid 使用

```bash
npm install --save hexo-theme-fluid
```

修改 _config.yml

```yaml
theme: fluid  # 指定主题
language: zh-CN  # 指定语言，会影响主题显示的语言，按需修改
```

更新 Fluid 主题

```bash
npm update --save hexo-theme-fluid
```

音乐播放器

```bash
npm install hexo-tag-aplayer --save
```

_config.yml 添加

```yaml
aplayer:
  meting: true
```

使用

```markdown
{% meting "523845661" "netease" "playlist" "theme:#FF4081" "mode:circulation" "mutex:true" "listmaxheight:340px" "preload:auto" %}
```

### _config.fluid.yml

自定义 html，这条 html 代码将加在所有的页面中

```yaml
custom_html: '<link rel="stylesheet" href="/css/aplayer.css">'
```

配置 aplayer 框颜色，适配暗色

```css
.aplayer-list-light {
	background: black;
}

.aplayer .aplayer-lrc:before{
	background: black;
}

.aplayer .aplayer-lrc:after{
	background: black;
}

.aplayer {
	background: black;
}

.aplayer .aplayer-list ol li.aplayer-list-light{
	background: black;
}

.aplayer .aplayer-list ol li:hover{
	background: gray;
}

.aplayer .aplayer-list ol li{
	border-top: black;
}

.aplayer .aplayer-lrc:before{
	height: 4%;
}

.aplayer .aplayer-lrc:after{
	height: 2%;
}

iframe{
	filter: invert(100%);
}
```

自定义颜色，去除 dark 模式，将 light 颜色调为 dark

```yaml
dark_mode:
  enable: false

# 主题颜色配置，其他不生效的地方请使用自定义 css 解决，配色可以在下方链接中获得启发
# Theme color, please use custom CSS to solve other colors, color schema can be inspired by the links below
# See: https://www.webdesignrankings.com/resources/lolcolors/
color:
  # body 背景色：CAD8D8 ffe0e6
  # body_bg_color: "#f8f8ff"
  body_bg_color: "#000"
  # 暗色模式下的 body 背景色，下同
  body_bg_color_dark: "#181c27"

  # 顶部菜单背景色
  # navbar_bg_color: "#2f4154"
  navbar_bg_color: "#000"
  navbar_bg_color_dark: "#1f3144"

  # 顶部菜单字体色
  # navbar_text_color: "#fff"
  navbar_text_color: "#d0d0d0"
  navbar_text_color_dark: "#d0d0d0"

  # 副标题字体色
  # subtitle_color: "#fff"
  subtitle_color: "#d0d0d0"
  subtitle_color_dark: "#d0d0d0"

  # 全局字体色
  # text_color: "#3c4858"
  text_color: "#c4c6c9"
  text_color_dark: "#c4c6c9"

  # 全局次级字体色（摘要、简介等位置）
  # sec_text_color: "#718096"
  sec_text_color: "#a7a9ad"
  sec_text_color_dark: "#a7a9ad"

  # 主面板背景色
  # board_color: "#fff"
  board_color: "#252d38"
  board_color_dark: "#252d38"

  # 文章正文字体色
  # post_text_color: "#2c3e50"
  post_text_color: "#c4c6c9"
  post_text_color_dark: "#c4c6c9"

  # 文章正文字体色（h1 h2 h3...）
  # post_heading_color: "#1a202c"
  post_heading_color: "#c4c6c9"
  post_heading_color_dark: "#c4c6c9"

  # 文章超链接字体色
  # post_link_color: "#0366d6"
  post_link_color: "#1589e9"
  post_link_color_dark: "#1589e9"

  # 超链接悬浮时字体色
  link_hover_color: "#30a9de"
  link_hover_color_dark: "#30a9de"

  # 超链接悬浮背景色
  # link_hover_bg_color: "#f8f9fa"
  link_hover_bg_color: "#364151"
  link_hover_bg_color_dark: "#364151"

  # 分隔线和表格边线的颜色
  # line_color: "#eaecef"
  line_color: "#435266"
  line_color_dark: "#435266"

  # 滚动条颜色
  # scrollbar_color: "#c4c6c9"
  scrollbar_color: "#687582"
  scrollbar_color_dark: "#687582"
  # 滚动条悬浮颜色
  # scrollbar_hover_color: "#a6a6a6"
  scrollbar_hover_color: "#9da8b3"
  scrollbar_hover_color_dark: "#9da8b3"

  # 按钮背景色
  button_bg_color: "transparent"
  button_bg_color_dark: "transparent"
  # 按钮悬浮背景色
  # button_hover_bg_color: "#f2f3f5"
  button_hover_bg_color: "#46647e"
  button_hover_bg_color_dark: "#46647e"
```

导航栏

```yaml
menu:
    - { key: 'home', link: '/', icon: 'iconfont icon-home-fill', name: 'Home' }
    #- { key: 'categorie', link: '/categories/', icon: 'iconfont icon-book', name: 'Categories' }
    #- { key: 'tag', link: '/tags/', icon: 'iconfont icon-tags-fill', name: 'Tags' }
    - {
        key: 'Docs',
        icon: 'iconfont icon-books',
        submenu: [
            { key: 'Front End', link: 'https://northboat.netlify.app/dev/fe/' },
            { key: 'Java', link: 'https://northboat.netlify.app/dev/java/' },
            { key: 'Integrated Circuit', link: 'https://northboat.netlify.app/dev/ic/' },
            { key: 'Operations', link: 'https://northboat.netlify.app/dev/ops/' },
            { key: 'DataStruct', link: 'https://northboat.netlify.app/408/datastruct/' },
	    { key: 'Network', link: 'https://northboat.netlify.app/408/network/' },
            { key: 'Operating System', link: 'https://northboat.netlify.app/408/operating/' },
	    { key: 'Organization', link: 'https://northboat.netlify.app/408/organization/' },
            { key: 'Mathematics', link: 'https://northboat.netlify.app/ai/math/' },
	    { key: 'Python', link: 'https://northboat.netlify.app/ai/python/' },
            { key: 'Machine Learning', link: 'https://northboat.netlify.app/ai/machine/' },
	    #{ key: 'Deep Learning', link: 'https://northboat.netlify.app/ai/deeplearning/' }, 
       ]
      }
    - { key: 'links', link: '/links/', icon: 'iconfont icon-link-fill' }
    - { key: 'music', link: '/music/', icon: 'iconfont icon-music', name: 'Music' }
    - { key: 'about', link: '/about/', icon: 'iconfont icon-addrcard', name: 'About' }
```

关于页

```yaml
about:
  enable: true
  banner_img: /img/ez.jpg
  banner_img_height: 77
  banner_mask_alpha: 0.3
  avatar: /img/logo.jpg
  name: "Northboat"
  intro: "984.5混子"
  # 更多图标可从 https://hexo.fluid-dev.com/docs/icon/ 查找，`class` 代表图标的 css class，添加 `qrcode` 后，图标不再是链接而是悬浮二维码
  # More icons can be found from https://hexo.fluid-dev.com/docs/en/icon/  `class` is the css class of the icon. If adding `qrcode`, The icon is no longer a link, but a hovering QR code
  icons:
    - { class: 'iconfont icon-github-fill', link: 'https://github.com/Northboat', tip: 'GitHub' }
    - { class: 'iconfont icon-wechat-fill', qrcode: '/img/wechat.png' }
    - { class: 'iconfont icon-books', link: 'https://northboat.netlify.app/', tip: 'Docs' }
    - { class: 'iconfont icon-whatsapp-fill', link: '#', tip: '18630338418' }
    - { class: 'iconfont icon-mail', link: '#', tip: 'northboat@163.com' }
```

