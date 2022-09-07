
module.exports = [

	
	{
		title: '计算机网络',
		collapsable: true,
		children: [
			'./basic/phy',
			{
			  title: "数据链路层",
			  collapsable: true,
			  children: [
			    './basic/datalinkI',
			    './basic/datalinkII',		
			  ]
		        },
			'./basic/networkI',
		]
	},
	
	{
		title: 'TCP/IP Socket in C',
		collapsable: true,
		children: [
			'./socket/tcp',
			'./socket/udp',
		]
	}
]
