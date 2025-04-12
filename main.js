/**
 * This file controls the page logic
 *
 * depends on jQuery>=1.7
 */
var canvas;
var scratchers = [];
(function () {
    /**
     * Returns true if this browser supports canvas
     *
     * From http://diveintohtml5.info/
     */
    // var cursor_x = -1;
    // var cursor_y = -1;
    //Select the background color
    var color = '#ffebb3';
    //Select the text color
    var colortxt = '#ffbb00';
    var gendertext = "Great News!";
    var backgrnd;
    //Select the gender text
    var surname;
    var soundHandle = new Audio();
    var triggered = false;
    var nosound = true;
    var params = new URLSearchParams(window.location.search.slice(1));
    var pct1 = 0;

    function supportsCanvas() {
        return !!document.createElement('canvas').getContext;
    };


    /**
     * Handle scratch event on a scratcher
     */
    function checkpct() {
        if (!triggered) {
            if (pct1 > 15 && pct1 < 23) {
                //document.getElementById("scratcher3Pct").innerHTML="Scratch MORE!";
                if (CrispyToast.toasts.length===0) {
                    CrispyToast.success('Scratch MORE!', { position: 'top-center', timeout: 2000});
                }
            }
            if (pct1 > 23) {
                $('#surprise').text(gendertext);
                $('#surprise').css('color', colortxt);
                if(CrispyToast.toasts.length!=0){
                    CrispyToast.clearall();
                }
                scratchers[0].clear();
                document.getElementsByTagName("body")[0].style.backgroundColor = color;
                document.getElementsByTagName("body")[0].style.backgroundImage = 'none';
                document.getElementById("H3").insertAdjacentHTML('afterend', "<h4 id='testtext' style='white-space:normal'>Because this is a demo, message under scratch area appears only for 1 second. In the real product, it will clear after scratch.</h4>");
                //document.getElementsByTagName("body")[0].style.backgroundImage.animation = 'gradient 15s ease infinite';
                $('#H3').hide();
                $('#H4').hide();
                setTimeout(function() {
                    scratchers[0].reset();
                  }, 100);
                confetti_effect();
 
            }
        }
    };
    function scratcher1Changed(ev) {
        pct1 = (this.fullAmount(30) * 100) | 0;
        checkpct();
    };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    };
    function confetti_effect() {
        if (triggered == true) {
            return;
        }
        if (!nosound) {
            soundHandle.volume = 0.5;
            soundHandle.play();
        }
        triggered = true;
        // do this for 10 seconds
        var end = Date.now() + (5 * 1000);
        var colors = ['#bb0000', '#ffffff'];

        (function frame() {

            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });


            // keep going until we are out of time
            if (Date.now() < end) {
                requestAnimationFrame(frame);

                return;
            }
            $("#resetbutton").show();

        }());


    };

    /**
     * Reset all scratchers
     */
    function onResetClicked(scratchers) {
        var i;
        pct1 = 0;
        CrispyToast.toasts=[];
        $("#resetbutton").hide();
        for (i = 0; i < scratchers.length; i++) {
            scratchers[i].reset();
        }

        $('#surprise').text('Surprise!');
        $('#surprise').css('color', colortxt);

        document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background.jpg)';
        document.getElementById('testtext').remove();
        $('#H3').show();
        $('#H4').show();
        triggered = false;
        soundHandle.pause();
        soundHandle.currentTime = 0;
        return false;
    };
    function fitCanvastoDiv() {
        var ttd = $(canvas).parent();
        // var ttd = document.getElementById('scratcher-box');
        canvas.width = ttd.width();
        canvas.height = canvas.width;
        if(scratchers[0]){ 
            if (triggered) {
            scratchers[0].resetnoclear(true);
        } else {
            scratchers[0].resetnoclear(false);
        }
        }
    }
    function initPage() {
        var scratcherLoadedCount = 0;
        canvas = document.getElementById("scratcher1");
        var i, i1;

        // document.addEventListener('mousedown', setMousePos, false);
        // function setMousePos(event) {
        //     cursor_x = event.pageX;
        //     cursor_y = event.pageY;
        //     }
        $( window ).on({
            orientationchange: function(e) {
                fitCanvastoDiv();
            },resize: function(e) {
                fitCanvastoDiv();
            }
        });        
        fitCanvastoDiv();

        surname = params.get('surname');
        if (surname != null && surname.replace(/\s/g, '').length) {
            $("#baby").text(' ' + surname + ' family!');
        }
        else {
            $("#baby").text('the family!');
            surname = "the";
        }
        // backgrnd = params.get('back');
        // if (backgrnd != null) {
        //     document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/' + backgrnd + '.jpg)';
        // }
        // else {
        //     document.getElementsByTagName("body")[0].style.backgroundImage = 'url(images/background.jpg)';
        // }

        document.getElementById('intro').innerHTML = "This scratch off surprise card for <strong>" + surname + "</strong> family contains sound when the surprise is revealed. Do you want to continue with sound?";
        document.getElementById('id01').style.display = 'block';
        $('.nosoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display = 'none';
            nosound = true;
        });
        $('.withsoundbtn').on("click", function (e) {
            document.getElementById('id01').style.display = 'none';
            nosound = false;
            if (soundHandle.currentTime != 0) { return; }
            soundHandle = document.getElementById('soundHandle');
            soundHandle.autoplay = true;
            soundHandle.muted = false;
            soundHandle.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            soundHandle.src = 'audio/celebrate.mp3';
            soundHandle.play();
            soundHandle.pause();
        });
        document.addEventListener(
            "visibilitychange",
            function (evt) {
                if (document.visibilityState != "visible") {
                    soundHandle.pause();
                    soundHandle.currentTime = 0;
                }
            },
            false,
        );
        // const mediaQueryList = window.matchMedia("(orientation: portrait)");
        // mediaQueryList.addEventListener("change", handleOrientationChange);
        // handleOrientationChange(mediaQueryList);



        document.getElementById("resetbutton").style.backgroundColor = colortxt;

        // called each time a scratcher loads
        function onScratcherLoaded(ev) {

            scratcherLoadedCount++;
            $("table1").width($(window).width());
            if (scratcherLoadedCount == scratchers.length) {
                // all scratchers loaded!

                // bind the reset button to reset all scratchers
                $('#resetbutton').on('click', function () {
                    onResetClicked(scratchers);
                });

                // hide loading text, show instructions text
                //$('#loading-text').hide();
                //$('#inst-text').show();
            }
        };

        // create new scratchers
        scratchers = new Array(1);

       for (i = 0; i < scratchers.length; i++) {
            i1 = i + 1;
            scratchers[i] = new Scratcher('scratcher' + i1);

            // set up this listener before calling setImages():
            scratchers[i].addEventListener('imagesloaded', onScratcherLoaded);

            scratchers[i].setImages('images/s' + i1 + 'bg.jpg',
                'images/foreground.jpg');
                scratchers[i].setShape('heart');


        }

        // get notifications of this scratcher changing
        // (These aren't "real" event listeners; they're implemented on top
        // of Scratcher.)
        //scratchers[3].addEventListener('reset', scratchersChanged);
        scratchers[0].addEventListener('scratchesended', scratcher1Changed);

        // var canvas = document.getElementById('scratcher1');
        // canvas.onmousemove = null;

        // Or if you didn't want to do it every scratch (to save CPU), you
        // can just do it on 'scratchesended' instead of 'scratch':
        //scratchers[2].addEventListener('scratchesended', scratcher3Changed);
    };

    /**
     * Handle page load
     */
    $(function () {
        if (supportsCanvas()) {
            initPage();
        } else {
            $('#scratcher-box').hide();
            $('#lamebrowser').show();
        }
    });

})();
