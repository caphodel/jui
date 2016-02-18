/**
 * @classdesc Button custom web component
 * @class button
 * @property {string} color Available color is blue and red
 * @property {string} icon Button icon, using font awesome. Ex. fa-calendar etc. For icon list see <a href="http://fontawesome.github.io/Font-Awesome/icons/">http://fontawesome.github.io/Font-Awesome/icons/</a>
 * @example <caption>Basic button</caption>
 * <j-button>My Button</j-button>
 * @example <caption>Button with different color</caption>
 * <j-button color="blue">My Button</j-button>
 * @example <caption>Button with icon</caption>
 * <j-button icon="fa-calendar">My Button</j-button>
 */
(function($){
	/** @constructor */
	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		this.iconPosition = 'afterBegin';

		$(this).attr('tabindex', 0);

		this.enabledAttrChange = ['disabled', 'icon']

		if(this.innerHTML.trim() == '')
			this.innerHTML = ''

		if(this.getAttribute('icon'))
			this.innerHTML = '<i class="fa '+this.getAttribute('icon')+'"></i> '+this.innerHTML

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}
	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

 /**
 	* Fires when button clicked
 	* @event click
 	* @memberof button
 	* @example
 	* <j-button id="myButton">My Button</j-button>
 	* <script>
 	* $('#myButton').on('click', function(value){
 	* 	console.log('Button clicked') //will print 'Button clicked' in javascript console
 	* })
 	* </script>
 	*/
	jui2.ui.button = {
		widget: document.registerElement('j-button',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
