//主管控导航栏

module.exports = [

    {
        text: 'Home', link: '/'
    },	

    {
        text: 'Developer',
	items: [
            {text: 'C/C++', link: '/dev/c/'},
            {text: 'Java', link: '/dev/java/'},
	    {text: 'Front End', link: '/dev/frontend/'},
	    {text: 'DevOps', link: '/dev/devops/'},
        ]
    },

	
    {
	text: '408',
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
	    {text: 'Math', link: '/ai/math/'},
	    {text: 'Python', link: '/ai/python/'},
	    {text: 'ML', link: '/ai/ml/'},
	]
    }


]
