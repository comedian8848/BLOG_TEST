
module.exports = [

	{
		title: '计算机组成原理',
		collapsable: true,
		children: [
			'./basic/outline',
			'./basic/bus',
			'./basic/cpu',
			'./basic/memory',
			'./basic/io',
			'./basic/num',	
			'./basic/instruction',
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
					'./integratedcircuit/verilog-base',
					'./integratedcircuit/verilog-advanced',
			    ]
			},
		]
	},
	

	
]
