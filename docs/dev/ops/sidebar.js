
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
		    './misc/git',
		    './misc/wechall',
		]
	},

	{
		title: '中间件',
		collapsable: true,
		children: [		   
		    {
			title: "Docker",
			collapsable: true,
			children: [
			    './mid/docker-base',
			    './mid/docker-advanced',			
			]
		    },
		    './mid/nginx',
		    {
			title: "数据库",
			collapsable: true,
			children: [
			    './mid/mysql',
			    './mid/redis',
			]
		    },
		    './mid/rabbitmq',
		]
	},

]