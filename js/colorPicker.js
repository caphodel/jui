/**
 * @classdesc Color picker custom web component
 * @class colorPicker
 * @example <caption>Color picker widget basic usage</caption>
 * <j-colorPicker id="date">Pick Color</j-colorPicker>
 * @augments textField
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {
		jui2.ui.base.proto.createdCallback.call(this, jui2.ui.colorPicker);

		var $self = $(this);

		this.setAttribute("icon", "fa-square");

		jui2.ui.textField.proto.createdCallback.call(this, 'Color Picker')

		$self.bind( "clickout", function(e){
			if($(e.target).parents('j-colorPicker').length == 0 && $(e.target).parents('[belongto=j-colorPicker]').length == 0)
				$('#j-colorPicker-'+$self.attr('id')).remove();
		});

		$self.click(function(e){
			if($(e.target).prop('tagName') == 'J-BUTTON'){
				$('#j-colorPicker-'+$self.attr('id')).remove();
			}
			else if($self.find('canvas').length > 0){
				if($(e.target).parents('.j-canvas-pallete').length == 0)
					$('#j-colorPicker-'+$self.attr('id')).remove();
			}
			else{
				$self.append('<div class="j-canvas-pallete"><canvas width="284" height="155"></canvas><div><div></div>Hex:<br/><input class="j-colorPallete-hex"></input><br/><br/><j-button>Pick</j-button></div></div>');
				//RGB:<br/><input class="j-colorPallete-rgb"></input>
				var $colors  = $self.find('canvas'),
				colorctx = $colors[0].getContext('2d'), colorEventX, colorEventY;

				var getColor = function(e) {
					var newColor,
					imageData = colorctx.getImageData(colorEventX, colorEventY, 1, 1), picker = $('#j-colorPicker-'+$self.attr('id'));
					//selectedColor = 'rgb(' + imageData.data[0] + ', ' + imageData.data[1] + ', ' + imageData.data[2] + ')';
					//$self.find('.j-colorPallete-rgb').val(selectedColor)
					//picker.find('.j-colorPallete-hex').val("#" + componentToHex(imageData.data[0]) + componentToHex(imageData.data[1]) + componentToHex(imageData.data[2]))
					picker.find('.j-canvas-pallete > div > div').css('background', "#" + componentToHex(imageData.data[0]) + componentToHex(imageData.data[1]) + componentToHex(imageData.data[2]));
				};

				var setColor = function(e) {
					var newColor,
					imageData = colorctx.getImageData(colorEventX, colorEventY, 1, 1), picker = $('#j-colorPicker-'+$self.attr('id'));
					//selectedColor = 'rgb(' + imageData.data[0] + ', ' + imageData.data[1] + ', ' + imageData.data[2] + ')';
					//$self.find('.j-colorPallete-rgb').val(selectedColor)
					picker.find('.j-colorPallete-hex').val("#" + componentToHex(imageData.data[0]) + componentToHex(imageData.data[1]) + componentToHex(imageData.data[2]))
					picker.find('.j-canvas-pallete > div > div').css('background', picker.find('.j-colorPallete-hex').val());
					picker.find('.j-colorPallete-hex').attr('hex', picker.find('.j-colorPallete-hex').val());
				};

				var componentToHex = function(c) {
					var hex = c.toString(16);
					return hex.length == 1 ? "0" + hex : hex;
				}

				var gradient = colorctx.createLinearGradient(0, 0, $colors.width(), 0);
				// Create color gradient
				gradient.addColorStop(0,    "rgb(255,   0,   0)");
				gradient.addColorStop(0.15, "rgb(255,   0, 255)");
				gradient.addColorStop(0.33, "rgb(0,     0, 255)");
				gradient.addColorStop(0.49, "rgb(0,   255, 255)");
				gradient.addColorStop(0.67, "rgb(0,   255,   0)");
				gradient.addColorStop(0.84, "rgb(255, 255,   0)");
				gradient.addColorStop(1,    "rgb(255,   0,   0)");
				// Apply gradient to canvas
				colorctx.fillStyle = gradient;
				colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height);

				// Create semi transparent gradient (white -> trans. -> black)
				gradient = colorctx.createLinearGradient(0, 0, 0, $colors.height());
				gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
				gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
				gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
				gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");
				// Apply gradient to canvas
				colorctx.fillStyle = gradient;
				colorctx.fillRect(0, 0, colorctx.canvas.width, colorctx.canvas.height);
				var z = jui2.findHighestZIndex()
				$colors.parent().css('z-index', z == '-Infinity' ? 100 : z);

				$self.find('.j-colorPallete-hex').val('#ffffff');
				$self.find('.j-colorPallete-hex').attr('hex', '#ffffff');

				$self.find('j-button').click(function(){
					var picker = $('#j-colorPicker-'+$self.attr('id'));
					$self.val(picker.find('.j-colorPallete-hex').attr('hex'));
					$self.find('i').css('color', picker.find('.j-colorPallete-hex').attr('hex'));
					$('#j-colorPicker-'+$self.attr('id')).remove();
				})

				$colors.mousemove(function(e) {
					colorEventX = e.pageX - $colors.offset().left;
					colorEventY = e.pageY - $colors.offset().top;
					getColor(e);
				});

				$colors.mouseout(function(e) {
					var picker = $('#j-colorPicker-'+$self.attr('id'));
					picker.find('.j-canvas-pallete > div > div').css('background', picker.find('.j-colorPallete-hex').attr('hex'));
					picker.find('.j-colorPallete-hex').val(picker.find('.j-colorPallete-hex').attr('hex'));
				});

				$colors.click(function(e) {
					colorEventX = e.pageX - $colors.offset().left;
					colorEventY = e.pageY - $colors.offset().top;
					setColor(e);
				});
				$('body').append('<j-modal belongto="j-colorPicker" snapto="#'+$self.attr('id')+' > input" snappos="topleft to bottomleft" id="j-colorPicker-'+$self.attr('id')+'"></j-modal>');
				$colors.parent().detach().appendTo('#j-colorPicker-'+$self.attr('id'))
			}
		})

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
		var enabledAttrChange = ['disabled', 'icon'];
		if(jui2.attrChange[attrName] && enabledAttrChange.indexOf(attrName) > -1)
			jui2.attrChange[attrName](this, oldVal, newVal);
	}

	jui2.ui.colorPicker = {
		widget: document.registerElement('j-colorPicker',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
