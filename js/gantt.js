
/**
 * @classdesc gantt custom web component
 * @class gantt
 * @augments gantt
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

  proto.generateData = jui2.ui.dataview.proto.generateData

	proto.createdCallback = function() {
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.gantt);
    var $self = $(this), loader = this.loader = $(this).children('j-loader').detach().attr('type', 'j-table'), self = this

    if(this.innerHTML.trim().replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, '') == "")
      data = [];
    else
      data = JSON.parse(this.innerHTML.trim().replace(/<(.|\n)*?>(.|\n)*?<\/(.|\n)*?>/ig, ''));

    this.aaData = data;

    var headCols = ["Task Name", "&nbsp;", "&nbsp;"]

    this.data = $.extend(true, [], data);

    $self.on('afterdraw', function(){
      $self.find('>.j-table-body > table > tbody > tr > td:nth-child(2)').wrapInner('<div style="height: 100%;"></div>')
      var $trs = $self.find('>.j-table-body > table > tbody > tr'),
      startDate = moment().subtract(1, 'month').startOf('week'),
      endDate = moment().endOf('week').add(1, 'month'),
      today = moment();
      $trs.each(function(i, val){
        var data = $self[0].data[i][3];
        if(moment(data.startDate, 'DD-MM-YYYY').subtract(2, 'week').isBefore(startDate))
          startDate = moment(data.startDate, 'DD-MM-YYYY').subtract(1, 'week')
        if(moment(data.endDate, 'DD-MM-YYYY').add(2, 'week').isAfter(endDate))
          endDate = moment(data.endDate, 'DD-MM-YYYY').add(1, 'week')
        var el = $trs.filter(function(){
          return $(this).children('td:nth-child(3)').text().trim()==($(val).find('>td:first-child').text())
        })
        if(el.length>0){
          if($(val).children('td:nth-child(2)').children().children('i.fa-plus').length==0)
            $(val).children('td:nth-child(2)').children().prepend('<i class="fa fa-minus-square-o"></i>')
          el.children('td:nth-child(2)').children().css('padding-left', parseInt($(val).children('td:nth-child(2)').children().css('padding-left'))+30).parent().parent()//.hide()
        }
      }).append('<td class="j-gantt-grid-container"></td>')

      //creating grid
      var grid = '<div style="height: 100%;position: relative">', gridHead = '<div style="height: 100%;position: relative">'
      gridWeek = '<div style="height: 100%;position: relative">', gridMonth = '<div style="height: 100%;position: relative">', week = 0, weekWidth = 0, month = 0, monthWidth = 0, weekDayCount = 0, monthDayCount = 0;
      while(!startDate.isAfter(endDate)){
        grid+='<div class="j-gantt-grid '+startDate.format('DDMMYYYY')+'"></div>'
        gridHead+='<div class="j-gantt-grid '+startDate.format('DDMMYYYY')+'"><span style="display:none">'+startDate.format('DD MMM YYYY')+'</span><span>'+startDate.format('DD MMM')+'</span><span style="display: none;">'+startDate.format('dd')+'</span><span style="display: none;">'+startDate.format('dd')[0]+'</span></div>'
        if(parseInt(startDate.format('W')) > week){
          if(week!=0){
            gridWeek = gridWeek.replace('{width}', weekWidth+'px').replace('{day}', weekDayCount)
            weekWidth = 0;
            weekDayCount = 0;
          }
          week = parseInt(startDate.format('W'))
          gridWeek += '<div day="{day}" class="j-gantt-grid week'+week+'" style="width: {width}">'+week+'</div>'
        }
        weekWidth += 50;
        weekDayCount++;

        if(parseInt(startDate.format('M')) > month){
          if(month!=0){
            gridMonth = gridMonth.replace('{width}', monthWidth+'px').replace('{day}', monthDayCount)
            monthWidth = 0;
            monthDayCount = 0;
          }
          month = parseInt(startDate.format('M'))
          gridMonth += '<div day="{day}" class="j-gantt-grid month'+month+'" style="width: {width}">'+startDate.format('MMM YYYY')+'</div>'
        }
        monthWidth += 50;
        monthDayCount++;
        startDate.add(1, 'day');
      }
      gridWeek = gridWeek.replace('{width}', weekWidth+'px').replace('{day}', weekDayCount)
      gridMonth = gridMonth.replace('{width}', monthWidth+'px').replace('{day}', monthDayCount)
      grid+='</div>';
      gridHead+='</div>';
      gridMonth+='</div>';
      $self.find('>.j-table-body > table > thead > tr > th:last-child').empty().append(gridHead);
      $self.find('>.j-table-body > table > thead > tr > th:last-child').prepend(gridWeek);
      $self.find('>.j-table-body > table > thead > tr > th:last-child').prepend(gridMonth);
      $trs.children('td:nth-child(3), td:first-child').hide()
			$trs.children('td:nth-child(2)').show()
      $self.find('.j-gantt-grid-container').append(grid)
      $self.find('>.j-table-body > table > thead > tr > th:nth-child(2)').hide()
      $self.find('>.j-table-body > table > thead > tr > th:nth-child(3)').show()
      $self.find('>.j-table-body > table > tbody > tr:last-child').clone().appendTo($self.find('>.j-table-body > table > tbody'))
      $self.find('>.j-table-body > table > tbody > tr:last-child').show().children().empty().css('padding', '0px')
      var elScrollWidths = $self.find('>.j-table-body > table > tbody > tr > td:nth-child(2)').map(function() {
        return this.scrollWidth
      }).get()
      maxScrollWidth = Math.max.apply(null, elScrollWidths)//-250+10;
      $self.find('>.j-table-body > table > tbody > tr:last-child td:nth-child(2)').css({
        "font-size": 0,
        "line-height": 0,
      }).append('<div class="j-gantt-task-scroll" style="overflow-x: auto; overflow-y: hidden;width: 100%; height: 20px; display: inline-block;"><div style="display:block;width:'+maxScrollWidth+'px;height:20px;"></div></div>')
      var gridCellWidths = $self.find('>.j-table-body > table > tbody > tr:first-child td:last-child > div > div').map(function(){
        return parseInt($(this).outerWidth())
      }).get(),
      sum = gridCellWidths._reduce(function(pv, cv) { return pv + cv; }, 0);
      $self.find('>.j-table-body > table > tbody > tr:last-child td:last-child').append('<div class="j-gantt-bar-scroll" style="overflow-x: auto; overflow-y: hidden;width: 100%; height: 20px; display: inline-block;"><div style="display:block;height:20px;width:'+sum+'px;"></div></div>')
      $self.find('.j-gantt-task-scroll').scroll(function(){
        $self.find('>.j-table-body > table > tbody > tr:not(:last-child) > td:nth-child(2) > div').css('margin-left', '-'+$(this).scrollLeft()+'px')
      })
      $self.find('.j-gantt-bar-scroll').scroll(function(){
        $self.find('>.j-table-body > table > tbody > tr:not(:last-child) > td:last-child > div, >.j-table-body > table > thead > tr > th:last-child > div').css('margin-left', '-'+$(this).scrollLeft()+'px')
      })

      $self[0].addFlag('#F46670', today.format('DD-MM-YYYY'), 'Today')

      //draw the bar
      var firstBar = false;
      $trs.each(function(i, val){
        var data = $self[0].data[i][3], startDate = moment(data.startDate, 'DD-MM-YYYY'), endDate = moment(data.endDate, 'DD-MM-YYYY'), diff = startDate.diff(endDate, 'days'),
        gridCellWidth = $trs.find('.j-gantt-grid').outerWidth(),
        bar = $('<div startDate="'+startDate.format('DDMMYYYY')+'" endDate="'+endDate.format('DDMMYYYY')+'" drag="true" verticalDrag="false" class="j-gantt-bar" style="width: '+(gridCellWidth*(Math.abs(diff)+1))+'px"><div class="j-gantt-progress j-gantt-progress-completed" style="display: inline-block;width:'+data.progress+'%"></div><span style="z-index: 1">'+data.progress+'%</span></div>'),
        childPos = $self.find('.'+startDate.format('DDMMYYYY')).offset(),
        parentPos = $self.find('.'+startDate.format('DDMMYYYY')).parent().offset()

				if($self[0].data[i][4] != undefined)
					if($self[0].data[i][4] == 1)
						bar.addClass('j-gantt-disable');

        if(today.isAfter(endDate)){
          bar.attr('warning', 'Overdue '+today.diff(endDate, 'days')+' days')
        }

        bar.appendTo($(val).children().last().children()).css({
          top: '2.5px',
          left: childPos.left - parentPos.left
        })

				if(firstBar==false)
					firstBar = childPos.left - parentPos.left

				if((childPos.left - parentPos.left) < firstBar)
					firstBar = childPos.left - parentPos.left

        if($(val).is(':visible'))
          self.updateBar(bar)

      })

			$self.find('.j-gantt-bar-scroll').scrollLeft(firstBar)

      $self.find('.j-gantt-bar').on('dragend', function(e, pos){
        var target = $(this).touching('.j-gantt-grid').eq(0), startDate = target.attr('class').split(' ')[1], endDate = $(this).touching('.j-gantt-grid').last().prev().attr('class').split(' ')[1]
        childPos = target.offset(),
        parentPos = target.parent().offset()
        $(this).css({
          top: '2.5px',
          left: childPos.left - parentPos.left
        }).attr('startDate', startDate)
        .attr('endDate', endDate)

        self.updateBar(this)
      })
    })

    $self.delegate('.fa-plus-square-o', 'click', function(){
      var $tr = $(this).parent().parent().parent()
      $showed = $tr.nextUntil(
        $tr.nextAll().filter(function(){
          var targetPad = parseInt($(this).children('td:nth-child(2)').children().css('padding-left')),
          elPad = parseInt($tr.children('td:nth-child(2)').children().css('padding-left'))
          return targetPad <= elPad
        })
      ).filter(function(){
        return parseInt($(this).children('td:nth-child(2)').children().css('padding-left')) == parseInt($tr.children('td:nth-child(2)').children().css('padding-left'))+30
      }).show()
      $showed.find('.j-gantt-bar').each(function(i, val){
        self.updateBar(val)
      })
      $(this).removeClass('fa-plus-square-o').addClass('fa-minus-square-o');

      var elScrollWidths = $self.find('>.j-table-body > table > tbody > tr > td:nth-child(2)').map(function() {
        return this.scrollWidth
      }).get()
      var maxScrollWidth = Math.max.apply(null, elScrollWidths)//-250+10;

      $self.find('.j-gantt-task-scroll > div').css('width', maxScrollWidth)
    })

    $self.delegate('.fa-minus-square-o', 'click', function(){
      var $tr = $(this).parent().parent().parent(), elPad = parseInt($tr.children('td:nth-child(2)').children().css('padding-left'))
      $tr.nextUntil(
        $tr.nextAll().filter(function(){
          var targetPad = parseInt($(this).children('td:nth-child(2)').children().css('padding-left'))
          return targetPad <= elPad
        })
      ).hide().find('.fa-minus-square-o').removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
      $(this).removeClass('fa-minus-square-o').addClass('fa-plus-square-o');

      var elScrollWidths = $self.find('>.j-table-body > table > tbody > tr > td:nth-child(2)').map(function() {
        return this.scrollWidth
      }).get()
      var maxScrollWidth = Math.max.apply(null, elScrollWidths)-200+10;

      $self.find('.j-gantt-task-scroll > div').css('width', maxScrollWidth)
    })

    $self.delegate('.j-gantt-bar', 'mouseover', function(e){
			var tooltip = $('#j-gantt-tooltip'), create = true;
			if(tooltip.length>0){
				if(tooltip[0].bar == e.target || tooltip[0] == e.target || tooltip[0].bar == $(e.target).parents('.j-gantt-bar')[0]){
					create = false;
				}
			}

			if(create){
				var info = self.taskInfo(this), offset = $(this).offset(), left;
				$('#j-gantt-tooltip').remove()

				$self.append('<j-modal id="j-gantt-tooltip" center="false">'+info.tooltip+'</j-modal>')
				if(e.pageX+$('#j-gantt-tooltip').outerWidth()>$(window).width())
					left = e.pageX-$('#j-gantt-tooltip').outerWidth()
				else
					left = e.pageX
				$('#j-gantt-tooltip').offset({left: left, top: offset.top-$('#j-gantt-tooltip').outerHeight()})
				$('#j-gantt-tooltip')[0].bar = e.target
			}
    })

    $self.delegate('.j-gantt-grid', 'mouseenter', function(e){
			var tooltip = $('#j-gantt-tooltip')
			if(tooltip.length>0){
				if(tooltip[0] == e.target || tooltip[0].bar == e.target || tooltip[0].bar == $(e.target).parents('.j-gantt-bar')[0]){

				}
				else
	      	$('#j-gantt-tooltip').remove()
			}
    })

    jui2.ui.dataview.proto.createdCallback.call(this)

    $self.find('thead').remove()

    $self.append(loader);

		this.enabledAttrChange = $.unique(this.enabledAttrChange.concat(['disabled', 'width', 'height', 'title']));

		$(this.children[0]).children().prepend(jui2.tmpl['tableHeader']({columns: headCols}) );

		for(i in this.attributes){
			var attrName = this.attributes[i].nodeName,
			newVal = this.attributes[i].nodeValue;
      if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
  			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, false, newVal);
      else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
        jui2.attrChange[attrName](this, false, newVal);
		}
	};

  proto.updateBar = function(item){
    var data = this.taskInfo(item), item = $(item), $self = $(this);
    if(data.overdue>0)
      item.attr('warning', 'Overdue '+data.overdue+' days')
    else {
      item.attr('warning', '')
    }

		if(data.disable == 1){
			item.addClass('j-gantt-disable')
		}

    var progressToComplete = data.expectedProgress>data.progress? 100 - data.expectedProgress : 100 - data.progress, gridCellWidth = item.parent().parent().find('.j-gantt-grid').outerWidth();

    item.empty()
    item.append('<span style="z-index: 1">'+data.progress+'%</span>')
    item.outerWidth(gridCellWidth*(Math.abs(moment(data.startDate, 'DD-MM-YYYY').diff(moment(data.endDate, 'DD-MM-YYYY'), 'days'))+1))
    item.prepend('<div class="j-gantt-progress j-gantt-progress-completed" style="display: inline-block;width:'+data.progress+'%"></div>')
    item.prepend('<div class="j-gantt-progress" style="display: inline-block; width: '+(data.expectedProgress-data.progress)+'%; left: '+data.progress+'%; background: #f46670"></div>')
    item.prepend('<div class="j-gantt-progress" style="display: inline-block; width: '+progressToComplete+'%; right: 0; left: unset; background: #c7d8f7"></div>')
    if(item.parent().parent().parent().children('td:nth-child(2)').find('.fa-minus-square-o, .fa-plus-square-o').length>0){
      item.append('<div class="j-gantt-milestone"></div>')
    }

    childPos = $self.find('.'+moment(data.startDate, 'DD-MM-YYYY').format('DDMMYYYY')).offset(),
    parentPos = $self.find('.'+moment(data.startDate, 'DD-MM-YYYY').format('DDMMYYYY')).parent().offset()

    item.css({
      top: '2.5px',
      left: childPos.left - parentPos.left
    })

  }

  proto.taskInfo = function(item){
    var item = $(item), data = this.data[item.parent().parent().parent().index()];
    data[3].startDate = moment($(item).attr('startDate'), 'DDMMYYYY').format('DD-MM-YYYY')
    data[3].endDate = moment($(item).attr('endDate'), 'DDMMYYYY').format('DD-MM-YYYY')
    var days = item.parent().children('.'+moment(data[3].startDate, 'DD-MM-YYYY').format('DDMMYYYY')).nextUntil('.'+moment(data[3].endDate, 'DD-MM-YYYY').format('DDMMYYYY')).length+2,
    overdue = moment().startOf('day').diff(moment(data[3].endDate, 'DD-MM-YYYY'), 'days'),
    progress = data[3].progress//parseInt(item.eq(0).children('.j-gantt-progress-completed').outerWidth())/parseInt(item.eq(0).outerWidth())*100,
    elapsedDays = moment().diff(moment(data[3].startDate, 'DD-MM-YYYY'), 'days'),
    expectedProgress = 100/days*(elapsedDays+1),
		disable = 0;

		if(item.hasClass('j-gantt-disable'))
			disable = 1

    if(expectedProgress>100){
      expectedProgress = 100;
    }
    var returnData = {
      overdue: overdue,
      progress: Math.round(progress),
      startDate: data[3].startDate,
      endDate: data[3].endDate,
      expectedProgress: expectedProgress,
      elapsedDay: elapsedDays,
      name: data[1],
			realData: data,
			disable: disable
    }

    returnData.tooltip = typeof this.tooltip == 'function' ? this.tooltip(returnData) : returnData.name

    return returnData;
  }

  proto.addFlag = function(color, date, note){
    var cls = moment(date, 'DD-MM-YYYY').format('DDMMYYYY'), fontColor = $.idealTextColor(color)
    if(note){
      note = '<div style="color:'+fontColor+'">'+note+'</div>'
    }
    else{
      note = ""
    }
    var target = $(this).find('.j-gantt-grid-container .'+cls);
    target.eq(0).append('<div class="j-gantt-flag" style="background:'+color+'">'+note+'</div>')
    target.not(target.eq(0)).append('<div class="j-gantt-flag" style="background:'+color+'"></div>')
  }

  proto.zoomOut = function(){
    var self = this, grid = $(this).find('> .j-table-body > table > tbody > tr .j-gantt-grid')
    if((grid.outerWidth()/2)% 1 == 0){
      grid.outerWidth(grid.outerWidth()/2)
      var gridHead = $(this).find('> .j-table-body > table > thead div:nth-child(3) .j-gantt-grid')
      gridHead.outerWidth(gridHead.outerWidth()/2)
      $(this).find('> .j-table-body > table > thead div:nth-child(2) .j-gantt-grid').each(function(i, val){
        $(val).outerWidth(parseInt($(val).attr('day'))*grid.outerWidth())
      })
      $(this).find('> .j-table-body > table > thead div:nth-child(1) .j-gantt-grid').each(function(i, val){
        $(val).outerWidth(parseInt($(val).attr('day'))*grid.outerWidth())
      })
      var scroll = $(this).find('> .j-table-body > table > tbody > tr .j-gantt-bar-scroll > div')
      scroll.outerWidth(scroll.outerWidth()/2)
      $(this).find('> .j-table-body > table > tbody > tr .j-gantt-bar').each(function(i, val){
        self.updateBar(val);
      })

      var grid = gridHead.filter(function(){
        return $(this).children(':visible').text().match('W')
      })
      if(grid.length==0)
        grid = gridHead
      if(grid[0].offsetWidth<=grid[0].scrollWidth)
        gridHead.children(':visible').hide().next().show()

      if(gridHead.eq(0).children(':visible').length==0){
        gridHead.parent().css('height', '0px')
      }
    }
  }

  proto.zoomIn = function(){
    var self = this, grid = $(this).find('> .j-table-body > table > tbody > tr .j-gantt-grid')
    grid.outerWidth(grid.outerWidth()*2)
    var gridHead = $(this).find('> .j-table-body > table > thead div:nth-child(3) .j-gantt-grid')
    gridHead.outerWidth(gridHead.outerWidth()*2)
    $(this).find('> .j-table-body > table > thead div:nth-child(2) .j-gantt-grid').each(function(i, val){
      $(val).outerWidth(parseInt($(val).attr('day'))*grid.outerWidth())
    })
    $(this).find('> .j-table-body > table > thead div:nth-child(1) .j-gantt-grid').each(function(i, val){
      $(val).outerWidth(parseInt($(val).attr('day'))*grid.outerWidth())
    })
    var scroll = $(this).find('> .j-table-body > table > tbody > tr .j-gantt-bar-scroll > div')
    scroll.outerWidth(scroll.outerWidth()*2)
    $(this).find('> .j-table-body > table > tbody > tr .j-gantt-bar').each(function(i, val){
      self.updateBar(val);
    })

    if(gridHead[0].offsetWidth>gridHead[0].scrollWidth)
      if(gridHead.children(':visible').length==0)
        gridHead.children('span:last-child').show()
      else if(gridHead.children(':visible').prev().length>0)
        gridHead.children(':visible').hide().prev().show()
    if(gridHead[0].offsetWidth<=gridHead[0].scrollWidth)
      if(gridHead.children(':visible').next().length>0)
        gridHead.children(':visible').hide().next().show()
      else
        gridHead.children().hide()

      if(gridHead.eq(0).children(':visible').length>0){
        gridHead.parent().css('height', '')
      }
  }


	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		if(jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName])
			jui2.attrChange[this.tagName.toLowerCase()+'_'+attrName](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.gantt = {
		widget: document.registerElement('j-gantt',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
;
