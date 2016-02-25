
/**
 * @classdesc Table custom web component
 * @class table
 * @property {string} title Table title.
 * @property {boolean} disabled True to disabled. Dedault to true.
 * @property {string} onafterdraw Function name that will be executed after data generated (only work on data loaded from server/ajax or if table data is generated again with generateData function)
 * @augments dataView
 * @example <caption>Table usage</caption>
 *
<j-table width="300px">
	[
		[ "ID", "Fruit", "data 1", "data 2", "data 3"],
		[ 1, "apple", 4, 10, 2 ],
		[ 2, "banana", 0, 4, 0 ],
		[ 3, "grape", 2, 3, 5 ],
		[ 4, "pear", 4, 2, 8 ],
		[ 5, "strawberry", 0, 14, 0 ]
	]
</j-table>
 * @example <caption>Table with toolbar</caption>
 *
<j-table width="300px">
	<j-toolbar position="top">
		<j-button>My Button</j-button>
	</j-toolbar>
	<j-toolbar position="bottom">
		<j-spacer></j-spacer><j-button>My Button</j-button>
	</j-toolbar>
	[
		[ "ID", "Fruit", "data 1", "data 2", "data 3"],
		[ 1, "apple", 4, 10, 2 ],
		[ 2, "banana", 0, 4, 0 ],
		[ 3, "grape", 2, 3, 5 ],
		[ 4, "pear", 4, 2, 8 ],
		[ 5, "strawberry", 0, 14, 0 ]
	]
</j-table>
 * @example <caption>Table with onafterdraw example</caption>
 *
<script>
	function cls(e){
		console.log('Data has been drawn!');
	}
</script>
<j-table width="300px" title="Table" onafterdraw="cls">
	[
		["Fruit", "data 1", "data 2", "data 3"]
	]
	<j-loader src="data.json"></j-loader>
</j-table>
 */

/**
 * Fire after data has been drawn (only work on data loaded from server/ajax or if table data is generated again with generateData function)
 * @event afterdraw
 * @param  {object} event Event object
 * @memberof table
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

(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.generateData = jui2.ui.dataview.proto.generateData

	proto.createdCallback = function() {
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.table);
		var $self = $(this),
		//custom = $(this).children('j-custom').detach(),
		drop = this.drop = $self.children('j-drop').detach().attr('type', 'j-table'),
		loader = this.loader = $self.children('j-loader').detach().attr('type', 'j-table'),
		pagination = this.pagination = $self.children('j-pagination').detach(),
		toolbarBot = this.toolbar = $self.children('j-toolbar[position="bottom"]').detach(),
		toolbar = this.toolbar = $self.children('j-toolbar').detach(),
		data, cst, z, i, thCount = 0, th, $tbody, $thead;

		var text = $('<div>'+this.innerHTML+'</div>');
		text.children().remove()

		if(text[0].innerHTML.trim().replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, '') == "")
			data = [];
		else
			data = JSON.parse(text[0].innerHTML.replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, ''));

		text.remove();

		this.aaData = data;

		var headCols = data.shift()

		this.data = $.extend(true, [], data);

		$self.on('afterdraw.height', function(){
			var $self = $(this)
			if($self){
				if($self.attr('style')){
					if($self.attr('style').match(/height/ig)){
						if($self.attr('style').match(/height/ig).length == 0 && typeof $self.attr('height') == 'undefined'){
							$self.css({
								'flex': 0,
								'-webkit-box-flex': 0,
								'-webkit-flex': 0,
								'display': 'block'
							})
						}
					}
					else{
						if(typeof $self.attr('height') == 'undefined'){
							$self.css({
								'flex': 0,
								'-webkit-box-flex': 0,
								'-webkit-flex': 0,
								'display': 'block'
							})
						}
					}
				}
				else{
					if(typeof $self.attr('height') == 'undefined'){
						$self.css({
							'flex': '0',
							'-webkit-box-flex': '0',
							'-webkit-flex': '0',
							'display': 'block'
						})
					}
				}
			}
		})

		$self.on('self.afterdraw', function(){
			$thead = $self.find('> .j-table-body > table:first-child > thead');
			$tbody = $self.find('> .j-table-body > table:first-child > tbody');

			var idx = $thead.find(' > tr > th').filter(function(){
				return $(this).text().trim() === ''
			}).index()

			$tbody.find(' > tr > td:nth-child('+(idx+1)+')').hide()

			$tbody.find( "> tr").click(function() {
				$(this).addClass('j-active').siblings().removeClass('j-active')
				var sel = $(this).find('td:visible').last().find('input[type=radio]')
				if(sel.length > 0){
					sel.prop('checked', true)
				}
			})

			$thead.find(' > tr > th .j-table-sort').off('click').click(function(){
				if($self[0].loader.length>0){
					var param = $self[0].loader[0].param
					if(param.iSortCol == $(this).parent().parent().index() && param.sSortDir == 'asc'){
						param.sSortDir = 'desc'
					}
					else{
						param.sSortDir = 'asc'
					}
					param.iSortCol = $(this).parent().parent().index();
					$self[0].generateData();
				}
			})
		})

		jui2.ui.dataview.proto.createdCallback.call(this)

		$(this.children[0]).children().prepend( jui2.tmpl['tableHeader']({columns: headCols}) );

		$thead = $self.find('> .j-table-body > table:first-child > thead');
		$tbody = $self.find('> .j-table-body > table:first-child > tbody');

		$(this.children[0]).children().find('j-resize').on('afterresize', function(){
			var $self = $(this), w = $self.parent().outerWidth()
			$self.parent().parent().width(w)
			$self.css('left', '')
			$self.find('>j-table-fixedheader th div').filter(function(){
				return $(this).text().trim()==$self.parent().text().trim()
			}).css('width', '').parent().width(w)
			$thead.find(' > tr > th > div').each(function(i, val){
				$(val).css('width', '')
			})
		}).on('beforeresize', function(){
			var divs = $thead.find(' > tr > th > div'),
			ws = divs.map(function(i, val){
			  return $(val).width()
			}).get()
			divs.each(function(i, val){
				var $el = $(val)
				$el.width(ws[i]);
			})
		})

		var c = 0;

		$thead.find(' > tr > th').filter(function(i, val){
			return $(val).text() === '' || $(val).text() === ' ';
		}).hide().each(function(i,val){
			$tbody.find(' > tr > td:nth-child('+(parseInt($(val).index())+1)+')').hide()
			c++;
		});

		/*$(this).find('>.j-table-body > table > thead > tr > th').each(function(i, val){
			var $el = $(val)
			$el.children().outerWidth($el.width());
		})*/
		/*$(this).find('>.j-table-body > table > thead > tr > th j-resize').click(function(){
			$(this).find('>.j-table-body > table > thead > tr > th j-resize').each(function(i, val){
				var div = $(val).parent()
				div.outerWidth(div.parent().width())
			})
		});*/

		$self.append(loader)

		if(pagination)
			$self.append(pagination)

		if(toolbar){
			toolbar.insertBefore($self.children('.j-table-body'))
		}

		if(toolbarBot){
			toolbarBot.insertAfter($self.children('.j-table-body'))
		}

		for(i in jui2.method){
			this[i] = jui2.method[i];
		}

		var enabledAttrChange = ['title'];
		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
			if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
				jui2.attrChange[attrName](this, '', newVal);
		}

		/* active tr highlight */

		this.enabledAttrChange = $.unique(this.enabledAttrChange.concat(['disabled', 'width', 'height', 'title']));

		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue, attr = this.tagName.toLowerCase()+'_'+attrName;
      if(jui2.attrChange[attr])
  			jui2.attrChange[attr](this, false, newVal);
      else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
        jui2.attrChange[attrName](this, false, newVal);
		}

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var attr = this.tagName.toLowerCase()+'_'+attrName;
		if(jui2.attrChange[attr])
			jui2.attrChange[attr](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.table = {
		widget: document.registerElement('j-table',  {
			prototype: proto
		}),
		proto: proto,
    extension: []
	}

}(jQuery))
;
