(function(){

  Sidebar = Base.extend({

    $body: null,
    $overlay: null,
    $sidebar: null,
    $sidebarHeader: null,
    $sidebarImg: null,
    $toggleButton: null,

    constructor: function(){
      this.$body = $('body');
      this.$overlay = $('.sidebar-overlay');
      this.$sidebar = $('#sidebar');
      this.$links = $('.main', this.$sidebar);
      this.$sidebarHeader = $('#sidebar .sidebar-header');
      this.$toggleButton = $('.navbar-toggle');
      this.sidebarImg = this.$sidebarHeader.css('background-image');

      this.addEventListeners();
    },

    addEventListeners: function(){
      var _this = this;

      _this.$toggleButton.on('click', function() {
        _this.$sidebar.toggleClass('open');
        if ((_this.$sidebar.hasClass('sidebar-fixed-left') || _this.$sidebar.hasClass('sidebar-fixed-right')) && _this.$sidebar.hasClass('open')) {
          _this.$overlay.addClass('active');
          _this.$body.css('overflow', 'hidden');
        } else {
          _this.$overlay.removeClass('active');
          _this.$body.css('overflow', 'auto');
        }

        return false;
      });

      _this.$links.on('click', function() {
        setTimeout(_this.closeSidebar.bind(_this), 250);
      })

      _this.$overlay.on('click', function() {
        _this.closeSidebar();
      });
    },

    closeSidebar(){
      var _this = this;
      _this.$overlay.removeClass('active');
      _this.$body.css('overflow', 'auto');
      _this.$sidebar.removeClass('open');
    }

  });

  window.Sidebar = Sidebar;

})();
