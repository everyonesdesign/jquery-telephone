;
(function ($) {

    $.fn.telephone = function (options) {

        var $this = $(this),
            $body = $(document.body),
            transformVendors = ["-moz-", "-webkit-", "-o-", "-ms-", ""];

        //setting options
        var defaults = {
            //mask
            //type (discus/electro)
            //speed of discus return, ms
            //smart positioning
        };

        options = $.extend(defaults, options);

        //setting markup
        var markup = {};
        markup.object = $("<div class='jqt-container' style='display: none; position: absolute;'></div>");
        markup.tabs = $("<ul class='jqt-tabs'><li class='jqt-tab'>Buttons</li><li class='jqt-tab'>Disc</li></ul>");
        var buttonsString = "";
        for (var i=1; i<10; i++) {
            buttonsString += "<li class='jqt-button jqt-button" + i + "'>" + i + "</li>";
        }
        buttonsString += "<li class='jqt-button jqt-button0'>0</li>";
        markup.buttons = $("<ul class='jqt-buttonsContainer'>" + buttonsString + "</ul>");
        markup.disc = $("<div class='jqt-disc'></div>");
        markup.discContainer = $("<div class='jqt-discContainer'></div>");

        //stop closing on container click
        markup.object.on({
            click: function(e) {
                e.stopPropagation();
            }
        });
        $body.append(markup.object);
        markup.object.append(markup.tabs);

        //buttons click listener
        markup.buttons.on("click", "li", function(e) {
            markup.object.$input.val(markup.object.$input.val() + e.target.innerHTML);
        });
        markup.object.append(markup.buttons);

        markup.discContainer.append(markup.disc);
        function setRotation(degrees) {
            for (var i=0; i<transformVendors.length; i++) {
                markup.disc.css(transformVendors[i]+"transform", "rotate(" + degrees + "deg)");
            }
        }
        //on rotationBegin
        function beginRotation() {
            markup.disc.rotate = true;
            if ($body.hasClass("jqt-rotating")) {
                markup.disc.stop();
                for (var i=0; i<transformVendors.length; i++) {
                    setRotation(0);
                    markup.disc.data("angle", 0);
                }
            } else {
                $body.addClass("jqt-rotating");
            }
        }
        //on rotationFinish
        function finishRotation() {
            var beginAngle = markup.disc.data("angle");
            markup.disc.rotate = false;
            $body.removeClass("jqt-rotating");
            $({deg: beginAngle}).animate({deg: 0}, {
                duration: 500,
                step: function(now) {
                    for (var i=0; i<transformVendors.length; i++) {
                        setRotation(now);
                        markup.disc.data("angle", now);
                    }
                }
            });
        }
        //disc listeners
        markup.disc.on({
            mousedown: beginRotation,
            mouseup: finishRotation
        });
        markup.object.append(markup.discContainer);

        $this.each(function() {
            var $input = $(this);
            if (!$input.is(":text")) return;

            $input.on({
                focus: function() {
                    var offset = $input.offset();
                    markup.object
                        .show()
                        .css({
                            top: offset.top + $input.outerHeight(),
                            left: offset.left
                        })
                        .$input = $input;
                },
                click: function(e) {
                    e.stopPropagation();
                }
            });
        });

        $body.on({
            click: function() {
                if (!markup.disc.rotate) markup.object.hide();
                finishRotation();
            },
            mousemove: function(e) {
                if (!markup.disc.rotate) return;
                var offset = markup.discContainer.offset(), //offset by parent because disc itself rotating
                    center_x = (offset.left) + (markup.disc.outerWidth()/2),
                    center_y = (offset.top) + (markup.disc.outerHeight()/2),
                    mouse_x = e.pageX; var mouse_y = e.pageY,
                    radians = Math.atan2(mouse_x - center_x, mouse_y - center_y),
                    degree = (radians * (180 / Math.PI) * -1) + 180;
                for (var i=0; i<transformVendors.length; i++) {
                    setRotation(degree);
                    markup.disc.data("angle", degree);
                }
            }
        });




        return this;

    };


}(jQuery));

