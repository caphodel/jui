(function($) {
  jui2.drag = {
    mouseDown: false,
    draggedEl: false,
    handler: false,
    clientX: 0,
    clientY: 0,
    horizontalDrag: true,
    verticalDrag: true,
    parent: false,
    mouseMove: false
  };
  $( document ).ready(function() {
    $('body').on('mousedown', function(e){
      jui2.drag.mouseDown = true;
      jui2.drag.horizontalDrag = true;
      jui2.drag.verticalDrag = true;
      jui2.drag.mouseMove = false;
      jui2.drag.parent = false;
      if($(e.target).attr('drag')){
        jui2.drag.draggedEl = $(e.target);
      }
      else{
        var parents = $(e.target).parents('[drag]');
        if(parents.length > 0)
          jui2.drag.draggedEl = parents.eq(0);
      }

      if(jui2.drag.draggedEl){

        if(jui2.drag.draggedEl.parent().css('position')=='relative'){
          jui2.drag.parent = true;
        }
        if(jui2.drag.draggedEl.attr('horizontalDrag')=='false'){
          jui2.drag.horizontalDrag = false;
        }
        if(jui2.drag.draggedEl.attr('verticalDrag')=='false'){
          jui2.drag.verticalDrag = false;
        }

        if(jui2.drag.draggedEl.attr('drag').toLowerCase()=='true'){
          jui2.drag.handler = jui2.drag.draggedEl.add(jui2.drag.draggedEl.find('*'));
        }
        else{
          var handler = jui2.drag.draggedEl.find(jui2.drag.draggedEl.attr('drag'));
          if(handler.length > 0)
            jui2.drag.handler = handler;
        }
      }
      if(jui2.drag.handler){
        jui2.drag.clientX = e.pageX - jui2.drag.draggedEl.offset().left;
    		jui2.drag.clientY = e.pageY - jui2.drag.draggedEl.offset().top;
        if(jui2.drag.handler && (jui2.drag.handler[0] == e.target || $.inArray(e.target, jui2.drag.handler) > -1)){
          var parentScroll = $(jui2.drag.draggedEl).parents().filter(function(){
              return $(this).hasScrollBar();
          });

          if(parentScroll.length === 0 || parentScroll.prop('tagName')=='HTML'){
            parentScroll = $(window);
          }
          //jui2.drag.handler.css('cursor', 'pointer');
          jui2.drag.draggedEl.css({
            '-webkit-touch-callout': 'none',
            '-webkit-user-select': 'none',
            '-khtml-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none'
          });
          if(jui2.drag.parent)
            $(e.target).parent().append('<j-drag></j-drag>');
          else
            $('body').append('<j-drag></j-drag>');
          var dragMask = $('j-drag'), mouseX = e.clientX + parentScroll.scrollLeft(),
  		      mouseY = e.clientY + parentScroll.scrollTop();

          dragMask.css({
            width: jui2.drag.draggedEl.outerWidth(),
            height: jui2.drag.draggedEl.outerHeight(),
            'z-index': jui2.findHighestZIndex()
          }).offset({top: mouseY-jui2.drag.clientY, left: mouseX-jui2.drag.clientX});
          jui2.drag.draggedEl.triggerHandler('dragstart', [{x: jui2.drag.draggedEl.offset().left, y: jui2.drag.draggedEl.offset().top}]);
        }
      }
    }).on('mouseup', function(e){
      if(jui2.drag.handler && jui2.drag.mouseDown && $('j-drag').length > 0 && jui2.drag.mouseMove){
        var parentScroll = $(jui2.drag.draggedEl).parents().filter(function(){
            return $(this).hasScrollBar();
        }), dragMask = $('j-drag');

        if(parentScroll.length === 0 || parentScroll.prop('tagName')=='HTML'){
          parentScroll = $(window);
        }
        var mouseX = e.clientX + parentScroll.scrollLeft(),
    		mouseY = e.clientY + parentScroll.scrollTop();

        if(!jui2.drag.verticalDrag){
          jui2.drag.draggedEl.offset({top: dragMask.offset().top, left: mouseX-jui2.drag.clientX});
          jui2.drag.draggedEl.triggerHandler('dragend', [{x: dragMask.offset().left, y: dragMask.offset().top}]);
        }
        else if(!jui2.drag.horizontalDrag){
          jui2.drag.draggedEl.offset({top: mouseY-jui2.drag.clientY, left: dragMask.offset().left});
          jui2.drag.draggedEl.triggerHandler('dragend', [{x: dragMask.offset().left, y: mouseY-jui2.drag.clientY}]);
        }
        else{
          jui2.drag.draggedEl.offset({top: mouseY-jui2.drag.clientY, left: mouseX-jui2.drag.clientX});
          jui2.drag.draggedEl.triggerHandler('dragend', [{x: mouseX-jui2.drag.clientX, y: mouseY-jui2.drag.clientY}]);
        }
        //jui2.drag.draggedEl.triggerHandler('dragend', [{x: mouseX-jui2.drag.clientX, y: mouseY-jui2.drag.clientY}]);
        //jui2.drag.draggedEl.offset({top: mouseY-jui2.drag.clientY, left: mouseX-jui2.drag.clientX})
        jui2.drag.draggedEl.css({
          '-webkit-touch-callout': '',
          '-webkit-user-select': '',
          '-khtml-user-select': '',
          '-moz-user-select': '',
          '-ms-user-select': '',
          'user-select': ''
        });
      }
      jui2.drag.mouseDown = false;
      jui2.drag.draggedEl = false;
      jui2.drag.handler = false;
      $('j-drag').remove();
    }).on('mousemove', function(e){
      if(jui2.drag.handler && jui2.drag.mouseDown){
        jui2.drag.mouseMove = true;
        var parentScroll = $(jui2.drag.draggedEl).parents().filter(function(){
            return $(this).hasScrollBar();
        });

        if(parentScroll.length === 0 || parentScroll.prop('tagName')=='HTML'){
          parentScroll = $(window);
        }
        var mouseX = e.clientX + parentScroll.scrollLeft(),
    		mouseY = e.clientY + parentScroll.scrollTop(),
        dragMask = $('j-drag');
        if(!jui2.drag.verticalDrag){
          dragMask.offset({top: dragMask.offset().top, left: mouseX-jui2.drag.clientX});
          jui2.drag.draggedEl.triggerHandler('dragmove', [{x: dragMask.offset().left, y: dragMask.offset().top}]);
        }
        else if(!jui2.drag.horizontalDrag){
          dragMask.offset({top: mouseY-jui2.drag.clientY, left: dragMask.offset().left});
          jui2.drag.draggedEl.triggerHandler('dragmove', [{x: dragMask.offset().left, y: mouseY-jui2.drag.clientY}]);
        }
        else{
          dragMask.offset({top: mouseY-jui2.drag.clientY, left: mouseX-jui2.drag.clientX});
          jui2.drag.draggedEl.triggerHandler('dragmove', [{x: mouseX-jui2.drag.clientX, y: mouseY-jui2.drag.clientY}]);
        }
      }
    });
  });
})(jQuery);
