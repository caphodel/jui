/**
 * @classdesc base for all custom web component
 * @class base
 */

(function($) {
  /** @constructor */
  var proto = Object.create(HTMLElement.prototype)

  proto.createdCallback = function(proto) {
    this.enabledAttrChange = this.enabledAttrChange || [];
    for(i in proto.extension){
      proto.extension[i](this);
    }

    if($(this).attr('onafterdraw'))
      $(this).on('afterdraw', function(e){
        window[$(this).attr('onafterdraw')].call(this, e);
      })

    /*for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
			if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
				jui2.attrChange[attrName](this, '', newVal);
		}*/

    //add id if not set
    if(!$(this).attr('id')){
      $(this).attr('id', 'j-'+jui2.random(8, 'aA#'))
    }

    if(!proto.extension){
      proto.extension = []
    }
  };

  jui2.ui.base = {
    widget: document.registerElement('j-base', {
      prototype: proto
    }),
    proto: proto,
    extension: []
  }

}(jQuery))
