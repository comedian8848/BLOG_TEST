
module.exports = [

	{
		title: 'Linux',
		collapsable: true,
		children: [
		    {
			title: "Linux 基础",
			collapsable: true,
			children: [
			    './linux/centos',
		   	 './linux/manjaro',
			]
		    },
		    './linux/kernel',
		    
		]
	},

	{
		title: '杂项',
		collapsable: true,
		children: [
		    './misc/wechall',
		    './misc/git',
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
			    './middleware/docker-base',
			    './middleware/docker-advanced',			
			]
		    },	
		    './middleware/rabbitmq',
		]
	},

]