console.log("Javascript is alive!");
var START_YEAR = 2025;
var YEARS_WIDE = 6025;
var DECADES = parseInt(YEARS_WIDE / 10) + 1;
var tlPaused = true;
var tlSpeed = 0.0;
var tickContainer = document.getElementById('tlTickContainer');
var tlSurface = document.getElementById('tlSurface');
var i;


window.onload = function() {

    // Utility function for creating DOM element
    // **************************************************
    var createElement = function(tag, id, className) {
        var elem = document.createElement(tag);
        elem.id = id;
        elem.className = className;
        return elem;
    };

    // Create timeline year/tick DOM elements
    // **************************************************
    for (i = 0; i < DECADES; i++) {
        var tlCell = createElement('div', undefined, 'tlTickCell');
        tlCell.style.left = ((i * 100) + 'px');
        var tlImg = createElement('div', undefined, 'tlTickImg');
        var tlLabel = createElement('div', undefined, 'tlTickLabel');
        tlLabel.textContent = (START_YEAR - 5) - (i * 10);
        tlCell.appendChild(tlImg);
        tlCell.appendChild(tlLabel);
        tickContainer.appendChild(tlCell);
    }
    // Start with the scrolling layer shifted 500 pixels so that start of timeline is in center of screen
    tlSurface.style.left = "500px";

    // Create Greensock timeline tweens
    // **************************************************
    var tl = new TimelineLite({useFrames: true});
    tl.timeScale(tlSpeed);

    // This callback is invoked when the start of the timeline is reached
    tl.call(function () {
        tlPaused = true;
        tl.pause();
        tlSpeed = 0; sliderSpeed.setValue(0);
        slider.setValue(0);
        tl.seek(1);
    });

    // First tween is for the master timeline
    // Each 'year' is 10 pixels wide. At speed 1.0 we scroll at one pixel per frame, 60 frames per second
    tl.to('#tlSurface', (YEARS_WIDE * 10), { left: -((YEARS_WIDE * 10) - 500), ease: Linear.easeNone});
    // Create a DOM element for each item in the DATA list
    for (i = 0; i < DATA.length; i++) {
        var pos, width;
        if (DATA[i].died == undefined) {
            pos = 0;
        } else {
            pos = (START_YEAR - DATA[i].died) * 10;
        }
        width = (START_YEAR - DATA[i].born) * 10 - pos;

        var elem = createElement('div', undefined, 'tlBar');
        elem.style.top = ((175 + ((i % 6) * 32)) + 'px');
        elem.style.left = (pos + 'px');
        elem.style.width = (width + 'px');
        elem.style.opacity = 0.5;
        elem.textContent = DATA[i].name;
        if (DATA[i].sex == 'F') {
            elem.style.backgroundColor = "#fac"
        }

        // Create a timeline tween animation for each item in the DATA list
        tl.to(elem, 15, {opacity: 1.0, scaleY: 1.5}, pos);
        tl.to(elem, 15, {scaleY: 1.0}, pos + 15);
        tl.to(elem, 50, {opacity: .33}, pos+width);

        DATA[i].elem = elem;
        tlSurface.appendChild(elem);
    }

    for (i = 0; i < IMAGES.length; i++) {
        var pos = (START_YEAR - IMAGES[i].year) * 10 - 48;

        var elem = createElement('img', undefined, 'tlImage');
        elem.style.left = (pos + 'px');
        elem.src = "./resources/images/" + IMAGES[i].url;

        // Create a timeline tween animation for each item in the DATA list
        tl.to(elem, 15, {scale: 1.33}, pos);
        tl.to(elem, 15, {scale: 1.0}, pos + 80);

        IMAGES[i].elem = elem;
        tlSurface.appendChild(elem);
    }

    // This callback is invoked when the end of the timeline is reached
    tl.call(function () {
        tlPaused = true;
        tl.pause();
        tlSpeed = 0;
        sliderSpeed.setValue(0);
        slider.setValue(YEARS_WIDE);
    });

    // Instantiate sliders for position and speed control
    // **************************************************
    var slider = new dhtmlXSlider({
        parent: "tlSlider",
        min: 0,
        max: YEARS_WIDE + 1,
        step: 1,
        value: 0
    });
    slider.attachEvent("onChange", function (value) {
        tl.seek(value * 10);
        tlSpeed = 0;
        tl.timeScale(tlSpeed);
        sliderSpeed.setValue(0);
    });

    var sliderSpeed = new dhtmlXSlider({
        parent: "tlSpeed",
        min: -30,
        max: 30,
        step: .50,
        value: 1.0
    });
    sliderSpeed.attachEvent("onChange", function (value) {
        tl.timeScale(value);
        tlSpeed = value;
        if (tlPaused) {
            tlPaused = false;
            tl.play();
        }
    });

    // Event handler - click in timeline to pause/play
    // **************************************************
    document.getElementById('tlViewport').onclick = function (event) {
        tlPaused = !tlPaused;
        if (tlPaused) {
            tl.pause();
            slider.setValue(tl.time() / 10);
        } else {
            if (tlSpeed == 0) {
                tlSpeed = 1.0;
            }
            tl.timeScale(tlSpeed);
            tl.play();
        }
    };
};
