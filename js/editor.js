/**
 * @classdesc WYSIWYG editor custom web component
 * @class editor
 * @example <caption>Editor basic usage</caption>
 * <j-editor>Editor</j-editor>
 * @augments textArea
 */
(function($) {

  var proto = Object.create(HTMLElement.prototype)

  proto.createdCallback = function() {

    jui2.ui.textArea.proto.createdCallback.call(this, '', 'text');

    $(this).find('textarea').wysiwyg({
      toolbar: 'top-selection',
      buttons: {
        bold: {
          title: 'Bold (Ctrl+B)',
          image: '\uf032', // <img src="path/to/image.png" width="16" height="16" alt="" />
          hotkey: 'b'
        },
        italic: {
          title: 'Italic (Ctrl+I)',
          image: '\uf033', // <img src="path/to/image.png" width="16" height="16" alt="" />
          hotkey: 'i'
        },
        underline: {
          title: 'Underline (Ctrl+U)',
          image: '\uf0cd', // <img src="path/to/image.png" width="16" height="16" alt="" />
          hotkey: 'u'
        },
        strikethrough: {
          title: 'Strikethrough (Ctrl+S)',
          image: '\uf0cc', // <img src="path/to/image.png" width="16" height="16" alt="" />
          hotkey: 's'
        },
        forecolor: {
          title: 'Text color',
          image: '\uf1fc' // <img src="path/to/image.png" width="16" height="16" alt="" />
        },
        highlight: {
          title: 'Background color',
          image: '\uf043' // <img src="path/to/image.png" width="16" height="16" alt="" />
        },
        /*alignleft: {
          title: 'Left',
          image: '\uf036', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },
        aligncenter: {
          title: 'Center',
          image: '\uf037', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },
        alignright: {
          title: 'Right',
          image: '\uf038', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },
        alignjustify: {
          title: 'Justify',
          image: '\uf039', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },*/
        subscript: {
          title: 'Subscript',
          image: '\uf12c', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: true // wanted on selection
        },
        superscript: {
          title: 'Superscript',
          image: '\uf12b', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: true // wanted on selection
        },
        /*indent: {
          title: 'Indent',
          image: '\uf03c', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },
        outdent: {
          title: 'Outdent',
          image: '\uf03b', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },
        orderedList: {
          title: 'Ordered list',
          image: '\uf0cb', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },
        unorderedList: {
          title: 'Unordered list',
          image: '\uf0ca', // <img src="path/to/image.png" width="16" height="16" alt="" />
          //showstatic: true,    // wanted on the toolbar
          showselection: false // wanted on selection
        },*/
        removeformat: {
          title: 'Remove format',
          image: '\uf12d' // <img src="path/to/image.png" width="16" height="16" alt="" />
        }
      }
    });

		/* getter/setter */
		Object.defineProperty(this.__proto__, 'value', {
			configurable: true,
			get: function(){
				if($(this).find('.wysiwyg-editor')[0])
					return $(this).find('.wysiwyg-editor').html();
				else
					return '';
			},
			set: function(value){
				if($(this).find('.wysiwyg-editor')[0])
					$(this).find('.wysiwyg-editor').html(value);
			}
		});

  };

  proto.attributeChangedCallback = function(attrName, oldVal, newVal) {
		var attr = this.tagName.toLowerCase()+'_'+attrName;
		if(jui2.attrChange[attr])
			jui2.attrChange[attr](this, oldVal, newVal);
    else if(jui2.attrChange[attrName] && this.enabledAttrChange.indexOf(attrName) > -1)
      jui2.attrChange[attrName](this, oldVal, newVal);
  }

  jui2.ui.editor = {
    widget: document.registerElement('j-editor', {
      prototype: proto
    }),
    proto: proto
  }

}(jQuery));
