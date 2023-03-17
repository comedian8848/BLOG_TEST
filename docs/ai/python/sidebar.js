module.exports = [
	{
		title: 'Python3',
		collapsable: true,
		children: [
		    './base/build',
		    {
			title: "Python Hundred",
		        collapsable: true,
			children: [
		                './base/first',
		                './base/second',
			    	'./base/third',		
			]
		    },
		    './base/dev',
		]
	},

	{
		title: '数据科学库',
		collapsable: true,
		children: [
			'./lib/numpy',
			'./lib/pandas',
			'./lib/scipy',
			'./lib/matplotlib',
		]
	},


]
