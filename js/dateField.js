
/**
 * @classdesc Datefield custom web component
 * @class dateField
 * @property {string} format Date formatting for datefield value, format conventions using momentjs formatting conventions see <a href="http://momentjs.com/docs/#/displaying/">http://momentjs.com/docs/#/displaying/</a>
 * @example <caption>Datefield widget basic usage</caption>
 * <j-datefield id="date">Date</j-datefield>
 * @example <caption>Datefield formatting</caption>
 * <j-datefield format="DD MMM YYYY">Date</j-datefield>
 * @augments textField
 */
//TODO: clearing and trimming code
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.dateField);

		var $self = $(this), $table, self = this, id = this.juiid

		this.setAttribute("icon", "fa-calendar");

		jui2.ui.textField.proto.createdCallback.call(this, '')

		if(!$self.attr('format')){
			$self.attr('format', 'DD/MM/YYYY')
		}

		var initDate = moment($self.val(), $self.attr('format')).format('MMMM YYYY')
		if(initDate == 'Invalid date')
			initDate = moment().format('MMMM YYYY')
		$self.append(jui2.tmpl['calendar']({day: jui2.lang.day.en, month: initDate}));

		$table = $self.children('table')

		$table.find('.fa-chevron-left').parent().click(function(){
			self.prevMonth($table)
		})

		$table.find('.fa-chevron-right').parent().click(function(){
			self.nextMonth($table)
		})
		//self.timestamp = 0
		$self.unbind('clickout').bind( "clickout", function(event){
			if(event.target != $self[0] && $(event.target).parents('#'+$self.attr('id')).length == 0 && $(event.target).parents('[belongto=j-dateField]').length == 0/* && self.timestamp != event.timestamp*/){
				$table.detach().appendTo($self);
				$('#j-dateField-'+id).remove();
				$table.hide();

				/*$('[belongto=j-dateField]').filter(function(){
					return $(this).
				})*/

				/*if($(event.target).parents('j-datefield, [belongto=j-dateField]').length == 0 && $(event.target).parents('j-datefield')[0] != $self[0]){
					$('[belongto=j-dateField]').find('table').detach().appendTo($self)
					$('[belongto=j-dateField]').find('table').hide()
					$('[belongto=j-dateField]').remove()
				}*/
			}
			//self.timestamp = event.timestamp
		});

		$table.delegate('td', 'click', function(e){
			e.stopPropagation();
			var elNum = parseInt(this.innerHTML), $this = $(this);

			if($this.parent().index()==0){
				if($this.nextAll().filter(function( index ) {
					return parseInt(this.innerHTML) < elNum
				}).length > 0){
					$table.find('thead tr:first-child th:nth-child(2)').text(moment($table.find('thead tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').format('MMMM YYYY'))
				}
			}
			else if($this.parent().index()==($this.parent().siblings().length)){
				if($this.prevAll().filter(function( index ) {
					return parseInt(this.innerHTML) > elNum
				}).length > 0){
					$table.find('thead tr:first-child th:nth-child(2)').text(moment($table.find('thead tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').format('MMMM YYYY'))
				}
			}
			$self.val(moment(('00'+elNum).slice(-2)+' '+$table.find('thead tr:first-child th:nth-child(2)').text(), 'DD MMMM YYYY').format($self.attr('format')))
			$table.detach().appendTo($self);
			$('#j-dateField-'+id).remove();
			$table.hide();
			/**
			 * Fires when date selected
			 * @event select
			 * @param {object} event Event object
			 * @param  {String} value Selected value
			 * @memberof dateField
			 * @example
			 * <j-datefield id="myDatefield1">Date</j-datefield>
			 * <script>
			 * $('#myDatefield1').on('select', function(e, value){
			 * 	console.log(value) // will print value you selected from datefield in javascript console
			 * })
			 * </script>
			 */
			$self.triggerHandler('select', [$self.val()]);

		})

		$self.delegate($self.children().not('table'), 'click', function(e){

			if($(e.target).parents('table')[0] != $table[0] && e.target != $table[0]){
				$table.toggle();
				if($table.is(':visible')){
					if($('#j-dateField-'+id).length==0)
						$('body').append('<j-modal belongto="j-dateField" snapto="#'+$self.attr('id')+' > input" snappos="topleft to bottomleft" id="j-dateField-'+id+'"></j-modal>');
					setTimeout(function(){
						if($('#j-dateField-'+id).touchBottom()){
							$('#j-dateField-'+id).attr('snappos', 'bottomleft to topleft')
							setTimeout(function(){
								if($('#j-dateField-'+id).touchTop())
									$('#j-dateField-'+id).attr('snappos', 'topleft to bottomleft')
							}, 250);
						}
					}, 250)
					$table.detach().appendTo('#j-dateField-'+id)

					var date = [], lastDate, startDate, w = [], i = 0;
					//$table.css('z-index', z == '-Infinity' ? 100 : z);

					//m = moment($self.val(), $self.attr('format'))

					lastDate = moment($self.val(), $self.attr('format')).endOf('month').endOf('week')
					if(lastDate == 'Invalid date' || lastDate.format($self.attr('format')) == 'Invalid date')
						lastDate = moment().endOf('month').endOf('week')
					startDate = moment($self.val(), $self.attr('format')).startOf('month').startOf('week')
					if(startDate == 'Invalid date' || startDate.format($self.attr('format')) == 'Invalid date')
						startDate = moment().startOf('month').startOf('week')

					while(startDate.format('DD/MM/YYYY') != lastDate.format('DD/MM/YYYY')){
						w[w.length] = startDate.format('D')
						i++;
						startDate.add(1, 'day');
						if(i==7){
							i=0;
							date[date.length] = w;
							w = [];
						}
					}

					w[w.length] = startDate.format('D')
					startDate.add(1, 'day');
					if(w.length > 0)
						date[date.length] = w;
					$table.find('> tbody').empty().append(jui2.tmpl['calendarBody']({date: date}));
				}
				else{
					$table.detach().appendTo($self);
					$('#j-dateField-'+id).remove();
				}
			}
		});

		jui2.keycodes.bind(this, "tab")
		/*--*
		 * Fires after dateField created
		 * @event afterdraw
		 * @instance
		 * @memberof dateField
		 * @example
		 * <j-datefield id="myDatefield2">Date</j-datefield>
		 * <script>
		 * $('#myDatefield2').on('afterdraw', function(value){
		 * 	console.log('Datefield created')
		 * })
		 * </script>
		 --*/
		//$self.triggerHandler('afterdraw')

		if(this.value || this.value == ''){
			if(this.value.trim()!=''){
				var tmpValue = this.value
				$(this).val(tmpValue);
			}
			delete this.value;
		}

		$self.on('keydown', function(e){
			if(e.keyCode == 8){
				$self.val('');
				$table.detach().appendTo($self);
				$('#j-dateField-'+id).remove();
				$table.hide();
			}
		})

		this.enabledAttrChange = $.unique(this.enabledAttrChange.concat(['disabled', 'icon']));

    for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
      if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
  			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, false, newVal);
      else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
        jui2.attrChange[attrName](this, false, newVal);
		}

	};

/**
 * Go to previous month
 * @method prevMonth
 * @memberof dateField
 * @instance
 */
	proto.prevMonth = function(table){
		var date = [], lastDate, startDate, w = [], i = 0, $table = table;
		lastDate = moment(table.find('tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').endOf('month').endOf('week')
		startDate = moment(table.find('tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').startOf('month').startOf('week')
		while(startDate.format('DD/MM/YYYY') != lastDate.format('DD/MM/YYYY')){
			w[w.length] = startDate.format('D')
			i++;
			startDate.add(1, 'day');
			if(i==7){
				i=0;
				date[date.length] = w;
				w = [];
			}
		}
		w[w.length] = startDate.format('D')
		startDate.add(1, 'day');
		if(w.length > 0)
			date[date.length] = w;

		$table.find('thead tr:first-child th:nth-child(2)').text(moment(table.find('tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').format("MMMM YYYY"))
		$table.find('> tbody').empty().append(jui2.tmpl['calendarBody']({date: date}));
	}
/**
 * Go to next month
 * @method nextMonth
 * @memberof dateField
 * @instance
 */
	proto.nextMonth = function(table){
		var date = [], lastDate, startDate, w = [], i = 0, $table = table;
		lastDate = moment(table.find('tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').endOf('month').endOf('week')
		startDate = moment(table.find('tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').startOf('month').startOf('week')
		while(startDate.format('DD/MM/YYYY') != lastDate.format('DD/MM/YYYY')){
			w[w.length] = startDate.format('D')
			i++;
			startDate.add(1, 'day');
			if(i==7){
				i=0;
				date[date.length] = w;
				w = [];
			}
		}
		w[w.length] = startDate.format('D')
		startDate.add(1, 'day');
		if(w.length > 0)
			date[date.length] = w;

		$table.find('thead tr:first-child th:nth-child(2)').text(moment(table.find('tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').format("MMMM YYYY"))
		$table.find('> tbody').empty().append(jui2.tmpl['calendarBody']({date: date}));
	}

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var tagName = this.tagName, attrChange = jui2.attrChange, key = tagName.toLowerCase()+'_'+attrName;
		if(attrChange[key])
			attrChange[key](this, oldVal, newVal);
    else if(attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.dateField = {
		widget: document.registerElement('j-datefield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
