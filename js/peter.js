/* ============================ SCRIPT STARS HERE ===================================*/

/* Basic base of the form */
var base = {
    answer: "",
    answerToggle: false,
    needsReset: false,
    alreadyShowed: false,
    petitionText: "Peter please answer the following question:"
}

/* Actions to control and perform in the form */

var controller = {
    init: () => {
        view.init();
    },
    reset: () => {
        base.answer = '';
        base.answerToggle = false;
        base.needsReset = false;
        view.resetUi();
    },
    keyDown: (e) => {
        let len = controller.getPetitionLength();
        let lenPredefined = controller.getPredefinedLenght();
        // console.log(len);
        if (len) {
          view.showFloatingLabels();
        } else {
          controller.reset();
        }

        if(e.key === '.'){ // Dot is the secret key
            base.answerToggle = !base.answerToggle;
            document.getElementById('petition').value += base.petitionText[len];
            return false;
        } else if (e.key.length === 1 && base.answerToggle) { // If its a character and in answer mode
            // console.log(`this is the lenght: ${lenPredefined}`);
            base.answer += e.key;
            if (len < lenPredefined) { // Making sure nothing else apears if the asnwer is too long
              document.getElementById('petition').value += base.petitionText[len];
            }
            // console.log(base.answer);
            return false;
        } else if (e.key === "Backspace" && base.answerToggle) { // if its a backpace
            base.answer = base.answer.slice(0,-1);
            // console.log(base.answer);
        }
    },
    getPetitionLength: () => {
        return document.getElementById('petition').value.length;
    },
    getPredefinedLenght: () => {
        return base.petitionText.length;
    },
    getAnswer: () => {
        const invalidResponse = [
            "That's not how you petition to Peter.",
            "Invalid petition. Please try again.",
            "You're not asking correctly",
            "Why should I answer to that?",
            "Please try again tomorrow. Or never...",
            "I'm tired... Try again another time.",
            "Not now, I'm busy. Maybe later.",
            "Fix your petition please.",
        ];
        const invalidQuestion = "Please ask Peter a valid question.";
        base.needsReset = true;

        if (!view.getQuestion()) {                  // Valid Question check
            return invalidQuestion;
        } else if(base.answer) {                   // Valid Petition check
            return "Peter says:" + "<br><br><h3>" + base.answer +"</h3";
        } else {                                    // Invalid Response
            let randomNum = Math.floor(Math.random() * invalidResponse.length);
            return invalidResponse[randomNum];
        }

    },
}


var view = {
    init: () => {
      document.getElementById('answerButton').addEventListener('click', () => {
        view.renderAnswer();
      });
      document.getElementById('resetButton').addEventListener('click', controller.reset);
      document.getElementById('closeModal').addEventListener('click', controller.reset);
      document.getElementById('petition').onkeydown = (event) => {
          if(document.getElementById('petition').value == ''){
              controller.reset();
          }
          return controller.keyDown(event)
      };
      document.getElementById('question').onkeydown = (event) => {
          switch(event.key) {
              // If "?" is pressed
              case "?":
                  document.getElementById('question').value += "?";
                  view.renderAnswer();
                  break;
              // If "Enter" is pressed
              case "Enter":
                  if(!document.getElementById('question').value.includes('?')){
                      document.getElementById('question').value += "?";
                  }
                  view.renderAnswer();
                  break;
          }

      };
    },
    renderAnswer: () => {
      document.getElementById('answer').innerHTML = controller.getAnswer();
      view.disableQuestion();
      view.clearPetition();
      if (base.answerToggle) {
        view.loading();
      }
      view.showAnswer();
    },
    showAnswer: () => {
      $('#myModal').modal('toggle');
      if (base.answerToggle) {
        $("#answer").delay(4000).fadeIn();
      } else {
        $("#answer").fadeIn();
      }
      view.showCloseModal();
    },
    showCloseModal: () => {
      if (base.answerToggle) {
        $('#closeModal').delay(4000).fadeIn();
      } else {
        $('#closeModal').fadeIn();
      }
    },
    resetUi: () => {
        view.clearPetition();
        view.clearQuestion();
        view.clearAnswer();
        view.enableQuestion();
        view.hideAnswer();
        view.hideFloatingLabels();
    },
    clearPetition: () => {
        document.getElementById('petition').value = '';
    },
    clearQuestion: () => {
        document.getElementById('question').value = '';
    },
    clearAnswer: () => {
        document.getElementById('answer').innerHTML = '';
    },
    disableQuestion: () => {
        document.getElementById('question').disabled = true;
    },
    enableQuestion: () => {
        document.getElementById('question').disabled = false;
    },
    hideAnswer: () => {
        document.getElementById('answer').style.display = "none";
    },
    showFloatingLabels: () => {
        var list = document.getElementsByClassName("floating-label-form-group");
        for (var i = 0; i < list.length; i++) {
          list[i].classList.add('floating-label-form-group-with-value');
        }
    },
    hideFloatingLabels: () => {
        var list = document.getElementsByClassName("floating-label-form-group");
        for (var i = 0; i < list.length; i++) {
          list[i].classList.remove('floating-label-form-group-with-value');
        }
    },
    getQuestion: () => {
        return document.getElementById('question').value;
    },
    loading: () => {
        if (!base.alreadyShowed) {
          document.getElementById("loader").style.display = "block";
          // Time out to hide the loader again
          setTimeout(
          function()
          {
            document.getElementById("loader").style.display = "none";
          },4000);
          // base.alreadyShowed = true;
        }
    }
}

// Here stars everything
controller.init();


/* ===================== NAVIGATION FLOW WITH JQUERY =============================== */
(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 71)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });

  // Scroll to top button appear
  $(document).scroll(function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 80
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Floating label headings for the contact form
  $(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
      $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
      $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
      $(this).removeClass("floating-label-form-group-with-focus");
    });
  });

})(jQuery); // End of use strict
