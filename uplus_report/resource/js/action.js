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

			$.confirm('确定通过这些图片吗？', function(){
				
				alert('1');

				return true;
			});
		},

		/* Do Block */
		isBlock: function(it){
			if( !iMasonry.find('li').length ){
				$.trace('请先申领任务');
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

		/* Get Data */
		getInfoData: function(it){
			$.renderHTML({
				element: report,
				data: _.api.message,
				html: _.tpl.message,
				type: 'get',
				dataType: 'json',
				callback: function(options){
					_.cache.message = options.database;

					// Append Html To Element
					$(options.element).html( options.render );

				}
			});
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
				top: _.dom.win.height() - _.dom.foot.outerHeight(),
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
		operatSelect: function(){
			$.taber({
				container: '.audit-operat form menu',
				menus: 'button',
				callback: function(it, index){
					it = $(it), it.closest('li').find('[data-name]:eq(0)').attr('data-value', it.attr('data-option'));
				}
			});

			// Get Selected Item's IDs
			var database = [];
			$.each( iMasonry.find('span.active'), function(x, item){
				$.each( _.cache.albums, function(i, data){
					if( data.id == item.getAttribute('data-id') ){
						database.push( data );
					}
				});
			});

			// Operat Submit
			$.formSubmit({
				database: database,
				instead: function(option){
					$.recursivePunish( option.database, option.data );
				}
			});
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