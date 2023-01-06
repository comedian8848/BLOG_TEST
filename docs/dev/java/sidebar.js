//java的侧边栏
module.exports = [



	{
		title: 'Java SE',
		collapsable: true,
		children: [
			'./javase/class',
			'./javase/collection',
			'./javase/io'
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
		title: 'JUC',
		collapsable: true,
		children: [
			'./juc/lock',
			'./juc/pool',
			'./juc/fork',	
			'./juc/single',
		]
	},
	
	{
		title: 'Web Frame',
		collapsable: true,
		children: [
			'./frame/springboot',
			'./frame/mybatis',
		]
	},

	{
		title: 'Web Application',
		collapsable: true,
		children: [
			'./app/helper',
			'./app/shutdown',
			'./app/performance',	
			'./app/post',
			'./app/controller',
			'./app/oj',	
			'./app/chatroom',
		]
	},
	
]
