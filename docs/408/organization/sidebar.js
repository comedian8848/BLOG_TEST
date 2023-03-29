
module.exports = [

	{
		title: '计算机组成原理',
		collapsable: true,
		children: [
			'./base/outline',
			'./base/bus',
			'./base/memory',
			'./base/io',
			'./base/num',	
			'./base/instruction',
			'./base/cpu',
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
			    title: "Verilog 基础",
			    collapsable: true,
			    children: [
					'./ic/experiment',
					'./ic/cpu',
			    ]
			},
			'./ic/interface',
		]
	},
	

	
]
