
/**
 * @classdesc Numberfield custom web component
 * @class numberField
 * @property {string} icon Button icon, using font awesome. Ex. fa-calendar etc. For icon list see <a href="">http://fortawesome.github.io/Font-Awesome/icons/</a>
 * @example <caption>Numberfield basic example</caption>
 * <j-numberfield>My number</j-numberfield>
 * @augments textField
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		jui2.ui.textField.proto.createdCallback.call(this, '')

		jui2.keycodes.bind(this, "tab,enter,backspace,escape,.,[0,9],delete,[96,111]")
	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.numberField = {
		widget: document.registerElement('j-numberfield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
