
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
		title: 'C/C++',
		collapsable: true,
		children: [
			'./c/stl',
			{
			    title: "C++ 程序设计",
			    collapsable: true,
			    children: [
			        './c/barber',
			        './c/matchman',
			    ]
		   	 },
			
		]
	},
	
	
	{
		title: '算法',
		collapsable: true,
		children: [
			'./algorithm/algo',
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
