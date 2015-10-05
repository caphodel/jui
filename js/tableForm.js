(function($){

/*********************** table form ******************************/
	var proto = Object.create(HTMLElement.prototype)
	
	proto.show = function(){
		
		var $self = $(this), $target = $($self.attr('target'))
		
		$self.appendTo($target)
		$target.children().not('.j-title').hide()
		$self.css('display', '');
		
	}
	
	proto.hide = function(){
		var $self = $(this), $target = $($self.attr('target'))
		$self.hide();
		$target.children().not(this).show()
	}
	
	proto.createdCallback = function() {
		
		var $self = $(this)
		
		for(i in jui2.method){
			this[i] = jui2.method[i];
		}
		
		var data = {
			cancel: $self.attr('cancel') || 'Cancel',
			submit: $self.attr('submit') || 'Submit'
		}
		
		this.innerHTML = jui2.tmpl['tableForm'](data);
		
		$self.find('.j-table-form-cancel').click(function(){
			$(this).parent().parent()[0].hide();
		})
		
		$self.hide();
		
	};
	
	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		/*var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);*/
	}
	
	jui2.ui.tableForm = {
		widget: document.registerElement('j-table-form',  { 
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))