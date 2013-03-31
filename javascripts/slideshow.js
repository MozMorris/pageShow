// Slideshow Module
var Slideshow = (function () {
  "use strict";

  // slideshow elements
  var actvSlide = $('#actv-slide'),
  next_slide = $('#next-slide'),
  next_btn = $('#next-btn'),
  previous_slide = $('#prev-slide'),
  prev_btn = $('#prev-btn'),


  // disables next / prev buttons while content is loading
  disableNav = function() {
    $('#controls a').on('click', function() { return false; });
    $('#controls a').off('click', navigate);
    $(document).off('keyup', navigate);
    $(window).off('popstate', updateState);
  },

  // enables navigation
  enableNav = function() {
    $('#controls a').on('click', navigate);
    $(document).on('keyup', navigate);
    $(window).on('popstate', updateState);
  },

  // preloads previous / next slides (determined by next/previous buttons)
  loadPreviousNext = function() {
    previous_slide.load($('.prev-next-lnks .prev', actvSlide).attr('href') + ' #actv-slide .content', function() {
      next_slide.load($('.prev-next-lnks .next', actvSlide).attr('href') + ' #actv-slide .content', enableNav);
    });
  },

  // detects which button has been clicked
  navigate = function(e) {
    e.preventDefault();
    disableNav();

    var state = {};

    if (this == prev_btn[0]) {
      previous();
      state = {
        direction: 'prev',
        url: prev_btn.attr('href')
      };
    } else if (this == next_btn[0] || e.which == 32) {
      next();
      state = {
        direction: 'next',
        url: next_btn.attr('href')
      };
    }

    if (typeof state.url != 'undefined') {
      window.history.pushState({ actvSlide: state.url }, document.title, state.url);
    }
  },

  // moves to the next slide
  next = function() {
    actvSlide.animate({
      left: '-20%'
    }, 500, 'swing', function() {
      next_slide.animate({
        left: '0%'
      }, 500, 'swing', updateSlide);
    });
  },

  // moves to the previous slide
  previous = function() {
    actvSlide.animate({
      left: '60%'
    }, 500, 'swing', function() {
      previous_slide.animate({
        left: '40%'
      }, 500, 'swing', updateSlide);
    });
  },

  // updates links for next / prev buttons
  updateLinks = function() {
    var prevLink = $('.prev-next-lnks .prev', actvSlide),
    nextLink = $('.prev-next-lnks .next', actvSlide);

    if (prevLink[0]) {
      prev_btn.attr('href', prevLink.attr('href'));
    }

    if (nextLink[0]) {
      next_btn.attr('href', nextLink.attr('href'));
    }
  },

  // updates active slide
  updateSlide = function() {
    if (this == next_slide[0]) {
      previous_slide.remove();
      previous_slide = actvSlide;
      previous_slide.attr('id', 'prev-slide');
      actvSlide = next_slide;
      actvSlide.attr('id', 'actv-slide');
      updateLinks();
      next_slide = $('<div class="slide" id="next-slide"></div>').appendTo('#slides-wrapper');
      next_slide.load($('.prev-next-lnks .next', actvSlide).attr('href') + ' #actv-slide .content', postLoad);
    } else {
      next_slide.remove();
      next_slide = actvSlide;
      next_slide.attr('id', 'next-slide');
      actvSlide = previous_slide;
      actvSlide.attr('id', 'actv-slide');
      updateLinks();
      previous_slide = $('<div class="slide" id="prev-slide"></div>').prependTo('#slides-wrapper');
      previous_slide.load($('.prev-next-lnks .prev', actvSlide).attr('href') + ' #actv-slide .content', postLoad);
    }
    $([previous_slide, actvSlide, next_slide]).each(function(i, e) {
      this.css('left', '');
    });
  },

  // update the current state of the slideshow
  updateState = function(e) {
    console.log(e.originalEvent.state);
  },

  // performs any tasks after the next / previous slides have been loaded
  postLoad = function() {
    // the buttons work again
    enableNav();
  };

  return {
    initialise: function() {
      loadPreviousNext();
    }
  };

})();
