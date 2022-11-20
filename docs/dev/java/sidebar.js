//java的侧边栏
module.exports = [
	{
		title: 'JavaSE',
		collapsable: true,
		children: [
			'./basic/class',
			'./basic/collection',
			'./basic/io'
		]
	},
	
	{
		title: 'JavaWeb',
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
		title: 'Frame',
		collapsable: true,
		children: [
			'./frame/mybatis',
			'./frame/springboot',
		]
	},

	{
		title: 'Project',
		collapsable: true,
		children: [
			'./project/helper',
			'./project/shutdown',
			'./project/performance',	
			'./project/post',
			'./project/controller',
			'./project/oj',	
			//'./project/seckill',
		]
	},
	
]
