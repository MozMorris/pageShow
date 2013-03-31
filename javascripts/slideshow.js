// Slideshow Module
var slideshow = (function () {
  "use strict";

  // slideshow elements
  var actvSlide = $('#actv-slide');
  var nextSlide = $('#next-slide');
  var nextBtn = $('#next-btn');
  var prevSlide = $('#prev-slide');
  var prevBtn = $('#prev-btn');

  // disables next / prev buttons while content is loading
  var disableNav = function() {
    $('#controls a').on('click', function() { return false; });
    $('#controls a').off('click', navigate);
    $(document).off('keyup', navigate);
    $(window).off('popstate', updateState);
  };

  // enables navigation
  var enableNav = function() {
    $('#controls a').on('click', navigate);
    $(document).on('keyup', navigate);
    $(window).on('popstate', updateState);
  };

  // preloads previous / next slides (determined by next/previous buttons)
  var loadPreviousNext = function() {
    prevSlide.load($('.prev-next-lnks .prev', actvSlide).attr('href') + ' #actv-slide .content', function() {
      nextSlide.load($('.prev-next-lnks .next', actvSlide).attr('href') + ' #actv-slide .content', enableNav);
    });
  };

  // detects which button has been clicked
  var navigate = function(e) {
    e.preventDefault();
    disableNav();

    var state = {};

    if (this == prevBtn[0]) {
      previous();
      state = {
        direction: 'prev',
        url: prevBtn.attr('href')
      };
    } else if (this == nextBtn[0] || e.which == 32) {
      next();
      state = {
        direction: 'next',
        url: nextBtn.attr('href')
      };
    }

    if (typeof state.url != 'undefined') {
      window.history.pushState({ actvSlide: state.url }, document.title, state.url);
    }
  };

  // moves to the next slide
  var next = function() {
    actvSlide.animate({
      left: '-20%'
    }, 500, 'swing', function() {
      nextSlide.animate({
        left: '0%'
      }, 500, 'swing', updateSlide);
    });
  };

  // moves to the previous slide
  var previous = function() {
    actvSlide.animate({
      left: '60%'
    }, 500, 'swing', function() {
      prevSlide.animate({
        left: '40%'
      }, 500, 'swing', updateSlide);
    });
  };

  // updates links for next / prev buttons
  var updateLinks = function() {
    var prevLink = $('.prev-next-lnks .prev', actvSlide),
    nextLink = $('.prev-next-lnks .next', actvSlide);

    if (prevLink[0]) {
      prevBtn.attr('href', prevLink.attr('href'));
    }

    if (nextLink[0]) {
      nextBtn.attr('href', nextLink.attr('href'));
    }
  };

  // updates active slide
  var updateSlide = function() {
    if (this == nextSlide[0]) {
      prevSlide.remove();
      prevSlide = actvSlide;
      prevSlide.attr('id', 'prev-slide');
      actvSlide = nextSlide;
      actvSlide.attr('id', 'actv-slide');
      updateLinks();
      nextSlide = $('<div class="slide" id="next-slide"></div>').appendTo('#slides-wrapper');
      nextSlide.load($('.prev-next-lnks .next', actvSlide).attr('href') + ' #actv-slide .content', postLoad);
    } else {
      nextSlide.remove();
      nextSlide = actvSlide;
      nextSlide.attr('id', 'next-slide');
      actvSlide = prevSlide;
      actvSlide.attr('id', 'actv-slide');
      updateLinks();
      prevSlide = $('<div class="slide" id="prev-slide"></div>').prependTo('#slides-wrapper');
      prevSlide.load($('.prev-next-lnks .prev', actvSlide).attr('href') + ' #actv-slide .content', postLoad);
    }
    $([prevSlide, actvSlide, nextSlide]).each(function(i, e) {
      this.css('left', '');
    });
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

  return {
    initialise: function() {
      loadPreviousNext();
    }
  };

})();
