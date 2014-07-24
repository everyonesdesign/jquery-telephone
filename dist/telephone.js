;
(function ($) {

    $.fn.telephone = function (options) {

        var $this = $(this),
            $body = $(document.body),
            transformVendors = ["-moz-", "-webkit-", "-o-", "-ms-", ""],
            degreeStorage = {deg: 0};

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
            if (!markup.disc.rotate) return;
            var offset = markup.discContainer.offset(), //offset by parent because disc itself rotating
                center_x = (offset.left) + (markup.disc.outerWidth()/2),
                center_y = (offset.top) + (markup.disc.outerHeight()/2),
                mouse_x = e.pageX; var mouse_y = e.pageY,
                radians = Math.atan2(mouse_x - center_x, mouse_y - center_y),
                degree = (radians * (180 / Math.PI) * -1) + 90;
            if (degree > 0 && degree < 45) degree = 0;
            else if (degree > 45 && degree < 90) degree = 90;
            setRotation(degree);
            markup.disc.data("angle", degree);
        }
        //on rotationBegin
        function beginRotation() {
            $(degreeStorage).stop();
            markup.disc.rotate = true;
        }
        //on rotationFinish
        function finishRotation() {
            markup.disc.rotate = false;
            degreeStorage.deg = markup.disc.data("angle");
            if (degreeStorage.deg) {
                $(degreeStorage).animate({deg: 360}, {
                    duration: 500,
                    step: function(now) {
                        for (var i=0; i<transformVendors.length; i++) {
                            setRotation(now);
                            markup.disc.data("angle", now);
                        }
                    }
                });
            }
        }
        //disc listeners
        markup.disc.on({
            mousedown: function(e) {
                beginRotation();
                calcRotation(e);
            },
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
            mousemove: calcRotation
        });




        return this;

    };


}(jQuery));

