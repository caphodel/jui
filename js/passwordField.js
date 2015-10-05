/**
 * @classdesc Passwordfield custom web component
 * @class passwordField
 * @property {string} icon Button icon, using font awesome. Ex. fa-key etc. For icon list see <a href="">http://fortawesome.github.io/Font-Awesome/icons/</a>
 * @example <caption>Passwordfield basic usage</caption>
 * <j-passwordfield>Password</j-passwordfield>
 * @example <caption>Passwordfield with icon</caption>
 * <j-passwordfield icon="fa-key">Password</j-passwordfield>
 * @augments textField
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		jui2.ui.textField.proto.createdCallback.call(this, 'Passwordfield', 'password')
	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.passwordField = {
		widget: document.registerElement('j-passwordfield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
