;
(function ($) {

    $.fn.telephone = function (options) {

        var $this = $(this),
            $body = document.body;

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
        for (i=1; i<10; i++) {
            buttonsString += "<li class='jqt-button jqt-button" + i + "'>" + i + "</li>";
        }
        buttonsString += "<li class='jqt-button jqt-button0'>0</li>";
        markup.buttons = $("<ul class='jqt-buttonsContainer'>" + buttonsString + "</ul>");
        markup.disc = $("<div class='jqt-discContainer'><div class='jqt-disc'></div></div>");

        markup.object.on("click", function(e) {
            e.stopPropagation();
        });
        $body.append(markup.object);

        markup.object.append(markup.tabs);

        markup.buttons.on("click", "li", function(e) {
            markup.object.$input.val(markup.object.$input.val() + e.target.innerHTML);
        });
        markup.object.append(markup.buttons);


        markup.object.append(markup.disc);

        $this.each(function() {
            var $input = $(this);
            if (!$input.is(":text")) return;

            $input.on({
                focus: function() {
                    markup.object
                        .show()
                        .css({
                            top: $input.offset().top + $input.outerHeight(),
                            left: $input.offset().left
                        })
                        .$input = $input;
                },
                click: function(e) {
                    e.stopPropagation();
                }
            });
        });

        $body.on("click", function() {
            markup.object.hide();
        });




        return this;

    };


}(jQuery));

