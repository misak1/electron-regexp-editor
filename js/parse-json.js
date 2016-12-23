module.exports = function (path, expand) {
    var fs = require('fs');
    this.path = path;
    this.expand = !expand;

    this.getStatus = function () {
        return { expand: this.expand, path: this.path };
    }

    this.getPath = function () {
        return this.path;
    }

    this.parseJson = function (path, expand) {
        this.path = path;
        this.expand = expand || true;
    }

    this.read = function () {
        var json = this.validateJSON(fs.readFileSync(this.path, "UTF-8"));
        var aw = expand ? JSON.stringify(json) : JSON.stringify(json, " ", 4);
        return aw;
    }
    this.validateJSON = function (text) {
        var obj = null;

        try {
            obj = JSON.parse(text);
            return obj;
        } catch (xxx) {
            ;
        }
        // try eval(text)
        try {
            obj = eval("(" + text + ")");
        } catch (xxxx) {
            console.log("ERROR. JSON.parse failed");
            return null;
        }
        console.log("WARN. As a result of JSON.parse, a trivial problem has occurred");
        return obj; // repaired
    }
};
