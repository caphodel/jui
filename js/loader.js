/**
 * @classdesc Extension for loading data from server/ajax
 * @class loader @extension table
 * @example <caption>Basic usage</caption>
 *
<j-table width="300px">
	<j-loader src="data.json"></j-loader>
	[
		[ "Fruit", "data 1", "data 2", "data 3"]
	]
</j-table>
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.generateData = function(target){
		var $parent = $(this).parent()
		$parent.attr('disabled', 'disabled');
		var param = this.param, self = this;
		param.sEcho++
		$.getJSON(this.getAttribute('src'), param).done(function(data){
			if(param.sEcho==data.sEcho){
				param.totalPage = Math.ceil(param.iTotalRecords/param.iDisplayLength)
				jui2.clearNullFromJson(data.aaData);
				target.data = data.aaData;
				self.targetGenerateData.call(target);
				$(target).find('> div > table > thead > tr > th').filter(function(i, val){
					return val.innerHTML === '';
				}).hide().each(function(i,val){
					$(target).find('> div > table > tbody > tr > td:nth-child('+(parseInt($(val).index())+1)+')').hide()
				});
				param.iTotalRecords = data.iTotalRecords
				self.afterDrawCall();
			}
		}).always(function(){
			$parent.removeAttr('disabled');
		})
	}

	proto.setParam = function(name, value){
		this.param[name] = value;
	}

	proto.createdCallback = function(label, type) {

		var self = this;

		this.afterDrawMethods = {};

		this.param = {
			sEcho: -1,
			iDisplayLength: self.getAttribute('size') || 10,
			iDisplayStart: 0,
			iSortCol_0: 0,
			sSearch: '',
			sSortDir_0: ''
		}

		if(this.getAttribute('type') == 'j-table'){
			var target = $(this).parent();

			this.target = target[0]

			this.targetGenerateData = this.target.generateData

			this.target.generateData = function(){
				self.generateData.call(self, this);
			}

			this.target.generateData();
		}

	};

	proto.afterDrawCall = function(){
		var self = this;
		$.each(this.afterDrawMethods, function(i, val){
			val.call(self)
		})
	}

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = [];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.loader = {
		widget: document.registerElement('j-loader',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
