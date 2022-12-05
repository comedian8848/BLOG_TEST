
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
		title: '数据库',
		collapsable: true,
		children: [
		    './database/mysql',
		    './database/redis',
		]
	},

	
	{
		title: '杂项',
		collapsable: true,
		children: [
		    './misc/wechall',
		    './misc/git',
		    {
			title: "Docker",
			collapsable: true,
			children: [
			    './misc/dockerI',
			    './misc/dockerII',			
			]
		    },
		]
	},
]
