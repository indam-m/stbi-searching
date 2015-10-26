/* others */

$(function () {
    Site.init();
    $('[data-toggle="tooltip"]').tooltip();
});

    var Site = {
        init: function () {
            Site.sidebarToggle();
            Site.controlSubMenu();
            Site.convertMonth();
            Site.fullHeight();
        },

        sidebarToggle: function() {
            $("#header-s__toggle").click(function () {
                $('nav.sidebar-s').css('opacity', 1);
                var layerWidth = $(window).width() - $('nav.sidebar-s').width();
                $(".layer-hidden").css('width', layerWidth).css('display', 'block');
                $('.footer-s').css('position', 'fixed').css('left',290);
                $('#container-s').bind('touchmove', function (e) {
                  e.preventDefault()
                });
                $("#container-s").animate({"marginLeft": ["290px", 'swing']}, {
                  duration: 30
                });
              });

              //close the menu
              $(".layer-hidden").click(function () {
                $('#container-s').unbind('touchmove');
                $("#container-s").animate({"marginLeft": ["0", 'swing']}, {
                  duration: 30,
                  complete: function () {
                    $('.layer-hidden').css('display', 'none');
                    $('nav.sidebar-s').css('opacity', 0);
                    $('#content-s').css('min-height', 'auto');
                    $('.footer-s').css('position', 'absolute').css('left',0);
                  }
                });
          });
        },

        controlSubMenu: function() {
            $('a.menu-has-sub').click(function() {
                if($(this).children("i.sidebar-s--icon-ddown").hasClass("fa-angle-right")){
                    $(this).find("i.sidebar-s--icon-ddown").removeClass("fa-angle-right").addClass("fa-angle-down");
                    $(this).parents("li").addClass("sidebar-s--has-sub");
                    $(".sidebar-s--sub").slideDown();
                }
            });
        },

        fullHeight: function() {
            var height = $(window).height() - $('header.header-s').height() - $('footer.footer-s').height();
            $('.tosca-wrapper').css('min-height',height);
        },

        opLight : {
            "overlay" : true,
            "overlay_color" : "#000",
            "opacity" : .5,
            "element" : null,
            "box-color" : null,
            "position" : "center",
            "onClose" : null,
            "autoLight" : false,
            "onLight" : null
        }
    }

    Site.Lightbox = function(opts){
        if(typeof opts != "object"){
            console.log("options harus bertipe object");
            return false;
        }
        if(opts.element == null | opts.element == ""){
            console.log("options.element harus diisi");
            return false;
        }

        var optionsKeys = Object.keys(opts);
        for(i = 0; i < optionsKeys.length; i++){
            if(Site.opLight.hasOwnProperty(optionsKeys[i]))
                Site.opLight[optionsKeys[i]] = opts[optionsKeys[i]];
        };
        var idRegx = /(#-?[_a-zA-Z]+[_a-zA-Z0-9-])\w+/g;
        var isId = false;

        if(Site.tesId(Site.opLight.element)){
            isId = true;
            Site.opLight.element = opLight.element.replace("#","");
        }

        if(Site.isFunction(Site.opLight.onClose))
            this.onClose = Site.opLight.onClose;

        if(Site.isFunction(Site.opLight.onLight))
            this.onLight = opLight.onLight;

        (Site.opLight.autoLight) ? this.doLight() : this.doClose();
    }

    Site.Lightbox.prototype = {
        onLight : function(){
            console.log("Lightbox is on");
        },
        onClose : function(){
            console.log("Lightbox is off");
        },
        doLight : function(){
            var dis = this;
            var lb = document.getElementById("lightbox-shadow");
            $(lb).fadeIn("fast",function(){
                $(document.getElementById(Site.opLight.element)).fadeIn('fast', function(){
                    dis.onLight();
                    $(lb).on("click", function(){
                      dis.doClose();
                  });
                });
            });
        },
        doClose : function(){
            var dis = this;
            var lb = document.getElementById("lightbox-shadow");
            $(lb).fadeOut('fast', function(){
                $(document.getElementById(Site.opLight.element)).fadeOut('fast', function(){$(lb).off('click')});
            })
        }
    }