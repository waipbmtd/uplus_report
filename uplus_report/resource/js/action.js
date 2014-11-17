;(function(_, $, undefined){

/* !!
 * 数据缓存
 * ** *** **** ***** **** *** ** *
 */
_.cache = {
	// 相册存储
	albums: [],
	// 消息存储
	message: []
}

/* !!
 * All Function Is In Plus
 * ** *** **** ***** **** *** ** *
 */
;+function( kit, masonry, report, active ){

var
	/* Kit Element */
	iKit = $(kit),

	/* Operat Button */
	operatButton = $('#operatButton'),

	/* Masonry Element */
	iMasonry = $(masonry),

	/* Report Element */
	iReport = $(report),

	/* Data-Function In Kit */
	kitFunction = {

		/* ** *** **** ***** Image ***** **** *** ** */

		/* Get Remain Length */
		getRemain: function(options){
			options = options || {}
			, options.data = options.data || {}
			, options.callback = options.callback || $.noop;

			$.get( _.api.remain, options.data, function( result ){
				$.checkResult(result, function( result ){
					options.callback( result );
				});
			});
		},

		/* Get Images Active */
		getImageActive: function(options){
			options = options || {}
			, options.container = options.container || undefined
			, options.selector = $.isType(options.selector, 'string') ? options.selector : ''
			, options.than = $.isType(options.than, 'object') ? options.than : []
			, options.database = [];

			$.each( options.container, function(x, item){
				$.each( options.than, function(i, data){
					if( data.id == item.getAttribute( options.selector ) ){
						options.database.push( data );
					}
				});
			});

			return options.database;
		},

		/* Get Info Active */
		getInfoActive: function(options){
			options = options || {}
			, options.id = options.id || 0
			, options.than = $.isType(options.than, 'object') ? options.than : []
			, options.database = {};

			if( options.than.length ){
				$.each(options.than, function(i, data){
					if( data.msgid == options.id ){
						options.database = data;
					}
				});
			}
			else{
				if( options.than.oid == options.id ){
					options.database = options.than;
				}
			}

			return options.database;
		},

		/* Get Data */
		getImageData: function(it){
			$.renderHTML({
				element: masonry,
				data: _.api.albums,
				html: _.tpl.albums,
				type: 'get',
				dataType: 'json',
				callback: function(options){
					_.cache.albums = options.database.data || {};

					// Append Html To Element
					$(options.element).html( options.render );

					// Masonry Water Fall
					iMasonry.imagesLoaded(function(){
						$.initMasonry({
							element: masonry,
							selector: 'li'
						});
					});

					// Choose Item
					$.choose({
						items: masonry + ' span',
						block: 'p',
						active: active
					});
				}
			});

		},

		/* Choose All Items */
		chooseAll: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			var element = $( it.closest('[data-element]').attr('data-element') );
			element.find('span').addClass( active );
		},

		/* Choose None Items */
		chooseNon: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			var element = $( it.closest('[data-element]').attr('data-element') );
			element.find('span').removeClass( active );
		},

		/* Choose Rev Items */
		chooseRev: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			var element = $( it.closest('[data-element]').attr('data-element') );
			$.each( element.find('span'), function(i, item){
				item = $(item), item.hasClass( active ) ? item.removeClass( active ) : item.addClass( active );
			});
		},

		/* Do Pass */
		isPass: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			if( !iMasonry.find('span.active').length ){
				$.trace('至少选择一张图片');
				return;
			}

			$.confirm('确定通过这些图片吗？', function(){
				
				var database = kitFunction.getImageActive({
						container: iMasonry.find('span.active'),
						selector: 'data-id',
						than: _.cache.albums
					});

				// Punish - 递归
				$.recursivePunish( database, {}, _.api.pass, function(){
					$.trace('处理完成', function(){
						iMasonry.find('span.active').fadeOut(function(){
							$(this).remove();
						});
					});
				});

				return true;
			});
		},

		/* Do Block */
		isBlock: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			if( !iMasonry.find('span.active').length ){
				$.trace('至少选择一张图片');
				return;
			}

			$.fancybox.open({
				href: _.tpl.operat,
				type: 'ajax',
				title: '举报处理',
				helpers: {
					title: {
						type: 'inside',
						position: 'top'
					}
				},
				afterShow: function(){
					$.fancyCall.operatSelect();

					$('.fancybox-overlay form[data-submit]').attr('data-callback', 'operatImage');
				}
			});
		},

		/* ** *** **** ***** Info ***** **** *** ** */

		/* 渲染页面 */
		renderInfoPage: function(data){
			data = data || {};

			$.renderHTML({
				element: report,
				data: _.api.message,
				html: _.tpl.message,
				than: data,
				type: 'get',
				dataType: 'json',
				callback: function(options){
					_.cache.message = options.database;

					// Append Html To Element
					$(options.element).html( options.render );
				}
			});
		},

		/* Get Data */
		getInfoData: function(it){

			// 如果空(首次拉取数据)
			if( iReport.find('.unPage').length ){

				// 获取剩余消息数
				kitFunction.getRemain({
					callback: function(result){
						kitFunction.renderInfoPage({ remain: result.data });
					}
				});

				return;
			}

			// 1.递归->msgs, 2.提交->profle
			var
				// 存储数据
				database = [],
				// 对象集
				items = iReport.find('.proinfo [data-msgid]'),
				// 用于合并的数据
				mergeData = _.cache.message.data;

			$.each( items, function(i, item){

				var
					// It对象
					it = $(item),

					// Item对象的data数据
					itData = $.getData(it),

					// 固定参数
					thanData = mergeData,

					// 根据msgid获取的数据
					itemData = kitFunction.getInfoActive({
						id: itData.msgid,
						than: thanData.msgs
					});

				// For Merge Data, Delete Msgs
				thanData.u_id = itData.uid;

				database.push( $.mergeJSON(thanData, itemData) );
			});

			// Punish - 递归
			$.recursivePunish( database, {}, _.api.pass, function(){ // 1.递归msgs完成
				
				items.closest('tr').slideUp(function(){
					items.closest('tr').remove();
				});

				var item = iReport.find('.profile [data-uid]');

				// 分支情况 - 大厅
				if( !item.length ){

					iReport.html('<div class="unPage">'),
					kitFunction.getInfoData( it );

				}

				var itData = $.getData( item );

				// 常规情况
				var database = _.cache.message.data;

				database.u_id = itData.uid;

				$.recursivePunish( [database], {}, _.api.pass, function(){ // 2.提交profile完成

					iReport.html('<div class="unPage">'),
					kitFunction.getInfoData( it );

				});
			});

			return;
		}

		/* Choose Un */
		/*
		chooseUn: function(it){
			switch( it.attr('class') ){
				case 'green':
					it.attr('class', 'red').text('不合格');
					break;
				case 'red':
					it.attr('class', 'green').text('合格');
					break;
			}
		}
		*/

		/* Choose All Items */
		/*
		chooseInfoAll: function(it){
			var element = $( it.closest('[data-element]').attr('data-element') + ' .proinfo' );
			$.each(element.find('table input:checkbox'), function(i, item){
				item.checked = true;
			});
		},
		*/

		/* Choose None Items */
		/*
		chooseInfoNon: function(it){
			var element = $( it.closest('[data-element]').attr('data-element') + ' .proinfo' );
			$.each(element.find('table input:checkbox'), function(i, item){
				item.checked = false;
			});
		},
		*/

		/* Choose Rev Items */
		/*
		chooseInfoRev: function(it){
			var element = $( it.closest('[data-element]').attr('data-element') + ' .proinfo' );
			$.each(element.find('input:checkbox'), function(i, checkbox){
				var item = $(checkbox);
				checkbox.checked = (item.is(':checked') ? false : true);
			});
		},
		*/

		/* Do Pass */
		/*
		isInfoPass: function(it){},
		*/

		/* Do Block */
		/*
		isInfoBlock: function(it){}
		*/

	};

/* Socket Run */
/*
$.timeout({
	count: (_.QQ, 312272592),
	time: 6789,
	def: true,
	callback: function(){

		// Get Remain Count Default
		kitFunction.getRemain({
			callback: function(result){
				$('#remain_default').html( result.data.msg_remain + result.data.album_remain );
			}
		});

		// Get Remain Count Dangerous
		kitFunction.getRemain({
			data: { risk: 1 },
			callback: function(result){
				$('#remain_dangerous').html( result.data.msg_remain + result.data.album_remain );
			}
		});
	}
});
*/

/* Default High Light Nav */
;(function( param ){

$.each( _.dom.nav.find('a'), function(i, a){

	if( !!~a.getAttribute('href').indexOf( param ) ){
		$(a).addClass('active');
	}
});

})
( _.location.pathname.match(/\w{0,}$/g)[0] );


/* Taber Change */
$.taber({
	menus: 'aside a',
	contents: 'section .main',
	callback: function(it, index){
		iKit.find('ul').hide().eq(index).show();
		
		// Init Kit Position
		$.initPosition({
			element: kit,
			children: 'li',
			self: true,
			left: _.dom.win.width(),
			top: _.dom.win.height() / 2, // - _.dom.foot.outerHeight(),
			off: {
				x: -1, y: -35
			}
		});
	}
});

/* Data-Function-Action */
$('[data-function]').on(_.evt.click, function(){
	var it = $(this), fn = it.attr('data-function');
	if( kitFunction[fn] ){
		kitFunction[fn]( it );
	}
});

/* Drag Kit */
$.drag({
	move: kit
});

/* Fancy Pop */
$.fancyPop();


/* Extend Callback */
$.extend({
	fancyCall: {
		// Operat Base
		operatBase: function( it ){

			var
				form = $('.audit-operat form'),
				associates = 'data-associate',
				assos = 'data-assos',
				cancel = form.find('.form-submit button:eq(0)');

			// 关联点击事件
			form.find('[' + associates + ']').on( _.evt.click, function(e){
				var me = $(this),
					data = me.attr( associates );

				$.each(form.find('[' + assos + ']').hide(), function(i, item){
					item = $(item);

					if( !!~$.inArray(data, item.attr( assos ).split(' ')) ){
						item.show();
					}
				});
				form.find('[' + assos + ']:not(:hidden):eq(0)').trigger( _.evt.click );
			});

			// Input Press
			$.sameInput({
				input: '.audit-operat form [data-name=timedelta]',
				onKeydown: function(e){
					var code = e.keyCode;
					if( (code == 8) || (code > 47 && code < 58) ){
						return true;
					}
					return false;
				},
				onKeyup: function(e){
					e.target.setAttribute('data-value', e.target.value);
				}
			});

			// Textarea Input
			$.sameInput({
				input: '.audit-operat form [data-name=memo]',
				onKeyup: function(e){
					e.target.setAttribute('data-value', e.target.value);
				}
			});

			// Tab 切换事件
			$.taber({
				container: '.audit-operat form menu',
				menus: 'button',
				callback: function(it, index){
					it = $(it);

					var
						parent = it.closest('li'),
						next = it.next();

					parent.find('[data-name]:eq(0)').attr('data-value', it.attr('data-option')),
					parent.find('span').hide();

					if( next.is('span') ){
						next.show();
					}
				}
			});

			// 中间排触发事件
			form.find('[' + associates + ']:not(:hidden):eq(0)').trigger( _.evt.click );

			// Popup Fancy Cancel
			cancel.on( _.evt.click, function(){
				$.fancybox.close();
			});
		},
		// Operat Albums
		operatSelect: function( it ){

			// 隐藏不可用项
			$('.audit-operat form li:eq(1)').find('button:eq(0), button:eq(1), button:eq(2)').hide();

			// Default UI
			$.fancyCall.operatBase();

			// Get Selected Item's Infomation From Cache
			var database = kitFunction.getImageActive({
					container: iMasonry.find('span.active'),
					selector: 'data-id',
					than: _.cache.albums
				});

			// Operat Submit
			$.formSubmit({
				database: database,
				instead: function(option){
					// Punish - 递归
					$.recursivePunish( option.database, option.data, _.api.punish, function(){
						$.trace('处理完成', function(){
							iMasonry.find('span.active').fadeOut(function(){
								$(this).remove();
							});
						});
					});
				}
			});
		},
		// Operat Items
		operatSelect_items: function( it ){

			// Default UI
			$.fancyCall.operatBase();
			
			var
				// Get It(em) Data
				itData = $.getData(it),

				// Get Info Item's Infomation From Cache
				database = [
					kitFunction.getInfoActive({
						id: itData.msgid,
						than: _.cache.message.data.msgs
					})
				];

			// Operat Submit
			$.formSubmit({
				database: database,
				instead: function(option){

					// For Merge Data, Delete Msgs
					var mergeData = _.cache.message.data;
					mergeData.u_id = itData.uid;
					delete mergeData.msgs;

					// Punish - 递归
					$.recursivePunish( option.database, $.mergeJSON(option.data, mergeData), _.api.punish, function(){
						$.trace('处理完成', function(){
							(function(tr){
								if( tr.length ){
									tr.slideUp(function(){
										tr.remove();
									});
								}
							})( it.closest('tr') );
						});
					});
				}
			});
		},
		// Operat Dating
		operatSelect_dating: function( it ){

			// 隐藏不可用项
			$('.audit-operat form li:eq(1)').find('button:eq(1), button:eq(2), button:eq(3)').hide();

			// Items Operat
			$.fancyCall.operatSelect_items( it );
		},
		// Operat Xiuchang
		operatSelect_xiuchang: function( it ){

			// 隐藏不可用项
			$('.audit-operat form li:eq(1)').find('button:eq(0), button:eq(2)').hide();

			// Items Operat
			$.fancyCall.operatSelect_items( it );
		},
		// Operat Qun
		operatSelect_qun: function( it ){

			// 隐藏不可用项
			$('.audit-operat form li:eq(1)').find('button:eq(0), button:eq(1), button:eq(2)').hide();

			// Items Operat
			$.fancyCall.operatSelect_items( it );
		}
	},
	formCall: {
		operatSubmit: function(result){
			console.log( result );
			alert('I am callback');
		},
		operatImage: function(result){
			console.log( result );
			alert('I am callback Image');

		}
	}
});



}( '.kit', '.masonry', '.report', 'active' );

})
(window, jQuery);