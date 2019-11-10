const slideTime = 10000; // ms

/**
 * @class Carousel
 */

class Carousel {
    constructor(state) {
        this._state = state;
    }

    set state(state) {
        this._state = state
    }

    run() {
        this._state.draw();
        this._state.getNext(this);
        //setTimeout(this.run(), slideTime)
        // Update data
    }


}

/**
 * @class Slide
 */

class Slide {
    constructor() {
        if (new.target === Slide) {
            throw new Error("Cannot instantiate abstract class");
        }
        this._contentbox = arguments[0][0];
        this._header = arguments[0][1];
        this._html = arguments[0][2];
    }

    get contentBox() {
        return this._contentbox;
    }

    get header() {
        return this._header;
    }

    get html() {
        return this._html;
    }

    set next(slide) {
        this._next = slide
    }

    get next() {
        return this._next
    }

    getNext(carousel) {
        carousel.state = this._next
    }

    set data(data) {
        this._data = data
    }

    draw() {
        //console.log("Timeout set for " + this._next);
        //sleep(5000);
        //setTimeout(this._next.draw(), slideTime);
        //console.log("Timeout done for " + this._next);
    }
}

/**
 * @class DrankTonight
 * @description Graph of most bought products tonight
 */

class DrankTonight extends Slide {
    constructor() {
        super(arguments);
    }

    draw() {
        const header = this.header;
        let content = this.contentBox;
        this.contentBox.innerHTML = this.html;

        const receivedData = {
            "labels": ['Bier', 'Apfelkorn', 'Cola'],
            "data": [10, 4, 7]};
        const labels = receivedData.labels;
        const data = receivedData.data;

        var ctx = document.getElementById("graph");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this._data.labels,
                datasets: [{
                    data: this._data.data,
                    backgroundColor: backgroundColors(this._data.data.length),
                    borderColor: borderColors(this._data.data.length),
                    borderWidth: 1
                }]
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 30,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 30
                        }
                    }]
                }
            }
        });

        super.draw();
    }
}

/**
 * @class PriceList
 * @description Table of prices of all available products
 */

class PriceList extends Slide {
    constructor() {
        super(arguments);
    }

    draw() {
        const header = this.header;
        let content = this.contentBox;
        this.contentBox.innerHTML = this.html;

        super.draw()
    }
}

/**
 * supportive functions
 */

function backgroundColors(length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        if (i % 2 === 0) {
            result.push('rgba(11, 131, 55, 0.5)');
        } else {
            result.push('rgba(255, 200, 0, 0.5)');
        }
    }
    return result;
}

function borderColors(length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        if (i % 2 === 0) {
            result.push('rgba(11, 131, 55, 1.0)');
        } else {
            result.push('rgba(255, 200, 0, 1.0)');
        }
    }
    return result;
}

/**
 * Initialization
 */

let currentState;
let carousel;

function runCarousel(state) {
    if (this.i === undefined || this.list === undefined) {
        throw new Error("Cannot start carousel: i or list undefined")
    }
    this.list[this.i].draw();
    this.i = (this.i + 1) % this.list.length;

    //currentState.draw();
    //currentState = currentState.next();
    setTimeout(runCarousel, 20000);
    // Update data
}

function startCarousel() {
    const contentBox = document.getElementById("content");
    const chartHTML = `<h1>Meest gedronken vanavond</h1><canvas class="graph" id="graph"></canvas>`;
    let drankTonight = new DrankTonight(contentBox, "Meest gedronken vanavond", chartHTML);
    drankTonight.data = {
        "labels": ['Bier', 'Apfelkorn', 'Cola'],
        "data": [10, 4, 7]};

    const priceListHTML = `<h1>Drankjes</h1><p>Te veel om op te noemen...</p>`;
    let priceList = new PriceList(contentBox, "Drankjes", priceListHTML);

    this.i = 0;
    this.list = [drankTonight, priceList];

    drankTonight.next = priceList;
    priceList.next = drankTonight;

    currentState = drankTonight;
    runCarousel();

    carousel = new Carousel();
    carousel.state = drankTonight;
    //carousel.run();
    runCarouselObj();

    //drankTonight.draw();

    //runCarousel();
}

function runCarouselObj() {
    carousel.run();
    setTimeout(runCarouselObj, slideTime);
}
