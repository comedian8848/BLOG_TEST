
module.exports = [


	{
		title: '数据结构',
		collapsable: true,
		children: [
			'./basic/struct',
			'./basic/algo',			
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
			{
			    title: "算法设计与分析",
			    collapsable: true,
			    children: [
				'./algorithm/basic/outline-partition',
			    ]
		   	 },	
			{
			    title: "算法实现",
			    collapsable: true,
			    children: [
				'./algorithm/leetcode/modeling',
				'./algorithm/leetcode/hash',
				'./algorithm/leetcode/recursion',
				'./algorithm/leetcode/binary',
				{
			    		title: "搜索和排序",
			    		collapsable: true,
			    		children: [
			        			'./algorithm/leetcode/bfs',
		    	        			'./algorithm/leetcode/dfs',
			        			'./algorithm/leetcode/sort',
			    		]
		   	 	},
				'./algorithm/leetcode/greedy',
				'./algorithm/leetcode/dp',
			    ]
		   	 },				
		]
	},
	

	
	{
		title: '数据库系统概论',
		collapsable: true,
		children: [
		    './database/relation',
		    './database/design',
		    './database/sql',
		]
	},
	
	
]
