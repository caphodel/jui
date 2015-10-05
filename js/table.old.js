(function($){

/*********************** dataview ******************************/
	
	var proto = Object.create(HTMLElement.prototype)
	
	proto.generateData = jui2.ui.dataview.proto.generateData
	
	proto.createdCallback = function() {
		var $self = $(this),
		custom = this.custom = $(this).children('j-custom').detach(),
		drop = this.drop = $(this).children('j-drop').detach().attr('type', 'j-table'),
		loader = this.loader = $(this).children('j-loader').detach().attr('type', 'j-table'),
		pagination = this.pagination = $(this).children('j-pagination').detach(),
		toolbar = this.toolbar = $(this).children('j-toolbar').detach(),
		data, cst, z, i, colgroup = [], thCount = 0, th
		
		if(this.innerHTML.trim() == '')
			data = [];
		else
			data = JSON.parse(this.innerHTML);
		
		this.aaData = data;
		
		var headCols = data.shift()
		
		this.data = $.extend(true, [], data);
		
		if(this.custom.length > 0){
			for(z in data){
				for (i in data[z]){
					cst = custom.filter( "[target='"+i+"']" );
					
					if(cst.length == 0){
						var attr = custom.eq(i).attr('target')
						if(typeof attr === typeof undefined || attr === false)
							cst = custom.eq(i)
					}
						
					if(cst.length > 0 && cst.text().trim() != ''){
						eval('fn = '+cst.text());
						this.data[z][i] = fn(data[z]);
					}
				}
			}
		}
			
		jui2.ui.dataview.proto.createdCallback.call(this)
		
		this.children[0].insertAdjacentHTML( 'afterbegin', jui2.tmpl['tableHeader']({columns: headCols}) );
		
		th = $(this.children[0]).children('thead').find('tr:last-child th')
		th.each(function(z, val){
			var cst = custom.filter( "[target='"+z+"']" ),
			w = $(val).width();
			
			if(cst.length == 0){
				var attr = custom.eq(z).attr('target')
				if(typeof attr === typeof undefined || attr === false)
					cst = custom.eq(z)
			}
			
			if(cst.length > 0){
				w = cst.attr('width')
			}
			if(val.innerHTML != '')
				colgroup += '<colgroup><col width="'+w+'"></col></colgroup>';
		})
		$self.children('table').prepend(colgroup).css('table-layout', 'fixed');
		
		var c = 0;
		$self.find('> table > thead > tr > th').filter(function(i, val){
			return val.innerHTML === '';
		}).hide().each(function(i,val){
			$self.find('> table > tbody > tr > td:nth-child('+(parseInt($(val).index())+1)+')').hide()
			c++;
		});
		
		$self.append(loader)
		
		if(pagination)
			$self.append(pagination)
		
		if(toolbar){
			toolbar.insertBefore($self.children('table'))
			$self.children('j-toolbar').outerWidth($self.width())
		}
		
		$self.children('j-pagination').outerWidth($self.width())
		
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
		
		$('<j-scroll></j-scroll>').insertAfter($self.find('> table'))
		
		/* active tr highlight */
		$self.find('> table > tbody ').delegate( "> tr", "click", function() {
			$(this).addClass('j-active').siblings().removeClass('j-active')
		})
		
		$self.find('> table').resize(function(){
			var h = 0;
			$self.children().not('j-loader, table').each(function(i, val){
				if($(val).prop('tagName') == 'J-TOOLBAR')
					h+=37
				else
					h+=parseInt($(val).outerHeight())
			})
			$self.css('min-height', (h+$self.find('> table').height())+'px');
			//$self.children('j-scroll').children().children().outerWidth($self.find('> table').outerWidth(true))
			
			$self.children('j-scroll').children().children().outerWidth($self.children('j-scroll').prev().outerWidth(true))
			$self.children('j-scroll').outerWidth($self.children('j-scroll').prev().outerWidth(true))
			$self.children('j-scroll').children().outerWidth($self.width())
		})
		
		var $toolbars = $self.find('> table').prevAll('j-toolbar'), mt = 0;
		$toolbars.each(function(i, val){
			mt = 37 * ($toolbars.length - i) - 4;
			$(val).css('margin-top', mt+'px');
		})
		
		$self.children().not('table, j-scroll').css('left', '0px');
	};
	
	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'width', 'height', 'title'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}
	
	jui2.ui.table = {
		widget: document.registerElement('j-table',  { 
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))