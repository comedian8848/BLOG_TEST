
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
		title: 'Miscellaneous',
		collapsable: true,
		children: [
		    './misc/wechall',
		    './misc/git',
		]
	},

	{
		title: 'Middleware',
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