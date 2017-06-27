function main() {
	var items;
	var selected_item;
	var selector1 = $('#analizor');
	var selector2 = $('#analit');
	
	$("#analizor_text").val("Select");
	$("#analit_text").val("Select");
	
	$.getJSON("./json/options.json", function(options) {
		for (var i = 0; i <= options.length; i++) {
			if (i == 0) {
				selector1.append($('<option>', {
					value: i,
					text: "Select"
				}));
			}
			else {
				selector1.append($('<option>', {
					value: i,
					text: options[i - 1].nume
				}));
			}
		}
		items = options;
	});
	
	selector2.append($('<option>', {
		value: 0,
		text: "Select"
	}));
	
	selector1.change(function(){	
		var op_sel = selector1.find(":selected").text();
		
		// Reset Selector 2
		$('#analit').html('');
		
		for (var i = 0; i < items.length; i++) {
			if (items[i].nume == op_sel) {
				selector2.append($('<option>', {
					value: 0,
					text: "Select"
				}));
				selected_item = items[i].analiti;
				for (var j = 0; j < selected_item.length; j++) {
					selector2.append($("<option>", {
						value: j + 1,
						text: selected_item[j].nume
					}));
				}
			}
		}
		if (op_sel == 'Select')
			selector2.append($('<option>', {
				value: 0,
				text: "Select"
			}));

		$("#analizor_text").val(op_sel);
	});
	
	selector2.change(function(){
		var seltext = selector2.find(":selected").text();
		var tip_val;
		
		if (seltext != "Select")
			tip_val = selected_item.find(x => x.nume == seltext).tip;
		else tip_val == -1;
		
		$("#analit_text").val(seltext);
		$("#tip_tabel").val(tip_val);
	});
}

$(document).ready(main());