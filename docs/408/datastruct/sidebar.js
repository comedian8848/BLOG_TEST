
module.exports = [


	{
		title: '数据结构',
		collapsable: true,
		children: [
			{
			    title: "数据结构实现及相关算法",
			    collapsable: true,
			    children: [
			        './base/struct',
				'./base/algorithm',
			    ]
		   	 },
						
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
		title: '数据库系统概论',
		collapsable: true,
		children: [
		    './data/intro',
		    './data/sql',
		    './data/design',
		]
	},
	
	
]
