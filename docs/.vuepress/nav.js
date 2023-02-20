//主管控导航栏

module.exports = [

    {
       	text: 'Home',
	items: [
	    {text: 'Docs', link: '/'},
	    {text: 'Blog', link: 'https://northpolar.netlify.app/'},
	    {text: 'Github', link: 'https://github.com/northboat'},
	    {text: 'Index', link: 'https://northboat.github.io/'},
        ]
	
    },	

    {
       	text: 'Developer',
	items: [
	    {text: 'Front End', link: '/dev/fe/'},
	    {text: 'Java', link: '/dev/java/'},
	    {text: 'Operations', link: '/dev/ops/'},
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
	    {text: 'Python', link: '/ai/python/'},
	    {text: 'Math', link: '/ai/math/'},
	    {text: 'Machine Learning', link: '/ai/machine/'},
	    //{text: 'Deep Learning', link: '/ai/deep/'}
	]
    }


]
