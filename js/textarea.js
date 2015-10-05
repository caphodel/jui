(function($){

/*********************** textfield ******************************/

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {

		this.iconPosition = 'beforeend';

		var label = label || '',
		type = type || 'text'

		if(this.innerHTML.trim() == '')
			this.innerHTML = label

		this.innerHTML = jui2.tmpl['textArea']({label: this.innerHTML});

		this.children[0].addEventListener("click", function(){
			$(this).next().focus();
		});

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		/* getter/setter */
		Object.defineProperty(this.__proto__, 'value', {
			configurable: true,
			get: function(){
				if($(this).children('textarea')[0])
					return $(this).children('textarea')[0].value;
				else
					return '';
			},
			set: function(value){
				if($(this).children('textarea')[0])
					$(this).children('textarea')[0].value = value;
			}
		});

		if(this.value){
			var tmpValue = this.value
			delete this.value;
			$(this).val(tmpValue);
		}
		else{
			delete this.value;
		}

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.textArea = {
		widget: document.registerElement('j-textarea',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
