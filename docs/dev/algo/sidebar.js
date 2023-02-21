module.exports = [
	{
		title: "算法设计与分析",
		collapsable: true,
		children: [
			'./design/outline-recursive-divide',
			'./design/dp-greedy',
			'./design/backtracking-branchbound-lp-networkflow',
		]
	},

	{
		title: "算法实现",
		collapsable: true,
		children: [
			'./achieve/modeling-hash-binary',
			'./achieve/recursion-divide',
			{
				title: "搜索 - 排序",
			    	collapsable: true,
			    	children: [
			        		'./achieve/bfs',
		    	        		'./achieve/dfs-backtracking',
			        		'./achieve/sort',
			    	]
		   	 },
			'./achieve/dp-greedy',
		]
	},

	
	
]
