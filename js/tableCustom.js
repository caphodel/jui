
// #DOING:100 Recreating j-custom for table as extension
(function($){

	jui2.ui.tableCustom = function(self) {
		var jCustom = $(self).find('> j-custom').detach(), $table, tmpData = [], colgroup = [], th;

		$(self).on('beforedraw', function(){
			$table = $(self).find('> .j-table-body > table:first-child');
			tmpData = []
			if(jCustom){
				if($table.find(' > colgroup').length == 0){
					if(jCustom.length>0){
						th = $table.find(' > thead > tr:last-child th')
						/*if(th.length==0)
							th = $table.find(' > tbody > tr:last-child td')*/
						th.each(function(z, val){
							var cst = jCustom.filter( "[target='"+z+"']" ),
							w = $(val).width(), attr;

							if(cst.length == 0){
								attr = jCustom.eq(z).attr('target')
								if(typeof attr === typeof undefined || attr === false){
									cst = jCustom.eq(z)
								}
							}

							if(cst.length > 0){
								w = cst.attr('width')
								if(val.innerHTML != ''){
									//colgroup += '<colgroup><col width="'+w+'"></col></colgroup>';
									$(val).width(w)
								}
							}
						})
						$table.css('table-layout', 'fixed');
						/*th.each(function(z, val){
							$(val).children().width($(val).width())
							//$(val).css("width", '');
						})*/
					}
				}
				if(jCustom.length > 0){
					var dataLoop = $(self)[0].viewData
					for(z in dataLoop){
						if(dataLoop.hasOwnProperty(z)){
							tmpData[z] = []
							for (i in dataLoop[z]){								if(dataLoop[z].hasOwnProperty(i)){
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
										tmpData[z][i] = cst[0].fn(dataLoop[z]);
									}
									else{
										tmpData[z][i] = dataLoop[z][i];
									}
								}
							}
						}
					}
				}
				else{
					tmpData = $(self)[0].viewData;
				}
			}
			else{
				tmpData = $(self)[0].viewData;
			}
			$(self)[0].viewData = tmpData;
		})
	}

	jui2.ui.table.extension.push(jui2.ui.tableCustom)

}(jQuery))
;
