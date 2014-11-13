;(function(_, $, undefined){

_.path = {

	// Base Root
	root: _.location.protocol + '//' + _.location.host,

	// Params
	params: function(params){
			params = params.match(/\w+\=\w+/g);
			
			if( !params || !params.length ){
				return undefined;
			}

			var paramsJson = {};
			for( var i = 0; i < params.length; i++ ){
				var item = params[i].split('=');
				paramsJson[item[0]] = item[1];
			}

			return paramsJson;
		}( _.location.search ),

	// Hash
	hash: _.location.hash.replace(/^#/, '')
},

_.dom = {
	win:     $(window),
	doc:     $(document),
	bod:     $(document.body),
	head:    $('header'),
	foot:    $('footer'),
	aside:   $('aside'),
	section: $('section')
},

_.evt = [
	{
		click: 'touchstart',
		over: 'touchstart',
		out: 'touchend',
		down: 'touchstart',
		move: 'touchmove',
		up: 'touchend'
	},
	{
		click: 'click',
		over: 'mouseover',
		out: 'mouseout',
		down: 'mousedown',
		move: 'mousemove',
		up: 'mouseup'
	}
][ !!~navigator.userAgent.indexOf('Mobile') ? 0 : 1 ];


/* !!
 * Extend jQuery
 * ** *** **** ***** **** *** ** *
 */
$.extend({
	isType: function(data, type){
		return !!(typeof data == type);
	},
	drag: function(options){
		
		options = options || {}
		
		/* Window Object For Move On And Capture Or Release */
		, options.win = $(window)
		
		/* Selector: Back Board */
		, options.board = $(options.board || document)
		
		/* Selector: Move Items */
		, options.mover = options.move || '.drag-item'
		
		/* Mouse Coordinates */
		, options.mouseCoor = {
				x: 0, y: 0
			}
		/* Default Coordinates */
		, options.initCoor = {
				x: 0, y: 0
			}
		/* Move Coordinates */
		, options.moveCoor = {
				x: 0, y: 0
			}
		/* Position Coordinates */
		, options.posiCoor = {
				x: 0, y: 0
			}
		
		/* Clear Database Function */
		, options.clearDatabase = function(){
			options.initCoor.x = 0,
			options.initCoor.y = 0;
			options.moveCoor.x = 0,
			options.moveCoor.y = 0;
			options.posiCoor.x = 0,
			options.posiCoor.y = 0;
			
			options.target = undefined;
		}
		/* Target Control */
		, options.target = undefined
		
		/* Drag Start Handle */
		, options.dragStartHandle = function(e){
			
			/* Compatible ClientX And ClientY */
			e = e || {}
			, e.clientX = e.clientX || 0
			, e.clientY = e.clientY || 0;
			
			/* Get Item Target */
			options.target =  $(this);// $(e.target);
			
			options.initCoor.x = e.clientX,
			options.initCoor.y = e.clientY;
			
			options.posiCoor.x = options.target.position().left,
			options.posiCoor.y = options.target.position().top;
			
			/* Capture Events */
			window.captureEvents(Event.MOUSEMOVE);
			
			/* Callback: On Drag Start */
			options.onDragstart( options );
		}
		/* Drag Move Handle */
		, options.dragMoveHandle = function(e){
		
			if( !options.target ){
				return;
			}
			
			options.moveCoor.x = e.clientX - options.initCoor.x + options.posiCoor.x,
			options.moveCoor.y = e.clientY - options.initCoor.y + options.posiCoor.y;
			
			options.target.css({
				left: options.moveCoor.x,
				top: options.moveCoor.y
			});
			
			/* Callback: On Drag Move */
			options.onDragmove( options );
		}
		/* Drag Up Handle */
		, options.dragUpHandle = function(e){
			
			/* Capture Events */
			window.releaseEvents(Event.MOUSEMOVE);
			
			/* Cache Mouse Coor */
			options.mouseCoor.x = e.clientX,
			options.mouseCoor.y = e.clientY;
			
			/* Callback: On Drag End */
			options.onDragend( options );
			
			/* Clear Database */
			options.clearDatabase();
		}
		
		/* Off Events */
		, options.cancel = function(){
			
			/* Event Agent At Start */
			options.board.undelegate( options.mover, $.evt.down, options.dragStartHandle );
			
			/* Bind Event At Move */
			options.win.off( $.evt.move, options.dragMoveHandle );
			
			/* Bind Event At Up */
			options.win.off( $.evt.up, options.dragUpHandle );
		}
		/* Execute Drag */
		, options.init = function(){
			
			/* Event Agent At Start */
			options.board.delegate( options.mover, _.evt.down, options.dragStartHandle ),
			
			/* Bind Event At Move */
			options.win.on( _.evt.move, options.dragMoveHandle ),
			
			/* Bind Event At Up */
			options.win.on( _.evt.up, options.dragUpHandle ),
		
			/* Bind Event Before Drag */
			options.onDragbefore( options );
			
			/* Amazing Api */
			return { cancel: options.cancel };
		};
		
		/* Detect Events */
		$.each('onDragbefore onDragstart onDragmove onDragend'.split(' '), function(i, e){
			options[e] = typeof options[e] === 'function' ? options[e] : $.noop;
		});
		
		return options.init();
	},
	taber: function(options){
		options = options || {}
		, options.container = options.container ? $(options.container) : _.dom.bod
		, options.menus = options.menus || undefined
		, options.contents = options.contents || undefined
		, options.event = options.event || _.evt.click
		, options.active = options.active || 'active'
		, options.index = options.index || 0
		, options.def = $.isType(options.def, 'boolean') ? options.def : true
		, options.callback = options.callback || $.noop;

		$.each(options.container, function(i, container){

			container = $(container);

			var menus = container.find( options.menus ),
				contents = container.find( options.contents );
			
			container.delegate(options.menus, options.event, function(e){
				
				options.index = menus.index( this );

				menus.removeClass( options.active ).eq( options.index ).addClass( options.active );

				if( contents.length ){
					contents.hide().eq( options.index ).show();
				}

				options.callback( this, options.index );
			});

			if( options.def ){
				menus.eq(0).trigger( options.event );
			}

		});
	},
	timeout: function(options){
		options = options || {}
		, options.callback = options.callback || $.noop
		, options.time = options.time || 150
		, options.count = Math.abs( options.count || 1 )
		, options.timeout
		, options.action = function(){
			if( options.count ){
				options.timeout = _.setTimeout(function(){
					options.callback();
					options.count--;
					_.clearTimeout( options.timeout );
					options.action();
				}, options.time);
				return;
			}
			return false;
		};

		options.action();
	},
	checkResult: function(result, callback){
		result = result || {}, callback = callback || $.noop;
		if( result.error ){
			callback(result), $.trace( result.message || '错误' );
			return false;
		}
	},
	formSubmit: function(options){
		options = options || {}
		, options.form = options.form || 'data-submit';

		$.each( $('[' + options.form + ']'), function(x, form){
			form = $(form);

			var formData = $.getData( form ),
				option = {
					name: options.name || 'data-name',
					value: options.value || 'data-value',
					method: options.method || formData.method || form.attr('method'),
					type: formData.submit,
					url: options.url || formData.action || form.attr('action'),
					callback: formData.callback ? $.formFn[ formData.callback ] : $.noop,
					data: {}
				};

			form.on('submit', function(){

				if( option.type == 'ajax' ){
					$.each( form.find('[' + option.name + ']'), function(i, item){
						item = $(item), option.data[ item.attr( option.name ) ] = item.attr( option.value );
					});
					$.ajax({
						type: option.method,
						url: option.url,
						data: option.data,
						success: function(result){
result = {
	error: true,
	message: 'This is a Error Message !!'
};
							$.checkResult(result, function( result ){
								option.callback( result );
							});

						}
					});

					return false;
				}

			});
		});
	},
	getData: function(element){
		var data = {}, it = $(element);
		it.prop('outerHTML').replace(/data-\w+/g, function(attr){
			data[ attr.substr(5) ] = it.attr( attr );
		});
		return data;
	},
	mergeJSON: function(){
		var data = {};
		$.each(arguments, function(x, json){
			$.each(json, function(i, v){
				data[i] = v;
			});
		});
		return data;
	},
	renderHTML: function(options){
		options = options || {}
		, options.element = options.element || undefined
		, options.data = options.data || undefined
		, options.html = options.html || undefined
		, options.type = options.type || 'get'
		, options.dataType = options.dataType || 'json'
		, options.callback = options.callback || $.noop
		, options.action = function( data ){
			if( options.html ){
				$.ajax({
					type: 'get',
					url: options.html,
					success: function(html){
						options.callback( (options.render = doT.template( html )(data), options) );
					}
				});
				return;
			}
			options.callback( (options.render = doT.template( $(options.element).html() )(data), options) );
		};

		if( !_.doT ){
			return;
		}

		if( $.isType(options.data, 'string') ){
			$.ajax({
				type: options.type,
				dataType: options.dataType,
				url: options.data,
				success: function( data ){
					data = $.isType(data, 'string') ?
						function(data){
							try{
								data = $.parseJSON(data);
							}
							catch(e){
								data = eval('(' + data + ')');
							}
							return data;
						}( data ):
						data;
					options.action( $.isType(data, 'string') ? $.parseJSON(data) : data );
				}
			});
			return;
		}

		options.action( options.data );
	},
	initMasonry: function(options){
		options = options || {}
		, options.element = options.element || undefined
		, options.selector = options.selector || undefined;

		if( !$.fn.masonry ){
			return;
		}
		if( _.masonryObject ){
			_.masonryObject.masonry('reload');
			return;
		}
		_.masonryObject = $(options.element);
		$(options.element).masonry({
			itemSelector: options.selector
		})
	},
	initPosition: function(options){
		options = options || {}
		, options.element = $(options.element || undefined)
		, options.children = options.children || 'li'
		, options.self = $.isType(options.self, 'boolean') ? options.self : true
		, options.left = options.left || 0
		, options.top = options.top || 0
		, options.off = options.off || { x: 0, y: 0 }
		, options.long = 0
		, options.callback = options.callback || $.noop;

		$.each( options.element.find( options.children ), function(i, item){
			options.long += $(item).outerWidth();
		});

		options.long += 2.5;

		options.element.css({
			width: options.long
			,left: options.left - (options.self ? options.long : 0) + options.off.x
			,top: options.top + options.off.y
		});

		options.callback( options );
	},
	choose: function(options){
		options = options || {}
		, options.items = $( options.items || undefined )
		, options.event = options.event || _.evt.click
		, options.active = options.active || 'active';

		options.items.on(options.event, function(e){
			var it = $(this);
			it.hasClass( options.active ) ? it.removeClass( options.active ) : it.addClass( options.active );
		});
	},
	trace: function(text){
		$.fancybox.open({
			content: text,
			closeBtn: false
		}),
		$.timeout({
			time: 3000,
			callback: function(){
				$.fancybox.close();
			}
		});
	},
	fancyPop: function(options){
		options = options || {}
		, options.container = options.container ? $(options.container) : _.dom.bod
		, options.elements = options.elements || '[data-fancy]';

		options.container.delegate(options.elements, _.evt.click, function(e){
			var it = $(this), option = $.mergeJSON( options, $.getData(it) );

			option.title = option.title || false,
			option.closeBtn = options.closeBtn || true,
			option.closeClick = options.closeClick || false,
			option.callback = option.callback || $.noop;

			$.fancybox.open({
				href: _.path.root + option.fancy,
				type: 'ajax',
				title: option.title,
				closeClick: option.closeClick,
				afterShow: $.fancyFn[ option.callback ],
				helpers: {
					title: {
						type: 'inside',
						position: 'top'
					}
				}
			});
		});
	}
});


})
(window, jQuery);