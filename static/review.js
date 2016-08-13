// SETTINGS
var min_loading_time = 2000;
var transition_time = 250;

var current_mode = 'all'; // 'match', 'distinct', 'unknown' or 'all'

var no_record_message = 'What whut, no records (left)!';

// INTERNALS
var started = false;

var settings = Object;

var datasets = Object;

/**********************
	USER INTERFACE
**********************/


function create_table(link, source, target){
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

function update_counts(){

	m = count_matches();
	u = count_non_matches();
	q = count_unknown();

	// Update the html text
	$('#matchbutton span').text(m).fadeIn(600);
	$('#nonmatchbutton span').text(u).fadeIn(600);
	$('#unknownbutton span').text(count_unknown()).fadeIn(600);
	$('#allbutton span').text(m+u+q).fadeIn(600);

}

function message(msg){
	$('#message').html(msg);
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

function error(msg) {
	if (msg){
		return "Error: " + msg
	} else {
		return "An error occured!"
	}
}

/**********************
        API
**********************/

function start(){

	// starting message
	$('#message').fadeOut(600, function(){

		navigation();

		// start at keypress
		$('#message').html("<p>Press a key to get started!</p>").fadeIn(600);

		$("#download-btn").click(function(){
			this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(download())
		});

		// Add a key listener to start
		$(document).one( "keydown", function() {

			// Remove the message and start comparing
			console.log('Start with reviewing the first record pair.')

			started = true;

			update_counts();

			$('#message').fadeOut(600, function(){

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

function read_data(url, callback){

	$.get(url, function(data){

		console.log("Get file " + url);

		// If file is json file, parsing is not needed
		if (/json$/.test(url)){

			return callback(data)

		// Else parse it with jquery.csv.js
		} else {

			var parse_options = {}

			// // Default seperator is ,
			// if (value["seperator"]){
			// 	parse_options["seperator"] = value["seperator"];
			// } 

			console.log("Data needs to be parsed");

			return callback($.csv.toObjects(data))

		}

	}).fail(function(){
		console.log('Error loading file.');
	});
}

// show pair (visual and bindings) --> classify (give class) --> hide pair ()

function show_pair(table){

}

function iterate(table){

	// console.log(table)

	if (table.length !== 0){

		$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass("activebutton");

		table.add('#classification').fadeIn(transition_time);

		if (table.hasClass('unknown')){
			$('#is_unknown_button').addClass('activebutton')
		} else if (table.hasClass('match')){
			$('#is_match_button').addClass('activebutton')
		} else if (table.hasClass('distinct')){
			$('#is_distinct_button').addClass('activebutton')
		} 

		// click_or_press
		$('#is_match_button, #is_distinct_button, #is_unknown_button').click(function(){
			classify_pair(event, table);
		});

		$(document).keydown(function(event){
			classify_pair(event, table);
		}); 

	} else {
		// last record in list
		console.log("Last record")
		$('#last').fadeIn(transition_time);
	}
}

function classify_pair(event, table){

	next = true;

	if ((event.keyCode === 39) || (event.currentTarget.id === "is_match_button")){

		console.log('Classified as match');
		disable_controls();
		warning("");

		table.removeClass().addClass('match');
		$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass("activebutton");
		$('#is_match_button').addClass("activebutton");

	} else if ((event.keyCode === 37) || (event.currentTarget.id === "is_distinct_button")){

		console.log('Classified as distinct')
		disable_controls();
		warning("");

		table.removeClass().addClass('distinct');
		$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass("activebutton");
		$('#is_distinct_button').addClass("activebutton");

	} else if ((event.keyCode === 191) || (event.currentTarget.id === "is_unknown_button")){
		
		console.log('Classified as unknown')
		disable_controls();
		warning("");

		table.removeClass().addClass('unknown');
		$('#is_match_button, #is_distinct_button, #is_unknown_button').removeClass("activebutton");
		$('#is_unknown_button').addClass("activebutton");

	} else if (event.keyCode === 38){

		console.log('Previous pair')
		disable_controls();
		warning("");

		next = false;

	} else if (event.keyCode === 40){

		console.log('Next pair')
		disable_controls();
		warning("");

	} else {

		// unknown key
		warning("Unknown key used. See the <a href='https://github.com/J535D165/recordlinkage-review' target='_blank'>documentation</a>.")

		next =null; //Do not go to the following or previous record
	}	

	update_counts();

	if ((next ==true ) || (next == false)){
		// remove table
		table.add('#classification').fadeOut(transition_time,  function(){

			// get next pair
			iterate(next_pair(table));

		});

	} else{

	}
}

function disable_controls(){

	// unbind click and keys
	$(document).unbind('keydown');
	$('#is_match_button, #is_distinct_button, #is_unknown_button').unbind("click");

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

function navigation(){

	$('#allbutton a').addClass('active'); 

	$(".navbutton").click(function(){

		// // clear keydown event listener
		// $(document).unbind('keydown');

		console.log("Button clicked: " + $(this).attr('id'));

		if ($(this).attr('id') === 'nonmatchbutton'){
			current_mode = 'distinct';
			$('#navigation a').removeClass('active');
			$('#nonmatchbutton a').addClass('active');

		} else if ($(this).attr('id') === 'matchbutton'){
			current_mode = 'match';
			$('#navigation a').removeClass('active');
			$('#matchbutton a').addClass('active');

		} else if ($(this).attr('id') === 'unknownbutton'){
			current_mode = 'unknown';
			$('#navigation a').removeClass('active');
			$('#unknownbutton a').addClass('active');

		} else if ($(this).attr('id') === 'allbutton'){
			current_mode = 'all';
			$('#navigation a').removeClass('active');
			$('#allbutton a').addClass('active');
		}

		if (started){
			// stop comparing, fade out
			$.when($('#content').children().fadeOut(transition_time)).done(function(){

				// console.log('test')

				iterate(first_pair());
			});
		}
		
	});

}

function make_index(indexType){

	if (index == "simple"){
		return simple_index()
	}
}

function simple_index(fileA,fileB) {
	
	$.each(fileA, function(index, value){

		
		
	});

}


/**********************
        SETTINGS
**********************/

function get_settings() {
	return settings
}

function set_settings(json_settings) {

	// Validate settings

	// set settings
	settings = json_settings;
}

function is_valid(json){
	return true
}

/**********************
        Start
**********************/

$(document).ready(function(){

	var d = new Date();
	var starttime = d.getTime();

	console.log("Start program");

	// start message
	$("#message").text("Picking flowers")

	// load the data
	$.getJSON( "review-settings.json", function( settings ) {

		if (!is_valid(settings)){
			alert('Incorrect settings file.');
		}

		console.log("Settings loaded")
		console.log(settings)

		var n_files_loaded = 0;

		// Load all files
		$.each( settings['records'], function( key, value ) {

			console.log(value["url"])

			// Load the file, dataType is a guess
			read_data(value["url"], function(data){

				// Store dataset
				datasets[key] = data

				n_files_loaded += 1;

				console.log(Object.keys(settings['records']).length);
				console.log(n_files_loaded);

				// If all files are loaded, start
				if (n_files_loaded == Object.keys(settings['records']).length){

					console.log("All files loaded: start");
					console.log(datasets["census1990"]);

					// Start, but not too fast
					if ((d.getTime() - starttime) < min_loading_time){
						
						setTimeout(start, min_loading_time);

					} else{
						
						start();

					}
				}
			})
			
		});

	}).fail(function() {
		console.log('Error loading review-settings.json.');
	});
});




		// $.each(trees, function(tree_i, tree){

		// 	$.each(tree['links'], function(link_i, link){

		// 		is_match = link._match;

		// 		// The three things needed
		// 		console.log(link);
		// 		console.log(tree.source[link.source._id]);
		// 		console.log(tree.target[link.target._id]);

		// 		jquery_table = create_table(link, tree.source[link.source._id], tree.target[link.target._id]);
		// 		jquery_table.data("targetID", link.target._id);
		// 		jquery_table.data("sourceID", link.source._id);

		// 		$('#content').append(jquery_table);

		// 	});

		// });





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


