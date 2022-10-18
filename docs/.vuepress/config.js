//核心配置文件

module.exports = {
    title: "NorthBoat's Docs",
    description: '片刻寧靜',
    dest: './dist/',
    base: '',
    port: '7777',
	
    head: [
        ['link', {rel: 'icon', href: '/leaf.ico'}],
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
              name: '我',
              artist: '张国荣',
              url: 'http://www.ytmp3.cn/down/46480.mp3',
              cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
            },
	    {
	      name: 'You Are Beautiful',
              artist: 'James Blunt',
	      url: 'http://www.ytmp3.cn/down/77296.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
	    },
	    {
	      name: '遥远的他',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/64842.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
	    },
	    {
	      name: '最冷一天',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/64370.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
	    },
	    {
	      name: '倾城',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/64402.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
	    },
	    {
	      name: '让一切随风',
	      artist: '钟镇涛',
	      url: 'http://www.ytmp3.cn/down/74929.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
	    },
	    {
	      name: '唯一',
	      artist: '告五人',
	      url: 'http://www.ytmp3.cn/down/75603.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
	    },
	    {
	      name: '失忆蝴蝶',
	      artist: '陈奕迅',
	      url: 'http://www.ytmp3.cn/down/52174.mp3',
	      cover: 'https://assets.smallsunnyfox.com/music/2.jpg'
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
    ]
}
