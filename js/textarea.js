
(function($){


/**
 * @classdesc textarea custom web component
 * @class textArea
 * @example <caption>TexaArea basic usage</caption>
 * <j-textarea><Textarea/j-textarea>
 */

/*********************** textarea ******************************/

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {

		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.textArea);

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

		this.enabledAttrChange = $.unique(this.enabledAttrChange.concat(['disabled', 'rows', 'cols']));

		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue, attr = this.tagName.toLowerCase()+'_'+attrName;
      if(jui2.attrChange[attr])
  			jui2.attrChange[attr](this, false, newVal);
      else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
        jui2.attrChange[attrName](this, false, newVal);
		}

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var attr = this.tagName.toLowerCase()+'_'+attrName;
		if(jui2.attrChange[attr])
			jui2.attrChange[attr](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.textArea = {
		widget: document.registerElement('j-textarea',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
