
module.exports = [

	{
		title: '计算机组成原理',
		collapsable: true,
		children: [
			'./basic/outline',
			'./basic/bus',
			'./basic/memory',
			'./basic/io',
			'./basic/num',	
			'./basic/instruction',
			'./basic/cpu',
		]
	},

	{
		title: '电子技术基础',
		collapsable: true,
		children: [
			'./circuit/door',
			'./circuit/combine',
			'./circuit/trigger',
			'./circuit/time',		
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
					'./ic/verilog-cpu',
			    ]
			},
		]
	},
	

	
]
