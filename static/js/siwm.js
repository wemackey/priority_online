////////////////////////////////////////////////////////////////
// SINGLE ITEM SPATIAL WM TASK
////////////////////////////////////////////////////////////////
// TO DO LIST
////////////////////////////////////////////////////////////////
//  Add x_axis jitter for probe with correct sampling distribution
//	Calculate/store variables: %Cor, RT
//	Incorporate PsiTurk
//	Configure multiple runs (add "next" button?)
//  Only get points if RSVP stream is answered correctly?

////////////////////////////////////////////////////////////////
// INITIALIZE PSITURK
////////////////////////////////////////////////////////////////
//
// Requires:
//     psiturk.js
//     utils.js
//
/////////////////////////////////////////////////////////////////


// Initalize psiturk object
var psiTurk = PsiTurk(uniqueId, adServerLoc);

// All pages to be loaded
var pages = [
  "instructions/instruct-1.html",
  "instructions/instruct-2.html",
  "instructions/instruct-3.html",
  "instructions/instruct-4.html",
  "instructions/instruct-5.html",
  "instructions/instruct-6.html",
  "instructions/instruct-7.html",
  "instructions/instruct-8.html",
  "instructions/instruct-ready.html",
  "stage.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you lik
  "instructions/instruct-1.html",
//  "instructions/instruct-2.html",
//  "instructions/instruct-3.html",
//  "instructions/instruct-4.html",
//  "instructions/instruct-5.html",
//  "instructions/instruct-6.html",
//  "instructions/instruct-7.html",
//  "instructions/instruct-8.html"
];

// Task object to keep track of the current phase
var currentview;

var run_num = 1;

var siwm_task = function() {

////////////////////////////////////////////////////////////////
// DECLARE TRIAL VARIABLES
////////////////////////////////////////////////////////////////
var trials = 50; //total number of trials per run
var donetrials = 0; //number of trials completed in this run
var ang = [15,25,35,45,55,65,75,105,115,125,135,145,155,165,195,205,215,225,235,245,255,285,295,305,315,325,335,345]; // possible angles
var ecc = 300; // stimulus eccentricity in pixels from fixation
var userans = null; //user response (left = 1, right = 0)
var corans = null; //correct response (left = 1, right = 0)
var rsvp_ans = null; //rsvp user response (present = 5, absent = 6)
var rsvp_corans = null; //rsvp correct response (present = 5, absent = 6)
var jitter = [10,50,100]; //jittered test location widths
var lr = [0,1]; //left or right probe
var del = [1500,2000,2500,3000,3500]; //possible delay periods
var listenkey = false; //do we want user input now?
var feedbackmsg = "no feedback"; //feedback message string
var colors = d3.scale.category20b();
var ci=0;
var let =["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
var tarnum = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
var letcount = 0; //which RSVP letter we are on
var letind = [7,8,9,10,11]; //which RSVP letter position we want to display the target
var score=0; //user score
var mpx=1; //score multiplier
var crow=0; //how many correct in a row
var score=0;
var rsvp_done = 0; //start/stop RSVP stream
var showtar = [0,1]; //show target in RSVP stream (1 = yes, 0 = no)
var s_width = screen.width / 96;
var s_height = screen.height / 96;
var loc_end_date = 0;
var loc_end_time = 0;
var loc_rt = 0;
var rsvp_end_date = 0;
var rsvp_end_time = 0;
var rsvp_rt = 0;
var rsvp_start_date = 0;
var rsvp_start_time = 0;
var loc_start_date = 0;
var loc_start_time = 0;

////////////////////////////////////////////////////////////////
// SET STIMULUS SIZE
////////////////////////////////////////////////////////////////
var m_vert_res = screen.height * 2.54; //in cm
var s_dist = 60; //in cm
var stim_r_visangle = 1; //in visual angle
var stim_r = 0; //in pixels

////////////////////////////////////////////////////////////////
// GET KEYPRESS RESPONSES
////////////////////////////////////////////////////////////////
var onKeyDown = function(evt) {
    if (evt.keyCode == 39) {
      userans = 1;
      loc_end_date = new Date();// right
      loc_end_time = loc_end_date.getTime();
    }
    else if (evt.keyCode == 37) {
      userans = 0;
      loc_end_date = new Date() // left
      loc_end_time = loc_end_date.getTime();
    }
	  else if (evt.keyCode == 89) {
      rsvp_ans = 5;
      rsvp_end_date = new Date() // present
      rsvp_end_time = rsvp_end_date.getTime();
    }
	  else if (evt.keyCode == 78) {
      rsvp_ans = 6;
      rsvp_end_date = new Date() // absent
      rsvp_end_time = rsvp_end_date.getTime();
    }
}

var onKeyUp = function(evt) {
  if (evt.keyCode == 39) {
    userans = 1;
    loc_end_date = new Date();// right
    loc_end_time = loc_end_date.getTime();
  }
  else if (evt.keyCode == 37) {
    userans = 0;
    loc_end_date = new Date() // left
    loc_end_time = loc_end_date.getTime();
  }
  else if (evt.keyCode == 89) {
    rsvp_ans = 5;
    rsvp_end_date = new Date() // present
    rsvp_end_time = rsvp_end_date.getTime();
  }
  else if (evt.keyCode == 78) {
    rsvp_ans = 6;
    rsvp_end_date = new Date() // absent
    rsvp_end_time = rsvp_end_date.getTime();
  }
}

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

psiTurk.showPage('stage.html');

////////////////////////////////////////////////////////////////
// INITIALIZE TASK/TASKLOOP
////////////////////////////////////////////////////////////////
var init = function (svg) {
  console.log(s_width,s_height);
	show_score();
	show_mpx();
	return setTimeout(function() {ITI(svg)},500);
 }

var taskloop = function (svg){
  if (donetrials<trials){
	shuffle(showtar);
	shuffle(letind);
	rsvp_corans = null;
    userans = null;
	rsvp_done = 0;
	dispText(svg);
    drawStimulus(svg);
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
var shuffle = function (array) {
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
// CALL EXPLOSION EFFECT
////////////////////////////////////////////////////////////////
var doVisual = function (fmx, fmy) {
  var fmx = parseFloat(fmx);
  var fmy = parseFloat(fmy)

// Circle explosion
//    for (var k = 0; k < 9; k++) {
//			svg.append("svg:circle")
//				.attr("cx",fmx).attr("cy",fmy).attr("r",10)
//				.style("stroke",colors(++ci)).style("fill",colors(++ci))
//				.transition().duration(800).ease(Math.sqrt)
//					.attr("cx",fmx+Math.floor(Math.random()*200)-100).attr("cy",fmy+Math.floor(Math.random()*200)-100)
//					.style("stroke-opacity",1e-6).style("fill-opacity",1e-6).remove();
//		}

// Confetti explosion

		for (var k = 0; k < 50; k++) {
			var randx = Math.floor(Math.random()*2000)-1000,
				randy = Math.floor(Math.random()*2000)-1000;
				thunnidx=30, thunnidy=30;
			if (randx < 0){thunnidx *= -1;}
			if (randy < 0){thunnidy*=-1;}
			svg.append("svg:line")
			.attr("x1",fmx).attr("y1",fmy).attr("x2",fmx).attr("y2",fmy)
			.style("stroke",colors(++ci)).style("stroke-width", "10px")
			.transition().duration(1000).ease(Math.sqrt)
				.attr("x1",fmx+randx).attr("y1",fmy+randy)
				.attr("x2",fmx+randx+thunnidx).attr("y2",fmy+randy+thunnidy)
				.style("stroke-opacity",0.1).remove();
		}
}

////////////////////////////////////////////////////////////////
// CREATE STAGE
////////////////////////////////////////////////////////////////
var makeStage = function (w,h) {
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
var clearStimulus = function (svg) {
  svg.selectAll("circle").remove();
}

////////////////////////////////////////////////////////////////
// DRAW STIMULI
////////////////////////////////////////////////////////////////
var drawStimulus = function (svg) {
  clearStimulus(svg);
  shuffle(ang);
  var angR = ang[1] * Math.PI / 180.0;
  cirx = ecc * Math.cos(angR);
  ciry = ecc * Math.sin(angR);
  var circle1 = svg.append("circle");
  circle1.attr("cx", 1024/2 + cirx)
         .attr("cy", 768/2 + ciry)
       .attr('r', 10)
       .attr("fill","red")
       .attr("stroke","red")
       .attr("stroke-width", 3);

  var fixation = svg.append("circle");
  fixation.attr("cx", 1024/2)
          .attr("cy", 768/2)
        .attr('r', 30)
        .attr("fill","black")
        .attr("stroke","black")
        .attr("stroke-width", 3);

      procx = circle1.attr("cx");
      procy = circle1.attr("cy");
      pror = circle1.attr("r");
      profill = circle1.attr("fill");
      prostroke = circle1.attr("stroke");
      prostrokewidth = circle1.attr("stroke-width");

  return setTimeout(function() {delayperiod(svg)},200);
}

////////////////////////////////////////////////////////////////
// DELAY PERIOD
////////////////////////////////////////////////////////////////
var delayperiod = function (svg){
	clearStimulus(svg);

	var fixation = svg.append("circle");
	fixation.attr("cx", 1024/2)
        	.attr("cy", 768/2)
        	.attr('r', 30)
        	.attr("fill","black")
        	.attr("stroke","black")
        	.attr("stroke-width", 3);

 	shuffle(del);
	return setTimeout(get_rsvp,del[1]);

}

////////////////////////////////////////////////////////////////
// RSVP STREAM
////////////////////////////////////////////////////////////////
var dispText = function (svg){
	letcount = letcount+1;
	svg.selectAll("text").remove();
	shuffle(let);
var text = svg.append("text");
		 text.attr("x", 1024/2)
         .attr("y", (768/2) + 17)
		 .attr("font-size",45)
		 .attr("text-anchor","middle")
		 .attr("font-weight","bold")
		 .attr("fill","white")
		 .text (let[1]);

		if (showtar[1]==1){
			rsvp_corans = 5;
			if (rsvp_done == 0){
				if (letcount==letind[1]){
					return setTimeout(function() {dispTarget(svg)},250);
				}
				else {
					return setTimeout(function() {dispText(svg)},250);
				}

			}
			else {
				svg.selectAll("text").remove();
				var text = svg.append("text");
						 text.attr("x", 1024/2)
				         .attr("y", (768/2) + 17)
						 .attr("font-size",45)
						 .attr("text-anchor","middle")
						 .attr("font-weight","bold")
						 .attr("fill","white")
						 .text ("?");
				letcount = 0;
			}
		}
		else {
			rsvp_corans = 6;
			if (rsvp_done == 0){
				return setTimeout(function() {dispText(svg)},250);
			}
			else {
				svg.selectAll("text").remove();
				var text = svg.append("text");
						 text.attr("x", 1024/2)
				         .attr("y", (768/2) + 17)
						 .attr("font-size",45)
						 .attr("text-anchor","middle")
						 .attr("font-weight","bold")
						 .attr("fill","white")
						 .text ("?");
				letcount = 0;
			}
		}
}

////////////////////////////////////////////////////////////////
// RSVP TARGET STREAM
////////////////////////////////////////////////////////////////
var dispTarget = function (svg){
	svg.selectAll("text").remove();
	shuffle(tarnum);
var text = svg.append("text");
		 text.attr("x", 1024/2)
         .attr("y", (768/2) + 17)
		 .attr("font-size",45)
		 .attr("text-anchor","middle")
		 .attr("font-weight","bold")
		 .attr("fill","white")
		 .text (tarnum[1]);
		console.log("Showed target")
		return setTimeout(function() {dispText(svg)},250);
}

////////////////////////////////////////////////////////////////
// RSVP RESPONSE
////////////////////////////////////////////////////////////////

var get_rsvp = function () {
	rsvp_done = 1;
  rsvp_start_date = new Date();
  rsvp_start_time = rsvp_start_date.getTime();

	return setTimeout(function() {probe()},2000);
}

////////////////////////////////////////////////////////////////
// SCORE UPDATE
////////////////////////////////////////////////////////////////
var show_score = function() {
	remove_word();
		d3.select("#score")
			.append("kbd")
			.attr("id","disp_score")
			.style("color","white")
			.style("text-align","center")
			.style("font-size","20px")
			.style("font-weight","400")
			.style("margin","10px")
			.text("SCORE: " + score);
	};

var show_mpx = function() {
		d3.select("#score")
			.append("kbd")
			.attr("id","disp_mpx")
			.style("color","green")
			.style("text-align","center")
			.style("font-size","20px")
			.style("font-weight","400")
			.style("margin","1px")
			.text("MP: " + mpx +"x");
	};

var remove_word = function() {
		d3.select("#disp_score").remove();
		d3.select("#disp_mpx").remove();
	};
////////////////////////////////////////////////////////////////
// DISPLAY PROBE
////////////////////////////////////////////////////////////////
var probe = function (){

	if(rsvp_ans==rsvp_corans){
		feedbackmsg = "Correct!";
	}
	else{
		feedbackmsg = "Incorrect!";
	}

	console.log(feedbackmsg);

 	shuffle(jitter);
 	shuffle(lr);

  loc_start_date = new Date();
  loc_start_time = loc_start_date.getTime();

 	if(lr[1]==1){
    	jx = parseFloat(procx) - jitter[1];
    	corans = 0;
  	}
  	else {
    	jx = parseFloat(procx) + jitter[1];
    	corans = 1;
  	}

  	var probecircle = svg.append("circle");
  	probecircle.attr("cx", jx)
         	.attr("cy", procy)
       		.attr('r', pror)
       		.attr("fill",profill)
       		.attr("stroke",prostroke)
       		.attr("stroke-width", prostrokewidth);

  	var fixation = svg.append("circle");
  	fixation.attr("cx", 1024/2)
          	.attr("cy", 768/2)
        	.attr('r', 30)
        	.attr("fill","black")
        	.attr("stroke","black")
        	.attr("stroke-width", 3);

	var middle = svg.append("circle");
	middle.attr("cx", 1024/2)
		    .attr("cy", 768/2)
		    .attr('r', 10)
		    .attr("fill","red")
		    .attr("stroke","red")
		    .attr("stroke-width", 3);

	var text = svg.append("text");
			text.attr("x", 1024/2 - 20)
			.attr("y", (768/2) + 9)
			.attr("font-size",20)
			.attr("text-anchor","middle")
			.attr("fill","red")
			.text ("<");

	var text2 = svg.append("text");
			text2.attr("x", 1024/2 + 20)
			.attr("y", (768/2) + 9)
			.attr("font-size",20)
			.attr("text-anchor","middle")
			.attr("fill","red")
			.text (">");

  	return setTimeout(getresponse,1200);
}

////////////////////////////////////////////////////////////////
// GET USER RESPONSE AND GIVE FEEDBACK
////////////////////////////////////////////////////////////////
var getresponse = function (){
  feedback();
}

var feedback = function (){
  clearStimulus(svg);
  if(corans==userans){
    doVisual(jx, procy);
    feedbackmsg = "Correct!";
	score=score+(100*mpx);
	crow=crow+1;
	if (crow==3) {
		mpx=mpx+1;
		crow=0;
	}
    var fixation = svg.append("circle");
    fixation.attr("cx", 1024/2)
             .attr("cy", 768/2)
           .attr('r', 30)
           .attr("fill","green")
           .attr("stroke","green")
           .attr("stroke-width", 5);
  }
  else if(userans==null){
    feedbackmsg = "Failed to answer!";
	crow=0;
	mpx=1;
    var fixation = svg.append("circle");
    fixation.attr("cx", 1024/2)
             .attr("cy", 768/2)
           .attr('r', 30)
           .attr("fill","white")
           .attr("stroke","white")
           .attr("stroke-width", 5);
  }
  else {
    feedbackmsg = "Incorrect!";
	crow=0;
	mpx=1;
    var fixation = svg.append("circle");
    fixation.attr("cx", 1024/2)
             .attr("cy", 768/2)
           .attr('r', 30)
           .attr("fill","red")
           .attr("stroke","red")
           .attr("stroke-width", 5);
  }

 	// alert(feedbackmsg);
	show_score();
	show_mpx();

 	donetrials = donetrials + 1;
 	return setTimeout(function() {ITI(svg)},1000);
}

////////////////////////////////////////////////////////////////
// ITI
////////////////////////////////////////////////////////////////
var ITI = function (svg){
  clearStimulus(svg);
  var fixation = svg.append("circle");
  fixation.attr("cx", 1024/2)
          .attr("cy", 768/2)
        .attr('r', 30)
        .attr("fill","black")
        .attr("stroke","black")
        .attr("stroke-width", 3);

  var rsvp_rt = rsvp_end_time - rsvp_start_time;
  var loc_rt = loc_end_time - loc_start_time;

  return setTimeout(function() {taskloop(svg)},2000);
}

////////////////////////////////////////////////////////////////
// END TASK
////////////////////////////////////////////////////////////////
var taskend = function (){
  // alert('Task complete!')
  run_num = run_num + 1;
}

var clearButton = function () {
  d3.select(".container")
    .selectAll("button")
    .remove();
}

var makeButton = function (text, callback) {
  d3.select(".buttonbar")
    .insert("button")
    .attr("type", "button")
    .attr("class", "btn btn-primary btn-lrg")
    .text(text)
    .on("click", function(d) { console.log("clicked"); callback(); } );
}

var doTrial = function (svg) {
  clearStimulus(svg);
  // clearButton();
  init(svg);
  makeButton("Next Trial", function () { init(svg); } );
}

var svg = makeStage(1024,768);

doTrial(svg);
}

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
      instructionPages, // a list of pages you want to display in sequence
      function() { currentview = new siwm_task(); } // what you want to do when you are done with instructions
    );
});
