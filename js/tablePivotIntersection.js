/**
 * Used automatically by tablePivotLeft/tablePivotTop if a table have both of them
 * @classdesc Pivot intersection extension for table widget
 * @class pivotIntersection @extension table
 */
(function($){

	var proto = Object.create(HTMLElement.prototype)

	proto.createdCallback = function() {

	};

	proto.attributeChangedCallback = function(attrName, oldVal, newVal){
	}

	jui2.ui.tablePivotIntersection = {
		widget: document.registerElement('j-table-pivot-intersection',  {
			prototype: proto
		}),
		proto: proto
	}

}(jQuery))
