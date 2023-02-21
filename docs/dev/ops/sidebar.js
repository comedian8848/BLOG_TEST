
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
			    './mid/mysql',
			    './mid/redis',
			]
		    },
		   
		    {
			title: "Docker",
			collapsable: true,
			children: [
			    './mid/docker-base',
			    './mid/docker-advanced',			
			]
		    },	
		    './mid/rabbitmq',
		]
	},

]
