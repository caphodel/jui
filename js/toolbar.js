
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		var self = this;
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.toolbar);

		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
			if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
				jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, false, newVal);
			else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
				jui2.attrChange[attrName](this, false, newVal);
		}
	};
	//#TODO:0 Fixing toolbar to support table as extension
	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.toolbar = {
		widget: document.registerElement('j-toolbar',  {
			prototype: proto
		}),
		proto: proto,
    extension: []
	}

}(jQuery))
;
