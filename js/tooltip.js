(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		var $self = $(this), self = this

		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.tooltip);

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		this.target = $($self.attr('target'));
		this.tooltip = $self.attr('tooltip');
		this.currentEl = false;

		$('body').on('mousemove.'+$self.attr('id'), $.throttle( 250, function(e){
			var show = self.target.is(e.target), target = $(e.target);
			if(show==false){
				var target = self.target.filter(target.parents())
			 	if(target.length > 0)
					show = true
			}
		  if(show){
				if(self.currentEl[0] != target[0]){
					self.currentEl = target;
					var offset = target.offset(), left;
					$('.j-tooltip').remove()
					$('body').append('<j-modal class="j-tooltip" center="false"></j-modal>');

					(typeof self.tooltip == 'string') ? $('.j-tooltip').append(self.tooltip) : self.tooltip($('.j-tooltip'))

					/*if(typeof self.tooltip == 'string'){
						$('.j-tooltip').append(self.tooltip)
					}
					else {
						self.tooltip($('.j-tooltip'))
					}*/

					left = (offset.left+$('.j-tooltip').outerWidth()>$(window).width()) ? offset.left-$('.j-tooltip').outerWidth() : offset.left+(target.outerWidth()/2)-($('.j-tooltip').outerWidth()/2)

					/*if(offset.left+$('.j-tooltip').outerWidth()>$(window).width())
						left = offset.left-$('.j-tooltip').outerWidth()
					else
						left = offset.left+(target.outerWidth()/2)-($('.j-tooltip').outerWidth()/2)*/
					$('.j-tooltip').offset({left: left, top: offset.top-$('.j-tooltip').outerHeight()})
				}

				if($self.closest('body').length == 0){
					$('body').off('mousemove.'+$self.attr('id'));
				}
			}
			else{
				$('.j-tooltip').remove()
			}
		}))

		this.enabledAttrChange = $.unique(this.enabledAttrChange.concat([]));

		var attrChange = jui2.attrChange

    for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue, attr = this.tagName.toLowerCase()+'_'+attrName;
      if(attrChange[attr])
  			attrChange[attr](this, false, newVal);
      else if(attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
        attrChange[attrName](this, false, newVal);
		}
	};

	proto.setText = function(text){
		var offset = this.currentEl.offset(), left, jtooltip = $('.j-tooltip');
		jtooltip.empty().append(text);
		if(offset.left+jtooltip.outerWidth()>$(window).width())
			left = offset.left-jtooltip.outerWidth()
		else
			left = offset.left+(this.currentEl.outerWidth()/2)-(jtooltip.outerWidth()/2)
		jtooltip.offset({left: left, top: offset.top-jtooltip.outerHeight()})
	}

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var attr = this.tagName.toLowerCase()+'_'+attrName, attrChange = jui2.attrChange;
		if(attrChange[attr])
			attrChange[attr](this, oldVal, newVal);
    else if(attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.tooltip = {
		widget: document.registerElement('j-tooltip',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
