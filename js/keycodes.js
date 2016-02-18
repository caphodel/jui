
(function($){
	jui2.nextChar = function (c) {
		return String.fromCharCode(c.charCodeAt(0) + 1);
	}

	jui2.keycodes = {
		'backspace': 8,
		'tab': 9,
		'enter': 13,
		'enter': 16,
		'ctrl': 17,
		'alt': 18,
		'pause/break': 19,
		'capslock': 20,
		'esc': 27, 'escape': 27,
		'space': 32,
		'pageup': 33,
		'pagedown': 34,
		'end': 35,
		'home': 36,
		'left': 37,
		'up': 38,
		'right': 39,
		'down': 40,
		'printscreen': 44,
		'insert': 45, 'ins' : 45,
		'delete': 46, 'del' : 46,
		'0' : 48,
		'1' : 49,
		'2' : 50,
		'3' : 51,
		'4' : 52,
		'5' : 53,
		'6' : 54,
		'7' : 55,
		'8' : 56,
		'9' : 57,
		'a' : 65,
		'b' : 66,
		'c' : 67,
		'd' : 68,
		'e' : 69,
		'f' : 70,
		'g' : 71,
		'h' : 72,
		'i' : 73,
		'j' : 74,
		'k' : 75,
		'l' : 76,
		'm' : 77,
		'n' : 78,
		'o' : 79,
		'p' : 80,
		'q' : 81,
		'r' : 82,
		's' : 83,
		't' : 84,
		'u' : 85,
		'v' : 86,
		'w' : 87,
		'x' : 88,
		'y' : 89,
		'z' : 90,
		'96' : 96,
		'97' : 97,
		'98' : 98,
		'99' : 99,
		'100' : 100,
		'101' : 101,
		'102' : 102,
		'103' : 103,
		'104' : 104,
		'105' : 105,
		'106' : 106,
		'107' : 107,
		'108' : 108,
		'109' : 109,
		'110' : 110,
		'111' : 111,
		'.' : 190
	}

	jui2.keycodes.bind = function(el, keycodes){
		keycodes = keycodes.replace(/\s+/g, '')
		keycodes = '["'+keycodes.replace(/,/g, '","').replace(/\"\[/g,'["').replace(/(\]\")/g,'"]')+'"]'
		keycodes = keycodes.replace(/(\]\")/g,'"]')
		keycodes = eval(keycodes)
		var tmp = []
		$.each(keycodes, function(i, val){
			if(typeof val == 'object')
				if(isNaN(val[0])){
					var first = val[0].lowerCase(), last = val[1].lowerCase()
					while(first!=last){
						tmp.push(jui2.keycodes[first])
						first = jui2.nextChar(first)
					}
					tmp.push(jui2.keycodes[first])
				}
				else{
					for(var z = parseInt(val[0]);z<=parseInt(val[1]);z++){
						tmp.push(jui2.keycodes[z])
					}
				}
			else
				tmp.push(jui2.keycodes[val])
		})
		var ctrlDown = false,
		ctrlKey = 17, vKey = 86, cKey = 67, xKey = 88;
		$(el).keydown(function (e) {
			if(e.keyCode == ctrlKey){
				ctrlDown = true;
			}else{
				if(ctrlDown && (e.keyCode == vKey || e.keyCode == cKey || e.keyCode == xKey)){
					return;
				}
				else{
					if($.inArray(e.keyCode, tmp)>=0){
						return
					}
					else
						e.preventDefault();
				}
			}
		}).keyup(function(e){
      if (e.keyCode == ctrlKey) ctrlDown = false;
    });
	}
}(jQuery));
