//java的侧边栏
module.exports = [



	{
		title: 'Java 基础',
		collapsable: true,
		children: [
			'./basic/class',
			'./basic/collection',
			'./basic/io'
		]
	},
	
	{
		title: 'Java Web',
		collapsable: true,
		children: [
			'./web/tomcat',
			'./web/maven',
			'./web/servlet',
			'./web/session',
		]
	},

	
	{
		title: 'Java 并发编程',
		collapsable: true,
		children: [
			'./juc/lock',
			'./juc/pool',
			'./juc/fork',	
			'./juc/single',
		]
	},
	
	{
		title: 'Web 框架',
		collapsable: true,
		children: [
			'./frame/springboot',
			'./frame/mybatis',
		]
	},

	{
		title: 'Web 项目',
		collapsable: true,
		children: [
			'./project/helper',
			'./project/shutdown',
			'./project/performance',	
			'./project/post',
			'./project/controller',
			'./project/oj',	
			'./project/chatroom',
			'./project/aides',
		]
	},
	
]
