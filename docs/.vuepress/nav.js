//主管控导航栏

module.exports = [

    {
        text: 'Home', link: '/'
    },	

    {
        text: 'Developer',
	items: [
            {text: 'C/C++', link: '/dev/c/'},
	    {text: 'Ops', link: '/dev/ops/'},
	    {text: 'Front End', link: '/dev/frontend/'},
	    {text: 'Java', link: '/dev/java/'},    
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
	    {text: 'Mathematics', link: '/ai/math/'},
	    {text: 'Python', link: '/ai/python/'},
	    {text: 'Machine Learning', link: '/ai/ml/'},
	    {text: 'Deep Learning', link: 'https://northboat-blog.netlify.app/album/'}
	]
    }


]
