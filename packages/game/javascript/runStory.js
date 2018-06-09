/**
 * @license
 * JaDE - A roguelike game engine for HTML.
 * <br />Copyright (C) 2018  Woldrich, Inc.
 *
 * <p><a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *   <img alt="Creative Commons License" style="border-width:0"
 *        src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a>
 *   <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">
 *     Creative Commons Attribution-ShareAlike 4.0 International License
 *   </a>.
 */

"use strict";

var inkjs = require("inkjs"),
  $ = require("jquery"),
  rx = require("rx"),

  choiceLink = require("../content/choiceLink.hbs"),
  testStoryDiv = require("../content/testStoryDiv.hbs"),
  testParagraph = require("../content/testParagraph.hbs");

function testStory(storyJson) {
  var story = new inkjs.Story(storyJson);

  var $storyContainer = $("#story");

  if($storyContainer.length == 0) {
    $storyContainer = $(testStoryDiv());

    $(document.body).append($storyContainer);
  }

  function showAfter(delay, $el) {
    setTimeout(function () {
      $el.addClass("show")
    }, delay);
  }

  function scrollToBottom() {
    var start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    var dist = document.body.scrollHeight - window.innerHeight - start;
    if (dist < 0) return;

    var duration = 300 + 300 * dist / 100;
    var startTime = null;

    function step(time) {
      if (startTime == null) startTime = time;
      var t = (time - startTime) / duration;
      var lerp = 3 * t * t - 2 * t * t * t;
      window.scrollTo(0, start + lerp * dist);
      if (t < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }



  function continueStory() {
    var delay = 0.0;

    // Generate story text - loop through available content
    while (story.canContinue) {
      $storyContainer.append("<p>variablesState: npcName=" + story.state.variablesState.$("npcName") + "</p>");
      $storyContainer.append("<p>variablesState: someUnsetTrigger=" + story.state.variablesState.$("someUnsetTrigger") + "</p>");
      story.state.variablesState.$("npcName", "davew");

      // Get ink to generate the next paragraph
      var paragraphText = story.Continue();

      // Create paragraph element
      var $paragraphElement = $(testParagraph({ text: paragraphText }));
      $storyContainer.append($paragraphElement);

      // Fade in paragraph after a short delay
      showAfter(delay, $paragraphElement);

      delay += 200.0;
    }

    // Create HTML choices from ink choices
    story.currentChoices.forEach(function (choice) {

      // Create paragraph with anchor element
      var $choiceParagraphElement = $(choiceLink({ choice: choice.text }));
      $storyContainer.append($choiceParagraphElement);

      // Fade choice in after a short delay
      showAfter(delay, $choiceParagraphElement);
      delay += 200.0;

      // Bind click handler
      $choiceParagraphElement.find("a").click(function(event) {
        // Don't follow <a> link
        event.preventDefault();

        // Remove all existing choices
        $storyContainer.remove("p.choice");

        // Tell the story where to go next
        story.ChooseChoiceIndex(choice.index);

        // And loop...
        continueStory();
      });
    });

    if(!story.canContinue && story.currentChoices.length == 0) {
      $storyContainer.append("<p>FIN</p>");
    }

    scrollToBottom();
  }

  // kick it off
  continueStory();
}

module.exports = testStory;
