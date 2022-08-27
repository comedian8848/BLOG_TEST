//核心配置文件

module.exports = {
    title: "NorthBoat's Study Room",
    description: '片刻寧靜',
    dest: './dist/',
    base: '',
    port: '7777',
	
    head: [
        ['link', {rel: 'icon', href: '/leaf.ico'}]
    ],
    markdown: {
        lineNumbers: true
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
