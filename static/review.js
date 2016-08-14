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

function create_table(rec1, rec2){
	// Function to create html tables
	// Useful for inserting in page

	match_class = 'unknown';

	// console.log(records)

	th_rec1 = [];
	td_rec1 = [];
	td_rec2 = [];
	th_rec2 = [];

	$.each(settings.compare, function(_, c){

		if (!c.values[0]){
			th_rec1.push('<th>' + c.values[0]["label"] + '</th>');
		} else{
			th_rec1.push('<th class="blank-cell"></th>');
		}

		if (!c.values[0]){
			td_rec1.push('<td>' + rec1[c.values[0]["label"]] + '</td>');
		} else {
			td_rec1.push('<td></td>');
		}

		if (!c.values[1]){
			td_rec2.push('<td>' + rec1[c.values[1]["label"]] + '</td>');
		} else {
			td_rec2.push('<td></td>');
		}

		if (!c.values[1]){
			th_rec2.push('<th>' + c.values[1]["label"] + '</th>');
		} else{
			th_rec2.push('<th class="blank-cell"></th>');
		}

	});

	var table_str = '<table>' + '<tr>' + th_rec1.join("") + '</tr>' + '<tr>' + td_rec1.join("") + '</tr>' + '<tr>' + td_rec2.join("") + '</tr>' + '<tr>' + th_rec2.join("") + '</tr>' + '</table>';

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

function is_valid(settings){
	return true
}

/**********************
    Initialize/Loading
**********************/

$(document).ready(function(){

	var d = new Date();
	var starttime = d.getTime();

	console.log("Start program");

	// start message
	$("#message").text("Picking flowers")

	// load the data
	$.getJSON( "review-settings.json", function( settings_data ) {

		if (!is_valid(settings_data)){
			alert('Incorrect settings file.');
		} else {
			settings = settings_data;
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

function start(){

	// starting message
	$('#message').fadeOut(600, function(){

		// start at keypress
		$('#message').html("<p>Press a key to get started!</p>").fadeIn(600);

		// Add a key listener to start
		$(document).one( "keydown", function() {

			// Remove the message and start comparing
			console.log('Start with reviewing the first record pair.')

			started = true;

			navigation();

			update_counts();

			$('#message').fadeOut(600, function(){

				// start with first record
				iterate(first_pair());
			});
		})
	});
}

function navigation(){

	$("#download-btn").click(function(){
		this.href = "data:text/plain;charset=UTF-8," + encodeURIComponent(download())
	});

	// Always start with "all" records. 
	$('#allbutton a').addClass('active'); 

	// What to do when one of the buttons is pressed. 
	$(".navbutton").click(function(){

		console.log("Navigation button clicked: " + $(this).attr('id'));

		$('#navigation a').removeClass('active');
		$(this).children('a').addClass('active');

		if ($(this).attr('id') === 'nonmatchbutton'){
			current_mode = 'distinct';

		} else if ($(this).attr('id') === 'matchbutton'){
			current_mode = 'match';

		} else if ($(this).attr('id') === 'unknownbutton'){
			current_mode = 'unknown';

		} else if ($(this).attr('id') === 'allbutton'){
			current_mode = 'all';
		}

		// Change to the new set
		$.when($('#content').children().fadeOut(transition_time)).done(function(){

			iterate(first_pair());
		});
		
	});

}

