this["jui2"] = this["jui2"] || {};
this["jui2"]["tmpl"] = this["jui2"]["tmpl"] || {};

this["jui2"]["tmpl"]["calendar"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "			<th>"
    + this.escapeExpression(((helper = (helper = helpers['short'] || (depth0 != null ? depth0['short'] : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"short","hash":{},"data":data}) : helper)))
    + "</th>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<table cellspacing=\"0px\">\r\n	<thead>\r\n		<tr>\r\n			<th><i class=\"fa fa-chevron-left\" style=\"position:static;\"></i>&nbsp;</th>\r\n			<th colspan=\"5\" style=\"width: 180px;\">"
    + this.escapeExpression(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"month","hash":{},"data":data}) : helper)))
    + "</th>\r\n			<th>&nbsp;<i class=\"fa fa-chevron-right\" style=\"position:static;\"></i></th>\r\n		</tr>\r\n		<tr>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.day : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tr>\r\n	</thead>\r\n	<tbody>\r\n	</tbody>\r\n</table>";
},"useData":true});

this["jui2"]["tmpl"]["calendarBody"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<tr>\r\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</tr>\r\n";
},"2":function(depth0,helpers,partials,data) {
    return "	<td>"
    + this.escapeExpression(this.lambda(depth0, depth0))
    + "</td>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.date : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["jui2"]["tmpl"]["comboToolbar"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<j-toolbar><j-spacer></j-spacer><j-textfield icon=\"fa-search\"></j-textfield></j-toolbar>";
},"useData":true});

this["jui2"]["tmpl"]["dataView"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "			<tr>\r\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "			</tr>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "				<td>"
    + ((stack1 = this.lambda(depth0, depth0)) != null ? stack1 : "")
    + "</td>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"j-table-body\">\r\n	<table>\r\n		<tbody>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "		</tbody>\r\n	</table>\r\n</div>";
},"useData":true});

this["jui2"]["tmpl"]["dataViewData"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "<tr>\r\n"
    + ((stack1 = helpers.each.call(depth0,depth0,{"name":"each","hash":{},"fn":this.program(2, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</tr>\r\n";
},"2":function(depth0,helpers,partials,data) {
    var stack1;

  return "	<td>"
    + ((stack1 = this.lambda(depth0, depth0)) != null ? stack1 : "")
    + "</td>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.data : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["jui2"]["tmpl"]["hslider"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<i class=\"fa fa-caret-left\"></i><div></div><i class=\"fa fa-caret-right\"></i>\r\n";
},"useData":true});

this["jui2"]["tmpl"]["mask"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"j-disable "
    + this.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"id","hash":{},"data":data}) : helper)))
    + "\"></div>";
},"useData":true});

this["jui2"]["tmpl"]["pagination"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<i class=\"fa fa-angle-left\"></i>\r\n<j-textfield class=\"j-gotopage\">Page</j-textfield>\r\n<span class=\"j-pageof\">of&nbsp;</span>\r\n<i class=\"fa fa-angle-right\"></i>\r\n<j-combofield class=\"j-itemPerPage\" value=\"10\">\r\n<j-table>\r\n  [[\"Items per page\"],[10],[25],[50],[100],[200]]\r\n</j-table>\r\n</j-combofield>\r\n<span>items per page</span>\r\n<i class=\"fa fa-refresh\"></i>\r\n<j-spacer></j-spacer>\r\n<span class=\"j-total\">0 items</span>\r\n";
},"useData":true});

this["jui2"]["tmpl"]["rightMenu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["jui2"]["tmpl"]["scroll"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div style=\"width:100%; display:block;\">\r\n	<div style=\"display: block; height: 0px;\">&nbsp;</div>\r\n</div>";
},"useData":true});

this["jui2"]["tmpl"]["tableForm"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div>\r\n</div>\r\n<j-toolbar>\r\n	<j-spacer>\r\n	</j-spacer>\r\n	<j-button class=\"j-table-form-cancel\">"
    + alias3(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"cancel","hash":{},"data":data}) : helper)))
    + "</j-button>\r\n	<j-button class=\"j-table-form-submit\" color=\"blue\">"
    + alias3(((helper = (helper = helpers.submit || (depth0 != null ? depth0.submit : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"submit","hash":{},"data":data}) : helper)))
    + "</j-button>\r\n</j-toolbar>";
},"useData":true});

this["jui2"]["tmpl"]["tableHeader"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1;

  return "		<th><div>"
    + ((stack1 = this.lambda(depth0, depth0)) != null ? stack1 : "")
    + "<div class=\"j-table-sort\"></div><j-resize drag=\"true\" direction=\"horizontal\"></j-resize></div></th>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return "<thead>\r\n	<tr>\r\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.columns : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "	</tr>\r\n</thead>\r\n";
},"useData":true});

this["jui2"]["tmpl"]["tableInPlaceForm"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<j-toolbar>\r\n	<j-spacer>\r\n	</j-spacer>\r\n	<j-button class=\"j-table-form-cancel\">"
    + alias3(((helper = (helper = helpers.cancel || (depth0 != null ? depth0.cancel : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"cancel","hash":{},"data":data}) : helper)))
    + "</j-button>\r\n	<j-button class=\"j-table-form-submit\" color=\"blue\">"
    + alias3(((helper = (helper = helpers.submit || (depth0 != null ? depth0.submit : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"submit","hash":{},"data":data}) : helper)))
    + "</j-button>\r\n</j-toolbar>";
},"useData":true});

this["jui2"]["tmpl"]["textArea"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return ": ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing;

  return "<label>"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</label>"
    + ((stack1 = (helpers.isnt || (depth0 && depth0.isnt) || alias1).call(depth0,(depth0 != null ? depth0.label : depth0),"",{"name":"isnt","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<textarea></textarea>";
},"useData":true});

this["jui2"]["tmpl"]["textField"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return ": ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function";

  return "<label>"
    + ((stack1 = ((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"label","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</label>"
    + ((stack1 = (helpers.isnt || (depth0 && depth0.isnt) || alias1).call(depth0,(depth0 != null ? depth0.label : depth0),"",{"name":"isnt","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<input type=\""
    + this.escapeExpression(((helper = (helper = helpers.type || (depth0 != null ? depth0.type : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"type","hash":{},"data":data}) : helper)))
    + "\"></input>";
},"useData":true});