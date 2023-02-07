
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
			        './c/lisp',
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
				'./algo/basic/outline-recursive-divide',
				'./algo/basic/dp-greedy',
				'./algo/basic/backtracking-branchbound-lp-networkflow',
			    ]
		   	 },	
			{
			    title: "算法实现",
			    collapsable: true,
			    children: [
				'./algo/leetcode/modeling-hash-binary',
				'./algo/leetcode/recursion-divide',
				{
			    		title: "搜索和排序",
			    		collapsable: true,
			    		children: [
			        			'./algo/leetcode/bfs',
		    	        			'./algo/leetcode/dfs-backtracking',
			        			'./algo/leetcode/sort',
			    		]
		   	 	},
				'./algo/leetcode/dp-greedy',
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
