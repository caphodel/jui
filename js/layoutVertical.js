(function($){

/*********************** layout Vertical ******************************/
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
		
		
	};
	
	/*proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}*/
	
	jui2.ui.layoutVertical = {
		widget: document.registerElement('j-layout-vertical',  { 
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))