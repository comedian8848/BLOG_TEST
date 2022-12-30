
module.exports = [
	
	{
		title: '操作系统',
		collapsable: true,
		children: [
			'./basic/outline',
			{
			    title: 'CPU 管理',
			    collapsable: true,
			    children: [
			    	'./basic/thread',
				'./basic/scheduling',
				'./basic/synchronized',
				'./basic/deadlock',
			    ]
			},
			{
			    title: '存储管理',
			    collapsable: true,
			    children: [
			    	'./basic/memory',
					'./basic/virtual',
			    ]
			},
			'./basic/file',
			'./basic/experiment',
			
		]
	},

	{
		title: '汇编语言',
		collapsable: true,
		children: [
			'./assembly/basic',
			{
			    title: '汇编程序设计',
			    collapsable: true,
			    children: [
				'./assembly/branch',
				'./assembly/loop',
			    ]
			},
		]
	},
	
	{
		title: '编译原理',
		collapsable: true,
		children: [
			'./compile/basic',
			{
			    title: '编译前端设计',
			    collapsable: true,
			    children: [
				'./compile/lexer',
				'./compile/parser',
			    ]
			},
			'./compile/lisp',
		]
	},
	
]
