
/**
 * @classdesc Dataview custom web component
 * @class dataView
 * @example <caption>Dataview basic usage</caption>
 * <j-dataview>
 *      [
 *         [ "apple", 4, 10, 2 ],
 *         [ "banana", 0, 4, 0 ],
 *         [ "grape", 2, 3, 5 ],
 *         [ "pear", 4, 2, 8 ],
 *         [ "strawberry", 0, 14, 0 ]
 *     ]
 * </j-dataview>
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)
/**
 * Generate dataView data
 * @method generateData
 * @memberof dataView
 * @return {object} this
 */
	proto.generateData = function(){
		var $self = $(this), tbody = $self.children('.j-table-body').children('table').eq(0).children('tbody'), self = this, thead = $self.children('.j-table-body').children('table').eq(0).children('thead');
		tbody.children('tr').remove();

		this.viewData = this.data

		$self.triggerHandler('beforedraw')

		tbody.append(jui2.tmpl['dataViewData']({data: this.viewData}));

		if(this.afterDrawCombo){
			if(typeof this.afterDrawCombo == 'function')
				this.afterDrawCombo()
		}

		// #TODO:0 Create drop as extension
		if(this.drop)
			if(this.drop.length > 0){
				for(i in this.drop){
					if(this.drop[i].getAttribute){
						if(this.drop[i].getAttribute('target') != null)
							tbody.find(' > tr > td:nth-child('+(parseInt(this.drop[i].getAttribute('target'))+1)+')').html(this.drop.eq(i).outerHTML())
					}
				}
			}

		//for combobox
		if($self.parent().parent().prop('tagName')=='J-COMBOFIELD')
			$self.find('j-resize').remove()

		var thCount = thead.find(' > tr:first-child > th').last().index() + 1 + (thead.find(' > tr:first-child > th[colspan]').map(function(){
		  return parseInt($(this).attr('colspan'))-1
		}).get()[0]||0);

		if(thCount > 0)
			tbody.find(' > tr > td:nth-child(n+'+(thCount+1)+')').remove();

		//remarks from :visible
		thCount = thead.find(' > tr:first-child > th').last().index() + 1 + (thead.find(' > tr:first-child > th[colspan]').map(function(){
		  return parseInt($(this).attr('colspan'))-1
		}).get()[0]||0);

		if(thCount > 0)
			tbody.find(' > tr > td:nth-child(n+'+(thCount+1)+')').remove();

		thead.find(' > tr:first-child > th').filter(function(){
			return $(this).text().trim() == ''
		}).each(function(i, val){
			val = $(val)
			tbody.find(' > tr > td:nth-child('+(parseInt(val.index())+1)+')').hide().attr('hide','true')
			val.hide()
		})

		$self.triggerHandler('self.afterdraw')
		$self.triggerHandler('afterdraw.height')
		/**
		 * Fire after data has been drawn
		 * @event afterdraw
		 * @param  {object} event Event object
		 * @memberof dataView
		 * @example
		 <j-table width="300px" title="Table" id="table1">
		 	[
		 		["Fruit", "data 1", "data 2", "data 3"]
		 	]
		 	<j-loader src="data.json"></j-loader>
		 </j-table>
		<script>
		$('#table1').on('afterdraw', function(){
			console.log('Data in table has been draw!')
		})
		</script>
		 */
		/*$(this).find('>.j-table-body > table > thead > tr > th').each(function(i, val){
			var $el = $(val)
			$el.children().outerWidth($el.width());
		})*/

		if(this.afterdrawCheck==false && this.firstDraw == true){
			this.firstDraw = false
			this.afterdrawIntervalCount = 0, this.afterdrawInterval = setInterval(function(){
				var events = jQuery._data( self, "events"), afterdrawLength = 1
				if($self.prop('tagName')=='J-DATAVIEW')
					afterdrawLength = 0;
				if(events != undefined)
					if(events.afterdraw)
						if(events.afterdraw.length > afterdrawLength){
							self.afterdrawCheck = true;
							$self.triggerHandler('afterdraw')

							if(self.getAttribute('onafterdraw')){
								if(typeof window[self.getAttribute('onafterdraw')] == 'function')
									window[self.getAttribute('onafterdraw')]()
							}
							clearInterval(self.afterdrawInterval);
						}
				if(!$.contains(document.documentElement, $self.get(0))){
					clearInterval(self.afterdrawInterval);
				}
			}, 250)
		}
		else{
			clearInterval(this.afterdrawInterval)
			$self.triggerHandler('afterdraw')
		}

		return this;
	}

	proto.createdCallback = function() {

		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.dataview);

		this.afterdrawCheck = false;
		this.firstDraw = true;
		var $self = $(this), data/*, custom = $(this).children('j-custom').detach()*/;

		var text = $('<div>'+this.innerHTML+'</div>');
		text.children().remove()

		if(text[0].innerHTML.trim().replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, '') == "")
			data = data || [];
		else
			data = data || JSON.parse(text[0].innerHTML.replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, ''));

		text.remove();

		if(!this.data)
			this.data = data;

		this.innerHTML = jui2.tmpl['dataView']();

		this.generateData();

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		var enabledAttrChange = ['disabled', 'width', 'height'];
		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
			if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
				jui2.attrChange[attrName](this, '', newVal);
		}

		Object.defineProperty(this.__proto__, 'record', {
			configurable: true,
			get: function(){
				return this.data;
			},
			set: function(data){
				this.data = data;
				this.generateData();
			}
		});
	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'width', 'height'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.dataview = {
		widget: document.registerElement('j-dataview',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
