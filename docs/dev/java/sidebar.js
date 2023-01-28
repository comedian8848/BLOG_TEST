//java的侧边栏
module.exports = [



	{
		title: 'Java SE',
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
