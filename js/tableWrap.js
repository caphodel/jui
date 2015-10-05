(function($) {

  jui2.ui.tableWrap = function(self) {
    self.enabledAttrChange.push('word-wrap');
    jui2.attrChange['word-wrap'] = function(el, oldVal, newVal) {
      if(newVal == 'true'){
        el.tableWrap = function(){
          $(el).find('> .j-table-body > table > thead > tr > th').each(function(i, val){
            $(el).find('> .j-table-body > table > colgroup > col').eq(i).width($(val).outerWidth())
          })
          $(el).find('> .j-table-body > table > tbody > tr > td').css({
            'word-wrap': 'break-word',
            'white-space': 'normal'
          });
        }
        el.tableWrap()
        $(el).on('self.afterdraw', el.tableWrap);
      }
      else{
        $(el).find('> .j-table-body > table > tbody > tr > td').css({
          'word-wrap': '',
          'white-space': ''
        });
        $(el).unbind('self.afterdraw', el.tableWrap);
      }
    }
  }

  jui2.ui.table.extension.push(jui2.ui.tableWrap)

}(jQuery))
