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
}
