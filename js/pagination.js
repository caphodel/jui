
/**
 * @classdesc Pagination extension for table widget
 * @class pagination @extension table
 * @example <caption>basic usage</caption>
 *
 <j-table width="300px">
 	<j-loader src="data.json"></j-loader>
 	[
 		[ "Fruit", "data 1", "data 2", "data 3"]
 	]
 	<j-pagination>
 	</j-pagination>
 </j-table>
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function(label, type) {

		var self = this;

		jui2.ui.toolbar.proto.createdCallback.call(this)
		this.innerHTML = jui2.tmpl['pagination']();

		var target = null;

		target = (this.getAttribute('target') != null) ? $(this.getAttribute('target'))[0] : $(this).parent().children('j-loader')[0]

		/*if(this.getAttribute('target') != null){
			target = $(this.getAttribute('target'))[0]
		}
		else{
			target = $(this).parent().children('j-loader')[0]
		}*/

		if(target){

			var $self = $(self);

			var margin = ($self.outerHeight(true)+6).toString()+'px', param = target.param

			$self.children('.fa-angle-left').click(function(){
				param.iDisplayStart = parseInt(param.iDisplayStart)
				param.iDisplayLength = parseInt(param.iDisplayLength)
				$self.parent().attr('disabled', 'disabled');
				param.iDisplayStart -= param.iDisplayLength
				if(param.iDisplayStart<0)
					param.iDisplayStart = 0
				target.target.generateData();
			})

			$self.parent().resize(function(){
				$(this).children('j-pagination').outerWidth($(this).width())
			});

			$self.children('.fa-refresh').click(function(){
				target.target.generateData();
			})
			$self.children('.fa-angle-right').click(function(){
				$self.parent().attr('disabled', 'disabled');
				param.iDisplayStart = parseInt(param.iDisplayStart)
				param.iDisplayLength = parseInt(param.iDisplayLength)
				param.iTotalRecords = parseInt(param.iTotalRecords)
				param.iDisplayStart += param.iDisplayLength
				if(param.iDisplayStart>=param.iTotalRecords)
					param.iDisplayStart -= param.iDisplayLength
				target.target.generateData();
			})

			$self.children('.j-gotopage').on('keydown', function(e){
				if(e.keyCode == 13){
					param.iDisplayLength = parseInt(param.iDisplayLength)
					param.iDisplayStart = $(this).val()*param.iDisplayLength-param.iDisplayLength
					target.target.generateData();
				}
			})

			$self.children('.j-itemPerPage').on('select', function(e, val){
				param.iDisplayLength = parseInt(val);
				target.target.generateData();
			})

			target.afterDrawMethods['pagination'] = function(){
				$self.children('.j-pageof').text(' of '+Math.ceil(param.iTotalRecords/param.iDisplayLength));
				$self.children('.j-gotopage').val(Math.ceil(param.iDisplayStart/param.iDisplayLength)+1);
				$self.children('.j-total').text(param.iTotalRecords+' items ');

				$self.find('.j-itemPerPage j-toolbar').remove()
			}

			target.afterDrawMethods['pagination']();

		}

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = [];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.pagination = {
		widget: document.registerElement('j-pagination',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
