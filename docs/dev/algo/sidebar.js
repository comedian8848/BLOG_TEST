module.exports = [
	{
		title: "算法设计与分析",
		collapsable: true,
		children: [
			'./basic/outline-recursive-divide',
			'./basic/dp-greedy',
			'./basic/backtracking-branchbound-lp-networkflow',
		]
	},

	{
		title: "算法实现",
		collapsable: true,
		children: [
			'./design/modeling-hash-binary',
			'./design/recursion-divide',
			{
				title: "搜索 - 排序",
			    	collapsable: true,
			    	children: [
			        		'./design/bfs',
		    	        		'./design/dfs-backtracking',
			        		'./design/sort',
			    	]
		   	 },
			'./design/dp-greedy',
		]
	},

	
	
]
