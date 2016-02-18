
/**
 * @classdesc Inplace editable extension for table widget
 * @class tableInPlaceForm @extension table
 * @property {string} target jQuery selector that point to a j-table
 * @property {string} clicktarget jQuery selector that point to a j-table column that will show tableInPlaceForm if double clicked. Eg. 'td', 'td:nth-child(1)' etc.
 * @property {number} recordno New attribute for form field inside tableInPlaceForm. Record number from data loaded in j-table that will be inserted as value in form field.
 * @example <caption>basic usage</caption>
 *
<j-table id="table">
	<j-loader src="data.json"></j-loader>
	[
		[ "Fruit", "data 1", "data 2", "data 3"]
	]
	<j-pagination>
	</j-pagination>
</j-table>
<j-table-inplace-form id="tableForm" target="#table" clicktarget="td">
	<j-textfield recordno="0" id="fruit">Fruit</j-textfield>
	<j-textfield recordno="1" id="data1">Data 1</j-textfield>
	<j-textfield recordno="2" id="data2">Data 2</j-textfield>
	<j-textfield recordno="3" id="data3">Data 3</j-textfield>
</j-table-inplace-form>
<script>
	$('#tableForm').on('submit', function(e, form){
		console.log('Submiting Fruit : '+form.find('#fruit').val()+', Data 1 : '+form.find('#data1').val()+', Data 2 : '+form.find('#data2').val()+', Data 3 : '+form.find('#data3').val())
	})
</script>
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {
		var $self = $(this), $target = $($self.attr('target')), form = $self.html()

		this.form = form

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		var data = {
			cancel: $self.attr('cancel') || 'Cancel',
			submit: $self.attr('submit') || 'Submit'
		}

		this.form += jui2.tmpl['tableInPlaceForm'](data);

		$(this).hide();

		$self.appendTo($target)

		$target.nodoubletapzoom()

		$target.on('self.afterdraw', function(e){
			$target.find('> .j-table-body > table > tbody > tr > '+$self.attr('clicktarget')).on('dblclick doubletap', function(event){
				var tr = $(this).parent()
				if(tr.find('.j-table-inplace-form').length == 0){
					tr.children().hide()
					tr.append('<td class="j-table-inplace-form" colspan="'+tr.children().length+'">'+$self[0].form+'</td>')
					tr.children('.j-table-inplace-form').find('*').not('j-toolbar').each(function(i, val){
						var el = $(val)
						if(el.attr('recordno')){
							el.val($target[0].data[tr.index()][el.attr('recordno')])
						}
					})
					tr.find('.j-table-form-cancel').on('click', function(){
						var el = $(this).parent().parent()
						el.parent().children(":not([hide=true])").show()
						/**
						 * Fires when cancel button clicked
						 * @event cancel
						 * @param {object} event Event object
						 * @param  {Object} el jQuery object
						 * @memberof tableInPlaceForm @extension table
						 */
						$self.triggerHandler('cancel', [el])
						el.remove()
					})
					tr.find('.j-table-form-submit').on('click', function(){
						var el = $(this).parent().parent()
						el.parent().children(":not([hide=true])").show()
						/**
						 * Fires when submit button clicked
						 * @event submit
						 * @param {object} event Event object
						 * @param  {Object} el jQuery object
						 * @memberof tableInPlaceForm @extension table
						 */
						$self.triggerHandler('submit', [el])
						//el.remove()
					})
					tr.children('.j-table-inplace-form').width($target.find('> .j-table-body > table').width());
					$self.triggerHandler('afterdraw', [$target[0].data[tr.index()]])
				}
			})
		})

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
	}

	jui2.ui.tableInPlaceForm = {
		widget: document.registerElement('j-table-inplace-form',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
