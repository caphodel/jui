
/**
 * @classdesc Modal custom web component
 * @class modal
 * @property {string} title Modal title
 * @example <caption>Basic modal</caption>
 * <j-modal title="My Modal">Modal Content</j-modal>
 */
(function($){
	/** @constructor */
	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {
		$(this).detach().appendTo('body')
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.modal);
		var z = jui2.findHighestZIndex()

		$(this).css('z-index', z == '-Infinity' ? 100 : z)

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

    for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
      if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
  			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, false, newVal);
      else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
        jui2.attrChange[attrName](this, false, newVal);
		}

		if(!$(this).attr('snappos') && !$(this).attr('snapto') && $(this).attr('center')!="false")
			$(this).center();
	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.modal = {
		widget: document.registerElement('j-modal',  {
			prototype: proto
		}),
		proto: proto,
    extension: []
	}

	jui2.attrChange['j-modal_width'] = function(el, oldVal, newVal){
		(newVal) ? $(el).css('width', newVal) : $(el).css('width', '')
    /*if(newVal){
			$(el).css('width', newVal)
		}
		else{
			$(el).css('width', '')
		}*/
	}

	jui2.attrChange['j-modal_height'] = function(el, oldVal, newVal){
		(newVal) ? $(el).css('height', newVal) : $(el).css('height', '')
    /*if(newVal){
			$(el).css('height', newVal)
		}
		else{
			$(el).css('height', '')
		}*/
	}

	jui2.attrChange['j-modal_title'] = function(el, oldVal, newVal){
    if(newVal){
			$(el).children('.j-modal-title').remove()
			$(el).prepend('<div class="j-modal-title">'+newVal+'<div class="j-modal-window-controls"><i class="fa fa-remove"></i></div></div>')
			$(el).find('> .j-modal-title .fa-remove').click(function(){
				$(el).remove()
			})
		}
		else{
			$(el).children('.j-modal-title').remove()
		}
	}

  jui2.attrChange['j-modal_snapto'] = function(el, oldVal, newVal){
    if(newVal){
      if($(el).attr('snappos')){
        var snappos = $(el).attr('snappos')
        if(snappos == 'topleft to bottomleft'){
          var pos = $(newVal).offset(), x = pos.left, y = pos.top+$(newVal).outerHeight(true);
        }
        else if(newVal == 'bottomleft to topleft'){
          var pos = $(snapto).offset(), x = pos.left, y = pos.top-$(el).outerHeight(true);
        }

        var z = jui2.findHighestZIndex()
        z = z == '-Infinity' ? 100 : z;

        $(el).css({
          top: y,
          left: x,
          'z-index': z
        })
      }
    }
  }

  jui2.attrChange['j-modal_snappos'] = function(el, oldVal, newVal){
    if(newVal){
      if($(el).attr('snapto')){
        var snapto = $(el).attr('snapto')
        if(newVal == 'topleft to bottomleft'){
          var pos = $(snapto).offset(), x = pos.left, y = pos.top+$(snapto).outerHeight(true);
        }
        else if(newVal == 'bottomleft to topleft'){
          var pos = $(snapto).offset(), x = pos.left, y = pos.top-$(el).outerHeight(true);
        }

        var z = jui2.findHighestZIndex()
        z = z == '-Infinity' ? 100 : z;

        $(el).css({
          top: y,
          left: x,
          'z-index': z
        })
      }
    }
  }

	jui2.attrChange['j-modal_drag'] = function(el, oldVal, newVal){
    if(newVal == 'true'){
			$(el).attr('drag', '.j-modal-title')
		}
	}

	jui2.attrChange['j-modal_resize'] = function(el, oldVal, newVal){
		(newVal == 'true') ? $(el).append('<j-resize></j-resize>') : $(el).children('j-resize').remove()
    /*if(newVal == 'true'){
			$(el).append('<j-resize></j-resize>')
		}
		else{
			$(el).children('j-resize').remove()
		}*/
	}

}(jQuery))
;
