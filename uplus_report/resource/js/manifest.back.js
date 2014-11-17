var _ = window;

;require.config({
	baseUrl: _.url.resource,
	paths: {
		jQuery: 'js/jQuery.min',
		less: 'js/less.min',
		doT: 'js/doT.min',
		loaded: 'js/imagesloaded.pkgd.min',
		masonry: 'js/masonry.min',
		fancybox: 'plugin/fancybox/jquery.fancybox.pack',
		Youjia: 'js/Youjia',
		action: 'js/action'
	}
}),

require('jQuery loaded masonry fancybox Youjia'.split(' '), function($){

	require('action'.split(' '));

});