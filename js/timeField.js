
 /**
  * @classdesc TimeField custom web component
  * @class timeField
  * @property {string} icon Button icon, using font awesome. Ex. fa-calendar etc. For icon list see <a href="">http://fortawesome.github.io/Font-Awesome/icons/</a>
  * @example <caption>Basic usage: <br/><j-timefield>Username</j-timefield></caption>
  * <j-timefield>Username</j-timefield>
  * @example <caption>Timefield with icon: <br/><j-timefield icon="fa-user">Username</j-timefield></caption>
  * <j-timefield icon="fa-user">Username</j-timefield>
  */

(function($){
	/** @constructor */
	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.comboField);
		var id = this.juiid

		this.iconPosition = 'beforeend';

		var label = label || '',
		type = type || 'text', $table, $div, $self = $(this);

		if(this.innerHTML.trim() == '')
			this.innerHTML = label

		var tmpValue = this.getAttribute('value') || '';

		this.innerHTML = jui2.tmpl['timeField']({label: this.innerHTML, type: type});

		$(this).children().eq(1).attr('value', tmpValue);
		$(this).append(jui2.tmpl['timeFieldBody']())

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

		jui2.keycodes.bind(this, "tab,enter,backspace,escape,[0,9],delete,[96,111]")

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		$div = $(this).children('div')
		$table = $(this).find('table')

		$table.bind( "clickout", function(event){
			if(event.target != $self[0] && $(event.target).parents('j-timeField')[0] != $self[0] && $(event.target).parents('[belongto=j-timeField]').length == 0){
				$table.detach().appendTo($div);
				$('#j-timeField-'+id).remove();
				$div.hide();
			}
		});

		$self.delegate($self.children().not('j-table'), 'click', function(e){
			var $eTarget = $(e.target);
			if($eTarget.hasClass('fa-remove')){
				$self.val('')
			}
			else if($eTarget.parents('div:not(j-table > div)')[0] != $div[0] && e.target != $div[0]){
				$div.toggle();
				if($div.css('display') == 'block'){
					if($('#j-timeField-'+id).length==0)
						$('body').append('<j-modal belongto="j-timeField" snapto="#'+$self.attr('id')+' > input" snappos="topleft to bottomleft" id="j-timeField-'+id+'"></j-modal>');
					$table.detach().appendTo('#j-timeField-'+id)
					$table.show();
					$div.show();

					$table.removeAttr('style');
				}
				else{
					$table.detach().appendTo($div);
					$('#j-timeField-'+id).remove();
					$div.hide();
				}
			}
		})

		$table.find('.j-timeField-setTime').click(function(){
			$self.find('input').eq(0).val($table.find('.j-active').eq(0).text());
			$self.find('input').eq(1).val($table.find('.j-active').eq(1).text());
			$table.detach().appendTo($div);
			$('#j-timeField-'+id).remove();
			$div.hide();

			/**
			 * Fires when time selected
			 * @event select
			 * @param {object} event Event object
			 * @param  {String} value Selected value
			 * @memberof timeField
			 * @example
			 * <j-timeField id="myTimeField1">Combo</j-timeField>
			 * <script>
			 * $('#myTimeField').on('select', function(e, value){
			 * 	console.log(value) // will print value you selected from timeField in javascript console
			 * })
			 * </script>
			 */

			$self.triggerHandler('select', [$self.val()]);
			$table.find('td').removeClass('j-active');
		})

		$table.delegate('td', 'click', function(e){

			var $table = $(this).parents('table').eq(0);
			if($('[belongto=j-timeField] > table tr:nth-child(2) td, [belongto=j-timeField] > table tr:nth-child(3) td').is($(this))){
				$('[belongto=j-timeField] > table tr:nth-child(2) td, [belongto=j-timeField] > table tr:nth-child(3) td').removeClass('j-active');
			}

			if($('[belongto=j-timeField] > table tr:nth-child(5) td').is($(this))){
				$('[belongto=j-timeField] > table tr:nth-child(5) td').removeClass('j-active');
			}

			if(!$('[belongto=j-timeField] > table tr:nth-child(6) td, [belongto=j-timeField] > table tr:nth-child(1) td, [belongto=j-timeField] > table tr:nth-child(4) td').is($(this)))
				$(this).addClass('j-active')

		})

		/**
		 * Set and get widget value
		 * @param {mixed} value can be empty
		 * @returns {mixed}
		 * @method val
		 * @memberof timeField
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
					return $(this).children('input')[0].value + ':' + $(this).children('input')[1].value;
				else
					return '';
			},
			set: function(value){
				if($(this).children('input')[0]){
					$(this).children('input')[0].value = value.split(':')[0];
					$(this).children('input')[1].value = value.split(':')[1];
				}
				return $(this).children('input')[0].value + ':' + $(this).children('input')[1].value;
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

	jui2.ui.timeField = {
		widget: document.registerElement('j-timefield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
