
 /**
  * @classdesc TextField custom web component
  * @class textField
  * @property {string} icon Button icon, using font awesome. Ex. fa-calendar etc. For icon list see <a href="">http://fortawesome.github.io/Font-Awesome/icons/</a>
  * @example <caption>Basic usage: <br/><j-textfield>Username</j-textfield></caption>
  * <j-textfield>Username</j-textfield>
  * @example <caption>Textfield with icon: <br/><j-textfield icon="fa-user">Username</j-textfield></caption>
  * <j-textfield icon="fa-user">Username</j-textfield>
  */

(function($){
	/** @constructor */
	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {

		this.iconPosition = 'beforeend';

		var label = label || '',
		type = type || 'text';

		if(this.innerHTML.trim() == '')
			this.innerHTML = label

		var tmpValue = this.getAttribute('value') || '';

		this.innerHTML = jui2.tmpl['textField']({label: this.innerHTML, type: type});

		$(this).children().eq(1).attr('value', tmpValue);

		this.removeAttribute('value');

		if(this.getAttribute('icon')){
			this.insertAdjacentHTML( 'beforeend', '<i class="j-ui-icon fa '+this.getAttribute('icon')+'"></i>' );
		}

		if (document.addEventListener) {                // For all major browsers, except IE 8 and earlier
			this.children[0].addEventListener("click", function(){
				$(this).next().focus();
			});
		} else if (document.attachEvent) {              // For IE 8 and earlier versions
			this.children[0].attachEvent("onclick", function(){
				$(this).next().focus();
			});
		}

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		/**
		 * Set and get widget value
		 * @param {mixed} value can be empty
		 * @returns {mixed}
		 * @method val
		 * @memberof textField
		 * @instance
		 * @example <caption>nopreview</caption>
		 * var value = $('#myWidget').val() // will return widget's value to variable value
		 * @example <caption>nopreview</caption>
		 * $('#myWidget').val('myValue') // will set widget's value to 'myValue'
		 */
		Object.defineProperty(this.__proto__, 'value', {
			configurable: true,
			get: function(){
				if($(this).children('input')[0])
					return $(this).children('input')[0].value;
				else
					return '';
			},
			set: function(value){
				if($(this).children('input')[0])
					$(this).children('input')[0].value = value;
				return $(this).children('input')[0].value
			}
		});

		var extend = true;
		if(this.noInherit)
			if(this.noInherit.indexOf('value')!=-1)
				extend = false;

		if(this.value && extend){
			var tmpValue = this.value
			delete this.value;
			$(this).val(tmpValue);
		}
		else{
			if(extend)
				delete this.value;
		}

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.textField = {
		widget: document.registerElement('j-textfield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
