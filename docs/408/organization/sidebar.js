
module.exports = [

	{
		title: '计算机组成原理',
		collapsable: true,
		children: [
			'./basic/outline',	
			'./basic/num',	
			'./basic/memory',
			'./basic/command',
			'./basic/cpu',
			'./basic/bus',
			'./basic/io',
		]
	},

	{
		title: '电子技术基础',
		collapsable: true,
		children: [
			'./digitalcircuit/door',
			'./digitalcircuit/combine',
			'./digitalcircuit/trigger',
			'./digitalcircuit/time',		
		]
	},

	{
		title: "集成电路设计",
		collapsable: true,
		children: [
			{
			    title: "Verilog",
			    collapsable: true,
			    children: [
					'./ic/verilog-base',
					'./ic/verilog-advanced',
			    ]
			},
		]
	},
	

	
]
