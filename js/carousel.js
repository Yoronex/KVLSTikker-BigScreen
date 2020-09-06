const slideTime = 20000; // ms
// The first slide should always be drawable! If this is not the case, BigScreen will not load.
const firstSlide = "PriceList";

/**
 * @class Carousel
 */

class Carousel {
    constructor(state) {
        this._nextState = state;
        this._state = state;
    }

    set nextState(state) {
        this._nextState = state
    }

    get state() {
        return this._state
    }

    run() {
        if (!this._nextState.drawable()) {
            this._nextState.getNext(this);
            this.update_data();
            this.run();
        } else {
            this.startProgressAnimation(this._nextState, this._state, true);
            this._nextState.draw();
            this._state = this._nextState;
            this._state.getNext(this);
        }
    }

    update_data() {
        updateSlideData(this._nextState.constructor.name);
    }

    async interrupt(interruptingState) {
        this.resetProgressAnimation(slidesOrdered.indexOf(this._state));
        this._nextState = interruptingState;
        this._nextState.next = this._state;
        // Allow the current loading bar to be reset, before we continue execution and start drawing the slide
        await new Promise(r => setTimeout(r, 10));
        this.run()
    }

    async startProgressAnimation(slide, oldSlide, doTransition = true) {
        if (slidesInterrupt.includes(slide.constructor.name)) {
            return;
        }

        let slideNr = slidesOrdered.indexOf(slide);
        // If the slide number is -1, the slide is not in the list and thus it must be an interrupt
        // We therefore get the number of the current slide
        if (slideNr === -1) {
            //slideNr = (slidesOrdered.indexOf(this._state) - 1 + slidesOrdered.length) % slidesOrdered.length;
            await addProgressBar(slide, oldSlide);
            slideNr = slidesOrdered.indexOf(slide);
        }
        // If this slide is first in the sequence, we have to reset all the progress bars in the carousel
        if (slideNr === 0) {
            await this.resetProgressColors();
        }

        if (slideNr < 0) { return }

        const child = carouselProgressBar.children[slideNr].children[0].children[0];
        if (doTransition) { child.style.transition = `transform ${slideTime / 1000 + 0.5}s linear`; }
        await sleep(10);
        child.style.transform = 'translateX(0)';
    }

    resetProgressAnimation(index) {
        let child = carouselProgressBar.children[index].children[0].children[0];
        child.style.transition = `transform 0s`;
        child.style.transform = 'translateX(-100%)';
    }

    async resetProgressColors() {
        const children = carouselProgressBar.children;
        for (let i = 0; i < children.length; i++) {
            children[i].children[0].children[0].style.transition = 'transform 0s';
            children[i].children[0].children[0].style.transform = 'translateX(-100%)';
        }
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
        carousel.nextState = this._next
    }

    set data(data) {
        this._data = data
    }

    draw() {}
}

/**
 * @class DrankTonight
 * @description Graph of most bought products tonight
 */

class DrankTonight extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": []}
    }

    drawable() {
        return this._data.values.length !== 0;

    }

    draw() {
        if (!this.drawable()) {
            return false;
        }
        this.contentBox.innerHTML = this.html;
        var ctx = document.getElementById("graph");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this._data.labels,
                datasets: [{
                    data: this._data.values,
                    backgroundColor: backgroundColors(this._data.values.length),
                    borderColor: borderColors(this._data.values.length),
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
                            callback: function(value) {if (value % 1 === 0) {return value;}}
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
        return true
    }
}

class MostDrank1 extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": [], "product_name": ""}
    }

    drawable() {
        return this._data.values.length !== 0;
    }

    draw() {
        if (!this.drawable()) {
            return false;
        }
        const name = this._data.product_name;
        this.contentBox.innerHTML = `<h1>Gedronken: ${name}</h1><canvas class="graph" id="graph"></canvas>`;
        var ctx = document.getElementById("graph");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this._data.labels,
                datasets: [{
                    data: this._data.values,
                    backgroundColor: backgroundColors(this._data.values.length),
                    borderColor: borderColors(this._data.values.length),
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
                            callback: function(value) {if (value % 1 === 0) {return value;}}
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
        return true
    }
}

class MostDrank2 extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": [], "product_name": ""}
    }

    drawable() {
        return this._data.values.length !== 0;
    }

    draw() {
        if (!this.drawable()) {
            return false;
        }
        const name = this._data.product_name;
        this.contentBox.innerHTML = `<h1>Gedronken: ${name}</h1><canvas class="graph" id="graph"></canvas>`;
        var ctx = document.getElementById("graph");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this._data.labels,
                datasets: [{
                    data: this._data.values,
                    backgroundColor: backgroundColors(this._data.values.length),
                    borderColor: borderColors(this._data.values.length),
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
                            callback: function(value) {if (value % 1 === 0) {return value;}}
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
        return true
    }
}

class MostDrank3 extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": [], "product_name": ""}
    }

    drawable() {
        return this._data.values.length !== 0;
    }

    draw() {
        if (!this.drawable()) {
            return false;
        }
        const name = this._data.product_name;
        this.contentBox.innerHTML = `<h1>Gedronken: ${name}</h1><canvas class="graph" id="graph"></canvas>`;
        var ctx = document.getElementById("graph");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this._data.labels,
                datasets: [{
                    data: this._data.values,
                    backgroundColor: backgroundColors(this._data.values.length),
                    borderColor: borderColors(this._data.values.length),
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
                            callback: function(value) {if (value % 1 === 0) {return value;}}
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
        return true
    }
}

/**
 * @class DrinkingScore
 * @description The current drinking score, translated into human speech
 */
class DrinkingScore extends Slide {
    constructor() {
        super(arguments);
        this._data = null;
    }

    calcPercentage() {
        return 100 - parseFloat(document.getElementById('score-bar-inner').style.top)
    }

    drawable() {
        return this.calcPercentage() > 0;
    }

    draw() {
        const percentage = this.calcPercentage();
        let message = ""
        if (percentage === 0) {
            return false
        } else if (percentage < 10) {
            message = "We hadden net zo goed cola kunnen drinken"
        } else if (percentage < 25) {
            message = "Eén kleintje dan"
        } else if (percentage < 50) {
            message = "Keurige borrel"
        } else if (percentage < 75) {
            message = "Er wordt stevig gezopen!"
        } else {
            message = "Er wordt zeer, zeer, zeer goed gezopen! Kathelijn kan trots zijn!"
        }
        this.contentBox.innerHTML = `<h1>Hoe hard wordt er gezopen?</h1><div id="quote" style="font-size: 30px; height: 50%; padding: 30px"><table style="width: 100%; height: 100%"><tr><td style="vertical-align: center; font-size: 32px"><i>${message}</i></td></tr></table></div>`;
        return true
    }
}

/**
 * @class PriceList
 * @description Table of prices of all available products
 */

class PriceList extends Slide {
    constructor() {
        super(arguments);
        this._data = {"names": [], "prices": []}
    }

    drawable() {
        return true;
    }

    draw() {
        this.contentBox.innerHTML = `<div class="pricelist" id="pricetable"></div>`;
        const height = document.getElementById("pricetable").offsetHeight;
        let products = this._data.names.length;
        if (products % 2 === 1) {
            products = products + 1;
            this._data.names.push("");
            this._data.prices.push("");
        }

        let fontSize = parseInt(Math.floor(height / products));

        if (fontSize > 32) {
            fontSize = 32;
        }

        let table = "";
        for (let j = 0; j < 2; j++) {
            if (j % 2 === 1) {
                table = table + `<td style="width: 6%"></td>`
            }
            table = table + `<td style="width: 47%"><table style="width: 100%;">`;

            for (let i = 0; i < products / 2; i++) {
                let name = this._data.names[i + j * products / 2];
                let price = this._data.prices[i + j * products / 2];
                if (j % 2 === 0) {
                    table = table + `<tr><td style='text-align: right;'>${name}</td><td style="width: 5%"></td><td style='text-align: left;'>${price}</td></tr>`;
                } else {
                    table = table + `<tr><td style='text-align: right;'>${price}</td><td style="width: 5%"></td><td style='text-align: left;'>${name}</td></tr>`;
                }
            }
            table = table + `</table></td>`;
        }

        this.contentBox.innerHTML = `<h1>Drankjes</h1><div class="pricelist" id="pricetable"><table width="100%" style="font-size: ${fontSize}px"><tr>${table}</tr></table></div>`

        return true
    }
}

/**
 * @class Quote
 * @description Random quote stored in Tikker
 */
class Quote extends Slide {
    constructor() {
        super(arguments);
        this._data = {};
    }

    drawable() {
        return true;
    }

    draw() {
        const quote = this._data.quote;
        const author = this._data.author;
        const date = this._data.date;
        this.contentBox.innerHTML = `<div id="quote" style="font-size: 30px; height: 100%; padding: 30px; overflow: hidden; box-sizing: border-box;">
            <table style="width: 100%; height: 100%; box-sizing: border-box; overflow: hidden;">
                <tr>
                    <td style="vertical-align: center; font-size: 40px">
                        <div class="quote-content"><i>"${quote}"</i></div>
                        <div class="quote-author">~ ${author}, ${date}</div>
                    </td>
                </tr>
            </table></div>`;
        return true
    }
}

/**
 * @class Debt
 * @description Wall of shame for who has the most debt
 */

class Debt extends Slide {
    constructor() {
        super(arguments);
        this._data = {'names': [], 'amount': []}
    }

    drawable() {
        return true;
    }

    draw() {
        let table = "";
        for (let i = 0; i < Math.min(10, this._data.names.length); i++) {
            const name = this._data.names[i];
            const debt = this._data.amount[i];
            if (i === 0) {
                table = table + "<tr style='font-size: 48px'>";
            } else if (i === 1) {
                table = table + "<tr style='font-size: 40px'>";
            } else if (i === 2) {
                table = table + "<tr style='font-size: 32px'>";
            } else {
                table = table + "<tr style='font-size: 24px'>";
            }

            const row = `<td style="text-align: right; width: 48%">${name}</td><td style="width: 4%"></td><td style="text-align: left; width: 48%; color: red;">${debt}</td></tr>`
            table = table + row;
        }
        this.contentBox.innerHTML = `<h1>Meeste schulden</h1><table style='width: 100%'>${table}</table>`
        return true
    }
}

class TopBalance extends Slide {
    constructor() {
        super(arguments);
        this._data = {'names': [], 'amount': []}
    }

    drawable() {
        return true;
    }

    draw() {
        let table = "";
        for (let i = 0; i < Math.min(10, this._data.names.length); i++) {
            const name = this._data.names[i];
            const debt = this._data.amount[i];
            if (i === 0) {
                table = table + "<tr style='font-size: 48px'>";
            } else if (i === 1) {
                table = table + "<tr style='font-size: 40px'>";
            } else if (i === 2) {
                table = table + "<tr style='font-size: 32px'>";
            } else {
                table = table + "<tr style='font-size: 24px'>";
            }

            const row = `<td style="text-align: right; width: 48%">${name}</td><td style="width: 4%"></td><td style="text-align: left; width: 48%; color: green;">${debt}</td></tr>`
            table = table + row;
        }
        this.contentBox.innerHTML = `<h1>Rijkste kindjes</h1><table style='width: 100%'>${table}</table>`
        return true
    }
}

class Balance extends Slide {
    constructor() {
        super(arguments);
        this._data = {"names": [], "amount": [], "unparsed": []}
    }

    drawable() {
        return this._data.names.length !== 0;
    }

    draw() {
        if (!this.drawable()) {
            return false;
        }

        this.contentBox.innerHTML = `<div class="pricelist" id="balancetable"></div>`;
        const height = document.getElementById("balancetable").offsetHeight;
        let products = this._data.names.length;
        if (products % 2 === 1) {
            products = products + 1;
            this._data.names.push("");
            this._data.amount.push("");
            this._data.unparsed.push(0);
        }

        let fontSize = parseInt(Math.floor(height / products));

        if (fontSize > 32) {
            fontSize = 32;
        }

        let table = "";
        for (let j = 0; j < 2; j++) {
            if (j % 2 === 1) {
                table = table + `<td style="width: 6%"></td>`
            }
            table = table + `<td style="width: 47%"><table style="width: 100%;">`;

            for (let i = 0; i < products / 2; i++) {
                let name = this._data.names[i + j * products / 2];
                let balanceString = this._data.amount[i + j * products / 2];
                let balance = this._data.unparsed[i + j * products / 2];
                if (j % 2 === 0) {
                    table = table + `<tr><td style='text-align: right;'>${name}</td><td style="width: 5%"></td>`;
                    if (balance < 0) {
                        table = table + `<td style='text-align: left; color: red;'>${balanceString}</td></tr>`;
                    } else {
                        table = table + `<td style='text-align: left; color: green;'>${balanceString}</td></tr>`;
                    }
                } else {
                    if (balance < 0) {
                        table = table + `<tr><td style='text-align: right; color: red;'>${balanceString}</td>`
                    } else {
                        table = table + `<tr><td style='text-align: right; color: green;'>${balanceString}</td>`
                    }
                    table = table + `<td style="width: 5%"></td><td style='text-align: left;'>${name}</td></tr>`;
                }
            }
            table = table + `</table></td>`;
        }

        this.contentBox.innerHTML = `<h1>Saldo's</h1><div class="pricelist" id="balancetable"><table width="100%" style="font-size: ${fontSize}px"><tr>${table}</tr></table></div>`;

        return true
    }
}

class Message extends Slide {
    constructor() {
        super(arguments);
        this._data = ""
    }

    drawable() {
        return true;
    }

    draw() {
        const quote = this._data;
        this.contentBox.innerHTML = `<div id="quote" style="font-size: 30px; height: 100%"><table style="width: 100%; height: 100%"><tr><td style="vertical-align: center; font-size: 40px">${quote}</td></tr></table></div>`;
        return true
    }
}

class Title extends Slide {
    constructor() {
        super(arguments);
        this._data = {'beer': "", 'flugel': ""}
    }

    drawable() {
        return true;
    }

    draw() {
        const beer = this._data.beer;
        const flugel = this._data.flugel;
        this.contentBox.innerHTML = `<div id="title" style="font-size: 40px; height: 100%">
<table style="width: 100%; height: 100%">
<tr>
<td style="vertical-align: center;">
<b style="font-size: 56px">Prins Pils</b style="font-size: 56px"><br>${beer}
</td>
</tr>
<tr>
<td style="vertical-align: center;">
<b style="font-size: 56px">Flügelmeisje</b><br>${flugel}
</td></tr></table></div>`;
        return true
    }
}

class RecentlyPlayed extends Slide {
    constructor() {
        super(arguments);
        this._data = [];
    }

    drawable() {
        return this._data.length !== 0;
    }

    draw() {
        if (!this.drawable()) {
            return false;
        }
        const pre = `<h1>Recent afgespeelde nummers</h1></h1><table style="width: 100%;">`;

        let content = "";
        for (let i = 0; i < this._data.length; i++) {
            const timestamp = "- " + this._data[i].timestamp;
            const track = this._data[i].artist + " - " + this._data[i].title;
            content = content + `<tr><td style="text-align: right; min-width: 120px; vertical-align: top;">${timestamp}</td><td style="width: 5%"></td><td style="text-align: left;">${track}</td></tr>`
        }

        const post = `</table>`;
        this.contentBox.innerHTML = pre + content + post;
        return true
    }
}

class Calendar extends Slide {
    constructor() {
        super(arguments);
        this._data = {'upcoming_events': false};
    }

    drawable() {
        return true;
    }

    draw() {
        const pre = `<h1>Aankomende activiteiten</h1></h1><table style="width: 100%;">`;

        let content = "";
        let name, date, days;
        if ('upcoming_events' in this._data) {
            if (this._data.upcoming_events) {
                for (let i = 0; i < this._data.calendar.length; i++) {
                    name = this._data.calendar[i].name;
                    date = this._data.calendar[i].date;
                    days = this._data.calendar[i].days;
                    content = content + `<tr><td style="text-align: right; min-width: 250px; vertical-align: top;">${date}</td><td style="width: 5%"><td style="text-align: left; width: 180px; vertical-align: top;">(${days} dagen)</td><td style="text-align: left;">${name}</td></tr>`
                }
            } else {
                content = `<tr><td style="text-align: center;">Er zijn geen aankomende activiteiten :(</td></tr>`
            }
        } else {
            content = `<tr><td style="text-align: center;"><i>Kan kalender niet downloaden (is er internet?)</i></td></tr>`
        }

        const post = `</table>`;
        this.contentBox.innerHTML = pre + content + post;
        return true
    }
}

class Birthdays extends Slide {
    constructor() {
        super(arguments);
        this._data = [];
    }

    drawable() {
        return true;
    }

    draw() {
        const pre = `<h1>Verjaardagskalender</h1></h1><table style="width: 100%;">`;

        let content = "";
        let name, date, days, age;
        if (this._data.length > 0) {
            for (let i = 0; i < this._data.length; i++) {
                name = this._data[i].user;
                date = this._data[i].birthday;
                days = this._data[i].days;
                age = this._data[i].age;
                content = content + `<tr><td style="text-align: right; min-width: 250px; vertical-align: top;">${date}</td><td style="width: 5%"><td style="text-align: left; width: 180px; vertical-align: top;">(${days} dagen)</td><td style="text-align: left;">${name} wordt ${age} jaar!</td></tr>`
            }
        } else {
            content = `<tr><td style="text-align: center;">Niemand is binnenkort jarig :(</td></tr>`
        }

        const post = `</table>`;
        this.contentBox.innerHTML = pre + content + post;
        return true
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

let carousel;
let carouselProgressBar;
let slides = {};
let slidesOrdered = [];
let slidesInterrupt = [];
let contentBox;

function initCarousel() {
    contentBox = document.getElementById("content");

    slides.DrankTonight = new DrankTonight(contentBox, "Meest gedronken vanavond", `<h1>Meest gedronken vanavond</h1><canvas class="graph" id="graph"></canvas>`);
    slides.MostDrank1 = new MostDrank1(contentBox, "Gedronken: ", "");
    slides.MostDrank2 = new MostDrank2(contentBox, "Gedronken: ", "");
    slides.MostDrank3 = new MostDrank3(contentBox, "Gedronken: ", "");
    slides.RecentlyPlayed = new RecentlyPlayed(contentBox, "Laatst afgespeelde nummers", "");
    slides.Title = new Title(contentBox, "Burgelijke Titels", "");
    slides.Debt = new Debt(contentBox, "Grootste schuld", '');
    slides.TopBalance = new TopBalance(contentBox, "Rijkste kindjes", '');
    slides.Balance = new Balance(contentBox, "Saldo's", '');
    slides.PriceList = new PriceList(contentBox, "Drankjes", '');
    slides.Quote = new Quote(contentBox, "Citaat", "");
    slides.Calendar = new Calendar(contentBox, "Kalender", "");
    slides.Birthdays = new Birthdays(contentBox, "Verjaardagskalender", "");
    slides.DrinkingScore = new DrinkingScore(contentBox, "Hoe hard wordt er gezopen?", "")

    slides.Message = new Message(contentBox, "Bericht", '');

    slidesInterrupt = [slides.Message.constructor.name];

    slides.PriceList.next = slides.DrinkingScore;
    slides.DrinkingScore.next = slides.DrankTonight
    slides.DrankTonight.next = slides.Calendar;
    slides.Calendar.next = slides.MostDrank1;
    slides.MostDrank1.next = slides.Balance;
    slides.Balance.next = slides.Quote;
    slides.Quote.next = slides.MostDrank2;
    slides.MostDrank2.next = slides.Debt;
    slides.Debt.next = slides.Birthdays;
    slides.Birthdays.next = slides.MostDrank3;
    slides.MostDrank3.next = slides.RecentlyPlayed;
    slides.RecentlyPlayed.next = slides.Title;
    slides.Title.next = slides.TopBalance;
    slides.TopBalance.next = slides.PriceList;

    initCarouselProgressBar();

    carousel = new Carousel(slides[firstSlide]);
    //carousel.nextState = slides[firstSlide];
    return firstSlide;
}

function initCarouselProgressBar() {
    // The first slide is the first slide in the ordering
    addProgressBar(slides[firstSlide]);

    // Check precondition
    if (!slidesOrdered[0].drawable()) {
        throw `The slide ${firstSlide} is not drawable by default. Please choose a different first slide.`
    }

    // Save the current and the next slide...
    let currentSlide = slidesOrdered[0];
    let nextSlide = slidesOrdered[0].next;
    // Loop until we see the first slide again, e.g. loop over all slides in the loop
    while (nextSlide.constructor.name !== firstSlide) {
        // If we can draw this slide...
        if (nextSlide.drawable()) {
            // Create a progress bar for it
            addProgressBar(nextSlide, currentSlide);
            // Change the current slide
            currentSlide = nextSlide;
            // Go to the next slide in the ordering
            nextSlide = currentSlide.next;
        // If we cannot draw this slide...
        } else {
            // Go to the next slide in the ordering
            nextSlide = nextSlide.next;
        }
    }
}

let carouselLoop;

function runCarouselObj() {
    setTimeout(drawWithCarouselObj, 500);
    hideContentBox();
}

function drawWithCarouselObj() {
    carouselLoop = setTimeout(runCarouselObj, slideTime);
    carousel.run();
    carousel.update_data();
    showContentBox();
}

function hideContentBox() {
    contentBox.style.opacity = '0'
}

function showContentBox() {
    contentBox.style.opacity = '1'
}

function interruptCarousel(interruptObj) {
    let interruptingState;
    if (interruptObj.name === "Message") {
        interruptingState = new Message(contentBox, "Bericht", '');
        interruptingState.data = interruptObj.data;
    }

    clearTimeout(carouselLoop);
    carousel.interrupt(interruptingState);
    carouselLoop = setTimeout(runCarouselObj, slideTime);
}

// Add a progress bar for the next slide, given the current slide
function addProgressBar(nextSlide, currentSlide = null) {
    // If no current slide is given, the new slide is simply appended to the end
    if (currentSlide === null) {
        slidesOrdered.push(nextSlide);
    } else {
        const slideNr = slidesOrdered.indexOf(currentSlide);
        slidesOrdered.splice(slideNr + 1, 0, nextSlide);
    }

    // Add the HTML code of a progress bar to the end of the current block
    carouselProgressBar = document.getElementById('carousel-progress-bar');
    carouselProgressBar.innerHTML += `
                <div class="slide-progress-bar-outer box-sizing" style="width: 0">
                    <div class="slide-progress-bar-inner box-sizing">
                        <div class="slide-progress-bar-animation box-sizing" style="transition: transform ${slideTime / 1000 + 0.5}s linear"></div>
                    </div>
                </div>`

    // Get the amount of progress bars
    const length = carouselProgressBar.children.length;
    // Calculate the width of each bar in percentages
    const width = 100 / length;

    // Set this new width for every bar
    for (let i = 0; i < length; i++) {
        carouselProgressBar.children[i].style.width = width + "%"
    }
}
