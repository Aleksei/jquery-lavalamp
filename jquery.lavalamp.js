// Place any jQuery/helper plugins in here.
jQuery.fn.lavaLamp = (function(){

	var pr = {
		getCSS: function( $item, left, reserve ) {
			var css = {
				left: $item.data('lavalampPos')
			};

			if ( Modernizr.backgroundsize && Modernizr.cssgradients ) {
				css.backgroundPosition = '' + ( left - css.left - reserve ) + 'px 0';
			}
			return css;
		}
	};

	var jPlugin = function( userOptions ) {
		var $self = $( this );

		var options = $.extend( true, {
			$current: false,
			seletors: {
				items: false,
				back: false
			},
			events: {
				activate: 'itemActivate'
			}
		}, userOptions );

		if ( !!options.selectors.items && !!options.selectors.back ) {
			$self.each(function(){
				var $self = $( this ),
					$items = $self.find( options.selectors.items ),
					$back = $self.find( options.selectors.back );

				for ( var i = 0, length = $items.length; i < length; i++ ) {
					$items.eq(i).data( 'lavalampPos', $items.eq(i).position().left );
				}

				var lastTween = false;

				var reserve = 100;

				var leftCSS = {
					left: $items.eq(0).data('lavalampPos'),
					visibility: 'visible'
				};

				if ( Modernizr.backgroundsize && Modernizr.cssgradients ) {
					var width = $items.eq(length - 1).data('lavalampPos') - $items.eq(0).data('lavalampPos') + $items.eq(length - 1 ).width();
					leftCSS.backgroundSize = '' + ( width + 2*reserve ) + 'px ' + $items.eq(0).height() + 'px';
					leftCSS.backgroundPosition = '' + ( -reserve ) + 'px 0px';
				}

				console.log( leftCSS.backgroundSize, $items, $items.eq(0) );

				var $current = $items.eq(0);

				if ( options.$current ) {
					$current = options.$current;
				}

				$back
					.css( leftCSS )
					.css( pr.getCSS( $current, leftCSS.left, reserve ) );

				$items.bind( options.events.activate, function( event ){
					var $item = $( event.target );

					if ( lastTween ) {
						lastTween.pause();
					}

					TweenLite.killTweensOf( $item );

					var tweenCSS = pr.getCSS( $item, leftCSS.left, reserve );

					tweenCSS.ease = Back.easeInOut;

					lastTween = new Tween( $back, 1, tweenCSS );
				});
			});
		}

		return $self;
	};

	return jPlugin;
})();
