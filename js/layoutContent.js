(function($){

/*********************** layout Content ******************************/
	var proto = Object.create(HTMLElement.prototype)
	
	proto.createdCallback = function() {
		
		/*this.iconPosition = 'afterBegin';
		
		if(this.innerHTML.trim() == '')
			this.innerHTML = 'Button'
		
		if(this.getAttribute('icon'))
			this.innerHTML = '<i class="fa '+this.getAttribute('icon')+'"></i> '+this.innerHTML
		
		for(i in jui2.method){
			this[i] = jui2.method[i];
		}*/
		
		$('<j-layout-no-resizer></j-layout-no-resizer>').insertAfter(this)
		
		var enabledAttrChange = ['resize'];
		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
			if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
				jui2.attrChange[attrName](this, '', newVal);
		}
		
	};
	
	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['resize'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}
	
	jui2.ui.layoutContent = {
		widget: document.registerElement('j-layout-content',  { 
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))