// #DOING:100 Recreating j-custom for table as extension
(function($){

	jui2.ui.tableCustom = function(self) {
		var jCustom = $(self).find('> j-custom').detach(), tmpData = [], colgroup = [];
		$(self).on('beforedraw', function(){
			if(jCustom){
				if($(self).find('> .j-table-body > table > colgroup').length == 0){
					if(jCustom.length>0){
						th = $(self).find('> .j-table-body > table > thead > tr:last-child th')
						th.each(function(z, val){
							var cst = jCustom.filter( "[target='"+z+"']" ),
							w = $(val).width();

							if(cst.length == 0){
								var attr = jCustom.eq(z).attr('target')
								if(typeof attr === typeof undefined || attr === false){
									cst = jCustom.eq(z)
								}
							}

							if(cst.length > 0){
								w = cst.attr('width')
							}
							if(val.innerHTML != '')
								colgroup += '<colgroup><col width="'+w+'"></col></colgroup>';
						})
						$(self).find('> .j-table-body > table').prepend(colgroup).css('table-layout', 'fixed');
					}
				}
				if(jCustom.length > 0){
					for(z in self.viewData){
						tmpData[z] = []
						for (i in self.viewData[z]){
							var cst = jCustom.filter( "[target='"+i+"']" );

							if(cst.length == 0){
								var attr = jCustom.eq(i).attr('target')
								if(typeof attr === typeof undefined || attr === false)
									cst = jCustom.eq(i)
							}

							if(cst.length > 0 && cst.html().trim() != ''){
								if(!cst[0].fn)
									cst[0].fn = eval('fn = '+cst.html().replace(/&lt;/g, '<')
										.replace(/&gt;/g, '>')
										.replace(/&amp;/g, '&'));
								tmpData[z][i] = cst[0].fn(self.viewData[z]);
							}
							else{
								tmpData[z][i] = self.viewData[z][i];
							}
						}
					}
				}
				else{
					tmpData = self.viewData;
				}
			}
			else{
				tmpData = self.viewData;
			}
			self.viewData = tmpData;
		})
	}

	jui2.ui.table.extension.push(jui2.ui.tableCustom)

}(jQuery))
