/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = PsiTurk(uniqueId, adServerLoc);

// All pages to be loaded
var pages = [
  "instructions/instruct-1.html",
  "instructions/instruct-ready.html",
  "stage.html",
  "stage1.html",
  "stage2.html",
  "stage3.html",
  "postquestionnaire.html",
  "postquestionnaire1.html",
  "postquestionnaire2.html",
  "postquestionnaire3.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you lik
  "instructions/instruct-1.html",
  "instructions/instruct-ready.html"
];

// Stimuli for a basic Stroop experiment
var stims = [1, 2, 3];
_.shuffle(stims);


// Task object to keep track of the current phase
var currentview;


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and
* insert them into the document.
*
********************/

/********************
* GORILLA TEST      *
********************/
var GorillaExperiment = function() {

  shuffle(stims);

  var whichvid = stims[0];
  console.log(whichvid);

  var wordon, // time word is presented
      listening = false,
      resp_prompt = '<p id="prompt">Please click continue when video has finished.</p>';

  var next = function() {
    if (stims.length===0) {
      finish();
    }
    else {
      $('#query').html(resp_prompt).show();
    }
  };

  var response_handler = function(e) {
    if (!listening) return;

    var keyCode = e.keyCode,
      response;

    switch (keyCode) {
      default:
        response = "";
        break;
    }
  };

  var finish = function() {
      $("body").unbind("keydown", response_handler); // Unbind keys
      currentview = new Questionnaire(1);
  };

  // Load the stage.html snippet into the body of the page
  if(whichvid==1) {
  psiTurk.showPage('stage1.html');
  }
  else if(whichvid==2) {
  psiTurk.showPage('stage2.html');
  }
  else {
  psiTurk.showPage('stage3.html');
  }

  // This uses the Raphael library to create the stimulus. Note that when
  // this is created the first argument is the id of an element in the
  // HTML page (a div with id 'stim')
  /*
  var R = Raphael("stim", 500, 200),
    font = "100px Helvetica";
  */

  var show_word = function(text, color) {
    d3.select("#stim")
      .append("div")
      .attr("id","word")
      .style("color",color)
      .style("text-align","center")
      .style("font-size","150px")
      .style("font-weight","400")
      .style("margin","20px")
      .text(text);
  };
  var remove_word = function(text, color) {
    //R.clear();
    d3.select("#word").remove();
  };

  // Register the response handler that is defined above to handle any
  // key down events.
  $("body").focus().keydown(response_handler);

  // Continue button functionality
  $("#next").click(function () {
      finish();
  });

  // Start the test
  next();
};


/****************
* Questionnaire *
****************/

var Questionnaire = function(qnum) {

  var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

  record_responses = function() {

    //psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});

    $('textarea').each( function(i, val) {
      psiTurk.recordUnstructuredData(this.id, this.value);
    });
    $('select').each( function(i, val) {
      psiTurk.recordUnstructuredData(this.id, this.value);
    });

  };

  prompt_resubmit = function() {
    replaceBody(error_message);
    $("#resubmit").click(resubmit);
  };

  resubmit = function() {
    replaceBody("<h1>Trying to resubmit...</h1>");
    reprompt = setTimeout(prompt_resubmit, 10000);

    psiTurk.saveData({
      success: function() {
          clearInterval(reprompt);
          finish();
      },
      error: prompt_resubmit}
    );
  };

  // Load the questionnaire snippet
  if(qnum==1) {
  psiTurk.showPage('postquestionnaire1.html');
  }
  else if(qnum==2) {
  psiTurk.showPage('postquestionnaire2.html');
  }
  else {
  psiTurk.showPage('postquestionnaire3.html');
  }

  $("#next").click(function () {
      record_responses();
      psiTurk.saveData({
            success: function(){
              if(qnum==1) {
              currentview = new Questionnaire(2);
              }
              else if(qnum==2) {
              currentview = new Questionnaire(3);
              }
              else {
              psiTurk.completeHIT();
              }
            },
            error: prompt_resubmit});
  });


};


/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
      instructionPages, // a list of pages you want to display in sequence
      function() { currentview = new GorillaExperiment(); } // what you want to do when you are done with instructions
    );
});
