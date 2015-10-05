/**
 * @classdesc Datefield custom web component
 * @class dateField
 * @property {string} format Date formatting for datefield value, format conventions is same with momentjs formatting conventions see <a href="http://momentjs.com/docs/#/displaying/">http://momentjs.com/docs/#/displaying/</a>
 * @example <caption>Datefield widget basic usage</caption>
 * <j-datefield id="date">Date</j-datefield>
 * @example <caption>Datefield formatting</caption>
 * <j-datefield format="DD MMM YYYY">Date</j-datefield>
 * @augments textField
 */

(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

		var $self = $(this), $table, self = this

		this.setAttribute("icon", "fa-calendar");

		jui2.ui.textField.proto.createdCallback.call(this, 'Datefield')

		if(!$self.attr('format')){
			$self.attr('format', 'DD/MM/YYYY')
		}

		var initDate = moment($self.val(), $self.attr('format')).format('MMMM YYYY')
		if(initDate == 'Invalid date')
			initDate = moment().format('MMMM YYYY')
		$self.append(jui2.tmpl['calendar']({day: jui2.lang.day.en, month: initDate}));

		$table = $self.children('table')

		$table.find('.fa-chevron-left').parent().click(function(){
			self.prevMonth()
		})

		$table.find('.fa-chevron-right').parent().click(function(){
			self.nextMonth()
		})

		$self.bind( "clickout", function(event){
			if(event.target != $self[0] && $(event.target).parents('j-datefield')[0] != $self[0]){
				$table.hide();
			}
		});

		$table.delegate('td', 'click', function(e){
			e.stopPropagation();
			var elNum = parseInt(this.innerHTML)

			if($(this).parent().index()==0){
				if($(this).nextAll().filter(function( index ) {
					return parseInt(this.innerHTML) < elNum
				}).length > 0){
					$table.find('thead tr:first-child th:nth-child(2)').text(moment($table.find('thead tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').format('MMMM YYYY'))
				}
			}
			else if($(this).parent().index()==($(this).parent().siblings().length)){
				if($(this).prevAll().filter(function( index ) {
					return parseInt(this.innerHTML) > elNum
				}).length > 0){
					$table.find('thead tr:first-child th:nth-child(2)').text(moment($table.find('thead tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').format('MMMM YYYY'))
				}
			}
			$self.val(moment(('00'+elNum).slice(-2)+' '+$table.find('thead tr:first-child th:nth-child(2)').text(), 'DD MMMM YYYY').format($self.attr('format')))
			$table.hide()
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
					//set top left
					$table.css('top', parseInt($self.css('height'))+$self.offset().top)
					.css('left', $self.position().left+$self.parents().filter(function(){
						//return $(this).scrollLeft()>0
						return $(this).hasScrollBar()
					}).scrollLeft());

					var parent = $self.parents().filter(function(){
						return $(this).hasScrollBar()
					})

					if(parent.length > 0)
						if(parent.eq(0).prop('tagName')!='HTML'){
							$table.css('top', parseInt($self.css('height'))+$self.position().top+parent.scrollTop())
						}
					
					$table.css('top', parseInt($self.css('height'))+$self.position().top+parent.scrollTop())

					var z = jui2.findHighestZIndex(), date = [], lastDate, startDate, w = [], i = 0;
					$table.css('z-index', z == '-Infinity' ? 100 : z);

					//m = moment($self.val(), $self.attr('format'))

					lastDate = moment($self.val(), $self.attr('format')).endOf('month').endOf('week')
					if(lastDate == 'Invalid date' || lastDate.format($self.attr('format')) == 'Invalid date')
						lastDate = moment().endOf('month').endOf('week')
					startDate = moment($self.val(), $self.attr('format')).startOf('month').startOf('week')
					if(startDate == 'Invalid date' || startDate.format($self.attr('format')) == 'Invalid date')
						startDate = moment().startOf('month').startOf('week')

					while(startDate.format('DD/MM/YYYY') != lastDate.format('DD/MM/YYYY')){
						w.push(startDate.format('D'))
						i++;
						startDate.add(1, 'day');
						if(i==7){
							i=0;
							date.push(w);
							w = [];
						}
					}

					w.push(startDate.format('D'))
					startDate.add(1, 'day');
					if(w.length > 0)
						date.push(w);
					$table.find('> tbody').empty().append(jui2.tmpl['calendarBody']({date: date}));
				}
			}
		});

		jui2.keycodes.bind(this, "")
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

	};

/**
 * Go to previous month
 * @method prevMonth
 * @memberof dateField
 * @instance
 */
	proto.prevMonth = function(){
		var date = [], lastDate, startDate, w = [], i = 0, $table = $(this).children('table');
		lastDate = moment($(this).find('table tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').endOf('month').endOf('week')
		startDate = moment($(this).find('table tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').startOf('month').startOf('week')
		while(startDate.format('DD/MM/YYYY') != lastDate.format('DD/MM/YYYY')){
			w.push(startDate.format('D'))
			i++;
			startDate.add(1, 'day');
			if(i==7){
				i=0;
				date.push(w);
				w = [];
			}
		}
		w.push(startDate.format('D'))
		startDate.add(1, 'day');
		if(w.length > 0)
			date.push(w);

		$table.find('thead tr:first-child th:nth-child(2)').text(moment($(this).find('table tr:first-child th:nth-child(2)').text(), "MMMM YYYY").subtract(1, 'month').format("MMMM YYYY"))
		$table.find('> tbody').empty().append(jui2.tmpl['calendarBody']({date: date}));
	}
/**
 * Go to next month
 * @method nextMonth
 * @memberof dateField
 * @instance
 */
	proto.nextMonth = function(){
		var date = [], lastDate, startDate, w = [], i = 0, $table = $(this).children('table');
		lastDate = moment($(this).find('table tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').endOf('month').endOf('week')
		startDate = moment($(this).find('table tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').startOf('month').startOf('week')
		while(startDate.format('DD/MM/YYYY') != lastDate.format('DD/MM/YYYY')){
			w.push(startDate.format('D'))
			i++;
			startDate.add(1, 'day');
			if(i==7){
				i=0;
				date.push(w);
				w = [];
			}
		}
		w.push(startDate.format('D'))
		startDate.add(1, 'day');
		if(w.length > 0)
			date.push(w);

		$table.find('thead tr:first-child th:nth-child(2)').text(moment($(this).find('table tr:first-child th:nth-child(2)').text(), "MMMM YYYY").add(1, 'month').format("MMMM YYYY"))
		$table.find('> tbody').empty().append(jui2.tmpl['calendarBody']({date: date}));
	}

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.dateField = {
		widget: document.registerElement('j-datefield',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
