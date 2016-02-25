
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
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.comboField);
		var id = this.juiid

		this.setAttribute("icon", "fa-angle-down");
		var table = $(this).children('j-table').detach(), $table, $self = $(this), $div;

		this.noInherit = ['value'];
		jui2.ui.textField.proto.createdCallback.call(this, '')

		$self.append(table).children('j-table').wrap('<div></div>')

		$div = $(this).children('div')
		$table = $(this).find('j-table')

		if(!$self.attr('pk'))
			$self.attr('pk', '0');

		$table.bind( "clickout", function(event){
			if(event.target != $self[0] && $(event.target).parents('j-combofield')[0] != $self[0] && $(event.target).parents('[belongto=j-comboField]').length == 0){
				$table.detach().appendTo($div);
				$('#j-comboField-'+id).remove();
				$div.hide();
			}
		});

		$self.delegate($self.children().not('j-table'), 'click', function(e){
			var $eTarget = $(e.target);
			if($table.find('> j-pagination > .j-itemPerPage').length > 0){
				$table.find('> j-pagination > .j-itemPerPage').remove();
				$table.find('> j-pagination > span:contains(items per page)').remove();
			}
			if($eTarget.hasClass('fa-remove')){
				$self.val('')
			}
			else if($eTarget.parents('div:not(j-table > div)')[0] != $div[0] && e.target != $div[0]){
				$div.toggle();
				if($div.css('display') == 'block'){
					if($('#j-comboField-'+id).length==0)
						$('body').append('<j-modal belongto="j-comboField" snapto="#'+$self.attr('id')+' > input" snappos="topleft to bottomleft" id="j-comboField-'+id+'"></j-modal>');
					$table[0].generateData();
					$table.detach().appendTo('#j-comboField-'+id)
					$table.show();
					$self.find('j-toolbar j-textfield').focus();
					table.find('table').removeAttr('style');
				}
				else{
					$table.detach().appendTo($div);
					$('#j-comboField-'+id).remove();
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
			$table.detach().appendTo($div);
			$('#j-comboField-'+id).remove();
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
			$self.triggerHandler('select', [$self.val()]);
			$table.find('tr').removeClass('j-active');
		})

		$table.prepend(jui2.tmpl['comboToolbar']())

		$self.find('j-toolbar j-textfield').on('keydown', function(e){
			if(e.keyCode == 13){
				var $loader = $table.find('j-loader')
				if($loader.length > 0){
					$loader[0].param.sSearch = $table.find('j-toolbar j-textfield').val()
					$table[0].generateData();
				}
				else{
					$('#j-comboField-'+id+' tbody tr').show()
					.not(':contains('+$table.find('j-toolbar j-textfield').val()+')').hide()
				}
			}
		})

		//delete value when captured backspace
		$self.on('keydown', function(e){
			if(e.keyCode == 8){
				$self.val('');
				$table.detach().appendTo($div);
				$('#j-comboField-'+id).remove();
				$div.hide();
			}
		})

		var tmpValue = $(this).attr('value') || (this.value || '')
		$(this).removeAttr('value')

		jui2.keycodes.bind($(this).children('input'), "tab")

		/* getter/setter */
		Object.defineProperty(this.__proto__, 'value', {
			configurable: true,
			get: function(){
				return $(this).attr('data-value');
			},
			set: function(value){
				var $this = $(this);
				if(value==''){
					$this.removeAttr('data-value');
					$this.children('input')[0].value = '';
					this.setAttribute("icon", "fa-angle-down")
				}
				else{
					$this.attr('data-value', value)
					var $table = $('#j-comboField-'+$(this)[0].juiid).find('j-table'), i;
					if(!$table[0]){
						$table = $this.find('> div > j-table')
					}

					for(i in $table[0].data){
						if($table[0].data[i][$(this).attr('pk')]==value){
							var data = $table[0].data[i].slice(), c = 0, valText = []
							$table.find('> .j-table-body > table > thead > tr > th').filter(function(){
								return $(this).css('display') != 'none'
							}).each(function(i, val){
								valText[valText.length] = data[$(val).index()]
							})
							$this.children('input')[0].value = valText.join(', ');
						}
					}
					if($this.children('input')[0].value.trim()!='')
						this.setAttribute("icon", "fa-remove")
				}
			}
		});

		if(tmpValue){
			$(this).find('> div > j-table').on('afterdraw', function(){
				$self.val(tmpValue)
			})
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
		var enabledAttrChange = ['disabled', 'icon'], attrChange = jui2.attrChange;
		if(attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.comboField = {
		widget: document.registerElement('j-combofield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
