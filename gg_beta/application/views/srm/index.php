<j-combofield id="">Status
	<j-table>
		[["", "Status"], [0, "Open"], [1, "Closed"]]
	</j-table>
</j-combofield>
<j-combofield id="department">Department from
	<j-table>
		[
			["", "Department"],
			["EL", "Electrical"],
			["ES", "Supporting Electronic and Electrical"],
			["PD", "Primary Automation Development"],
			["PO", "Primary Electronic Operations"],
			["SE", "Secondary Electronic Operations"],
			["SD", "Secondary Automation Development"]
		]
	</j-table>
</j-combofield>
<j-combofield id="department"> to
	<j-table>
		[
			["", "Department"],
			["EL", "Electrical"],
			["ES", "Supporting Electronic and Electrical"],
			["PD", "Primary Automation Development"],
			["PO", "Primary Electronic Operations"],
			["SE", "Secondary Electronic Operations"],
			["SD", "Secondary Automation Development"]
		]
	</j-table>
</j-combofield><br/>
<j-button id="search">Search</j-button>
<br/>
<br/>
<j-table id="srm_table">
	<j-loader src="http://gggmpscdweb02/data/srmRelation.php?callback=?"></j-loader>
	[["SRM", "Feasibility Study", "Design", "Material Req.", "Installation"]]

	<j-custom target="0">
		function(record){
			return '<a href="http://gggmpscdweb02/redmine/issues/'+record[0]+'">#'+record[0]+' - '+record[9]+'</a>';
		}
	</j-custom>

	<j-custom target="1">
		function(record){
			return '<a href="http://gggmpscdweb02/redmine/issues/'+record[1]+'">'+record[2]+'</a>';
		}
	</j-custom>

	<j-custom target="2">
		function(record){
			return '<a href="http://gggmpscdweb02/redmine/issues/'+record[3]+'">'+record[4]+'</a>';
		}
	</j-custom>

	<j-custom target="3">
		function(record){
			return '<a href="http://gggmpscdweb02/redmine/issues/'+record[5]+'">'+record[6]+'</a>';
		}
	</j-custom>

	<j-custom target="4">
		function(record){
			return '<a href="http://gggmpscdweb02/redmine/issues/'+record[7]+'">'+record[8]+'</a>';
		}
	</j-custom>
	<j-pagination></j-pagination>
</j-table>
