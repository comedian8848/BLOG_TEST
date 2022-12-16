
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
			'./algorithm/modeling',
			'./algorithm/hash',
			'./algorithm/recursion',
			'./algorithm/binary',
			{
			    title: "搜索和排序",
			    collapsable: true,
			    children: [
			        './algorithm/bfs',
		    	        './algorithm/dfs',
			        './algorithm/sort',
			    ]
		   	 },
			'./algorithm/greedy',
			'./algorithm/dp',	
		]
	},
	

	
	{
		title: '数据库系统概论',
		collapsable: true,
		children: [
		    './database/relation',
		    './database/sql',
		    './database/design',
		]
	},
	
	
]
