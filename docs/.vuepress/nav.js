//主管控导航栏

module.exports = [

    {
        text: 'Home', link: '/'
    },	

    {
        text: 'Developer',
	items: [
	    {text: 'Front End', link: '/dev/fe/'},
	    {text: 'Back End', link: '/dev/be/'},
           	    {text: 'Integrated Circuit', link: '/dev/ic/'},
	    {text: 'Operations', link: '/dev/ops/'},
        ]
    },

	
    {
	text: 'Major',
	items: [
	    {text: 'Data Struct', link: '/408/datastruct/'},
	    {text: 'Network', link: '/408/network/'},
	    {text: 'Operating System', link: '/408/operating/'}, 
	    {text: 'Organization', link: '/408/organization/'},
   
	]
    },
	
    {
	text: 'Artificial Intelligence', 
	items: [
	    {text: 'Mathematics', link: '/ai/math/'},
	    {text: 'Program', link: '/ai/program/'},
	    {text: 'Machine Learning', link: '/ai/machine/'},
	    //{text: 'Deep Learning', link: '/ai/deep/'}
	]
    }


]
