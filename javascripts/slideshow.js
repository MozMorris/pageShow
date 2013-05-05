// Slideshow Module
var slideshow = (function () {
  "use strict";

  // slideshow elements
  var $actvSlide = $('#actv-slide');
  var $controls = $('#controls a');
  var $nextSlide = $('#next-slide');
  var $nextBtn = $('#next-btn');
  var $prevSlide = $('#prev-slide');
  var $prevBtn = $('#prev-btn');

  // disables navigation
  var disableNav = function() {
    $controls.on('click', nothing);
    $controls.off('click', navigate);
    $(window).off('popstate', updateState);
  };

  // enables navigation
  var enableNav = function() {
    $controls.off('click', nothing);
    $controls.on('click', navigate);
    $(window).on('popstate', updateState);
  };

  // preloads previous / next slides (determined by next/previous buttons)
  var loadPreviousNext = function() {
    // load previous slide
    $prevSlide.load($('.link-meta .prev', $actvSlide).attr('href') + ' #actv-slide >');
    // load next slide & enabled navigation
    $nextSlide.load($('.link-meta .next', $actvSlide).attr('href') + ' #actv-slide >', enableNav);
  };

  // detects which button has been clicked
  var navigate = function(e) {
    e.preventDefault();
    disableNav();
    var state = {};

    if (this == $prevBtn[0]) {
      previous();
      state = {
        direction: 'prev',
        url: $prevBtn.attr('href')
      };
    } else if (this == $nextBtn[0]) {
      next();
      state = {
        direction: 'next',
        url: $nextBtn.attr('href')
      };
    }

    if (typeof state.url != 'undefined') {
      window.history.pushState({ $actvSlide: state.url }, document.title, state.url);
    }
  };

  // moves to the next slide
  var next = function() {
    $actvSlide.animate({
      left: '-20%'
    }, 500, 'swing', function() {
      $nextSlide.animate({
        left: '0%'
      }, 500, 'swing', updateSlide);
    });
  };

  // moves to the previous slide
  var previous = function() {
    $actvSlide.animate({
      left: '60%'
    }, 500, 'swing', function() {
      $prevSlide.animate({
        left: '40%'
      }, 500, 'swing', updateSlide);
    });
  };

  // updates links for next / prev buttons
  var updateLinks = function() {
    var prevLink = $('.link-meta .prev', $actvSlide),
    nextLink = $('.link-meta .next', $actvSlide);

    if (prevLink[0]) {
      $prevBtn.attr('href', prevLink.attr('href'));
    }

    if (nextLink[0]) {
      $nextBtn.attr('href', nextLink.attr('href'));
    }
  };

  // updates active slide
  var updateSlide = function() {
    if (this == $nextSlide[0]) {
      activateNext();
    } else {
      activatePrev();
    }

    // reset the css
    $([$prevSlide, $actvSlide, $nextSlide]).each(function(i, e) {
      this.css('left', '');
    });
  };

  // bring the next slide into view
  var activateNext = function() {
    $prevSlide.remove();
    $prevSlide = $actvSlide;
    $prevSlide.attr('id', 'prev-slide');
    $actvSlide = $nextSlide;
    $actvSlide.attr('id', 'actv-slide');
    updateLinks();
    $nextSlide = $('<div class="slide" id="next-slide"></div>').appendTo('#slides-wrapper');
    $nextSlide.load($('.link-meta .next', $actvSlide).attr('href') + ' #actv-slide >', postLoad);
  };

  // bring the previous slide into view
  var activatePrev = function() {
    $nextSlide.remove();
    $nextSlide = $actvSlide;
    $nextSlide.attr('id', 'next-slide');
    $actvSlide = $prevSlide;
    $actvSlide.attr('id', 'actv-slide');
    updateLinks();
    $prevSlide = $('<div class="slide" id="prev-slide"></div>').prependTo('#slides-wrapper');
    $prevSlide.load($('.link-meta .prev', $actvSlide).attr('href') + ' #actv-slide >', postLoad);
  };

  // update the current state of the slideshow
  var updateState = function(e) {
    console.log(e.originalEvent.state);
  };

  // performs any tasks after the next / previous slides have been loaded
  var postLoad = function() {
    // the buttons work again
    enableNav();
  };

  // do nothing
  var nothing = function() {
    return false;
  };

  return {
    initialise: function() {
      loadPreviousNext();
    }
  };

})();
