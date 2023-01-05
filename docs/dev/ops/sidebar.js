
module.exports = [

	{
		title: 'Linux',
		collapsable: true,
		children: [
		    './linux/centos',
		    './linux/manjaro',
		]
	},


	{
		title: '中间件',
		collapsable: true,
		children: [
		    {
			title: "数据库",
			collapsable: true,
			children: [
			    './middleware/mysql',
			    './middleware/redis',
			]
		    },
		   
		    {
			title: "Docker",
			collapsable: true,
			children: [
			    './middleware/dockerI',
			    './middleware/dockerII',			
			]
		    },	
		    './middleware/rabbitmq',
		]
	},

	
	{
		title: '工具',
		collapsable: true,
		children: [
		    './tool/wechall',
		    './tool/git',
		]
	},
]
