/**
 * @classdesc Pivot column extension for table widget
 * @class pivotLeft @extension table
 * @example <caption>basic usage</caption>
 *
<j-table width="300px" id="table">
	<j-custom target="2" width="150px">
	</j-custom>
	<j-loader src="data.json"></j-loader>
	[
		[ "Fruit", "data 1", "data 2", "data 3"]
	]
	<j-pagination>
	</j-pagination>
</j-table>
<j-table-pivot-left target="#table">
[0]
</j-table-pivot-left>
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.draw =  function(){
		var $self = $(this), $target = $($self.attr('target')).children('.j-table-body'), column = this.column,
		$table = $target.find('> table').clone(true), c = 0, w = 0;

		$self.empty().append($table);
		$self.find('th').each(function(i, val){
			if(column.indexOf(i) == -1){
				$self.find('table > tbody > tr > td:nth-child('+(i-c+1)+')').remove()
				$self.find('table > colgroup').eq((i-c)).remove()
				$(val).remove()
				c++;
			}
			else{
				$(val).outerWidth($target.find('thead > tr > th').eq(i).outerWidth());
				w += $target.find('thead > tr > th').eq(i).outerWidth()
			}
		})

		$target.children('table').find('td:nth-child(1)').each(function(i, val){
			var td = $self.find('table > tbody > tr:nth-child('+(i+1)+') > td:first-child')
			if(($(val).height()-9)<=9 && td.text().trim()==''){
				$self.find('table > tbody > tr:nth-child('+(i+1)+') > td:first-child').html('&nbsp')
			}
			td.css('height', $(val).css('height'))
		})

		/*$self.find('table > colgroup > col').each(function(i, val){
			w+=parseInt($(this).attr('width'))
		})*/

		$self.children('table').css('width', w)

		if($self.parent().children('j-table-pivot-top').length>0){
			if($self.parent().children('j-table-pivot-intersection').length==0){
				$self.parent().append('<j-table-pivot-intersection></j-table-pivot-intersection>')
			}
			var $intersection = $self.parent().children('j-table-pivot-intersection')
			$intersection.empty().append($self.parent().children('j-table-pivot-top').find('table').clone(true))
			$intersection.find('tr td:nth-child(n+'+($self.parent().children('j-table-pivot-left').find('tr:first-child > td').length+1)+')').remove()
			$intersection.find('tr th:nth-child(n+'+($self.parent().children('j-table-pivot-left').find('tr:first-child > td').length+1)+')').remove()
			$intersection.find('colgroup').remove()
			$intersection.children().css('width', $self.children().css('width'))
		}
	}

	proto.createdCallback = function() {

		var $self = $(this), $target = $($self.attr('target')).children('.j-table-body'), column;

		if(this.innerHTML.trim() == '')
			column = [];
		else
			column = JSON.parse(this.innerHTML);

		this.column = column

		$(this).appendTo($target)

		var lastScrollLeft = 0

		$target.scroll(function(){
			var st = $(this).scrollLeft();
			if (st != lastScrollLeft){
				$self.css('z-index', jui2.findHighestZIndex() == -Infinity? 100:jui2.findHighestZIndex())
				$self.parent().children('j-table-pivot-intersection').css('z-index', jui2.findHighestZIndex() == -Infinity? 100:jui2.findHighestZIndex())
			}
			else{
				$self.css('z-index', '')
			}

			lastScrollLeft = st

			$self.css('left', $(this).scrollLeft());
			$self.parent().children('j-table-pivot-intersection').css('left', $(this).scrollLeft());
			$self.css('top', '-'+$(this).scrollTop());
		})

		$($self.attr('target')).on('afterdraw', function(){
			$(this).find('> .j-table-body > j-table-pivot-left')[0].draw();
		})

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		/*var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);*/
	}

	jui2.ui.tablePivotLeft = {
		widget: document.registerElement('j-table-pivot-left',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
