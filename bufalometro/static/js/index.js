function Meter(id) {
    this.id = id;
    this.meterParams = {
        meter: "/static/images/dial-back-reverse-sm.png",
        glass: "/static/images/glass-sm.png",
        width: 230,
        height: 119,
        needlePosition: [115, 115],
        needleScale: 0.95,
        useStoppers: true,
        minLevel: 0.0,
        maxLevel: 1.0,
        level: 0.0,
    };
}

Meter.prototype.init = function() {
    this.div = $(this.id);
    this.div.meter(this.meterParams);
    this.curValue = 0.0;
    this.div.click(this.click.bind(this));
}

Meter.prototype.shake = function() {
    var self = this;
    var val1 = this.curValue;
    var val2 = val1 + Math.random()*0.1 - 0.05;
    var val3 = val2 + Math.random()*0.1 - 0.05;
    setTimeout(function() { self.div.meter('setLevel', val2); }, 100);
    setTimeout(function() { self.div.meter('setLevel', val3); }, 200);
    setTimeout(function() { self.div.meter('setLevel', val1); }, 300);
}

Meter.prototype.setValue = function(value) {
    this.div.meter('setLevel', value);
    this.curValue = value;
}

Meter.prototype.click = function() {
    this.shake();
}

function SmallMeter(id, modelName, page) {
    this.page = page;
    this.id = id;
    this.modelName = modelName;
    this.meterParams = {
            meter: "/static/images/speedo-back-small-100.png",
            glass: "/static/images/speedo-glass-small-100.png",
            width: 100,
            height: 100,
            maxAngle: 135.5,
            minAngle: -135.5,
            needlePosition: [50,50],
            needleScale: 0.5,
            useStoppers: true,
            minLevel: 0.0,
            maxLevel: 1.0,
            level: 0.0,
        };
}

SmallMeter.prototype = Object.create(Meter.prototype);

SmallMeter.prototype.click = function() {
    $.ajax({
            url: "/api/explain/" + this.modelName,
            data: { "text": this.page.getInput()  }
    }).done(function(r) {
        if (!r.success) console.log("Error: " + r.error);
        else self.page.setInput(r.explain);
    });
    this.shake();
}

function Page() {
    this.mainMeter = new Meter("#main-meter");
    this.leftMeter = new SmallMeter("#left-meter", "sentiment", this);
    this.centerMeter = new SmallMeter("#center-meter", "lerciosity", this);
    this.rightMeter = new SmallMeter("#right-meter", "referencity", this);
    this.subMeters = [this.leftMeter, this.rightMeter, this.centerMeter];
}

Page.prototype.init = function() {
    this.inputBox = $("#input");
    this.inputBox.keyup(this.textKeyUp.bind(this));
    this.button = $("#start");
    this.button.click(this.bufalaPro.bind(this));
    this.brandImage = $("#bufala");
    this.autoUpdate = setInterval(this.updateMeters.bind(this), 2000);
    this.dirty = true;
    this.bufalaMode = false;
    this.bufalaProRunning = false;
    this.mainMeter.init();
    this.leftMeter.init();
    this.centerMeter.init();
    this.rightMeter.init();
}

Page.prototype.getInput = function() {
    return $.trim(this.inputBox.text());
}

Page.prototype.setInput = function(newHtml) {
    var restore = saveCaretPosition(this.inputBox.get(0));
    var prevHtml = this.inputBox.html();
    this.inputBox.html(newHtml + "              ");
    restore();
}

Page.prototype.setMainMeter = function(value) {
    this.mainMeter.setValue(value);
    if (value > 0.5 && !this.bufalaMode) {
        this.bufalaMode = true;
        this.brandImage.removeClass("bufalogo").addClass("bufalogo-bufala");
    }
    else if (value <= 0.5 && this.bufalaMode) {
        this.bufalaMode = false;
        this.brandImage.removeClass("bufalogo-bufala").addClass("bufalogo");
    }
}

Page.prototype.textKeyUp = function() {
    this.dirty = true;
}

Page.prototype.updateMeters = function() {
    if (!this.dirty) return;
    this.dirty = false;
    var self = this;
    return $.ajax({
            url: "/api/analyze",
            data: { "text": this.getInput()  }
    }).done(function(r) {
        for (var i = 0; i < self.subMeters.length; i++) {
            var m = self.subMeters[i];
            m.setValue(r[m.modelName]);
        }
    });
}

Page.prototype.bufalaPro = function() {
    var self = this;
    if (self.bufalaProRunning) return;
    self.bufalaProRunning = true;
    self.button.addClass("disabled");
    $.ajax({
        url: "/api/credibility",
        data: { "text": this.getInput() }
    }).done(function(r) {
        if (!r.success) console.log("Error: " + r.error);
        else self.setMainMeter(r.score);
        self.bufalaProRunning = false;
        self.button.removeClass("disabled");
    });
}

