/**
 * @classdesc Pivot row extension for table widget
 * @class pivotTop @extension table
 * @example <caption>basic usage</caption>
 *
<j-table width="300px" id="table" height="150px">
	<j-loader src="data.json"></j-loader>
	[
		[ "Fruit", "data 1", "data 2", "data 3"]
	]
	<j-pagination>
	</j-pagination>
</j-table>
<j-table-pivot-top target="#table">
[0]
</j-table-pivot-top>
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.draw =  function(){
		var $self = $(this), $target = $($self.attr('target')).children('.j-table-body'), column = this.column,
		$table = $target.children('table').clone(true), c = 0, w = 0;
		$self.empty().append($table);

		$self.children().css('width', $target.css('width'))
		$self.find('tbody > tr').each(function(i, val){
			if(column.indexOf(i) == -1){
				$self.find('table > tbody > tr:nth-child('+(i-c+1)+')').remove()
				c++;
			}
			else{
				//console.log($target.find('> tbody > tr:nth-child('+(i-c+1)+') > td'), '> tbody > tr:nth-child('+(i-c+1)+') > td')
				$(val).children().css('height', $target.find('> table > tbody > tr:nth-child('+(i-c+1)+') > td').eq(0).css('height'));
			}
		})

		$self.children('table').css('width', $target.children('table').outerWidth())
		//$self.trigger('afterdraw')
		if($self.parent().children('j-table-pivot-left').length>0){
			if($self.parent().children('j-table-pivot-intersection').length==0){
				$self.parent().append('<j-table-pivot-intersection></j-table-pivot-intersection>')
			}
			var $intersection = $self.parent().children('j-table-pivot-intersection')
			$intersection.empty().append($self.find('table').clone(true))
			$intersection.find('tr td:nth-child(n+'+($self.parent().children('j-table-pivot-left').find('tr:first-child > td').length+1)+')').remove()
			$intersection.find('tr th:nth-child(n+'+($self.parent().children('j-table-pivot-left').find('tr:first-child > td').length+1)+')').remove()
			$intersection.find('colgroup').remove()
			$intersection.children().css('width', $self.parent().children('j-table-pivot-left').children().css('width'))
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

		var lastScrollTop = 0

		$target.scroll(function(){
			var st = $(this).scrollTop();
			if (st != lastScrollTop){
				$self.css('z-index', jui2.findHighestZIndex() == -Infinity? 100:jui2.findHighestZIndex())
				$self.parent().children('j-table-pivot-intersection').css('z-index', jui2.findHighestZIndex() == -Infinity? 100:jui2.findHighestZIndex())
			}
			else{
				$self.css('z-index', '')
			}

			lastScrollTop = st;

			$self.css('left', '-'+$(this).scrollLeft());
			$self.css('top', $(this).scrollTop());
			$self.parent().children('j-table-pivot-intersection').css('top', $(this).scrollTop());
		})

		$($self.attr('target')).on('afterdraw', function(){
			$(this).find('> .j-table-body > j-table-pivot-top')[0].draw();
		})

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		/*var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);*/
	}

	jui2.ui.tablePivotTop = {
		widget: document.registerElement('j-table-pivot-top',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
