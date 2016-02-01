//slider
(function ($, global) {
  var HSHC = global.HSH || {};

  HSHC.Utils =  (function () {
    return {
    //check for mobile user agents
      isMobile : (function(){
               if( navigator.userAgent.match(/Android/i)
               || navigator.userAgent.match(/webOS/i)
               || navigator.userAgent.match(/iPhone/i)
               || navigator.userAgent.match(/iPod/i)
               || navigator.userAgent.match(/BlackBerry/i)
               || navigator.userAgent.match(/Windows Phone/i)
               ){
                      return true;
                }
               else {
                  return false;
                }
      })()
    }

  }());

  HSHC.Hero = (function () {
    return {

      init: function () {
        this.startAnimation();
      },

      startAnimation: function(){
        var _this = this;
        setTimeout(_this.showHeroLogo, 100);

        for(var i = 1; i < 8; i++) {
          (function(index) {
              setTimeout(function() {
                $('.hero-prod-logos .prod.p'+index).addClass('in');
              }, 700 + (i*300));
          })(i);
        }

      },

      showHeroLogo: function(){
        $('.hero-logo').addClass('in');
      },

    }
  }());

  HSHC.Slider = (function () {
    return {

      ui : null,
      prevSlideClass: null,

      init: function () {
        var _this = this;

        //cache elements
        this.ui = {
          $doc: $(window),
          $slider: $('.slider'),
          $productsDisplay: $('#products-display'),
          $productsNav: $('#products-nav li')
        }

        _this.initSlider();
        _this.addEventListeners();
      },

      addEventListeners: function(){
        var _this = this;

        this.ui.$productsNav.click(function(){
          var index = $(this).index();
          _this.ui.$slider.data('owlCarousel').goTo(index);
          return false;
        })

        if(HSHC.Utils.isMobile)
          return;
        /*_this.ui.$doc.scroll(function() {
          var top = _this.ui.$doc.scrollTop(),
              speedAdj = (top*0.6),
              speedAdjOffset = speedAdj - top;

          _this.ui.$slider.css('webkitTransform', 'translate(0, '+ speedAdj +'px)');
          _this.ui.$slider.find('.container').css('webkitTransform', 'translate(0, '+  speedAdjOffset +'px)');
        })*/
      },

      initSlider: function(){
        var _this = this;

        this.ui.$slider.owlCarousel({
          //autoPlay : 3000,
          stopOnHover : true,
          slideSpeed: 600,
          pagination: false,
          goToFirstSpeed : 2000,
          singleItem : true,
          autoHeight : true,
          transitionStyle: 'backSlide',
          afterInit: function(){
            _this.prevSlideClass = _this.ui.$productsNav[this.currentItem].getAttribute('data-prod');
          },
          afterAction : function(elem, num){
            _this.handleSliderUpdate(this.currentItem);
          }
        });
      },

      handleSliderUpdate: function(num){
        var _this = this;
        var li = this.ui.$productsNav[num];
        var classToAdd = li.getAttribute('data-prod');

        this.ui.$productsDisplay.removeClass(_this.prevSlideClass).addClass(classToAdd);
        _this.prevSlideClass = classToAdd;

        this.ui.$productsNav.removeClass('active');
        $(li).addClass('active');
      }

    }
  }());

  HSHC.Positions = (function () {
    return {

      init: function () {
        var _this = this;
        this.panels = $('#jobs .panel-body').hide();

        $('#jobs .trigger').click(function() {
          var $this = $(this);

          _this.panels.slideUp();

          if($this.hasClass('active')){
            $this.removeClass('active');
            $('.job').removeClass('active');
          }else{
            $('#jobs .trigger').removeClass('active');
            $('.job').removeClass('active');
            $this.addClass('active');
            $this.closest('.job').addClass('active');
          }

          if($(this).parent().find('.panel-body').css('display') != 'block'){
            $(this).parent().find('.panel-body').slideDown();
              return false;
          }
          return false;
        });

      }

    }
  }());

  HSHC.Timeline = (function () {
    return {

      init: function () {
        this.initScrollpane();
      },

      initScrollpane: function(){
        $('.scroll-pane').jScrollPane({
          autoReinitialise: true
        });
      }

    }
  }());

  $( document ).ready(function() {
    if($('.index').length > 0){
      HSHC.Slider.init();
      HSHC.Hero.init();
    }

    if($('#jobs').length > 0){
      HSHC.Positions.init();
    }

    if($('#timeline').length > 0){
      HSHC.Timeline.init();
    }
  });

}(jQuery, this));

//add bind support in donk browsers
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
