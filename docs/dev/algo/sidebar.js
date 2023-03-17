module.exports = [
	{
		title: "算法设计与分析",
		collapsable: true,
		children: [
			'./base/outline-recursive-divide',
			'./base/dp-greedy',
			'./base/backtracking-branchbound-lp-networkflow',
		]
	},

	{
		title: "具体算法实现",
		collapsable: true,
		children: [
			'./design/modeling-hash-binary',
			'./design/recursion-divide',
			{
				title: "搜索和排序",
			    	collapsable: true,
			    	children: [
						'./design/sort',
			        		'./design/bfs',
		    	        		'./design/dfs-backtracking',
			        		
			    	]
		   	 },
			'./design/dp-greedy',
		]
	},

	
	
]
