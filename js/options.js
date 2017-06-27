function main() {
	var items;
	var selector1 = $('#analizor');
	var selector2 = $('#analit');

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
				$.each(items[i].analiti, function(val, text){
					selector2.append($("</option>"), new Option(text, val));
				});
			}
		}
		if (op_sel == 'Select')
			selector2.append($('<option>', {
				value: 0,
				text: "Select"
			}));
	});
}

$(document).ready(main());
