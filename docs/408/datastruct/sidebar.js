
module.exports = [
	{
		title: '算法',
		collapsable: true,
		children: [
			'./algorithm/search',
			'./algorithm/dp',
		]
	},
	
	{
		title: '数据结构',
		collapsable: true,
		children: [
			'./basic/algorithm',
			'./basic/struct',
		]
	},
	
	{
		title: '数据库',
		collapsable: true,
		children: [
		    {
			title: "系统概论",
			collapsable: false,
			children: [
			    './database/relation',
			    './database/sql',
			    './database/design',			
			]
		    },
		    {
			title: "实际应用",
			collapsable: false,
			children: [
			    './database/mysql',
			    './database/redis',			
			]			
		    }
		]
	},
	
	
]
