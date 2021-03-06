<!--
/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
	var o = {
	"M+" : this.getMonth()+1, //月份
	"d+" : this.getDate(), //日
	"h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
	"H+" : this.getHours(), //小时
	"m+" : this.getMinutes(), //分
	"s+" : this.getSeconds(), //秒
	"q+" : Math.floor((this.getMonth()+3)/3), //季度
	"S" : this.getMilliseconds() //毫秒
	};
	var week = {
	"0" : "/u65e5",
	"1" : "/u4e00",
	"2" : "/u4e8c",
	"3" : "/u4e09",
	"4" : "/u56db",
	"5" : "/u4e94",
	"6" : "/u516d"
	};
	if(/(y+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
	}
	if(/(E+)/.test(fmt)){
		fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
	}
	for(var k in o){
		if(new RegExp("("+ k +")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
		}
	}
	return fmt;
}



;(function(_, $, undefined){

_.console = _.console || { log: $.noop },

_.report_type = $.trim(_.report_type).length ? Number(_.report_type) : 0,

_.select_remain = undefined,

_.globalLock = false,

/* !!
 * 路径
 * ** *** **** ***** **** *** ** *
 */
_.path = {

	// Base Root
	root: _.location.protocol + '//' + _.location.host,

	// Base webSocket
	ws: 'ws://' + _.location.host,

	// Base Domain: (No Port)
	domain: _.location.protocol + '//' + _.location.hostname,

	// Base Resource
	resource: (_.url && _.url.resource) ? _.url.resource : '',

	// Base Template
	template: function(page){
		return _.path.root + '/api/1/get_template?page=' + page + '.html';
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
	// Report End
	end: '/api/1/report/end?report_type=' + _.report_type,

	// 获取剩余消息数
	remain: '/api/1/report/remain',
	// 获取所有剩余消息数
	remain_all: '/api/1/report/remain/all',
	// 获取Album
	albums: '/api/1/report/album_image/list' + '?report_type=' + _.report_type,
	// 获取Message
	message: '/api/1/report/message/next' + '?report_type=' + _.report_type,
	// 审核未通过
	punish: '/api/1/punish' + '?report_type=' + _.report_type,
	// 审核通过接口
	pass: '/api/1/pass' + '?report_type=' + _.report_type,
	// 批量审核接口
	report_batch: '/api/1/report/batch_deal' + '?report_type=' + _.report_type,

	// 获取高危用户列表
	user_risk_list: '/api/1/user/risk/list',
	// 获取特殊用户列表
	user_special_list: '/api/1/user/special/list',
	// 单个高危用户: Get->获取, Post->添加
	user_risk: '/api/1/user/risk',
	// 单个特殊用户: Get->获取, Post->添加
	user_special: '/api/1/user/special',

	// 获取用户日志
	user_punish_log: '/api/1/user/punish/log',

	// 获取用户(客服)列表
	user_list: '/api/1/user/list',
	// 获取用户详细
	user_detail: '/api/1/user/log/list',

	// 获取视频信息
	video_next: function( resource, report ){
		return '/api/1/report/video/next?resource_type=' + resource + '&report_type=' + report
	},

	// 获取 User Profile
	user_profile: function( uid ){
		return '/api/1/user/profile?u_id=' + uid;
	},
	// 获取Profile
	report_profile: function( rid ){
		return '/api/1/report/' + rid + '/profile';
	}
},

/* !!
 * 模板接口
 * ** *** **** ***** **** *** ** *
 */
_.tpl = {
	albums: _.path.template('loaded/albums'),
	message: _.path.template('loaded/message'),
	operat: _.path.template('loaded/operat'),
	users: _.path.template('loaded/users'),
	users_punish: _.path.template('loaded/users_punish'),
	users_special: _.path.template('loaded/users_special'),
	users_risk: _.path.template('loaded/users_risk'),
	users_sheet: _.path.template('loaded/users_sheet'),
	select_panel: _.path.template('loaded/select_panel'),
	user_detail: _.path.template('loaded/user_detail'),
	user_profile: _.path.template('loaded/user_profile'),
	video_next: _.path.template('loaded/video_next')
},

/* !!
 * 键值
 * ** *** **** ***** **** *** ** *
 */
_.keys = {
	// 数字
	number: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
	// 负数
	negative: [109, 173],
	// 点
	point: [110, 190],
	// 退格
	back: [8]
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
$.get('/api/1/enum/all', function(data){
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
    /*return resource type identify （1,4：图片， 2：，3：）*/
 	resType: function(url){
        var re = /^.*resource_type\/(\d{1})\d+\/resource_id.*$/i;
        var arr = re.exec(url);
        if(arr != null && arr.length == 2){
            return arr[1];
        }
        return -1;
	},
	drag: function(options){
		
		options = options || {}
		
		/* Window Object For Move On And Capture Or Release */
		, options.win = $(window)
		
		/* Selector: Back Board */
		, options.board = $(options.board || document)
		
		/* Selector: Move Items */
		, options.mover = options.move || '.drag-item'

		/* Selector: Move Target */
		, options.nation = options.nation || options.move
		
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
			if( e.target.tagName.toLowerCase() != options.nation ){
				return;
			}

			options.target = $(e.target).closest( options.mover );

			if( !options.target.length ){
				return;
			}
			
			options.initCoor.x = e.clientX,
			options.initCoor.y = e.clientY;
			
			options.posiCoor.x = options.target.position().left,
			options.posiCoor.y = options.target.position().top;
			
			/* Capture Events */
			if( window.captureEvents ) window.captureEvents(Event.MOUSEMOVE);
			
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
			if( window.releaseEvents ) window.releaseEvents(Event.MOUSEMOVE);
			
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
			options.board.undelegate( options.target, $.evt.down, options.dragStartHandle );
			
			/* Bind Event At Move */
			options.win.off( $.evt.move, options.dragMoveHandle );
			
			/* Bind Event At Up */
			options.win.off( $.evt.up, options.dragUpHandle );
		}
		/* Execute Drag */
		, options.init = function(){
			
			/* Event Agent At Start */
			options.board.delegate( options.target, _.evt.down, options.dragStartHandle ),
			
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
	dataTo: function(from, to, rules){

		if( !$.isPlainObject(from) || !$.isPlainObject(to) || !$.isArray(rules) ){
			return false;
		}

		$.each(rules, function(key, value){
			to[ key ] = from[ key ] || '';
		});

		return to;

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
	cookie: function(){
		var cookie = document.cookie;
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
					var callResult = options.callback( options );

					if( $.isType(callResult, 'number') ){
						options.time = callResult;
					}

					options.count--;
					_.clearTimeout( options.timeout );
					options.action();
				}, options.time);
				return;
			}
			return false;
		};

		if( options.def ){
			options.callback( options );
		}

		options.action();
	},
	patternDate: function(data, fmt){
		return data.pattern(fmt || 'yyyy-MM-dd hh:mm:ss');
	},
	timePicker: function(options){
		options = options || {}
		, options.items = (options.items instanceof jQuery) ? options.items : $(options.items || 'data-datepicker')
		, options.input = $.isType(options.input, 'boolean') ? options.input : false;

		$.each( options.items, function(i, item){
			item = $(item);
			var itemData = $.getData( item );
			item.datepicker( $.mergeJSON( options, itemData ) );

			if( itemData.diff ){
				var date = new Date( new Date().getTime() + eval('(' + itemData.diff + ')') * 86400 * 1000 );
				data = $.patternDate(date, 'yyyy-MM-dd');
				item.val( data ).attr('data-value', data);
			}

			item.on('keydown', function(e){
				if( e.keyCode == 13 ){
					return true;
				}
				return options.input;
			});
		});
	},
	formatDate: function(time){
		return new Date(time).toLocaleString();
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

				try{

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
						if( !item.is(':hidden') || item.is('[type=hidden]') ){
							option.data[ item.attr( option.name ) ] = item.attr( option.value );
						}
					});

				}
				catch(e){
					console.log(e);
				}

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
								option.callback( result, form );
							});
						}
					});

					return false;
				}

				// 老是报错，毛了，干脆直接阻止吧！
				return false;

			});
		});
	},
	getData: function(element){
		var data = {}, it = $(element);
		if( !it.length ){
			return data;
		}
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
	mergeArray: function(){
		var data = [],
			doMerge = function( arr ){
				if( arr.length ){
					data = data.concat( arr.shift() ), doMerge( arr );
				}
			};
		doMerge( Array.prototype.slice.call(arguments) );
		return data;
	},
	pagination: function(current, total, count){
		total, current;
		var
			count = count || 5,
			diff = 0,
			start = current - count,
			end = current + count;

		if( total <= count * 2 + 1 ){
			start = 1, end = total;
		}
		else{
			if( start < 1 ){
				start = 1, end += (count - current);
			}
			if( current > (total - count) ){
				end = total, start -= (count - (total - current));
			}
		}
		// alert('start:' + start + ':::' + 'end:' + end + ':::' + 'current:' + current);
		return { start: start, end: end }
	},
	reloadHTML: function(options){
		options = options || {}
		, options.element = options.element || ''
		, options.data = options.data
		, options.callback = options.callback || $.noop;

		if( doT && options.element.length ){
			options.element.html( doT.template( options.element.html() )( options.data ) ), options.callback( options );
		}
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

				return function( tempCache ){

					if( tempCache ){
						options.callback( (options.render = doT.template( tempCache )(data), (options.database = data, options)) );
						return;
					}
					$.ajax({
						type: 'get',
						cache: true,
						url: options.html,
						success: function(html){
							_.dom.bod.data(options.html, html),
							options.callback( (options.render = doT.template( html )(data), (options.database = data, options)) );
						}
					});

				}( _.dom.bod.data( options.html ) );
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

		options.long += 5;

		options.element.css({
			width: options.long + 10
			,left: options.left - 10 - (options.self ? options.long : 0) + options.off.x
			,top: options.top + options.off.y
		});

		options.callback( options );
	},
	choose: function(options){
		options = options || {}
		, options.items = $( options.items || undefined )
		, options.block = options.block || undefined
		, options.type = !!~$.inArray(options.type, 'only one'.split(' ')) ? options.type : 'one'
		, options.event = options.event || _.evt.click
		, options.active = options.active || 'active'
		, options.callback = options.callback || $.noop;
		
		options.items.on(options.event, function(e){
			if( options.block && $(e.target).closest( options.block ).length ){
				return;
			}
			var it = $(this);

			switch( options.type ){
				case 'one':
					it.hasClass( options.active ) ? it.removeClass( options.active ) : it.addClass( options.active );
				break;
				case 'only':
					options.items.removeClass( options.active ), it.addClass( options.active );
				break;
			}

			options.callback( it, it.hasClass( options.active ) );
		});
	},
	trace: function(text, callback, time){
		callback = callback || $.noop, time = time || 300;

		$.fancybox.open({
			content: '<div class="trace">' + text + '</div>',
			minHeight: 20,
			speedIn: 100,
			speedOut: 100,
			closeBtn: false,
			scrolling: 'no',
			beforeShow: function(){
				// 全局锁
				_.globalLock = true;
			},
			afterClose: function(){
				// 全局锁
				_.globalLock = false;
			}
		}),
		$.timeout({
			time: time,
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
			speedIn: 100,
			speedOut: 100,
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

				_.dom.doc.one('keydown', function(e){
					var code = e.keyCode;
					if( code == 13 || code == 32 ){
						$('.confirm button:eq(1)').trigger( _.evt.click );
					}
				});

			},
			beforeShow: function(){
				// 全局锁
				_.globalLock = true;
			},
			afterClose: function(){
				// 全局锁
				_.globalLock = false;
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
			option.speedIn = option.speedIn || 100,
			option.speedOut = option.speedOut || 100,
			option.callback = option.callback || $.noop;

			$.fancybox.open({
				href: _.path.root + option.fancy,
				type: 'ajax',
				title: option.title,
				closeClick: option.closeClick,
				speedIn: option.speedIn,
				speedOut: option.speedOut,
				afterShow: function(){
					$.fancyCall[ option.callback ]( it );
				},
				beforeShow: function(){
					// 全局锁
					_.globalLock = true;
				},
				afterClose: function(){
					// 全局锁
					_.globalLock = false;
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
	mask: function(options){
		var loading = ''
					+ '<div class="spinner">'
					+ '<div class="spinner-container container1">'
					+ '<div class="circle1"></div>'
					+ '<div class="circle2"></div>'
					+ '<div class="circle3"></div>'
					+ '<div class="circle4"></div>'
					+ '</div>'
					+ '<div class="spinner-container container2">'
					+ '<div class="circle1"></div>'
					+ '<div class="circle2"></div>'
					+ '<div class="circle3"></div>'
					+ '<div class="circle4"></div>'
					+ '</div>'
					+ '<div class="spinner-container container3">'
					+ '<div class="circle1"></div>'
					+ '<div class="circle2"></div>'
					+ '<div class="circle3"></div>'
					+ '<div class="circle4"></div>'
					+ '</div>'
					+ '</div>';

		options = options || {}
		, options.css = 'masker'
		, options.mask = _.masker ? _.masker:
			( _.masker = $('<div class="' + options.css + '">' + loading + '</div>') )
		, options.onOpen = options.onOpen || $.noop
		, options.onClose = options.onClose || $.noop
		, options.hasMask = function(){
			return !!_.dom.bod.find('.' + options.css).length;
		}
		, options.open = function(fn){
			fn = fn || $.noop;
			options.hasMask() ? _.dom.bod.find('.' + options.css) : _.dom.bod.append( options.mask );
			fn( options.onOpen );
		}
		, options.close = function(fn){
			fn = fn || $.noop;
			options.mask.remove(), _.dom.bod.find('.' + options.css).remove();
			fn( options.onClose );
		};

		return {
			open: options.open,
			close: options.close
		};
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
		if( options.onChange ){
			options.input.on('change', function(e){
				return options.onChange( e );
			}).trigger('change');
		}

	},
	punish: function(options, api, callback){
		options = options || {}
		, options.callback = options.callback || $.noop
		, callback = callback || $.noop

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

		api = api || '/api/1/punish';

		// This Option Is Merge By 2 Options
		// console.log(options);

		// Msgs 传数组获取不到
		if( $.isType(options.msgs, 'object') ){
			options.msgs = JSON.stringify( options.msgs );
		}

		// Profile Oid To Data.Owner
		options.profile = options.profile || {},
		options.owner = options.profile.oid || '';

		$.ajax({
			type: 'post',
			data: options,
			url: api,
			beforeSend: function(){
				_.globalLock = true;
			},
			success: function(result){
				$.checkResult(result, function( result ){
					_.globalLock = false, options.callback( result ), callback();
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

			// 数字UI, 说太慢了? 有值
			if( _.masker ){
				var text = _.masker.find('.text').length ?
					_.masker.find('.text'):
					$('<div class="text">剩余：<bdo></bdo></div>').prependTo( _.masker );

				_.masker.find('.text bdo').text( options.length );
			}

			// 执行请求
			$.punish( $.mergeJSON( options.shift(), often ), api, function(){
				$.recursivePunish( options, often, api, callback );
			});
			return false;
		}

		// 数字UI, 说太慢了? 无值
		if( _.masker ){
			_.masker.find('.text').remove();
		}

		callback();

		return false;

	},
	// 异步提交数据, 因为递归请求太慢了?
	recursiveAsyc: function(options, often, api, callback){

		if( !$.isType(options, 'object') ){
			return;
		}

		callback = callback || $.noop;

		$.each(options, function(i, option){
			// 执行请求
			$.punish( $.mergeJSON( option, often ), api );
		});

		callback();
	},
	// 一次性提交
	recursiveOnce: function(options, often, api, callback){

		if( !$.isType(options, 'object') ){
			return; 
		}

		callback = callback || $.noop;

		// 临时方法 - 献给Items
		often.items = '[';

		$.each(options, function(i, option){
			often.items += (i ? ',' : '') + JSON.stringify(option);
		});

		often.items += ']';

		// T.T
		var punish_type;
		try{
			punish_type = often.punish_type || options.punish_type || 103;
		}
		catch(e){
			console.log(e);
			punish_type = 103;
		}

		// 临时方法 - 献给Deal
		often.deal = {
			reason: 2, // 色情
			module_type: 4, // 用户
			punish_type: punish_type, // 删除资源
			timedelta: often.timedelta || -1, // 限制登录时间
			memo: often.memo || 'auto', // 备注
			pass: 0
		};
		if( often.pass ){
			often.deal = {pass: 1};
		}
		often.deal = JSON.stringify( often.deal );

		$.punish( often, api, function(){
			callback();
		});
	},
	reportEnd: function(options){

		// Mask UI
		if( $('.masker').length ){
			$.mask().close();
		}

		$.ajax({
			type: 'get',
			url: _.api.end,
			data: options,
			success: function(result){
				$.checkResult(result, function( result ){
					// options.callback();
				});
			}
		});
	}
});


})
(window, jQuery);