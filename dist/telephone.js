;
(function ($) {

    $.fn.telephone = function (options) {

        var $this = $(this),
            $body = $(document.body),
            transformVendors = ["-moz-", "-webkit-", "-o-", "-ms-", ""],
            degreeStorage = {deg: 0},
            beginAngle = 0;

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
        //basic object
        markup.object = $("<div class='jqt-container' style='display: none; position: absolute;'></div>");
        markup.tabs = $("<ul class='jqt-tabs'><li class='jqt-tab'>Buttons</li><li class='jqt-tab'>Disc</li></ul>");

        //buttons
        var buttonsString = "";
        for (var i=1; i<10; i++) {
            buttonsString += "<li class='jqt-button jqt-button" + i + "'>" + i + "</li>";
        }
        buttonsString += "<li class='jqt-button jqt-button0'>0</li>";
        markup.buttons = $("<ul class='jqt-buttonsContainer'>" + buttonsString + "</ul>");

        //disc
        markup.disc = $("<div class='jqt-disc'></div>");
        var discNumbersString = "";
        for (var i=1; i<10; i++) {
            discNumbersString += "<li class='jqt-discNumber jqt-discNumber" + i + "'>" + i + "</li>";
        }
        discNumbersString += "<li class='jqt-discNumber jqt-discNumber0'>0</li>";
        markup.discContainer = $("<div class='jqt-discContainer'><ul class='jqt-discNumbersContainer'>" + discNumbersString + "</ul></div>");
        markup.disc.rotate = false;
        markup.disc.finish = false;

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
        function calcRotation(e) {
            if (!markup.disc.rotate) return null;
            var offset = markup.discContainer.offset(), //offset by parent because disc itself rotating
                center_x = (offset.left) + (markup.disc.outerWidth()/2),
                center_y = (offset.top) + (markup.disc.outerHeight()/2),
                mouse_x = e.pageX; var mouse_y = e.pageY,
                radians = Math.atan2(mouse_x - center_x, mouse_y - center_y),
                degree = (radians * (180 / Math.PI) * -1) + 90;
            if (degree < 0) degree = degree + 360;
            if (degree > 0 && degree < 45) degree = 0;
            else if (degree > 45 && degree < 90) degree = 90;
            return degree;
        }
        //on rotationBegin
        function beginRotation(e) {
            $(degreeStorage).stop();
            markup.disc.rotate = true;
            markup.disc.finish = false;
            beginAngle = calcRotation(e);
        }
        //on rotationFinish
        function finishRotation(degrees) {
            if (degrees == 0) return; //not to make full circle =)
            degreeStorage.deg = degrees;
            markup.disc.finish = true;
            $(degreeStorage).animate({deg: 360}, {
                duration: 500,
                step: function(now) {
                    for (var i=0; i<transformVendors.length; i++) {
                        setRotation(now);
                    }
                },
                complete: function() {
                    markup.disc.rotate = false;
                    markup.disc.finish = false;
                }
            });
        }
        //disc listeners
        markup.disc.on({
            mousedown: function(e) {
                beginRotation(e);
                setRotation(calcRotation(e));
            }
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
            click: function(e) {
                if (!markup.disc.rotate) markup.object.hide();
            },
            mouseup: function(e) {
                if (markup.disc.rotate && !markup.disc.finish) finishRotation(calcRotation(e));
            },
            mousemove: function(e) {
                if (markup.disc.rotate && !markup.disc.finish) {
                    var angle = calcRotation(e);
                    setRotation(angle);
                }
            }
        });

        return this;

    };


}(jQuery));

