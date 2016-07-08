
var min_loading_time = 2000;
var transition_time = 250;

var current_mode = 'all'; // 'match', 'distinct', 'unknown' or 'all'

var no_record_message = 'What whut, no records left!';
/**********************
	USER INTERFACE
**********************/

function create_table_pair(linkbox, id, match_class){
	// Function to create html tables
	// Useful for inserting in page


	if (!match_class){
		match_class = 'unknown';
	}

	// console.log(records)

	var table_str = '<table style="display:none;" id="' + id + '" class="' + match_class + '" >'; 

	// add header
	table_str += '<tr>';
	$.each(linkbox, function(_, td){
		if (td.description_source){
			table_str += '<th>' + td.description_source + '</th>';
		} else {
			table_str += '<th class="blank-cell"></th>';
		}
	});

	table_str += '</tr>'		

	// add source
	table_str += '<tr>'
	$.each(linkbox, function(_, td){
		if (td.value_source){
			table_str += '<td>' + td.value_source + '</td>';
		} else {
			table_str += '<td></td>';
		}
	});
	table_str += '</tr>'		

	// add target
	table_str += '<tr>'
	$.each(linkbox, function(_, td){
		if (td.value_target){
			table_str += '<td>' + td.value_target + '</td>';
		} else {
			table_str += '<td></td>';
		}
	});
	table_str += '</tr>'

	// add header
	table_str += '<tr>'
	$.each(linkbox, function(_, td){
		if (td.description_target){
			table_str += '<th>' + td.description_target + '</th>';
		} else {
			table_str += '<th class="blank-cell></th>';
		}
	});
	table_str += '</tr>';

	// end table
	table_str += '</table>';

	return table_str
}

function count_matches(){
	a = $('#content').find('table.match');

	return a.length
}

function count_non_matches(){
	a = $('#content').find('table.distinct');

	return a.length
}

function count_unknown(){
	a = $('#content').find('table.unknown');

	return a.length
}

function onchange(){

	m = count_matches();
	u = count_non_matches();
	q = count_unknown();

	// Update the html text
	$('#matchbutton span').text(m);
	$('#nonmatchbutton span').text(u);
	$('#unknownbutton span').text(count_unknown());
	$('#allbutton span').text(m+u+q);

}

function get_internal_pair_id(tree_i, link_i){
	return 'pair_' + tree_i.toString() + '_' + link_i.toString()
}

/**********************
        INTERNAL
**********************/

function get_record(tree, _document, _id){

	var record;
	$.each(tree['records'], function(_, record_i){

		if ((record_i._document == _document) & (record_i._id == _id)){
			record = record_i;
		}
	});

	return record
};

function start(){

	// starting message
	$('#loading').fadeOut(600, function(){

		navigation();

		// start at keypress
		$('#press_key').fadeIn(600);
	
		// Add a key listener to start
		$(document).one( "keydown", function() {

			// Remove the message and start comparing
			console.log('Start with reviewing the first record pair.')

			onchange();

			$('#press_key').fadeOut(600, function(){
				iterate(first_pair());
			});
		})
	});
}

function iterate(table){

	// console.log(table)

	if (table.length !== 0){

		table.fadeIn(transition_time);
		// table.attr('class', '.selected');

	    var previousScroll = 0;
	    
	    $(window).scroll(function () {
	       var currentScroll = $(this).scrollTop();
	       if (currentScroll > previousScroll){
	           alert('down');
					onchange();

					// get next pair
					iterate(next_pair(table));      
					 }
	       else {
	          alert('up');
					onchange();

					// get next pair
					iterate(prev_pair(table));      
					 }
	       previousScroll = currentScroll;
	    });

		$('#is_match_button, #is_distinct_button, #is_unknown_button').click(function(){

			// unbind click and keys
			$(document).unbind('keydown');
			$('#is_match_button, #is_distinct_button, #is_unknown_button').unbind("click");

			console.log("clicked");
			var bc = $(this).attr('id');
			// clear warning
			warning("");

			// remove table
			table.fadeOut(transition_time,  function(){

				if (bc === "is_match_button"){
					// match (right)
					console.log('Classified as match ' + table.attr('id'));

					table.removeClass().addClass('match');
					onchange();

					// get next pair
					iterate(next_pair(table));

				} else if (bc === "is_distinct_button"){
					// distinct (left)
					console.log('Classified as distinct ' + table.attr('id'));

					table.removeClass().addClass('distinct');
					onchange();

					iterate(next_pair(table));

				} else if (bc === "is_unknown_button"){
					// next
					console.log('Next pair ' + table.attr('id'));

					// get next pair
					iterate(next_pair(table));

				} 
			});
		});


		$(document).keydown(function(event){

			var kc = event.keyCode;

			// General keycodes for all correct keys
			if (kc === 37 || kc === 38 || kc === 39 || kc === 40 || kc === 191){

				// clear keydown event listener
				$(document).unbind('keydown');
				$('#is_match_button, #is_distinct_button, #is_unknown_button').unbind("click");

				// clear warning
				warning("");

				// remove table
				table.fadeOut(transition_time,  function(){

					if (kc === 39){
						// match (right)
						console.log('Classified as match ' + table.attr('id'));

						table.removeClass().addClass('match');
						onchange();

						// get next pair
						iterate(next_pair(table));

					} else if (kc === 37){
						// distinct (left)
						console.log('Classified as distinct ' + table.attr('id'))

						table.removeClass().addClass('distinct');
						onchange();

						iterate(next_pair(table));

					} else if ((kc === 191) ){
						console.log('Classified as unknown ' + table.attr('id'))

						table.removeClass().addClass('unknown');
						onchange();
						
						// get next pair
						iterate(next_pair(table));

					} else if (kc === 38){
						// previous
						console.log('Previous pair ' + table.attr('id'))

						// get next pair
						iterate(prev_pair(table));

					} else if (kc === 40){
						// next 
						console.log('Next pair ' + table.attr('id'))

						// get next pair
						iterate(next_pair(table));

					} 				

				});
			} else {
				// unknown key
				console.log("Unknown key")
				warning("Unknown key used. See the <a href='https://github.com/J535D165/recordlinkage-review' target='_blank'>documentation</a>.")
			}
		})
	} else {
		// last record in list
		console.log("Last record")
		$('#last').fadeIn(transition_time);
	}
}

function next_pair(table){


	var s = 'table';

	if (current_mode !== 'all'){
		s = 'table.' + current_mode
	}

	return table.next(s);
}

function first_pair(){


	var s = '';

	if (current_mode !== 'all'){
		s = '.' + current_mode
	}

	// console.log($('#content table.unknown:first'));
	
	return $('#content table' + s).first();
}

function prev_pair(table){
	if (current_mode === 'all'){
		return table.prev('table')
	} else {
		return table.prev('table.' + current_mode)
	}
}

// function classify_as_match(table){

// }

// function classify_as_distinct(){
	
// }

// function classify_as_unknown(){
	
// }

function warning(msg){

	console.log("Warning: " + msg);

	if (msg !== ""){
		$('#warning p').html(msg);
		$('#warning').show();
	} else{
		$('#warning p').html("")
		$('#warning').hide();
	}
	
}

function is_valid(json){
	return true
}

function btn_matches(){
	console.log("testttt")
}

function navigation(){

	// console.log('#' + current_mode + 'button');
	// console.log($('#' + current_mode + 'button a'));

	$('#allbutton a').addClass('active'); 

	$(".navbutton").click(function(){

		// clear keydown event listener
		$(document).unbind('keydown');

		var button_clicked = $(this).attr('id');

		console.log("Button clicked: " + button_clicked);

		if (button_clicked === 'nonmatchbutton'){
			current_mode = 'distinct';
			$('#navigation a').removeClass('active');
			$('#nonmatchbutton a').addClass('active');
		} else if (button_clicked === 'matchbutton'){
			current_mode = 'match';
			$('#navigation a').removeClass('active');
			$('#matchbutton a').addClass('active');
		} else if (button_clicked === 'unknownbutton'){
			current_mode = 'unknown';
			$('#navigation a').removeClass('active');
			$('#unknownbutton a').addClass('active');
		} else if (button_clicked === 'allbutton'){
			current_mode = 'all';
			$('#navigation a').removeClass('active');
			$('#allbutton a').addClass('active');

		}

		// stop comparing, fade out
		$.when($('#content').children().fadeOut(transition_time)).done(function(){

			// console.log('test')

			iterate(first_pair());
		});
		
	});

}

$(document).ready(function(){

    var previousScroll = 0;

	var d = new Date();
	var starttime = d.getTime();

	// load the data
	$.ajax({
		url: "data.json",
		dataType: "json",
		success: function(data){
			// console.log(data)

			// // Initialize
			// onchange();

			forest = data['forest'];
			trees = forest['tree'];

			// console.log(trees)

			if (!is_valid(data)){
				alert('Problem with the data! Fix this first.');
			}

			$.each(trees, function(tree_i, tree){

				$.each(tree['links'], function(link_i, link){

					is_match = link._match;

					rec_source = get_record(tree, link.source._document, link.source._id);
					rec_target = get_record(tree, link.target._document, link.target._id)

					// console.log(rec_source)
					// console.log(link.compare)

					var linkbox = [];

					$.each(link.compare, function(_, c){

						// console.log(c._source);
						try{
							value_source = rec_source.field[c._source].value;
						} catch(err){
							value_source = null;
						}
						try{
							description_source = rec_source.field[c._source]._description;
						} catch(err) {
							description_source = null;
						}

						try{
							value_target = rec_target.field[c._target].value;
						} catch(err){
							value_target = null;
						}

						try{
							description_target = rec_target.field[c._target]._description;
						} catch(err){
							description_target = null;
						}

						compare = c.value;

						linkbox.push({
							'value_source': value_source,
							'description_source': description_source,
							'value_target': value_target,
							'description_target': description_target,
							'compare': compare
						});

					});

					console.log(linkbox);

					$('#content').append(create_table_pair(linkbox, get_internal_pair_id(tree_i, link_i), is_match));
					// foo(linkbox, tree_i, link_i);
				});

			});

			// Let the linking begin
			if ((d.getTime() - starttime) < min_loading_time){
				setTimeout(function(){
					start();
				}, min_loading_time);
			} else{
				start();
			}
		},
		error: function(){
			console.log('Error loading the file.');
		}
	});


});

(function () {
    var previousScroll = 0;


    
    $('#content').scroll(function () {
    	console.log('test')

       var currentScroll = $(this).scrollTop();
       if (currentScroll > previousScroll){
           alert('down');
       }
       else {
          alert('up');
       }
       previousScroll = currentScroll;
    });
}());


