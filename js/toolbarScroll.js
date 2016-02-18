
(function($) {

  jui2.ui.toolbarScroll = function(self) {
    self.enabledAttrChange.push('toolbarscroll');

    jui2.attrChange['toolbarscroll'] = function(el, oldVal, newVal) {
      if (newVal.toLowerCase() == 'true') {

    		$(self).on('DOMNodeInserted', function(){
    			var elements = $(self).find('> *:not(.toolbarscroll-left):not(.toolbarscroll-right)')
    			elements.css('margin', '0px 2px')
    		  //elements.last().css('margin-right', '20px')
    		  elements.first().css('margin-left', '20px')
    		})

        $(el).css({
          position: 'relative'
        });
        $(el).scrollLeft(0);
        $(el).append('<j-button class="toolbarscroll-left" style="margin: 0px; left: 0px;position: absolute;top: 0px; height: 100%; border: 0px; border-right: 1px solid #d8d8d8; padding-top: 8px; width: 20px; background: inherit; text-align: center;" icon="fa-caret-left"></j-button>')
        $(el).append('<j-button class="toolbarscroll-right" style="margin: 0px; right: 0px;position: absolute;top: 0px; height: 100%; border: 0px; border-left: 1px solid #d8d8d8; padding-top: 8px; width: 20px; background: inherit; text-align: center;" icon="fa-caret-right"></j-button>')
        $(el).append('<div class="toolbarscroll-right-space" style="padding-right: 16px;">&nbsp</div>')

        $(el).children('.toolbarscroll-left').css('left', $(el).scrollLeft())
        $(el).children('.toolbarscroll-right').css('right', '-' + $(el).scrollLeft().toString() + 'px')

        var timeoutId, time, mdown;
        $(el).children('.toolbarscroll-left').bind('mousedown', function() {
          time = 250
          mdown = function() {
            $(el).scrollLeft($(el).scrollLeft() - 20)
            if ($(el).scrollLeft() < 0)
              $(el).scrollLeft(0)
            $(el).children('.toolbarscroll-left').css('left', $(el).scrollLeft())
            $(el).children('.toolbarscroll-right').css('right', '-' + $(el).scrollLeft().toString() + 'px')
            if (time > 0)
              time = time - 50;
            timeoutId = setTimeout(mdown, time);
          }
          mdown()
        })
        $(el).children('.toolbarscroll-right').bind('mousedown', function() {
          time = 250
          mdown = function() {
            $(el).scrollLeft($(el).scrollLeft() + 20)
            var max = el.scrollWidth - $(el).width() + 40
            if ($(el).scrollLeft() > max)
              $(el).scrollLeft(max)
            $(el).children('.toolbarscroll-left').css('left', $(el).scrollLeft())
            $(el).children('.toolbarscroll-right').css('right', '-' + $(el).scrollLeft().toString() + 'px')
            if (time > 0)
              time = time - 50;
            timeoutId = setTimeout(mdown, time);
          }
          mdown()
        })
        $(el).on('DOMMouseScroll mousewheel', function(e){
          var wheel = 0;
          if(e.originalEvent.wheelDelta)
            wheel = e.originalEvent.wheelDelta
          if(e.originalEvent.deltaY)
            wheel = e.originalEvent.deltaY
          if(e.originalEvent.detail)
            wheel = e.originalEvent.detail

          if(wheel>0){
            $(el).scrollLeft($(el).scrollLeft() + 20)
            var max = el.scrollWidth - $(el).width() + 40
            if ($(el).scrollLeft() > max)
              $(el).scrollLeft(max)
            $(el).children('.toolbarscroll-left').css('left', $(el).scrollLeft())
            $(el).children('.toolbarscroll-right').css('right', '-' + $(el).scrollLeft().toString() + 'px')
          }
          else{
            $(el).scrollLeft($(el).scrollLeft() - 20)
            if ($(el).scrollLeft() < 0)
              $(el).scrollLeft(0)
            $(el).children('.toolbarscroll-left').css('left', $(el).scrollLeft())
            $(el).children('.toolbarscroll-right').css('right', '-' + $(el).scrollLeft().toString() + 'px')
          }

          return false;
        })

        $('body').bind('mouseup', function() {
          clearTimeout(timeoutId);
        });
      }
      else{
  			var elements = $(self).find('> *:not(.toolbarscroll-left):not(.toolbarscroll-right)')
  			elements.css('margin', '0px 2px')
      }
    }
  }

  jui2.ui.toolbar.extension.push(jui2.ui.toolbarScroll)

}(jQuery))
;