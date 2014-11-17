;(function(_, undefined){

var
/* Strict Mode ? */
strict = true

/* Noop */
,noop = new Function()

/* Root */
,root = _.location.protocol + '//' + _.location.host

/* Resource: url.resource is get from python */
,resource = root + _.url.resource + 'js/'

/* Manifest */
,manifest = document.querySelector('[data-manifest]')

/* Document Head */
,head = function(head){
	return (head && head.length) ? head[0] : document.body;
}( document.getElementsByTagName('head') )

/* Require Script */
,require = function(path, callback){
	
	// Compatible With Arguments
	path = path || '', callback = callback || noop;

	// Create Script Node
	var script = document.createElement('script');

	script.src = ( /^(http|ftp)/.test( path ) ? path : resource + path ) + '.js'
	, script.type = 'text/javascript'
	, script.async = true;

	// Append Script To Head
	head.appendChild( script );

	// Listener Script
	script.onload = script.onreadystatechange = function(){
		if ( (!this.readyState) || this.readyState == 'complete' || this.readyState == 'loaded' ){
			// Do Callback
			callback( this );
		} 
	}
}

/* Recursive Require */
,recursive = function(arr, callback){
	callback = callback || noop;
	
	if( !arr.length ){
		return callback();
	}
	require(arr.shift(), function(){
		recursive(arr, callback);
	});
};

/* Run Default Manifest */
require( root + manifest.getAttribute('data-manifest'), function(e){
	recursive( _.modules ? _.modules.split(' ') : [], function(){
		console.log('All Script Loaded !!');
	});
});

})
(window);