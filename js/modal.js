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
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.modal);

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

  jui2.attrChange['j-modal_snapto'] = function(el, oldVal, newVal){
    if(newVal){
      if($(el).attr('snappos')){
        var snappos = $(el).attr('snappos')
        if(snappos == 'topleft to bottomleft'){
          var pos = $(newVal).offset(), x = pos.left, y = pos.top+$(newVal).outerHeight(true);
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

}(jQuery))
