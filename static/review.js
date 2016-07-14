
var min_loading_time = 2000;
var transition_time = 250;

var current_mode = 'all'; // 'match', 'distinct', 'unknown' or 'all'

var no_record_message = 'What whut, no records left!';

/**********************
	USER INTERFACE
**********************/

function create_table_pair(link, source, target){
	// Function to create html tables
	// Useful for inserting in page

	if (!link._match){
		match_class = 'unknown';
	} else{
		match_class = link._match;
	}

	// console.log(records)

	th_source = [];
	td_source = [];
	td_target = [];
	th_target = [];

	$.each(link.compare, function(_, c){

		if ((c._source in source) ){
			th_source.push('<th>' + c._source + '</th>');
		} else{
			th_source.push('<th class="blank-cell"></th>');
		}

		if ((c._source in source) ){
			td_source.push('<td>' + source[c._source] + '</td>');
		} else {
			td_source.push('<td></td>');
		}

		if ((c._target in target) ){
			td_target.push('<td>' + target[c._target] + '</td>');
		} else {
			td_target.push('<td></td>');
		}

		if ((c._target in target) ){
			th_target.push('<th>' + c._target + '</th>');
		} else{
			th_target.push('<th class="blank-cell"></th>');
		}

	});

	var table_str = '<table>' + '<tr>' + th_source.join("") + '</tr>' + '<tr>' + td_source.join("") + '</tr>' + '<tr>' + td_target.join("") + '</tr>' + '<tr>' + th_target.join("") + '</tr>' + '</table>';

	table = $(table_str);
	table.hide();
	table.addClass(match_class);

	return table
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
	$('#matchbutton span').text(m).fadeIn(600);
	$('#nonmatchbutton span').text(u).fadeIn(600);
	$('#unknownbutton span').text(count_unknown()).fadeIn(600);
	$('#allbutton span').text(m+u+q).fadeIn(600);

}

function warning(msg){

	if (msg !== ""){
		console.log("Warning: " + msg);

		$('#warning p').html(msg);
		$('#warning').show();
	} else{
		$('#warning p').html("")
		$('#warning').hide();
	}
	
}

/**********************
        INTERNAL
**********************/

// function get_record(tree, _document, _id){

// 	var record;
// 	$.each(tree['records'], function(_, record_i){

// 		if ((record_i._document == _document) & (record_i._id == _id)){
// 			record = record_i;
// 		}
// 	});

// 	return record
// };


function start(){

	// starting message
	$('#loading').fadeOut(600, function(){

		navigation();

		// start at keypress
		$('#press_key').fadeIn(600);

		$("#download-btn").click(function(){
			this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(download())
		});

		// Add a key listener to start
		$(document).one( "keydown", function() {

			// Remove the message and start comparing
			console.log('Start with reviewing the first record pair.')

			onchange();

			$('#press_key').fadeOut(600, function(){

				// start with first record
				iterate(first_pair());
			});
		})
	});
}

function download(){

	result_str = "id1,id2,class \n"

	$('#content table').each(function(){

		result_str += [
			$(this).data("sourceID").toString(), 
			$(this).data("targetID").toString(), 
			$(this).attr("class").toString()
			].join() + "\n"
	});

	return result_str
}

// show pair (visual and bindings) --> classify (give class) --> hide pair ()

function show_pair(table){

}

function iterate(table){

	// console.log(table)

	if (table.length !== 0){

		table.add('#classification').fadeIn(transition_time);

		if (table.hasClass('unknown')){
			$('#is_unknown_button').addClass('activebutton')
		}

		$('#is_match_button, #is_distinct_button, #is_unknown_button').click(function(){

			// disable controls
			disable_controls();

			// clear warning
			warning("");

			var bc = $(this).attr('id');

			// remove table
			table.add('#classification').fadeOut(transition_time,  function(){

				if (bc === "is_match_button"){

					table.removeClass().addClass('match');
					$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass();
					$('#is_match_button').addClass('selected');

					onchange();

					// get next pair
					iterate(next_pair(table));

				} else if (bc === "is_distinct_button"){

					table.removeClass().addClass('distinct');
					$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass();
					$('#is_distinct_button').addClass('selected');

					onchange();

					iterate(next_pair(table));

				} else if (bc === "is_unknown_button"){

					table.removeClass().addClass('unknown');
					$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass();
					$('#is_unknown_button').addClass('selected');

					onchange();

					// get next pair
					iterate(next_pair(table));

				} 
			});
		});


		$(document).keydown(function(event){

			var kc = event.keyCode;

			// General keycodes for all correct keys
			if (kc === 37 || kc === 38 || kc === 39 || kc === 40 || kc === 191){

				disable_controls();

				// clear warning
				warning("");

				// remove table
				table.add('#classification').fadeOut(transition_time,  function(){

					if (kc === 39){
						// match (right)
						console.log('Classified as match ' + table.attr('id'));

						table.removeClass().addClass('match');

						// get next pair
						iterate(next_pair(table));

					} else if (kc === 37){
						// distinct (left)
						console.log('Classified as distinct ' + table.attr('id'))

						table.removeClass().addClass('distinct');

						iterate(next_pair(table));

					} else if ((kc === 191) ){
						console.log('Classified as unknown ' + table.attr('id'))

						table.removeClass().addClass('unknown');
						
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

					onchange();

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

function disable_controls(){

	// unbind click and keys
	$(document).unbind('keydown');
	$('#is_match_button, #is_distinct_button, #is_unknown_button').unbind("click");

}

// function classify_table(classification_str){

// 	// var bc = $(this).attr('id');
// 	console.log('Classified as match ' + classification_str);

// 	// remove table
// 	table.fadeOut(transition_time,  function(){

// 		if (classification_str === "match"){
// 			// match (right)

// 			table.removeClass().addClass('match');
// 			onchange();

// 			// get next pair
// 			iterate(next_pair(table));

// 		} else if (classification_str === "distinct"){
// 			// distinct (left)
// 			console.log('Classified as distinct ' + table.attr('id'));

// 			table.removeClass().addClass('distinct');
// 			onchange();

// 			iterate(next_pair(table));

// 		} else if (classification_str === "is_unknown_button"){
// 			// next
// 			console.log('Next pair ' + table.attr('id'));

// 			// get next pair
// 			iterate(next_pair(table));

// 		} 
// 	});
// }

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
		url: "../example/data.json",
		dataType: "json",
		success: function(data){

			forest = data['forest'];
			trees = forest['tree'];

			if (!is_valid(data)){
				alert('Problem with the data! Fix this first.');
			}

			$.each(trees, function(tree_i, tree){

				$.each(tree['links'], function(link_i, link){

					is_match = link._match;

					// The three things needed
					console.log(link);
					console.log(tree.source[link.source._id]);
					console.log(tree.target[link.target._id]);

					jquery_table = create_table_pair(link, tree.source[link.source._id], tree.target[link.target._id]);
					jquery_table.data("targetID", link.target._id);
					jquery_table.data("sourceID", link.source._id);

					$('#content').append(jquery_table);

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

// (function () {
//     var previousScroll = 0;


    
//     $('#content').scroll(function () {
//     	console.log('test')

//        var currentScroll = $(this).scrollTop();
//        if (currentScroll > previousScroll){
//            alert('down');
//        }
//        else {
//           alert('up');
//        }
//        previousScroll = currentScroll;
//     });
// }());

