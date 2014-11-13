;(function(_, $, undefined){

/* !!
 * All Function Is In Plus
 * ** *** **** ***** **** *** ** *
 */
+function( kit, masonry, report, active ){

var
	/* Kit Element */
	iKit = $(kit),

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
				data: '/resource/database/data-img.json',
				html: '/template/albums.html',
				type: 'get',
				dataType: 'script',
				callback: function(options){

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
			var element = $( it.closest('[data-element]').attr('data-element') );
			element.find('span').addClass( active );
		},

		/* Choose None Items */
		chooseNon: function(it){
			var element = $( it.closest('[data-element]').attr('data-element') );
			element.find('span').removeClass( active );
		},

		/* Choose Rev Items */
		chooseRev: function(it){
			var element = $( it.closest('[data-element]').attr('data-element') );
			$.each( element.find('span'), function(i, item){
				item = $(item), item.hasClass( active ) ? item.removeClass( active ) : item.addClass( active );
			});
		},

		/* Do Pass */
		isPass: function(it){},

		/* Do Block */
		isBlock: function(it){},

		/* ** *** **** ***** Info ***** **** *** ** */

		/* Get Data */
		getInfoData: function(it){
			$.renderHTML({
				element: report,
				data: '/resource/database/data-info.json',
				html: '/template/profile.html',
				type: 'get',
				dataType: 'json',
				callback: function(options){

					// Append Html To Element
					$(options.element).html( options.render );

					console.log(options);
					alert(options);

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

}( '.kit', '.masonry', '.report', 'active' );

$.extend({
	fancyFn: {
		operatSelect: function(){
			$.taber({
				container: '.audit-operat form menu',
				menus: 'button',
				callback: function(it, index){
					it = $(it), it.closest('li').find('[data-name]').attr('data-value', it.attr('data-option'));
				}
			});
			
			$.formSubmit();
		}
	},
	formFn: {
		operatSubmit: function(result){
			console.log( result );
			alert('I am callback');
		}
	}
});

})
(window, jQuery);