module.exports = [
	{
		title: 'Python3',
		collapsable: true,
		children: [
		    './basic/build',
		    {
			title: "Python Hundred",
		                collapsable: true,
			children: [
		                    './basic/one',
		                    './basic/nine',
			    './basic/seventeen',		
			]
		    },
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

	{
		title: '简单开发',
		collapsable: true,
		children: [
			'./dev/shadow',
		]
	},


]
