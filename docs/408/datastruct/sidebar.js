
module.exports = [


	{
		title: '数据结构',
		collapsable: true,
		children: [
			'./basic/struct',
			'./basic/algorithm',			
		]
	},
	
	
	{
		title: '算法',
		collapsable: true,
		children: [
			'./algorithm/recursion',
			'./algorithm/search',
			'./algorithm/sort',
			'./algorithm/dp',
			'./algorithm/greedy',
			'./algorithm/hash',
			'./algorithm/modeling',
			'./algorithm/pointer',	
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
