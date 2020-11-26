var GUIManager = {

	init: function(levelEditor){

		jQuery('body').find('.panel').not('.fixed').children('.panel-head').on('click', function(ev){
			ev.preventDefault();
			jQuery(this).parent().toggleClass('open');
		});

		jQuery('#settings').children('.btn-settings').on('click', function(ev){
			ev.preventDefault();
			jQuery(this).parent().toggleClass('open');
		});

		jQuery('#utilities-bar').children('.slot:not(.unique):not(.one-child)').children('button:not(.with-arrow)').on('click', function(ev){
			ev.preventDefault();
			jQuery(this).toggleClass('active');
		});
		jQuery('#utilities-bar').children('.slot.unique').children('button').on('click', function(ev){
			ev.preventDefault();
			jQuery(this).parent().children('button').removeClass('active');
			jQuery(this).addClass('active');
		});
		jQuery('#utilities-bar').children('.slot.one-child').children('button').on('click', function(ev){
			ev.preventDefault();
			var noActive = jQuery(this).parent().children('button').not('.active');
			jQuery(this).parent().children('button.active').removeClass('active');
			noActive.addClass('active');
		});
		jQuery('#utilities-bar').children('.slot').children('button.with-arrow').on('click', function(ev){
			ev.preventDefault();
			jQuery(this).next('ul').toggleClass('open');
		});
		jQuery('#utilities-bar').children('.slot').children('button.with-arrow').next('ul').children('li').on('click', function(ev){
			ev.preventDefault();
			jQuery(this).parent().children('li').removeClass('active');
			jQuery(this).addClass('active');
			jQuery(this).parent().prev('button.with-arrow').text(jQuery(this).text());
			jQuery(this).parent().toggleClass('open');
			let evtName = jQuery(this).parent().attr('data-ref');
			document.dispatchEvent(new CustomEvent('snap.'+evtName, { detail: { size: parseFloat(jQuery(this).text()) } }));
		});

		tippy('[data-tippy-content]', {delay: [1000, 0]});

		this.updateRangeField();
		jQuery('body').find('input[type="range"]').on('input', function(){
			jQuery(this).parent().css({
				'--value': jQuery(this).val(),
				'--text-value': JSON.stringify(jQuery(this).val())
			});
		});

		jQuery('#right-sidebar').find('input.prop').each(function(){
			var text = jQuery(this)[0];
			text.onkeypress = text.onpaste = checkInput;
			function checkInput(e) {
				var e = e || event;
				var char = e.type == 'keypress' ? String.fromCharCode(e.keyCode || e.which) : (e.clipboardData || window.clipboardData).getData('Text');
				// Only number and 'dot' char allowed
				if(/[^\d\.]/gi.test(char)) return false;
			}
		});

		jQuery('#btn-new-scene').on('click', function(ev){
			ev.preventDefault();
			if(jQuery(this).prev('input').val() == ""){
				jQuery(this).prev('input').addClass('required');
			} else {
				jQuery('#file-manager').removeClass('show');
				levelEditor.sceneName = jQuery(this).prev('input').val();
				levelEditor.resetScene();
			}
		});
	},

	initAssetsCarousel: function(){
		var scope = this;
		jQuery('.owl-carousel').owlCarousel({
			items: 1, loop: false, nav: true, dots: false,
			onTranslated: function(event) { scope.setAssetFromCarousel(jQuery(event.target)); }
		});
	},
	setCurrentCarousel: function(carousel){
		carousel = jQuery(carousel);
		jQuery('#assets-lists').children('.owl-carousel').removeClass('current');
		carousel.addClass('current');
		this.setAssetFromCarousel(carousel);
	},
	setAssetFromCarousel: function(carousel){
		var activeItem = carousel.find('.owl-stage').children('.owl-item.active');
		var assetRef = jQuery(activeItem).children('div').attr('data-ref');
		carousel.attr('data-asset', assetRef);
	},


	updateRangeField: function(){
		jQuery('body').find('input[type="range"]').each(function(){
			jQuery(this).parent().css({
				'--min': jQuery(this).attr('min'),
				'--max': jQuery(this).attr('max'),
				'--step': jQuery(this).attr('step'),
				'--value': jQuery(this).val(),
				'--text-value': JSON.stringify(jQuery(this).val())
			});
		});
	}

};
