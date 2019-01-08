(function ( $ ) {

	// Grab all focal point images


	$(window).on('load', function () {
		var $img = $('img.js-focal-point-image').not('[data-responsify-initialized]');

		// console.warn("initializing image: ", $img);

		$img.one('load', function () {
			$(this).css('max-width', 'none').responsify();
		}).each(function() {
			if (this.complete) {
				$(this).load().responsify();
			}
		});

		// Flag the element, so we don't initialize it twice.
		$img.attr("data-responsify-initialized", "true");

		// TODO: Quick fix -DP
		setTimeout(function () {
			$img.responsify();
		}, 20);

		// When window is resizing...
		$(window).on('resize', function(){
			// Retrigger responsify.js
			$img.responsify();
		});
	});



	// https://github.com/wentin/ResponsifyJS/
	$.fn.responsify = function() {
		return this.each(function() {
		  var owidth, oheight,
		      twidth, theight,
		      fx1, fy1, fx2, fy2,
		      width, height, top, left,
		      $this = $(this);

		  // MC: ATTCK additions. Save the original dimensions on the element, so we're calculating
		  //  based off of them. Can help the resizing correct itself if it ever miscalculates.
		  if (!$this.data("orig-width")) {
		  	$this.data("orig-width", $this.width());
		  	$this.data("orig-height", $this.height());
		  }

		  // Used to be current image dimensions.
		  owidth = $this.data("orig-width");
		  oheight = $this.data("orig-height");

		  // Container dimensions
		  twidth = $this.parent().width();
		  theight = $this.parent().height();

		  // Focal point values.
		  // These are NaN when the attributes are not set.
		  fx1 = Number($this.attr('data-focus-left'));
		  fy1 = Number($this.attr('data-focus-top'));
		  fx2 = Number($this.attr('data-focus-right'));
		  fy2 = Number($this.attr('data-focus-bottom'));



		  // console.warn("focal point: ", fx1, fy1, fx2, fy2);
		  // console.warn("owidth: ", owidth);


		  //  If image width/height ratio is bigger than the container's...
		  if( owidth/oheight > twidth/theight ) {
		  	// Calculate focal point width
		    var fwidth = (fx2-fx1) * owidth;
		    // console.warn("...img proportions bigger than container...");


		    // If focal point width/height ratio is bigger than the container's...
		    if ( fwidth/oheight > twidth/theight ) {
		    	// console.warn("...focal point width bigger than container");

		      height = oheight*twidth/fwidth;
		      width = owidth*twidth/fwidth;
		      left = -fx1*width;
		      top = (theight-height)/2;
		      // console.warn("...1");

		    } else {


		      height = theight;
		      width = theight*owidth/oheight;
		      // console.warn("tWIDTH: ",twidth);
		      // console.warn("oWIDTH: ",owidth);
		      // console.warn("oheight: ",oheight);
		      left = twidth/2 - (fx1 + fx2)*width/2;
		      // if left > 0, it will leave blank on the left, so set it to 0;
		      left = left>0?0:left;
		      // if width - left < twidth, it will leave blank on the right, so set left = width - twidth
		      left = (twidth - left - width)>0?(twidth-width):left;
		      top = 0;
		      // console.warn("......2");
		    }

		  } else {

		    var fheight = (fy2-fy1) * oheight;

		    if ( fheight/owidth > theight/twidth ) {


		      // MC - original code below. Does not cover all bases since images smaller than the container
		      //  will have whitespace around them. Removing this in favor of our solution further below.
		      // width = owidth*theight/fheight;
		      // height = oheight*theight/fheight;
		      // top = -fy1*height;
		      // left = (twidth-width)/2;

		      // console.warn(".........3");

		      // MC - our addition. When the container is bigger than the original image, stretch it out.
		      width = twidth;
		      height = oheight*twidth/owidth;
		      top = 0
		      left = 0;


		    } else {

		      width = twidth;
		      height = twidth*oheight/owidth;
		      top = theight/2 - (fy1 + fy2)*height/2;
		      // if top > 0, it will leave blank on the top, so set it to 0;
		      top = top>0?0:top;
		      // if height - top < theight, it will leave blank on the bottom, so set top = height - theight
		      top = (theight - top - height)>0?(theight-height):top;
		      left = 0;
		      // console.warn("............4");

		    }
		  }

		  $this.parent().css({
		    "overflow": "hidden"
		  });

		  $this.css({
		    "position": "relative",
		    "height": height,
		    "width": width,
		    "left": left,
		    "top": top
		  });
		});
	};

}( jQuery ));