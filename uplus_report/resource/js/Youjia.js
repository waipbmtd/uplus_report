;(function(_, $, undefined){

/* !!
 * 路径
 * ** *** **** ***** **** *** ** *
 */
_.path = {

	// Base Root
	root: _.location.protocol + '//' + _.location.host,

	// Base Resource
	resource: _.url.resource || '',

	// Base Template
	template: function(page){
		return _.path.root + '/get_template?page=' + page + '.html';
	},

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

/* !!
 * 数据接口
 * ** *** **** ***** **** *** ** *
 */
_.api = {
	// 获取剩余消息数
	remain: '/report/remain',
	// 获取Album
	albums: '/report/album_image/list',
	// 获取Message
	message: '/report/message/next',
	// 审核未通过
	punish: '/punish',
	// 审核通过接口
	pass: '/pass'
},

/* !!
 * 模板接口
 * ** *** **** ***** **** *** ** *
 */
_.tpl = {
	albums: _.path.template('albums'),
	message: _.path.template('message'),
	operat: _.path.template('operat')
},

/* !!
 * 节点对象
 * ** *** **** ***** **** *** ** *
 */
_.dom = {
	win:     $(window),
	doc:     $(document),
	bod:     $(document.body),
	head:    $('header'),
	foot:    $('footer'),
	nav:     $('nav'),
	aside:   $('aside'),
	section: $('section')
},

/* !!
 * 翻译
 * ** *** **** ***** **** *** ** *
 */
_.enum = {},
$.get('/enum/all', function(data){
	_.enum = data;
}),

/* !!
 * 事件
 * ** *** **** ***** **** *** ** *
 */
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
	inGroup: function(item, data){
		if( $.isType(data, 'array') ){
			return !!~$.inArray(item, data);
		}
		if( $.isType(data, 'object') ){
			return !!(item in data);
		}
		if( $.isType(data, 'string') ){
			return !!~data.indexOf(item);
		}
		return undefined;
	},
	escape: function(word, mode){
		if( $.isType(word, 'number') || $.isType(word, 'string') ){
			return _.enum[mode][word];
		}
		if( $.isType(word, 'object') ){
			var result = '';
			$.each(word, function(i, v){
				result += (i ? ', ' : '') + _.enum[mode][v];
			});
			return result;
		}
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
		, options.def = $.isType(options.def, 'boolean') ? options.def : false
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

		if( options.def ){
			options.callback();
		}

		options.action();
	},
	checkResult: function(result, callback){
		result = result || {}, callback = callback || $.noop;
		return result.ret == 1 ? ($.trace( result.info || '错误' ), false) : (callback(result), true);
	},
	formSubmit: function(options){
		options = options || {}
		, options.form = options.form || 'data-submit'
		, options.database = options.database || undefined
		, options.instead = $.isType(options.instead, 'function') ? options.instead : undefined;

		$.each( $('[' + options.form + ']'), function(x, form){
			form = $(form);

			form.on('submit', function(){

				var formData = $.getData( form ),
					option = {
						name: options.name || 'data-name',
						value: options.value || 'data-value',
						method: options.method || formData.method || form.attr('method'),
						type: formData.submit,
						instead: options.instead,
						database: options.database,
						url: options.url || formData.action || form.attr('action'),
						callback: formData.callback ? $.formCall[ formData.callback ] : $.noop,
						data: {}
					};

				$.each( form.find('[' + option.name + ']'), function(i, item){
					item = $(item);
					if( !item.is(':hidden') ){
						option.data[ item.attr( option.name ) ] = item.attr( option.value );
					}
				});

				if( option.instead ){
					option.instead( option );
					return false;
				}

				if( option.type == 'ajax' ){
					$.ajax({
						type: option.method,
						url: option.url,
						data: option.data,
						success: function(result){
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
		, options.than = $.isType(options.than, 'object') ? options.than : undefined
		, options.type = options.type || 'get'
		, options.dataType = options.dataType || 'json'
		, options.callback = options.callback || $.noop
		, options.action = function( data ){
			if( options.html ){
				$.ajax({
					type: 'get',
					url: options.html,
					success: function(html){
						options.callback( (options.render = doT.template( html )(data), (options.database = data, options)) );
					}
				});
				return;
			}
			options.callback( (options.render = doT.template( $(options.element).html() )(data), (options.database = data, options)) );
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

					data = options.than ? $.mergeJSON(data, options.than) : data;

					$.checkResult(data, function(){
						options.action( data );
					});
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
		, options.block = options.block || undefined
		, options.event = options.event || _.evt.click
		, options.active = options.active || 'active';

		options.items.on(options.event, function(e){
			if( options.block && $(e.target).closest( options.block ).length ){
				return;
			}
			var it = $(this);
			it.hasClass( options.active ) ? it.removeClass( options.active ) : it.addClass( options.active );
		});
	},
	trace: function(text, callback){
		callback = callback || $.noop;

		$.fancybox.open({
			content: '<div class="trace">' + text + '</div>',
			minHeight: 20,
			closeBtn: false
		}),
		$.timeout({
			time: 2000,
			callback: function(){
				$.fancybox.close(), callback();
			}
		});
	},
	confirm: function(text, callback){
		callback = callback || $.noop;

		var html = '<div class="confirm">'
				 + '<p>' + text + '</p>'
				 + '<hr class="line-gray" />'
				 + '<button type="button" class="btn-gray">取消</button>'
				 + '<button type="button" class="btn-green">确定</button>'
				 + '</div>'

		$.fancybox.open({
			content: html,
			closeBtn: false,
			afterShow: function(){

				$.each( $('.confirm'), function(i, dialog){
					dialog = $(dialog),
					dialog.find('button:eq(0)').on(_.evt.click, function(){
						$.fancybox.close();
					}),
					dialog.find('button:eq(1)').on(_.evt.click, function(){
						if( callback() ){
							$.fancybox.close();
						}
					})
				});

			}
		})
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
				afterShow: function(){
					$.fancyCall[ option.callback ]( it );
				},
				helpers: {
					title: {
						type: 'inside',
						position: 'top'
					}
				}
			});
		});
	},
	sameInput: function(options){
		options = options || {}
		, options.input = $(options.input || undefined)
		, options.onKeyup = options.onKeyup || undefined
		, options.onKeydown = options.onKeydown || undefined
		, options.onKeypress = options.onKeypress || undefined;

		if( options.onKeyup ){
			options.input.on('keyup', function(e){
				return options.onKeyup( e );
			});
		}
		if( options.onKeydown ){
			options.input.on('keydown', function(e){
				return options.onKeydown( e );
			});
		}
		if( options.onKeypress ){
			options.input.on('keypress', function(e){
				return options.onKeypress( e );
			});
		}

	},
	punish: function(options, api, callback){
		options = options || {}
		, options.callback = options.callback || $.noop

		// Must
		, options.module_type = options.module_type || undefined
		, options.punish_type = options.punish_type || undefined
		, options.reason = options.reason || undefined
		, options.reporter = options.reporter || undefined
		, options.u_id = options.u_id || undefined
		, options.id = options.id || undefined
		, options.mod = options.mod || undefined

		// Optional
		, options.timedelta = options.timedelta || ''
		, options.memo = options.memo || ''
		, options.url = options.url || ''
		, options.thumb_url = options.thumb_url || ''
		, options.module_id = options.module_id || ''
		, options.msg_id = options.msg_id || ''
		, options.owner = options.owner || '';

		api = api || '/punish';

		// This Option Is Merge By 2 Options
		// console.log(options);

		$.ajax({
			type: 'post',
			data: options,
			url: api,
			success: function(result){
				$.checkResult(result, function( result ){
					callback( result );
				});
			}
		});
	},
	recursivePunish: function(options, often, api, callback){

		if( !$.isType(options, 'object') ){
			return;
		}

		callback = callback || $.noop;

		if( options.length ){
			$.punish( $.mergeJSON( options.shift(), often ), api, function(){
				$.recursivePunish( options, often, api, callback );
			});
			return false;
		}

		callback();

		return false;

	}
});


})
(window, jQuery);