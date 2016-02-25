'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Experiment = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _analysis = require('../lib/analysis');

var analysis = _interopRequireWildcard(_analysis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Default objects
var defaultMeta = {
    "state": "empty",
    "comment": "",
    "defaultResponse": "",
    "defaultStat": "mean",
    "defaultAnalysis": "descriptive"
};
var defaultParameters = new Map();
var defaultResponses = [{
    "name": "",
    "nature": "normal",
    "unit": "",
    "array": [],
    "timeUnit": "order",
    "timeArray": [],
    "factors": [""],
    "blocks": [""]
}];
var defaultFactors = [{
    "name": "",
    "nature": "numeric",
    "unitLevels": "",
    "array": [],
    "isUncontrollable": true
}];
var defaultBlocks = [{
    "name": "",
    "nature": "categorical",
    "unitLevels": "",
    "array": []
}];

/** Class representing a generic experiment. */
//export default

var Experiment = exports.Experiment = function () {
    function Experiment(experimentData) {
        _classCallCheck(this, Experiment);

        //{comment = '', parameters = {}, responses = {}, factors = {}} = {}) {
        var data = experimentData || {};
        this.meta = data.meta || defaultMeta;
        this.parameters = new Map(data.parameters) || defaultParameters;
        this.responses = data.responses || defaultResponses;
        this.factors = data.factors || defaultFactors;
        this.blocks = data.blocks || defaultBlocks;
        this.results = data.results || {};
    }

    _createClass(Experiment, [{
        key: 'updateState',
        value: function updateState() {
            if (this.meta.defaultResponse === '') {
                this.meta.state = 'empty';
                return this.meta.state;
            }
        }
    }, {
        key: 'defaultAnalysis',
        value: function defaultAnalysis() {
            var err = '';
            this.updateState();
            if (this.meta.state !== 'completed') {
                err = 'experiment not completed';
                console.error(err);
                return err;
            }
            this.results = analysis.defaultAnalysis(this);
            return this.results;
        }
    }]);

    return Experiment;
}();
/*
let dataNature = {
    NORMAL: 0,
    QUASI_NORMAL: 1,
    NON_NORMAL: 2,
    BINOMIAL: 3,
    POISSON: 4     
}

class ExperimentalData {
    constructor(name, nature, unit, array) {//{name = '', nature = 0, unit = undefined, array = []} = {}) {
        this.name = name;
        this.nature = nature;
        this.unit = unit;
        this.array = array;
    }
}

export class Response extends ExperimentalData {
    constructor(name, nature, unit, array, mainStat) {//{name = '', nature = 0, unit = undefined, array = [], mainStat = 0} = {}) {
        super(name, nature, unit, array);
        this.mainStat = mainStat;
    }
}

export class Factor extends ExperimentalData {
    constructor(name, nature, unit, array, isNoise, linkedResponses) {//{name = '', nature = 0, unit = undefined, array = [], mainStat = 0} = {}) {
        super(name, nature, unit, array);
        this.isNoise = isNoise;
        this.linkedResponses = linkedResponses;
    }
}
*/