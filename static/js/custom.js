////////////////////////////////////////////////////////////////
// WM & PRIORTY TASK (4 ITEMS)
////////////////////////////////////////////////////////////////
// TO DO LIST
////////////////////////////////////////////////////////////////
//  Add staircase procedure
//	Create correct eccentricity annulis
//	Calculate/store variables: %Cor, RT
//	Incorporate PsiTurk
//	Configure multiple runs
//	Replace message boxes
//	Communicate with EyeLink?
//	Possible to use backticks for timing?
//	Increase # of items?
//	Add fixation task
//	Make it game-like: explosions for correct/incorrect answers
//	Add a scoreboard

////////////////////////////////////////////////////////////////
// DECLARE TRIAL VARIABLES
////////////////////////////////////////////////////////////////
var trials = 50; //total number of trials per run
var donetrials = 0; //number of trials completed in this run
var locs = [150,175,200,225,250,275,300]; //possible locations
var userans = null; //user response (left = 0, right = 1)
var corans = null; //correct response (left = 0, right = 1)
var del = [500,750,1000,1250,1500]; //possible delay periods
var listenkey = false; //do we want user input now?
var feedbackmsg = "no feedback"; //feedback message string

////////////////////////////////////////////////////////////////
// GET KEYPRESS RESPONSES
////////////////////////////////////////////////////////////////
function onKeyDown(evt) {
  	if (evt.keyCode == 39) userans = 1;
  	else if (evt.keyCode == 37) userans = 0;
}

function onKeyUp(evt) {
  	if (evt.keyCode == 39) userans = 1;
  	else if (evt.keyCode == 37) userans = 0;
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

////////////////////////////////////////////////////////////////
// INITIALIZE TASK/TASKLOOP
////////////////////////////////////////////////////////////////
function init(svg) {
	return setTimeout(taskloop(svg),500);
 }
		
function taskloop(svg){
	if (donetrials<trials){
		//display 4 dot sequence
		prob = Math.floor((Math.random()*4)+1);
		userans = null;
		drawStimulus1(svg);
	}
	else taskend();
		//variable delay
		//probe dot l/r
		//await response
		//give feedback on ACC and RT
}

////////////////////////////////////////////////////////////////
// SHUFFLE FUNCTION
////////////////////////////////////////////////////////////////
function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

////////////////////////////////////////////////////////////////
// CREATE STAGE
////////////////////////////////////////////////////////////////
function makeStage(w,h) {
	var svg = d3.select(".container")
	   .insert("center")
	   .insert("svg")
	   .attr("width", w)
	   .attr("height", h);
	return svg;
}

////////////////////////////////////////////////////////////////
// CLEAR STAGE
////////////////////////////////////////////////////////////////
function clearStimulus(svg) {
	svg.selectAll("circle").remove();
}

////////////////////////////////////////////////////////////////
// DRAW STIMULI
////////////////////////////////////////////////////////////////
function drawStimulus1(svg) {
clearStimulus(svg);
	shuffle(locs);
	var circle1 = svg.append("circle");
	circle1.attr("cx", 1024/2 - locs[1])
	       .attr("cy", 768/2 - 200)
		   .attr('r', 20)
		   .attr("fill","red")
		   .attr("stroke","red")
		   .attr("stroke-width", 3);

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
	        .attr("cy", 768/2)
		    .attr('r', 5)
		    .attr("fill","black")
		    .attr("stroke","black")
		    .attr("stroke-width", 3);

	if (prob==1){
			procx = circle1.attr("cx");
			procy = circle1.attr("cy");
			pror = circle1.attr("r");
			profill = circle1.attr("fill");
			prostroke = circle1.attr("stroke");
			prostrokewidth = circle1.attr("stroke-width");
	}
	return setTimeout(function() {drawStimulus2(svg)},200);
}

function drawStimulus2(svg) {
	clearStimulus(svg);
	shuffle(locs);
	var circle2 = svg.append("circle");
	circle2.attr("cx", 1024/2 - locs[1])
	       .attr("cy", 768/2 + 200)
		   .attr('r', 20)
		   .attr("fill","blue")
		   .attr("stroke","blue")
		   .attr("stroke-width", 3);

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
	        .attr("cy", 768/2)
		    .attr('r', 5)
		    .attr("fill","black")
		    .attr("stroke","black")
		    .attr("stroke-width", 3);

	if (prob==2){
			procx = circle2.attr("cx");
			procy = circle2.attr("cy");
			pror = circle2.attr("r");
			profill = circle2.attr("fill");
			prostroke = circle2.attr("stroke");
			prostrokewidth = circle2.attr("stroke-width");
	}

	return setTimeout(function() {drawStimulus3(svg)},200);
}

function drawStimulus3(svg) {
	clearStimulus(svg);
	shuffle(locs);
	var circle3 = svg.append("circle");
	circle3.attr("cx", 1024/2 + locs[1])
	       .attr("cy", 768/2 + 200)
		   .attr('r', 20)
		   .attr("fill","black")
		   .attr("stroke","black")
		   .attr("stroke-width", 3);

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
	        .attr("cy", 768/2)
		    .attr('r', 5)
		    .attr("fill","black")
		    .attr("stroke","black")
		    .attr("stroke-width", 3);

	if (prob==3){
			procx = circle3.attr("cx");
			procy = circle3.attr("cy");
			pror = circle3.attr("r");
			profill = circle3.attr("fill");
			prostroke = circle3.attr("stroke");
			prostrokewidth = circle3.attr("stroke-width");
	}
	return setTimeout(function() {drawStimulus4(svg)},200);
}

function drawStimulus4(svg) {
	clearStimulus(svg);
	shuffle(locs);
	var circle4 = svg.append("circle");
	circle4.attr("cx", 1024/2 + locs[1])
	       .attr("cy", 768/2 - 200)
		   .attr('r', 20)
		   .attr("fill","white")
		   .attr("stroke","white")
		   .attr("stroke-width", 3);

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
	        .attr("cy", 768/2)
		    .attr('r', 5)
		    .attr("fill","black")
		    .attr("stroke","black")
		    .attr("stroke-width", 3);

	if (prob==4){
			procx = circle4.attr("cx");
			procy = circle4.attr("cy");
			pror = circle4.attr("r");
			profill = circle4.attr("fill");
			prostroke = circle4.attr("stroke");
			prostrokewidth = circle4.attr("stroke-width");
	}

	return setTimeout(function() {delayperiod(svg)},200);
}

////////////////////////////////////////////////////////////////
// DELAY PERIOD
////////////////////////////////////////////////////////////////
function delayperiod(svg){
	clearStimulus(svg);

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
	        .attr("cy", 768/2)
		    .attr('r', 5)
		    .attr("fill","black")
		    .attr("stroke","black")
		    .attr("stroke-width", 3);

	shuffle(del);
	return setTimeout(probe,del[1]);
}

////////////////////////////////////////////////////////////////
// DISPLAY PROBE
////////////////////////////////////////////////////////////////
function probe(){
	var probecircle = svg.append("circle");
	probecircle.attr("cx", procx)
	       .attr("cy", procy)
		   .attr('r', pror)
		   .attr("fill",profill)
		   .attr("stroke",prostroke)
		   .attr("stroke-width", prostrokewidth);
	corans = 1;

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
	        .attr("cy", 768/2)
		    .attr('r', 5)
		    .attr("fill","black")
		    .attr("stroke","black")
		    .attr("stroke-width", 3);

	return setTimeout(getresponse,1200);
}

////////////////////////////////////////////////////////////////
// GET USER RESPONSE AND GIVE FEEDBACK
////////////////////////////////////////////////////////////////
function getresponse(){
	feedback();
}

function feedback(){
	if(corans==userans){
		feedbackmsg = "Correct!";
		var fixation = svg.append("circle");
		fixation.attr("cx", 1024/2)
	           .attr("cy", 768/2)
		       .attr('r', 5)
		       .attr("fill","green")
		       .attr("stroke","green")
		       .attr("stroke-width", 5);
	}
	else if(userans==null){
		feedbackmsg = "Failed to answer!";
		var fixation = svg.append("circle");
		fixation.attr("cx", 1024/2)
	           .attr("cy", 768/2)
		       .attr('r', 5)
		       .attr("fill","white")
		       .attr("stroke","white")
		       .attr("stroke-width", 5);
	}
	else {
		feedbackmsg = "Incorrect!";
		var fixation = svg.append("circle");
		fixation.attr("cx", 1024/2)
	           .attr("cy", 768/2)
		       .attr('r', 5)
		       .attr("fill","red")
		       .attr("stroke","red")
		       .attr("stroke-width", 5);
	}

	// alert(feedbackmsg);

	donetrials = donetrials + 1;
	return setTimeout(function() {taskloop(svg)},1000);
}

////////////////////////////////////////////////////////////////
// END TASK
////////////////////////////////////////////////////////////////
function taskend(){
	// alert('Task complete!')
}

function clearButton() {
	d3.select(".container")
	  .selectAll("button")
	  .remove();
}

function makeButton(text, callback) {
	d3.select(".buttonbar")
	  .insert("button")
	  .attr("type", "button")
	  .attr("class", "btn btn-primary btn-lrg")
	  .text(text)
	  .on("click", function(d) { console.log("clicked"); callback(); } );
}

function doTrial(svg) {
	clearStimulus(svg);
	// clearButton();
	init(svg);
	makeButton("Next Trial", function () { init(svg); } );
}

var svg = makeStage(1024,768);

doTrial(svg);
