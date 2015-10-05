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
		var tbody = $(this).children('div').children('table').children('tbody'), self = this;
		tbody.children('tr').remove();

		/*var tmpData = [], self = this
		if(this.custom){
			if(this.custom.length > 0){
				for(z in this.data){
					tmpData[z] = []
					for (i in this.data[z]){
						var cst = this.custom.filter( "[target='"+i+"']" );

						if(cst.length == 0){
							var attr = this.custom.eq(i).attr('target')
							if(typeof attr === typeof undefined || attr === false)
								cst = this.custom.eq(i)
						}

						if(cst.length > 0 && cst.html().trim() != ''){
							if(!cst[0].fn)
								cst[0].fn = eval('fn = '+cst.html().replace(/&lt;/g, '<')
									.replace(/&gt;/g, '>')
									.replace(/&amp;/g, '&'));
							tmpData[z][i] = cst[0].fn(this.data[z]);
						}
						else{
							tmpData[z][i] = this.data[z][i];
						}
					}
				}
			}
			else{
				tmpData = this.data;
			}
		}
		else{
			tmpData = this.data;
		}*/
		this.viewData = this.data

		$(this).triggerHandler('beforedraw')

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
							$(this).find('> div > table > tbody > tr > td:nth-child('+(parseInt(this.drop[i].getAttribute('target'))+1)+')').html(this.drop.eq(i).outerHTML())
					}
				}
			}
		var thCount = $(this).find('> div > table > thead > tr > th').length;

		if(thCount > 0)
			$(this).find('> div > table > tbody > tr > td:nth-child(n+'+(thCount+1)+')').remove();

		$(this).find('> div > table th:empty').each(function(i, val){
			tbody.find('> tr > td:nth-child('+(parseInt($(val).index())+1)+')').hide()
			$(val).hide()
		})

		$(this).triggerHandler('self.afterdraw')
		$(this).triggerHandler('afterdraw.height')
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
		if(this.afterdrawCheck==false && this.firstDraw == true){
			this.firstDraw = false
			this.afterdrawIntervalCount = 0, this.afterdrawInterval = setInterval(function(){
				var events = jQuery._data( self, "events")
				if(events != undefined)
					if(events.afterdraw.length > 1){
						self.afterdrawCheck = true;
						$(self).triggerHandler('afterdraw')

						if(self.getAttribute('onafterdraw')){
							if(typeof window[self.getAttribute('onafterdraw')] == 'function')
								window[self.getAttribute('onafterdraw')]()
						}
						clearInterval(self.afterdrawInterval);
					}
				if(!$.contains(document.documentElement, $(self).get(0))){
					clearInterval(self.afterdrawInterval);
				}
			}, 250)
		}
		else{
			clearInterval(this.afterdrawInterval)
			$(self).triggerHandler('afterdraw')
		}
		/*if(this.afterdrawCheck == false){
			var events = jQuery._data( self, "events")
			if(events!=undefined){
				if(events.afterdraw!=undefined)
					if(events.afterdraw.length > 1){
						this.afterdrawCheck = true;
					}
			}
			if(this.afterdrawCheck == false){
				var afterdrawIntervalCount = 0, afterdrawInterval = setInterval(function(){
					if(afterdrawIntervalCount==3)
						clearInterval(afterdrawInterval)
					var events = jQuery._data( self, "events")
					if(events != undefined)
						if(events.afterdraw.length > 1 && !self.afterdrawCheck){
							self.afterdrawCheck = true;
							$(self).triggerHandler('afterdraw')

							if(self.getAttribute('onafterdraw')){
								if(typeof window[self.getAttribute('onafterdraw')] == 'function')
									window[self.getAttribute('onafterdraw')]()
							}
						}
					afterdrawIntervalCount++
				}, 250)
			}
		}
		if(this.afterdrawCheck){
			$(this).triggerHandler('afterdraw')

			if(this.getAttribute('onafterdraw')){
				if(typeof window[this.getAttribute('onafterdraw')] == 'function')
					window[this.getAttribute('onafterdraw')]()
			}
		}*/

		return this;
	}

	proto.createdCallback = function() {

		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.dataview);

		this.afterdrawCheck = false;
		this.firstDraw = true;
		var data;

		if(this.innerHTML.trim() == '')
			data = data || [];
		else
			data = data || JSON.parse(this.innerHTML.replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, ''));
		if(!this.data)
			this.data = data;

		//this.generateData();

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
