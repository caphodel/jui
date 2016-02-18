/**
 * @classdesc Horizontal slider custom web component
 * @class hslider
 * @example <caption>Basic usage</caption>
 * <j-hslider>My Content</j-hslider>
 */
(function($){
	/** @constructor */
	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {
		var self = this;
    jui2.ui.base.proto.createdCallback.call(this, jui2.ui.hslider);

		var children = $(this).children().detach();

		$(this).append(jui2.tmpl['hslider']()).children('div').append(children)

		var timeoutId, time, mdown;
		$(this).children('i').first().bind('mousedown', function() {
			time = 250
			mdown = function() {
				$(self).children('div').scrollLeft($(self).children('div').scrollLeft() - 20)
				if (time > 0)
					time = time - 50;
				timeoutId = setTimeout(mdown, time);
			}
			mdown()
		})

		$(this).children('i').last().bind('mousedown', function() {
			time = 250
			mdown = function() {
				$(self).children('div').scrollLeft($(self).children('div').scrollLeft() + 20)
				if (time > 0)
					time = time - 50;
				timeoutId = setTimeout(mdown, time);
			}
			mdown()
		})

		$(this).children('div').on('DOMMouseScroll mousewheel', function(e){
			var wheel = 0;
			if(e.originalEvent.wheelDelta)
				wheel = e.originalEvent.wheelDelta
			if(e.originalEvent.deltaY)
				wheel = e.originalEvent.deltaY
			if(e.originalEvent.detail)
				wheel = e.originalEvent.detail
			if(wheel>0){
				$(this).scrollLeft($(this).scrollLeft() + 20)
			}
			else{
				$(this).scrollLeft($(this).scrollLeft() - 20)
			}

			return false;
		})

		$('body').bind('mouseup', function() {
			clearTimeout(timeoutId);
		});

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}
	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.hslider = {
		widget: document.registerElement('j-hslider',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
