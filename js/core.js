/**
 * @namespace jui2
 * @global
 */
var jui2 = jui2 || {
	ui: {},
	lang: {}
};

(function($) {

	Array.prototype._reduce = function(callback /*, initialValue*/) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.reduce called on null or undefined');
    }

    if (typeof callback !== 'function') {
			return;
      //throw new TypeError(typeof callback + ' is not a function');
    }
    var t = Object(this), len = t.length >>> 0, k = 0, value;
    if (arguments.length == 2) {
      value = arguments[1];
    } else {
      while (k < len && !(k in t)) {
        k++;
      }
      if (k >= len) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      value = t[k++];
    }
    for (; k < len; k++) {
      if (k in t) {
        value = callback(value, t[k], k, t);
      }
    }
    return value;
  };

	jui2.path = './dist/';

	jui2.loadExtension = function(){
		$.getJSON(jui2.path+'extension/').done(function(data){
			for(i in data){
				data[i] = jui2.path+'extension/'+data[i]+'/'+data[i]+'.js'
			}
			head.load(data)
		})
	}

	jui2.lang = jui2.lang || {};
	/**
	 * @namespace ui
	 * @memberof jui2
	 */
	jui2.ui = jui2.ui || {};
	/**
	 * Create random string
	 * @memberof jui2
	 * @param  {Number} length String length
	 * @param  {String} chars  String output format combination, Combination: 'a' for lowercase alphabet, 'A' for uppercase alphabet, '#' for numeric and '!' for non alphanumeric
	 * @return {String}        Random string
	 * @example
	 * var randomString = jui2.random(8, 'aA#'); //will return random string containing uppercase, lowercase and numeric string
	 */
	jui2.random = function (length, chars) {
		var result = '', mask = '', text, i;

		text = {
			'a': 'abcdefghijklmnopqrstuvwxyz',
			'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			'#': '0123456789',
			'!': '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\'
		};

		for (i = chars.length; i--;)
			mask+=text[chars[i]]

		for (i = length; i > 0; --i)
			result += mask[Math.round(Math.random() * (mask.length - 1))];
		return result;
	};
	/**
	 * return highest z-index
	 * @memberof jui2
	 * @return {number} Highest z-index
	 */
	jui2.findHighestZIndex = function(){
		return Math.max.apply(null,$.map($('body > *'), function(e,n){
		   if($(e).css('position')=='absolute')
				return parseInt($(e).css('z-index'))||1 ;
		   })
		);
	}
	/**
	 * Clear null value from JSON object and change it to empty string
	 * @memberof jui2
	 * @param  {object} json JSON object
	 * @return {object}      JSON object
	 */
	jui2.clearNullFromJson = function(json){
		jui2.iterateJson(json, function(json){
			if(typeof json == 'object')
				for (var data in json) {
					if(!json[data])
						if(json[data]!=0)
							json[data] = ''
				}
		})
	};
	/**
	 * Iterating a json object
	 * @memberof jui2
	 * @param  {object}   json JSON object
	 * @param  {Function} fn   function to execute in every JSON object items
	 * @example
	 * jui2.iterateJson({
	 * 	a: 1,
	 *  b: 2
	 * }, function(obj){
	 * 	console.log(obj)
	 * }) // will print 1 then 2
	 */
	jui2.iterateJson = function(json, fn){
		for (var data in json) {
			fn(json[data])
			typeof json[data] == 'object' &&
				jui2.iterateJson(json[data], fn)
		}
	};

	/*old code*/
	$.fn.jui2Serialize = function(){
		value = {};
		this.find('[role=textField],[role=timeField],[role=uploadField],[role=textArea],[role=dateField],[role=comboField],[role=datePicker],[role=passwordField],[role=radioField]').each(function(){
			var el = $(this)
			var role = el.attr('role'), id = el.attr('name')||el.attr('id'), text = '';

			if (role=='textArea')
				text = $(el.find('iframe')[0].contentWindow.document.body).html().trim()

			value[id] =
				role=='textArea' && (text != '<br>' && jui2.escapeHtmlEntities(text.replace('&#x2010;', '-').replace('&#x2013;', '-').replace('&#x9;', '').replace(/&nbsp;/g,' ').replace(/\s\s+/g, ' ').replace(/(^<br>|<br>$)/g,'')) != '' && jui2.escapeHtmlEntities(jui2.cleanWordPaste(text).replace('&#x2010;', '-').replace('&#x2013;', '-').replace('&#x9;', '').replace(/&nbsp;/g,' ').replace(/\s\s+/g, ' ').replace(/(^<br>|<br>$)/g,'')))
				|| role=='comboField' &&
					el.find('input[type=hidden]').val()
				|| role=='radioField' &&
					el.find('input:checked').val()
				|| role=='timeField' &&
					el.find('input').eq(0).val()+':'+el.find('input').eq(1).val()
				|| el.find('input').val()

			if(role=='textArea' && value[id]=='<br>')
				value[id] = ''

			if(role=='textArea'){
				if(value[id])
					value[id] = jui2.escapeHtmlEntities((he.encode(value[id], {
						'allowUnsafeSymbols': false
					})).replace('&#x2010;', '-').replace('&#x2013;', '-').replace('&#x9;', '').replace(/&nbsp;/g,' ')
					.replace(/\s\s+/g, ' '));
			}

		});
		var i = 0
		this.find('j-datefield, j-combofield').each(function(i, val){
			var el = $(val), id = el.attr('name')||el.attr('id')
			value[id] = el.val();
		})

		value = $.extend(value, $(this).getValues())
		return value;
	};

	/**
	 * Count the size of overlapped area
	 * @param  {jQuery} selector jQuery selector, object or HTMLElement
	 * @return {object}          JSON object containing width and height of overlapped area
	 */
	$.fn.overlappedSize = function(selector){
		var el = $(selector),
		offset1 = this.offset(),
		offset2 = el.offset(),
		w1 = this.outerWidth(),
		w2 = el.outerWidth(),
		h1 = this.outerHeight(),
		h2 = el.outerHeight(),
		width = Math.max(Math.min(offset1.left+w1, offset2.left+w2) - Math.max(offset1.left, offset2.left), 0),
		height = Math.max(Math.min(offset1.top+h1, offset2.top+h2) - Math.max(offset1.top, offset2.top), 0)

		return {
			width: width,
			height: height
		}
	}

	/**
	 * Calculate distance between 2 points
	 * @param  {object} point1 x and y of point ex. {x: 10, y: 10}
	 * @param  {object} point2 x and y of point ex. {x: 10, y: 10}
	 * @return {number}        distance
	 */
	$.calcDistance = function(point1, point2){
		var xs = 0, ys = 0;

		xs = point2.x - point1.x;
		xs = xs * xs;

		ys = point2.y - point1.y;
		ys = ys * ys;

		return Math.sqrt( xs + ys );
	}

	$.fn.centerPoint = function(){
		var xy1 = this.offset()

		return {
			x: xy1.left + this.outerWidth()/2,
			y: xy1.top + this.outerHeight()/2
		}
	}

	/**
	 * Get nearest distance of 2 elements
	 * @param  {jQuery} selector jQuery selector, object or HTMLElement
	 * @return {integer}          Distance of nearest distance in pixel
	 */
	$.fn.nearestDistance = function(selector){
		var offset1 = this.offset(), topLeft1 = {x: offset1.left, y: offset1.top},
		bottomLeft1 = {x: offset1.left, y: offset1.top+this.outerHeight()},
		topRight1 = {x: offset1.left+this.outerWidth(), y: offset1.top},
		bottomRight1 = {x: offset1.left+this.outerWidth(), y: offset1.top+this.outerHeight()},
		bottom1 = offset1.top+this.outerHeight(),
		right1 = offset1.left+this.outerWidth()
		el = $(selector),
		offset2 = el.offset(), topLeft2 = {x: offset2.left, y: offset2.top},
		bottomLeft2 = {x: offset2.left, y: offset2.top+el.outerHeight()},
		topRight2 = {x: offset2.left+el.outerWidth(), y: offset2.top},
		bottomRight2 = {x: offset2.left+el.outerWidth(), y: offset2.top+el.outerHeight()},
		bottom2 = offset2.top+el.outerHeight(),
		right2 = offset2.left+el.outerWidth(), distance = []

		if(right1 > offset2.left && !(offset1.left > right2)){
			if(bottom1 < offset2.top)
				distance.push(offset2.top - bottom1)
			if(bottom2 < offset1.top)
				distance.push(offset1.top - bottom2)
		}

		if(bottom1 > offset2.top && !(offset1.top > bottom2)){
			if(right1 < offset2.left)
				distance.push(offset2.left - right1)
			if(right2 < offset1.left)
				distance.push(offset1.left - right2)
		}

		if(bottom1 < offset2.top){
			distance.push($.calcDistance(bottomRight1, topLeft2))
			distance.push($.calcDistance(bottomRight1, topRight2))
			distance.push($.calcDistance(bottomLeft1, topLeft2))
			distance.push($.calcDistance(bottomLeft1, topRight2))
		}
		else if(bottom2 < offset1.top){
			distance.push($.calcDistance(bottomRight2, topLeft1))
			distance.push($.calcDistance(bottomRight2, topRight1))
			distance.push($.calcDistance(bottomLeft2, topLeft1))
			distance.push($.calcDistance(bottomLeft2, topRight1))
		}

		if(right1 < offset2.left){
			distance.push($.calcDistance(bottomRight1, topLeft2))
			distance.push($.calcDistance(bottomRight1, bottomLeft2))
			distance.push($.calcDistance(topRight1, topLeft2))
			distance.push($.calcDistance(topRight1, bottomLeft2))
		}
		else if(right2 < offset1.left){
			distance.push($.calcDistance(bottomRight2, topLeft1))
			distance.push($.calcDistance(bottomRight2, bottomLeft1))
			distance.push($.calcDistance(topRight2, topLeft1))
			distance.push($.calcDistance(topRight2, bottomLeft1))
		}

		//TODO: 0 Could be optimized.
		return Math.min.apply(null, distance);
	}

	$.fn.nearest = function(selector){
		var isOverlap = false, self = this, data = $(), value = false, tmp, el1, el2, offset1, offset2, targetOffset = this.offset(), width = this.outerWidth(), height = this.outerHeight();
		$(selector || '*:visible').not(this.get(0)).each(function(i, el){

			if(!isOverlap){
				if(self.isOverlap(el)){
          tmp = self.overlappedSize(el)
          tmp = tmp.width*tmp.height
          data = $(el)
          value = tmp
          data.add(el)
					isOverlap = true
				}
				else{
          if(!value){
            value = self.nearestDistance(el);
            data = $(el)
          }
          else{
            if(self.nearestDistance(el) < value){
              data = $(el)
              value = self.nearestDistance(el)
            }
            else if(value == self.nearestDistance(el)){
							el1 = data.last(), el2 = $(el), dist2 = $.calcDistance(self.centerPoint(),el2.centerPoint()), dist1 = $.calcDistance(self.centerPoint(),el1.centerPoint())

							if(dist2 < dist1)
								data = el2
							else if(dist1 == dist2)
								data = data.add(el)
            }
          }
				}
			}
			else{
        tmp = self.overlappedSize(el)
        tmp = tmp.width*tmp.height
				if(value < tmp){
					data = $(el)
					value = tmp
				}
				else if(value == tmp){
					el1 = data.last(), el2 = $(el), dist2 = $.calcDistance(self.centerPoint(),el2.centerPoint()), dist1 = $.calcDistance(self.centerPoint(),el1.centerPoint())

					if(dist2 < dist1)
						data = el2
					else if(dist1 == dist2)
						data = data.add(el)
				}
			}
		})

		return data;
	}

	/**
	 * Check if element is in viewport
	 * @return {boolean} true if element in viewport
	 */
	$.fn.inViewport = function() {
    var rect = this.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
	};

	/**
	 * Get HTML string of element
	 * @return {String}   Outer HTML string of an element
	 */
	$.fn.outerHTML = function(s) {
		return s
	    ? this.before(s).remove()
	    : jQuery("<p>").append(this.eq(0).clone()).html();
	};

	/**
	 * Check if element touched the top of the window
	 * @return {boolean} true if element touched the top of the window
	 * @author Deddy Lasmono Putro
	 */
	$.fn.touchTop = function(){
		//var el = $(this);
		return $(this).offset().top<0
	};

	/**
	 * Check if element touched the bottom of the window
	 * @return {boolean} true if element touched the bottom of the window
	 * @author Deddy Lasmono Putro
	 */
	$.fn.touchBottom = function(){
		var wd = $(window);
		return (this.offset().top + this.height()) >= (wd.height()+wd.scrollTop())
	};

	/**
	 * Get values from jui2 widget inside selected element
	 * @return {object} Collection of jui2 widget values
	 * @author Deddy Lasmono Putro
	 */
	$.fn.getValues = function(){
		var values = {}
		this.find('j-textfield, j-textarea, j-passwordfield, j-combofield, j-datefield, j-numberfield, j-editor, j-timefield').filter(function(){
			var el = $(this);
	    return (el.attr('name')||el.attr('id')) !== undefined
	  }).each(function(i, val){
	    var el = $(val), id = el.attr('name')||el.attr('id')
			values[id] = el.val()
		})
		return values;
	};

	/**
	 * Get RGB value from hex color
	 * @param  {string} color Hex color
	 * @return {object}       Objct containing RGB value
	 * @author Deddy Lasmono Putro
	 */
	$.getRGB = function(color) {
		var r, g, b, rgb;
		if(color.match(/rgb/gi)){
			rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			r = rgb[1];
			g = rgb[2];
			b = rgb[3];

		  return {
				R: r,
				G: g,
				B: b
		  };
		}
		else{
			r = color.substring(1, 3);
			g = color.substring(3, 5);
			b = color.substring(5, 7);

		  return {
				R: parseInt(r, 16),
				G: parseInt(g, 16),
				B: parseInt(b, 16)
		  };
		}
	};

	/**
	 * Get ideal color (black or white) for defined background color
	 * @param  {string} bgColor Hex color
	 * @return {string} color Hex color (black/white)
	 * @author Deddy Lasmono Putro
	 */
	$.idealTextColor = function(bgColor) {

		var nThreshold = 105,
		components = $.getRGB(bgColor),
		bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

		return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
	};

	/**
	 * Get only text(remove children) from element
	 * @return {string} Element's text
	 * @author Deddy Lasmono Putro
	 */
	$.fn.justtext = function() {
		var c = this.clone(), text = c.children()
		.remove()
		.end()
		.text();
		c.remove();
		return text;
	};

	/**
	 * Center an element
	 * @return {jQuery} jQuery object
	 * @author Deddy Lasmono Putro
	 */
	$.fn.center = function () {
		var wd = $(window)
	  this.css("position","absolute");
	  this.css("top", Math.max(0, ((wd.height() - this.outerHeight(false)) / 2) + wd.scrollTop()) + "px");
	  this.css("left", Math.max(0, ((wd.width() - this.outerWidth(false)) / 2) + wd.scrollLeft()) + "px");
	  return this;
	};

	/**
	 * Check if element overlapping other element
	 * @param  {jQuery} selector Jquery selector, object or eleemnt
	 * @return {boolean}          true if overlapping
	 * @author Deddy Lasmono Putro
	 */
	$.fn.isOverlap = function(selector){
		var rect1, rect2 = selector instanceof jQuery ? selector[0].getBoundingClientRect() : (selector instanceof HTMLCollection ? selector.getBoundingClientRect() : $(selector)[0].getBoundingClientRect())
		if(!this.is(':visible')){
			this.css('opacity', 0).show();
			rect1 = this[0].getBoundingClientRect()
			this.hide().css('opacity', '');
		}
		else
			rect1 = this[0].getBoundingClientRect()
		return !(rect1.right < rect2.left ||
	    rect1.left > rect2.right ||
	    rect1.bottom < rect2.top ||
	    rect1.top > rect2.bottom)
	};

	/**
	 * Check if element inside another element
	 * @param  {jQuery} selector jQuery object, selector or HTMLElement
	 * @return {boolean}          true if element inside another element
	 * @author Deddy Lasmono Putro
	 */
	$.fn.isInside = function(selector){
		var rect1 = this[0].getBoundingClientRect(), rect2 = selector instanceof jQuery ? selector[0].getBoundingClientRect() : (selector instanceof HTMLCollection ? selector.getBoundingClientRect() : $(selector)[0].getBoundingClientRect())
		return (rect2.right > rect1.right &&
	    rect2.left < rect1.left ||
	    rect2.bottom > rect1.bottom ||
	    rect2.top < rect1.top)
	};

	/**
	 * Get elements that touching selected element
	 * @param  {jQuey} selector jQuery selector, object or HTMLElement
	 * @return {jQuery}          jQuery object that contains all element that touching selected element
	 */
	$.fn.touching = function(selector){
	  var el = this;
	  return $(selector || '*:visible').filter(function(){
	    return el.isOverlap(this)
	  })
	}

	/**
	 * Check if element has scrollbar or not
	 * @return {boolean} Return true if element has scrollbar
	 * @author Deddy Lasmono Putro
	 */
    $.fn.hasScrollBar = function() {
      return this.get(0).scrollHeight > this.outerHeight();
    };

})(jQuery);

/*!
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

// Script: jQuery resize event
//
// *Version: 1.1, Last updated: 3/14/2010*
//
// Project Home - http://benalman.com/projects/jquery-resize-plugin/
// GitHub       - http://github.com/cowboy/jquery-resize/
// Source       - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.js
// (Minified)   - http://github.com/cowboy/jquery-resize/raw/master/jquery.ba-resize.min.js (1.0kb)
//
// About: License
//
// Copyright (c) 2010 "Cowboy" Ben Alman,
// Dual licensed under the MIT and GPL licenses.
// http://benalman.com/about/license/
//
// About: Examples
//
// This working example, complete with fully commented code, illustrates a few
// ways in which this plugin can be used.
//
// resize event - http://benalman.com/code/projects/jquery-resize/examples/resize/
//
// About: Support and Testing
//
// Information about what version or versions of jQuery this plugin has been
// tested with, what browsers it has been tested in, and where the unit tests
// reside (so you can test it yourself).
//
// jQuery Versions - 1.3.2, 1.4.1, 1.4.2
// Browsers Tested - Internet Explorer 6-8, Firefox 2-3.6, Safari 3-4, Chrome, Opera 9.6-10.1.
// Unit Tests      - http://benalman.com/code/projects/jquery-resize/unit/
//
// About: Release History
//
// 1.1 - (3/14/2010) Fixed a minor bug that was causing the event to trigger
//       immediately after bind in some circumstances. Also changed $.fn.data
//       to $.data to improve performance.
// 1.0 - (2/10/2010) Initial release

(function ($, window, undefined) {
	'$:nomunge'; // Used by YUI compressor.

	// A jQuery object containing all non-window elements to which the resize
	// event is bound.
	var elems = $([]),

	// Extend $.resize if it already exists, otherwise create it.
	jq_resize = $.resize = $.extend($.resize, {}),

	timeout_id,

	// Reused strings.
	str_setTimeout = 'setTimeout',
	str_resize = 'resize',
	str_data = str_resize + '-special-event',
	str_delay = 'delay',
	str_throttle = 'throttleWindow';

	// Property: jQuery.resize.delay
	//
	// The numeric interval (in milliseconds) at which the resize event polling
	// loop executes. Defaults to 250.

	jq_resize[str_delay] = 250;

	// Property: jQuery.resize.throttleWindow
	//
	// Throttle the native window object resize event to fire no more than once
	// every <jQuery.resize.delay> milliseconds. Defaults to true.
	//
	// Because the window object has its own resize event, it doesn't need to be
	// provided by this plugin, and its execution can be left entirely up to the
	// browser. However, since certain browsers fire the resize event continuously
	// while others do not, enabling this will throttle the window resize event,
	// making event behavior consistent across all elements in all browsers.
	//
	// While setting this property to false will disable window object resize
	// event throttling, please note that this property must be changed before any
	// window object resize event callbacks are bound.

	jq_resize[str_throttle] = true;

	// Event: resize event
	//
	// Fired when an element's width or height changes. Because browsers only
	// provide this event for the window element, for other elements a polling
	// loop is initialized, running every <jQuery.resize.delay> milliseconds
	// to see if elements' dimensions have changed. You may bind with either
	// .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
	//
	// Usage:
	//
	// > jQuery('selector').bind( 'resize', function(e) {
	// >   // element's width or height has changed!
	// >   ...
	// > });
	//
	// Additional Notes:
	//
	// * The polling loop is not created until at least one callback is actually
	//   bound to the 'resize' event, and this single polling loop is shared
	//   across all elements.
	//
	// Double firing issue in jQuery 1.3.2:
	//
	// While this plugin works in jQuery 1.3.2, if an element's event callbacks
	// are manually triggered via .trigger( 'resize' ) or .resize() those
	// callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
	// events system. This is not an issue when using jQuery 1.4+.
	//
	// > // While this works in jQuery 1.4+
	// > $(elem).css({ width: new_w, height: new_h }).resize();
	// >
	// > // In jQuery 1.3.2, you need to do this:
	// > var elem = $(elem);
	// > elem.css({ width: new_w, height: new_h });
	// > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
	// > elem.resize();

	$.event.special[str_resize] = {

		// Called only when the first 'resize' event callback is bound per element.
		setup : function () {
			// Since window has its own native 'resize' event, return false so that
			// jQuery will bind the event using DOM methods. Since only 'window'
			// objects have a .setTimeout method, this should be a sufficient test.
			// Unless, of course, we're throttling the 'resize' event for window.
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var elem = $(this);

			// Add this element to the list of internal elements to monitor.
			elems = elems.add(elem);

			// Initialize data store on the element.
			$.data(this, str_data, {
				w : elem.width(),
				h : elem.height()
			});

			// If this is the first element added, start the polling loop.
			if (elems.length === 1) {
				loopy();
			}
		},

		// Called only when the last 'resize' event callback is unbound per element.
		teardown : function () {
			// Since window has its own native 'resize' event, return false so that
			// jQuery will unbind the event using DOM methods. Since only 'window'
			// objects have a .setTimeout method, this should be a sufficient test.
			// Unless, of course, we're throttling the 'resize' event for window.
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var elem = $(this);

			// Remove this element from the list of internal elements to monitor.
			elems = elems.not(elem);

			// Remove any data stored on the element.
			elem.removeData(str_data);

			// If this is the last element removed, stop the polling loop.
			if (!elems.length) {
				clearTimeout(timeout_id);
			}
		},

		// Called every time a 'resize' event callback is bound per element (new in
		// jQuery 1.4).
		add : function (handleObj) {
			// Since window has its own native 'resize' event, return false so that
			// jQuery doesn't modify the event object. Unless, of course, we're
			// throttling the 'resize' event for window.
			if (!jq_resize[str_throttle] && this[str_setTimeout]) {
				return false;
			}

			var old_handler;

			// The new_handler function is executed every time the event is triggered.
			// This is used to update the internal element data store with the width
			// and height when the event is triggered manually, to avoid double-firing
			// of the event callback. See the "Double firing issue in jQuery 1.3.2"
			// comments above for more information.

			function new_handler(e, w, h) {
				var elem = $(this),
				data = $.data(this, str_data);

				// If called from the polling loop, w and h will be passed in as
				// arguments. If called manually, via .trigger( 'resize' ) or .resize(),
				// those values will need to be computed.
				data.w = w !== undefined ? w : elem.width();
				data.h = h !== undefined ? h : elem.height();

				old_handler.apply(this, arguments);
			};

			// This may seem a little complicated, but it normalizes the special event
			// .add method between jQuery 1.4/1.4.1 and 1.4.2+
			if ($.isFunction(handleObj)) {
				// 1.4, 1.4.1
				old_handler = handleObj;
				return new_handler;
			} else {
				// 1.4.2+
				old_handler = handleObj.handler;
				handleObj.handler = new_handler;
			}
		}

	};

	function loopy() {

		// Start the polling loop, asynchronously.
		timeout_id = window[str_setTimeout](function () {

				// Iterate over all elements to which the 'resize' event is bound.
				elems.each(function () {
					var elem = $(this),
					width = elem.width(),
					height = elem.height(),
					data = $.data(this, str_data);

					// If element size has changed since the last time, update the element
					// data store and trigger the 'resize' event.
					if (width !== data.w || height !== data.h) {
						elem.trigger(str_resize, [data.w = width, data.h = height]);
					}

				});

				// Loop.
				loopy();

			}, jq_resize[str_delay]);

	};

})(jQuery, this);
;/****lang/day.js****/
(function($){

	jui2.lang.day = {
		en: {
			sun: {
				short: 'Sun',
				long: 'Sunday'
			},
			mon: {
				short: 'Mon',
				long: 'Monday'
			},
			tue: {
				short: 'Tue',
				long: 'Tuesday'
			},
			wed: {
				short: 'Wed',
				long: 'Wednesday'
			},
			thu: {
				short: 'Thu',
				long: 'Thursday'
			},
			fri: {
				short: 'Fri',
				long: 'Friday'
			},
			sat: {
				short: 'Sat',
				long: 'Saturday'
			}
		}
	}

}(jQuery));/****lang/month.js****/
(function($){

	jui2.lang.month = {
		en: {
			jan: {
				short: 'Jan',
				long: 'January'
			},
			feb: {
				short: 'Feb',
				long: 'February'
			},
			mar: {
				short: 'Mar',
				long: 'March'
			},
			apr: {
				short: 'Apr',
				long: 'April'
			},
			may: {
				short: 'May',
				long: 'May'
			},
			jun: {
				short: 'Jun',
				long: 'June'
			},
			jul: {
				short: 'Jul',
				long: 'July'
			},
			aug: {
				short: 'Aug',
				long: 'August'
			},
			sep: {
				short: 'Sep',
				long: 'September'
			},
			oct: {
				short: 'Oct',
				long: 'October'
			},
			nov: {
				short: 'Nov',
				long: 'November'
			},
			dec: {
				short: 'Dec',
				long: 'December'
			},
		}
	}

}(jQuery));
