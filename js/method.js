jui2.method = {
	disable : function(el){
		self = el || this
		self.className += ' j-disable';
	},
	enable: function(el){
		self = el || this
		self.className = self.className.replace( /(?:^|\s)j-disable(?!\S)/g , '' )
	}
}