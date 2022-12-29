module.exports = [
	{
		title: 'Python',
		collapsable: true,
		children: [
		    './python/build',
		    {
			title: "Python 100",
		        collapsable: true,
			children: [
		            './python/one',
		            './python/nine',
			    './python/seventeen',		
			]
		    },
		]
	},

	{
		title: '小玩具',
		collapsable: true,
		children: [
			'./toy/well',
			'./toy/gridworld',
			'./toy/mousecat',
		]
	},

	{
		title: '数据科学库',
		collapsable: true,
		children: [
			'./lib/numpy',
			'./lib/pandas',
			'./lib/scipy',
			'./lib/visual',
		]
	},


]
