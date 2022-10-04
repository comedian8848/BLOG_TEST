
module.exports = [
	{
		title: 'Linux',
		collapsable: true,
		children: [
		    './linux/centos',
		    './linux/manjaro',
		]
	},
	
	{
		title: '工具',
		collapsable: true,
		children: [
		    './tool/git',
		    {
			title: "Docker",
			collapsable: true,
			children: [
			    './tool/dockerI',
			    './tool/dockerII',			
			]
		    },
			
		]
	},
	
	{
		title: '杂项',
		collapsable: true,
		children: [
		    './misc/wechall',
		]
	},
	
	
]
