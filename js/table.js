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
		//custom = this.custom = $(this).children('j-custom').detach(),
		drop = this.drop = $(this).children('j-drop').detach().attr('type', 'j-table'),
		loader = this.loader = $(this).children('j-loader').detach().attr('type', 'j-table'),
		pagination = this.pagination = $(this).children('j-pagination').detach(),
		toolbarBot = this.toolbar = $(this).children('j-toolbar[position="bottom"]').detach(),
		toolbar = this.toolbar = $(this).children('j-toolbar').detach(),
		data, cst, z, i, thCount = 0, th

		// #TODO:10 Create j-drop as extension
		// #DOING:20 remove all code that processs another tag, and make it as a separate extension
		/*end of doing*/

		if(this.innerHTML.trim() == '')
			data = [];
		else
			data = JSON.parse(this.innerHTML.replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, ''));

		this.aaData = data;

		var headCols = data.shift()

		this.data = $.extend(true, [], data);

		/*if(this.custom.length > 0){
			for(z in data){
				for (i in data[z]){
					cst = custom.filter( "[target='"+i+"']" );

					if(cst.length == 0){
						var attr = custom.eq(i).attr('target')
						if(typeof attr === typeof undefined || attr === false)
							cst = custom.eq(i)
					}

					if(cst.length > 0 && cst.text().trim() != ''){
						if(!cst[0].fn)
							cst[0].fn = eval('fn = '+cst.html().replace(/&lt;/g, '<')
								.replace(/&gt;/g, '>')
								.replace(/&amp;/g, '&'));
						this.data[z][i] = cst[0].fn(data[z]);
					}
				}
			}
		}*/

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
						/*else{
							$self.find('> .j-table-body').css({
								'flex': '',
								'-webkit-box-flex': '',
								'-webkit-flex': '',
								'display': 'flex'
							})
						}*/
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
			//$(this).css('display', 'block')
			//setTimeout(function)
			var idx = $self.find('> .j-table-body > table > thead > tr > th').filter(function(){
				return this.innerHTML === ''
			}).index()

			$self.find('> .j-table-body > table > tbody > tr > td:nth-child('+(idx+1)+')').hide()
		})

		jui2.ui.dataview.proto.createdCallback.call(this)

		$(this.children[0]).children().prepend(jui2.tmpl['tableHeader']({columns: headCols}) );

		/*th = $(this.children[0].children[0]).children('thead').find('tr:last-child th')
		th.each(function(z, val){
			var cst = custom.filter( "[target='"+z+"']" ),
			w = $(val).width();

			if(cst.length == 0){
				var attr = custom.eq(z).attr('target')
				if(typeof attr === typeof undefined || attr === false){
					cst = custom.eq(z)
				}
			}

			if(cst.length > 0){
				w = cst.attr('width')
			}
			if(val.innerHTML != '')
				colgroup += '<colgroup><col width="'+w+'"></col></colgroup>';
		})
		$self.children('div').children('table').prepend(colgroup).css('table-layout', 'fixed');*/

		var c = 0;
		$self.find('> div > table > thead > tr > th').filter(function(i, val){
			return val.innerHTML === '' || val.innerHTML === ' ';
		}).hide().each(function(i,val){
			$self.find('> div > table > tbody > tr > td:nth-child('+(parseInt($(val).index())+1)+')').hide()
			c++;
		});

		$self.append(loader)

		if(pagination)
			$self.append(pagination)

		if(toolbar){
			toolbar.insertBefore($self.children('div'))
		}

		if(toolbarBot){
			toolbarBot.insertAfter($self.children('div'))
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
		$self.find('> div > table > tbody ').delegate( "> tr", "click", function() {
			$(this).addClass('j-active').siblings().removeClass('j-active')
		})

		/*var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }*/
		this.enabledAttrChange = $.unique(this.enabledAttrChange.concat(['disabled', 'width', 'height', 'title']));

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
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
