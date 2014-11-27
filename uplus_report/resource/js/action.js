;(function(_, $, undefined){

/* !!
 * 数据缓存
 * ** *** **** ***** **** *** ** *
 */
_.cache = {
	// 相册存储
	albums: [],
	// 消息存储
	message: [],
	// 用户存储
	users: {
		risk: [],
		special: [],
		system: []
	}
}

/* !!
 * 设值全局Ajax
 * ** *** **** ***** **** *** ** *
 */
$.ajaxSetup({
	async: true,
	cache: false
});

/* !!
 * 设值全局Datepicker中文
 * ** *** **** ***** **** *** ** *
 */
if( $.datepicker ){
	$.datepicker.setDefaults({
		clearText: '清除',
		clearStatus: '清除已选日期',
		closeText: '关闭',
		closeStatus: '不改变当前选择',
		prevText: '<上月',
		prevStatus: '显示上月',
		prevBigText: '<<',
		prevBigStatus: '显示上一年',
		nextText: '下月>',
		nextStatus: '显示下月',
		nextBigText: '>>',
		nextBigStatus: '显示下一年',
		currentText: '今天',
		currentStatus: '显示本月',   
		monthNames: ['一月','二月','三月','四月','五月','六月', '七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['一','二','三','四','五','六', '七','八','九','十','十一','十二'],
		monthStatus: '选择月份',
		yearStatus: '选择年份',
		weekHeader: '周',
		weekStatus: '年内周次',
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		dayStatus: '设置 DD 为一周起始',
		dateStatus: '选择 m月 d日, DD',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		initStatus: '请选择日期',
		isRTL: false
	});
}

/* !!
 * All Function Is In Plus
 * ** *** **** ***** **** *** ** *
 */
;+function( kit, masonry, report, reportUser, active ){

var
	/* Full Mask */
	mask = $.mask(),

	/* Kit Element */
	iKit = $(kit),

	/* Operat Button */
	operatButton = $('#operatButton'),

	/* Masonry Element */
	iMasonry = $(masonry),

	/* Report Element */
	iReport = $(report),

	/* Report User */
	iReportUser = $(reportUser),

	/* Data-Function In Kit */
	kitFunction = {

		/* 是否存在Mask */
		hasMask: function(){
			return !!$('#masker').length;
		},

		/* ** *** **** ***** Image ***** **** *** ** */

		/* Database Tolerance */
		dataTolerance: function(data){
			return (data = data || {})
				, data.thumb_url = data.thumburl || ''
				, data.msg_id = data.msgid || ''
				, data;
		},

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
						// type: 'only',
						block: 'p',
						active: active,
						callback: function( it, on ){
							if( on ){
								// kitFunction.isBlock();
							}
						}
					});
					
					/* Key Panel Choose */
					var keyPanel = $('.key-panel').show();
					$.each( keyPanel.find('input'), function(i, input){
						input = $(input);
						input
							.on(_.evt.over, function(){
								input.select();
							})
							.on('keyup', function(){
								input.select();
							})
							.blur(function(){
								var v = input.val().toUpperCase().substr(0, 1);

								if( !v.length || v.charCodeAt(0) < 65 || v.charCodeAt(0) > 90 ){
									v = input.attr('data-default').toUpperCase();
								}

								$.each( keyPanel.find('input:not(:eq(' + i + '))'), function(x, item){
									v = input.val().toUpperCase();
									if( v == $(item).val() ){
										v = input.attr('data-default').toUpperCase();
										return false;
									}
								});

								input.val(v).attr('value', v);
							});
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

			var element = it.hasClass('masonry') ? it : $( it.closest('[data-element]').attr('data-element') );
			element.find('span').addClass( active );
		},

		/* Choose None Items */
		chooseNon: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			var element = it.hasClass('masonry') ? it : $( it.closest('[data-element]').attr('data-element') );
			element.find('span').removeClass( active );
		},

		/* Choose Rev Items */
		chooseRev: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			var element = it.hasClass('masonry') ? it : $( it.closest('[data-element]').attr('data-element') );
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

			// $.confirm('确定通过这些图片吗？', function(){
				
				var database = kitFunction.getImageActive({
						container: iMasonry.find('span.active'),
						selector: 'data-id',
						than: _.cache.albums
					});

				// Loading UI
				if( !kitFunction.hasMask() ){
					mask.open();
				}

				// Punish - 一次
				$.recursiveOnce( database, { pass: 1 }, _.api.report_batch, function(){

					// Loading UI
					mask.close();

					$.trace('处理完成', function(){
						iMasonry.find('span.active').fadeOut(function(){
							$(this).remove();

							// 交互 - 如果木有数据了, 就去拉一批
							if( !iMasonry.find('span').length ){
								kitFunction.getImageData();
							}
						});
					});

				});

				return; // 先阻止一下下

				// Punish - 异步
				$.recursiveAsyc( database, {}, _.api.pass, function(){

					// Loading UI
					mask.close();

					$.trace('处理完成', function(){
						iMasonry.find('span.active').fadeOut(function(){
							$(this).remove();

							// 交互 - 如果木有数据了, 就去拉一批
							if( !iMasonry.find('span').length ){
								kitFunction.getImageData();
							}
						});
					});

				});

				return; // 先阻止一下下

				// Punish - 递归
				$.recursivePunish( database, {}, _.api.pass, function(){

					// Loading UI
					mask.close();

					$.trace('处理完成', function(){
						iMasonry.find('span.active').fadeOut(function(){
							$(this).remove();

							// 交互 - 如果木有数据了, 就去拉一批
							if( !iMasonry.find('span').length ){
								kitFunction.getImageData();
							}
						});
					});
				});

				return true;
			// });
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

		/* Do Block Fast */
		isBlockFast: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
				return;
			}

			if( !iMasonry.find('span.active').length ){
				$.trace('至少选择一张图片');
				return;
			}

			$.confirm('确定设置这些图片为不合格吗？', function(){

				var
					// Get Selected Item's Infomation From Cache
					database = kitFunction.getImageActive({
						container: iMasonry.find('span.active'),
						selector: 'data-id',
						than: _.cache.albums
					});

				// Loading UI
				if( !kitFunction.hasMask() ){
					mask.open();
				}

				// Punish - 一次
				$.recursiveOnce( database, {}, _.api.report_batch, function(){

					// Loading UI
					mask.close();

					$.trace('处理完成', function(){
						iMasonry.find('span.active').fadeOut(function(){
							$(this).remove();

							// 交互 - 如果木有数据了, 就去拉一批
							if( !iMasonry.find('span').length ){
								kitFunction.getImageData();
							}
						});
					});

				});

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

				// 获取剩余消息数, 并渲染页面
				kitFunction.getRemain({
					callback: function(result){
						kitFunction.renderInfoPage({ remain: result.data });
					}
				});

				return false;
			}

			// 1.递归->msgs, 2.提交->profle
			var
				// 存储数据
				database = [],
				// 对象集
				items = iReport.find('.proinfo [data-msgid]'),
				// 用于合并的数据
				mergeData = _.cache.message.data;

			// 循环Items(Msgs), 获取数据
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
						id: itData.msgid || '',
						than: thanData.msgs
					});

				// For Merge Data, Delete Msgs
				thanData.u_id = itData.uid || '';

				database.push( $.mergeJSON(thanData, itemData) );
			});
			
			// Loading UI
			if( !kitFunction.hasMask() ){
				mask.open();
			}
			// Punish - 递归
			$.recursivePunish( database, {}, _.api.pass, function(){ // 1.递归msgs完成

				items.closest('tr').slideUp(function(){
					items.closest('tr').remove();
				});

				var item = iReport.find('.profile [data-uid]');

				// 分支情况 - 如果无数据, 则直接复位
				if( !item.length ){

					$.reportEnd({
						id: _.cache.message.data.id,
						callback: function(){
							iReport.html('<div class="unPage">'),
							kitFunction.getInfoData( it );
						}
					});

					return false;
				}

				var itData = $.getData( item );

				// 常规情况
				var database = _.cache.message.data;

				database.u_id = itData.uid;
				database.module_id = database.profile.mid;

				// 数据适配
				database = kitFunction.dataTolerance( database );

				$.recursivePunish( [database], {}, _.api.pass, function(){ // 2.提交profile完成

					// 完成所有report提交后，发送end请求
					$.reportEnd({
						id: _.cache.message.data.id,
						callback: function(){
							iReport.html('<div class="unPage">'),
							kitFunction.getInfoData( it );
						}
					});

				});
			});

			return;
		},

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

		deleteUser: function(it){

			var
				// Item Data
				itData = $.getData(it),
				// Confirm Text
				text = '确定删除该用户吗？',
				// Do Function
				doDelete = function(it){
					var database = {},
						url = '';

					$.each( _.cache.users.risk, function(i, data){
						if( data.user_id == itData.user_id ){
							database = data;
						}
					});

					switch( itData.type ){
						case 'risk':
							url = _.api.user_risk;
							break;
						case 'special':
							url = _.api.user_special;
							break;
						case 'system':
							url = _.api.user_system;
							break;
						default:
							break;
					}

					$.ajax({
						type: 'delete',
						url: url,
						data: database,
						success: function(result){
							$.checkResult(result, function( result ){

								(function(tr){
									if( tr.length ){
										tr.slideUp(function(){
											tr.remove();
										});
									}
								})( it.closest('tr') );

							});
						}
					});

					return true;
				}

			if( itData.rid ){

				$.get( _.api.report_profile( itData.rid ), function(result){

					$.each(result.data, function(k, v){
						text += '<br/>' + k + ':' + v;
					});

					$.confirm(text, function(){
						doDelete( it );
					});

				});

				return;
			}

			$.confirm(text, function(){
				doDelete( it );
			});
		},

		// Search User Detail
		searchUserDetail: function( it ){
			var itData = $.getData(it);

			$.renderHTML({
				element: $('.report_select_result'),
				data: _.api.user_detail + '?csid=' + itData.id + '&current=' + (itData.current || 1),
				html: _.tpl.user_detail,
				type: 'get',
				dataType: 'json',
				callback: function(options){

					// UI
					it.addClass('active').siblings().removeClass('active');

					// Append Html To Element
					$(options.element).html( options.render );
				}
			});
		},
		searchCustomer: function( element ){

			element = $(element);

			if( element.length ){
				$.get( _.api.user_list, function(result){
					$.checkResult(result, function(result){

						$.reloadHTML({
							element: element.find('ul'),
							data: result
						});

					});
				});
			}
		}('.report_select_panel')

	};


/* Extend Callback */
$.extend({
	fancyCall: {
		// Fancy Close
		fancyClose: function( button ){
			// Popup Fancy Cancel
			button.on( _.evt.click, function(){
				$.fancybox.close();
			});
		},

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
					if( !!~$.inArray(code, $.mergeArray(_.keys.number, _.keys.negative, _.keys.point, _.keys.back)) ){
						return true;
					}
					return false;
				},
				onKeyup: function(e){
					e.target.setAttribute('data-value', e.target.value);
				},
				onChange: function(e){
					e.target.setAttribute('data-value', e.target.value);
				}
			});

			// Textarea Input
			$.sameInput({
				input: '.audit-operat form [data-name=memo]',
				onKeyup: function(e){
					e.target.setAttribute('data-value', e.target.value);
				},
				onChange: function(e){
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
			$.fancyCall.fancyClose( cancel );
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

					// Loading UI
					if( !kitFunction.hasMask() ){
						mask.open();
					}

					// Punish - 一次
					$.recursiveOnce( option.database, option.data, _.api.report_batch, function(){

						// Loading UI
						mask.close();

						$.trace('处理完成', function(){
							iMasonry.find('span.active').fadeOut(function(){
								$(this).remove();

								// 交互 - 如果木有数据了, 就去拉一批
								if( !iMasonry.find('span').length ){
									kitFunction.getImageData();
								}
							});
						});

					});

					return; // 先阻止一下下

					$.recursiveAsyc( option.database, option.data, _.api.punish, function(){

						// Loading UI
						mask.close();

						$.trace('处理完成', function(){
							iMasonry.find('span.active').fadeOut(function(){
								$(this).remove();

								// 交互 - 如果木有数据了, 就去拉一批
								if( !iMasonry.find('span').length ){
									kitFunction.getImageData();
								}
							});
						});

					});

					return; // 先阻止一下下

					// Punish - 递归 - 递归
					$.recursivePunish( option.database, option.data, _.api.punish, function(){

						// Loading UI
						mask.close();

						$.trace('处理完成', function(){
							iMasonry.find('span.active').fadeOut(function(){
								$(this).remove();

								// 交互 - 如果木有数据了, 就去拉一批
								if( !iMasonry.find('span').length ){
									kitFunction.getImageData();
								}
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
					mergeData.module_id = mergeData.profile.mid;

					$.each(mergeData.msgs, function(i, item){
						if( item.msgid == itData.msgid ){
							mergeData = $.mergeJSON( mergeData, item );
						}
					});

					// 数据适配
					mergeData = kitFunction.dataTolerance( mergeData );

					delete mergeData.msgs;

					// Punish - 一次
					/*
					$.recursiveOnce( option.database, $.mergeJSON(option.data, mergeData), _.api.report_batch, function(){

						// Loading UI
						mask.close();

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
					*/

					// Punish - 异步
					$.recursiveAsyc( option.database, $.mergeJSON(option.data, mergeData), _.api.punish, function(){

						// Loading UI
						mask.close();

						$.trace('处理完成', function(){
							(function(tr){
								if( tr.length ){
									tr.slideUp(function(){
										tr.remove();
									});
								}
								// 如果无tr, 则认为是profile按钮, 做移除处理
								else{
									it.fadeOut(function(){
										it.remove();
									});
								}
							})( it.closest('tr') );
						});

					});

					return; // 先阻止一下下

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
			$('.audit-operat form li:eq(1)').find('button:eq(0), button:eq(1)').hide();

			// Items Operat
			$.fancyCall.operatSelect_items( it );
		},
 		// Operat Siliao
		operatSelect_shiliao: function( it ){

			// 隐藏不可用项
			$('.audit-operat form li:eq(1)').find('button:eq(0), button:eq(1), button:eq(2)').hide();

			// Items Operat
			$.fancyCall.operatSelect_items( it );
		},
 		// Operat Geren
		operatSelect_geren: function( it ){

			// 隐藏不可用项
			$('.audit-operat form li:eq(1)').find('button:eq(0), button:eq(1), button:eq(2)').hide();

			// Items Operat
			$.fancyCall.operatSelect_items( it );
		},
		// Add User
		addUser: function( it ){
			var itData = $.getData(it);

			$.reloadHTML({
				element: $('.audit-user'),
				data: {
					type: itData.type
				},
				callback: function(){
					// Popup Fancy Cancel
					$.fancyCall.fancyClose( $('.audit-user form .form-submit button:eq(0)') );

					// Input Press
					$.sameInput({
						input: '.audit-user form [data-name=user_id]',
						onKeydown: function(e){
							var code = e.keyCode;
							if( (code == 8) || (code > 47 && code < 58) ){
								return true;
							}
							return false;
						},
						onKeyup: function(e){
							e.target.setAttribute('data-value', e.target.value);
						},
						onChange: function(e){
							e.target.setAttribute('data-value', e.target.value);
						}
					});

					// Add User Submit Control
					$.formSubmit();
				}
			});
		},
		// Add User Sys
		addUserSys: function( it ){
			var itData = $.getData(it);

			$.reloadHTML({
				element: $('.audit-user'),
				data: {
					type: itData.type
				},
				callback: function(){
					// Popup Fancy Cancel
					$.fancyCall.fancyClose( $('.audit-user form .form-submit button:eq(0)') );

					// Input Press
					$.sameInput({
						input: '.audit-user form [data-name=user_id]',
						onKeydown: function(e){
							var code = e.keyCode;
							if( (code == 8) || (code > 47 && code < 58) ){
								return true;
							}
							return false;
						},
						onKeyup: function(e){
							e.target.setAttribute('data-value', e.target.value);
						},
						onChange: function(e){
							e.target.setAttribute('data-value', e.target.value);
						}
					});

					var
						form = $('.audit-user form'),
						cancel = form.find('.form-submit button:eq(0)');

					// Input Press
					$.sameInput({
						input: '.audit-user form input[data-name]',
						onKeydown: function(e){
							// return false;
						},
						onKeyup: function(e){
							e.target.setAttribute('data-value', e.target.value);
						},
						onChange: function(e){
							e.target.setAttribute('data-value', e.target.value);
						}
					});

					// Tab 切换事件
					$.taber({
						container: '.audit-user form menu',
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

					// Popup Fancy Cancel
					$.fancyCall.fancyClose( cancel );

					// Add User Submit Control
					$.formSubmit();
				}
			});
		}
	},
	formCall: {
		operatSubmit: function(result, form){
			console.log( result );
			alert('I am callback');
		},
		operatImage: function(result, form){
			console.log( result );
			alert('I am callback Image');
		},
		getUsers: function(result, form){
			$.checkResult(result, function( result ){

				_.cache.users.risk = result.data;

				$.renderHTML({
					element: form.closest('.report_user').find('.report_search_result'),
					data: $.mergeJSON(result, { type: form.attr('data-type') }),
					html: _.tpl.users,
					type: 'get',
					dataType: 'json',
					callback: function(options){
						// Append Html To Element
						$(options.element).html( options.render );
					}
				});
			});
		},
		getUsersPunish: function(result, form){
			$.checkResult(result, function( result ){

				$.renderHTML({
					element: form.closest('.report_user').find('.report_search_result'),
					data: $.mergeJSON(result, { type: form.attr('data-type') }),
					html: _.tpl.users_punish,
					type: 'get',
					dataType: 'json',
					callback: function(options){
						// Append Html To Element
						$(options.element).html( options.render );
					}
				});
			});
		},
		getSheet: function(result, form){
			$.checkResult(result, function( result ){

				$.renderHTML({
					element: form.closest('.report_sheet').find('.report_search_result'),
					data: $.mergeJSON(result, { type: form.attr('data-type') }),
					html: _.tpl.users_sheet,
					type: 'get',
					dataType: 'json',
					callback: function(options){
						// Append Html To Element
						$(options.element).html( options.render );
					}
				});
			});
		},
		addUserCallback: function(result, form){
			$.checkResult(result, function( result ){
				$.trace('处理完成', function(){
					$.fancybox.close();
				});
			});
		}
	},
	init: +function(){

		/* Show Elements By Admin */
		;(function(selector){

			$.each( $('['+selector+']'), function(i, item){

				item = $(item);

				if( _[ item.attr( selector ) ] != 'admin' ){
					item.remove();
				}

			});

		})('data-show');

		/* Socket Run */
		;(function( time ){

			var cache = {
					album: 0, msg: 0
				},
				// 时间间隔
				timeResult = time,
				// 节点集
				elements = $('#remain_default, #remain_dangerous, #remain_resource'),
				// 临时方法 - 响应赠长
				calculateTime = function( data ){

					if( data.album_remain != cache.album || data.msg_remain != cache.msg ){
						cache = {
							album: data.album_remain, msg: data.msg_remain
						},
						timeResult = time;
						return;
					}

					timeResult = (timeResult > 30000) ? 30000 : (timeResult + 999);
				};

			// WebSocket: IO
			/*
			var socket = io( _.path.root + _.api.remain_all );

			socket
				.on('connect', function( result ){
					console.log( result );
					return;

					$.each( $('#remain_default, #remain_dangerous, #remain_resource'), function(x, element){

						element = $(element);

						var data = result.data[ x ];

						element.html( data.album_remain + data.msg_remain );

					});
				})
				.on('event', function( result ){
					console.log( result );
				})
				.on('disconnect', function( result ){
					console.log( result );
				});
			*/

			try{

				// WebSocket
				var socket = new WebSocket( _.path.ws + _.api.remain_all ); 

				// 打开Socket 
				socket.onopen = function(event){

					// 监听消息
					socket.onmessage = function(result){
						var
							database = $.parseJSON( result.data );

						// 如果缓存里木有，则置入并重置时间
						calculateTime( database.data );

						$.each( database.data, function(i, data){
							elements.eq(i).html( data.album_remain + data.msg_remain );
						});
					};

					$.timeout({
						count: (_.QQ, 312272592),
						time: time,
						def: true,
						callback: function( options ){

							// 发送一个初始化消息
							socket.send('Whos Your Daddy ?!');

							return timeResult;
						}
					});

				}

			}
			catch(e){

				// 非WebSocket
				$.timeout({
					count: (_.QQ, 312272592),
					time: time,
					def: true,
					callback: function( options ){

						// Get Remain Count In (Default)
						kitFunction.getRemain({
							callback: function(result){
								if( !result.data ){
									_.clearTimeout( options.timeout );
									return;
								}

								elements.eq(0).html( result.data.album_remain + result.data.msg_remain ), calculateTime( result.data );
							}
						});

						// Get Remain Count In (Dangerous)
						kitFunction.getRemain({
							data: { report_type: 1 },
							callback: function(result){
								if( !result.data ){
									_.clearTimeout( options.timeout );
									return;
								}

								elements.eq(1).html( result.data.album_remain + result.data.msg_remain );
							}
						});

						// Get Remain Count In (Resource)
						kitFunction.getRemain({
							data: { report_type: 2 },
							callback: function(result){
								if( !result.data ){
									_.clearTimeout( options.timeout );
									return;
								}

								elements.eq(2).html( result.data.album_remain + result.data.msg_remain );
							}
						});

						return timeResult;
					}
				});
			}

		})
		(4567);

		/* Default Welcome */
		;(function(element){
			var text = '', vs = element.text().split(''), vcount = vs.length;
			$.each( vs, function(i, v){
				text += '<bdo>' + v + '</bdo>';
			});
			element.html(text).css('line-height', _.dom.doc.height() + 'px').addClass('welcome');

			var items = element.find('bdo');
			
			$.each(items, function(i, item){
				item = $(item);
				item.css({
					top: i%2 ? 60 : -60,
					left: i%2 ? 60 : -60
				});
			});

			$.timeout({
				count: vcount,
				time: 45,
				callback: function( options ){
					items.eq( vcount - options.count ).animate({ top: 0, left: 0 }, 135);

					if( options.count == 1 ){
						$.timeout({
							time: 600,
							callback: function(){
								_.dom.aside.find('a:eq(0)').trigger( _.evt.click ),
								element.fadeOut(function(){
									element.remove();
								});
							}
						});
					}
				}
			});
		})
		( $('#welcome') );

		/* Key Down For Choose Albums */
		_.dom.doc.on('keydown', function(e){
			var code = e.keyCode, isOff = iMasonry.is(':hidden'), items = iMasonry ? iMasonry.find('span') : [];

			// Only For Key Code
			console.log(code);

			// 如果不在Masonry区
			if( isOff || !items.length ){
				return;
			}

			// 如果焦点在输入框内
			if( e.target.tagName == 'INPUT' || e.target.tagName == 'TEXTAREA' ){
				return;
			}

			// 数字快捷键
			if( !!~$.inArray(code, _.keys.number) ){
				var i = code % 48 ? code % 48 : 10;
				items.eq( i-1 ).trigger( _.evt.click );
				return;
			}

			// 快捷键 - 字母
			if( code > 64 && code < 91 ){

				var keyPanel = $('.key-panel'), keys = {};
				if( !keyPanel.length ){
					return;
				}

				$.each( keyPanel.find('[data-name]'), function(i, item){

					keys[ item.getAttribute('data-name') ] = item.value.charCodeAt(0);

					if( code == item.value.charCodeAt(0) ){
						kitFunction[ item.getAttribute('data-name') ]( iMasonry );
					}

				});
			}
		});

		/* Default High Light Nav */
		;(function( param ){

		$.each( _.dom.nav.find('a'), function(i, a){

			if( !!~a.getAttribute('href').indexOf( param ) ){
				$(a).addClass('active').attr('href', 'javascript:void(0);');
			}
		});

		})
		( _.location.pathname.match(/\w{0,}$/g)[0] );


		/* Reload Aside */
		$.reloadHTML({
			element: _.dom.aside,
			data: {
				current: _.current
			},
			callback: function(){
				$.timeout({
					callback: function(){
						_.dom.aside.find('a:eq(0)').trigger( _.evt.click );
					}
				}, 30);
			}
		});

		/* Taber Change */
		$.taber({
			menus: 'aside a',
			contents: 'section .main',
			callback: function(it, index){
				iKit.find('ul').hide().eq(index).show();
				
				// Init Kit Position
				if( iKit.length ){
					$.initPosition({
						element: kit,
						children: 'li',
						self: true,
						left: _.dom.doc.width(),
						top: _.dom.doc.height() - _.dom.foot.outerHeight(),
						off: {
							x: -1, y: -35
						}
					});
				}
			}
		});

		/* Same Input Press */
		$.sameInput({
			input: '[data-input="same"]',
			onKeydown: function(e){
				var code = e.keyCode;
				if( (code == 8) || (code > 47 && code < 58) ){
					return true;
				}
				return false;
			},
			onKeyup: function(e){
				e.target.setAttribute('data-value', e.target.value);
			},
			onChange: function(e){
				e.target.setAttribute('data-value', e.target.value);
			}
		});

		/* Datepicker */
		$.timePicker({
			items: '[data-datepicker]',
			input: false
		});

		/* Drag Kit */
		$.drag({
			move: kit,
			nation: 'bdo'
		});

		/* Fancy Pop */
		$.fancyPop();

		/* All Form Control */
		$.formSubmit();

		/* Data-Function-Action */
		_.dom.bod.delegate('[data-function]', _.evt.click, function(){
			var it = $(this), fn = it.attr('data-function');
			if( kitFunction[fn] ){
				kitFunction[fn]( it );
			}
		});

	}()
});



}( '.kit', '.masonry', '.report', '.report_user', 'active' );

})
(window, jQuery);