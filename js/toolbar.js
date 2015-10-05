(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {

		var self = this;
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.toolbar);
		
	};
	//#TODO:0 Fixing toolbar to support table as extension
	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
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
