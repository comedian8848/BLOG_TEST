//核心配置文件

module.exports = {
    title: "Northboat Docs",
    description: '片刻寧靜',
    dest: './dist/',
    base: '',
    port: '7777',
	
    head: [
        ['link', {rel: 'icon', href: '/img/leaf.ico'}],
	['link', {rel:'stylesheet', href:'https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css'}],
	//['link', {rel:'stylesheet', href:'https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.css'}],
	//['script', {src: 'https://github.com/markdown-it/markdown-it/blob/master/bin/markdown-it.js'}],
	//['script', {src: 'https://gitcdn.xyz/cdn/goessner/markdown-it-texmath/master/texmath.js'}],
	['script', {src: 'https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js'}],
    ],

    markdown: {
      lineNumbers: true,
      anchor: { permalink: false },
      toc: {includeLevel: [1,2]},
      extendMarkdown: md => {
        md.use(require('markdown-it-texmath'))
      }
    },

    themeConfig: {
		logo: '/img/logo.png',
        nav: require("./nav.js"),
        sidebar: require("./sidebar.js"),
        sidebarDepth: 2,
        lastUpdated: 'Last Updated',
        searchMaxSuggestoins: 10,
        serviceWorker: {
            updatePopup: {
                message: "有新的内容.",
                buttonText: '更新'
            }
        },
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页 ！'
    },

    plugins: [
      [
        '@vuepress-reco/vuepress-plugin-bgm-player',
        {
          "audios": [
	    {
	      name: '白羊',
	      artist: 'Northboat',
	      url: '/song/aries.aac',
	      cover: '/img/error.jpg'
	    },
            {
              name: '我',
              artist: '张国荣',
              url: 'http://www.ytmp3.cn/down/46480.mp3',
              cover: '/img/error.jpg'
            },
	    {
	      name: 'You Are Beautiful',
              artist: 'James Blunt',
	      url: 'http://www.ytmp3.cn/down/77296.mp3',
	      cover: '/img/error.jpg'
	    },
	    {
	      name: '遥远的他',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/64842.mp3',
	      cover: '/img/error.jpg'
	    },
	    {
	      name: '最冷一天',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/64370.mp3',
	      cover: '/img/error.jpg'
	    },
	    {
	      name: '倾城',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/64402.mp3',
	      cover: '/img/error.jpg'
	    },
	    {
	      name: '让一切随风',
	      artist: '钟镇涛',
	      url: 'http://www.ytmp3.cn/down/74929.mp3',
	      cover: '/img/error.jpg'
	    },
	    {
	      name: '失忆蝴蝶',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/52174.mp3',
	      cover: '/img/error.jpg'
	    },
          ],
          // 是否默认缩小
          "autoShrink": true ,
          // 缩小时缩为哪种模式
          "shrinkMode": 'float',
	  // 悬浮方位
	  "floatPosition": 'left',
          // 悬浮窗样式
          "floatStyle":{ "bottom": "44px", "z-index": "999999" },
	  //"position": { left: '10px', bottom: '0px', 'z-index': "999999" }
        }
      ],
	  ["ribbon-animation", {
		size: 90,   // 默认数据
		opacity: 0.3,  //  透明度
		zIndex: -1,   //  层级
		opt: {
			// 色带HSL饱和度
			colorSaturation: "80%",
			// 色带HSL亮度量
			colorBrightness: "60%",
			// 带状颜色不透明度
			colorAlpha: 0.65,
			// 在HSL颜色空间中循环显示颜色的速度有多快
			colorCycleSpeed: 6,
			// 从哪一侧开始Y轴 (top|min, middle|center, bottom|max, random)
			verticalPosition: "center",
			// 到达屏幕另一侧的速度有多快
			horizontalSpeed: 200,
			// 在任何给定时间，屏幕上会保留多少条带
			ribbonCount: 2,
			// 添加笔划以及色带填充颜色
			strokeSize: 0,
			// 通过页面滚动上的因子垂直移动色带
			parallaxAmount: -0.5,
			// 随着时间的推移，为每个功能区添加动画效果
			animateSections: true
		},
		ribbonShow: false, //  点击彩带  true显示  false为不显示
		ribbonAnimationShow: true  // 滑动彩带
	  }],
	  ["sakura", {
        num: 9,  // 默认数量
        show: true, //  是否显示
        zIndex: 99,   // 层级
        img: {
          replace: false,  // false 默认图 true 换图 需要填写httpUrl地址
          httpUrl: '...'     // 绝对路径
        }     
      }],
    ]
}
