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
	text: 'Major',
	items: [
	    {text: 'Data Struct', link: '/major/datastruct/'},
	    {text: 'Network', link: '/major/network/'},
	    {text: 'Operating System', link: '/major/operating/'},
	    {text: 'Organization', link: '/major/organization/'},
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
