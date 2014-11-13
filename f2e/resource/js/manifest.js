;require.config({
	// baseUrl: '/resource',
	paths: {
		jQuery: '/resource/js/jQuery.min',
		less: '/resource/js/less.min',
		doT: '/resource/js/doT.min',
		loaded: '/resource/js/imagesloaded.pkgd.min',
		masonry: '/resource/js/masonry.min',
		fancybox: '/resource/plugin/fancybox/jquery.fancybox.pack',
		Youjia: '/resource/js/Youjia',
		action: '/resource/js/action'
	}
}),

require('jQuery loaded masonry fancybox Youjia'.split(' '), function($){

	require('action'.split(' '));

});