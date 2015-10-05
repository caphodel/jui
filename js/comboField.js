/**
 * @classdesc Combofield custom web component
 * @class comboField
 * @property {number} pk Column number in data retrieved that will be use as primary key and as value when combo items selected
 * @example <caption>Combofield widget basic usage</caption>
 *
<j-combofield id="combo">Combo
	<j-table>
		[
			[ "ID", "Fruit", "data 1", "data 2", "data 3"],
      [ 1, "apple", 4, 10, 2 ],
      [ 2, "banana", 0, 4, 0 ],
      [ 3, "grape", 2, 3, 5 ],
      [ 4, "pear", 4, 2, 8 ],
      [ 5, "strawberry", 0, 14, 0 ]
    ]
	</j-table>
</j-combofield>
 * @example <caption>Combofield data from server</caption>
 *
<j-combofield>Combo
	<j-table>

		<j-loader src="http://gggmpscdweb05/gg_beta/index.php/emres_sppb/get_data"></j-loader>
		[["ID", "SPPB No.", "SPPB Date", "Requestor", "PIC"]]
		<j-pagination>
		</j-pagination>
	</j-table>
</j-combofield>
 * @augments textField
 */

(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		this.setAttribute("icon", "fa-angle-down");
		var table = $(this).children('j-table').detach(), $table, $self = $(this);

		this.noInherit = ['value'];
		jui2.ui.textField.proto.createdCallback.call(this, 'Combofield')

		$(this).append(table);
		$(this).children('j-table').wrap('<div></div>')

		var $div = $(this).children('div')
		$table = $(this).find('j-table')

		if(!$self.attr('pk'))
			$self.attr('pk', '0');

		$self.bind( "clickout", function(event){
			if(event.target != $self[0] && $(event.target).parents('j-combofield')[0] != $self[0]){
				$div.hide();
			}
		});

		$self.delegate($self.children().not('j-table'), 'click', function(e){
			if($(e.target).hasClass('fa-remove')){
				$self.val('')
			}
			else if($(e.target).parents('div:not(j-table > div)')[0] != $div[0] && e.target != $div[0]){
				$div.toggle();
				if($div.css('display') == 'block'){

					$div.css('top', parseInt($self.css('height'))+$self.offset().top)
					.css('left', 125+$self.position().left+$self.parents().filter(function(){
						//return $(this).scrollLeft()>0
						return $(this).hasScrollBar()
					}).scrollLeft());

					var parent = $self.parents().filter(function(){
						return $(this).hasScrollBar()
					})

					if(parent.length > 0)
						if(parent.eq(0).prop('tagName')!='HTML')
							$div.css('top', parseInt($self.css('height'))+$self.position().top+parent.scrollTop())

					$div.css('top', parseInt($self.css('height'))+$self.position().top+parent.scrollTop())

					$table.show();
					$self.find('j-toolbar j-textfield').focus();
					table.find('table').removeAttr('style');
					var z = jui2.findHighestZIndex()
					$div.css('z-index', z == '-Infinity' ? 100 : z);
				}
			}
		})

		$table.delegate('td', 'click', function(e){
			var $table = $(this).parents('j-table').eq(0), val = $table[0].data[$(this).parent().index()][$self.attr('pk')]
			for(var i in $table[0].data){
				if($table[0].data[i][$self.attr('pk')]==val){
					$self.val($table[0].data[i][$self.attr('pk')])
				}
			}
			$div.hide();
			/**
			 * Fires when date selected
			 * @event select
			 * @param {object} event Event object
			 * @param  {String} value Selected value
			 * @memberof dateField
			 * @example
			 * <j-combofield id="myCombo1">Combo</j-combofield>
			 * <script>
			 * $('#myCombo1').on('select', function(e, value){
			 * 	console.log(value) // will print value you selected from datefield in javascript console
			 * })
			 * </script>
			 */
			$(this).triggerHandler('select', [$self.val()]);
			$table.find('tr').removeClass('j-active');
		})

		$table.prepend(jui2.tmpl['comboToolbar']())

		$self.find('j-toolbar j-textfield').on('keydown', function(e){
			if(e.keyCode == 13){
				var $loader = $self.find('j-table j-loader')
				if($loader.length > 0){
					$loader[0].param.sSearch = $self.find('j-toolbar j-textfield').val()
					$('j-combofield j-table')[0].generateData();
				}
			}
		})

		var defValue = $(this).attr('value') || ''
		$(this).removeAttr('value')

		jui2.keycodes.bind($(this).children('input'), "")

		/* getter/setter */
		Object.defineProperty(this.__proto__, 'value', {
			configurable: true,
			get: function(){
				return $(this).attr('data-value');
			},
			set: function(value){
				if(value==''){
					$(this).removeAttr('data-value');
					$(this).children('input')[0].value = '';
					this.setAttribute("icon", "fa-angle-down")
				}
				else{
					$(this).attr('data-value', value)
					var $table = $(this).find('j-table'), i;
					for(i in $table[0].data){
						if($table[0].data[i][$(this).attr('pk')]==value){
							var data = $table[0].data[i].slice(), c = 0, valText = []
							$table.find('thead th').filter(function(){
								return $(this).css('display') != 'none'
							}).each(function(i, val){
								valText.push(data[$(val).index()])
							})
							$(this).children('input')[0].value = valText.join(', ');
						}
					}
					if($(this).children('input')[0].value.trim()!='')
						this.setAttribute("icon", "fa-remove")
				}
			}
		});
		
		if(this.value){
			var tmpValue = this.value
			$(this).find('> div > j-table').on('afterdraw', function(){
				$self.val(tmpValue)
			})
			delete this.value;
		}
		delete this.value;

		$self.triggerHandler('afterdraw')

	};

	/**
	 * Get selected record data
	 * @method getSelectedRecord
	 * @memberof comboField
	 * @return {array} record Selected record
	 * @instance
	 */
	proto.getSelectedRecord = function(){
		var value = $(this).attr('data-value'), $table = $(this).find('j-table'), i;
		for(i in $table[0].data){
			if($table[0].data[i][$(this).attr('pk')]==value){
				return $table[0].data[i]
			}
		}
	}

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.comboField = {
		widget: document.registerElement('j-combofield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
