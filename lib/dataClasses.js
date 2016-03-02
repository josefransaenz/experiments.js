'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Experiment = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _analysis = require('../lib/analysis');

var analysis = _interopRequireWildcard(_analysis);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Default objects
var defaultMeta = {
    state: "empty",
    comment: "",
    defaultStat: "mean",
    defaultAnalysis: "descriptive",
    defaultConfLevel: 0.95
};
var defaultResponse = {
    name: "",
    nature: "normal",
    unit: "",
    array: [],
    timeUnit: "order",
    timeArray: [],
    factors: [],
    blocks: []
};
var defaultFactor = {
    name: "",
    nature: "numeric",
    unitLevels: [],
    array: [],
    isUncontrollable: true
};
var defaultBlock = {
    name: "",
    nature: "categorical",
    unitLevels: [],
    array: []
};

/** Valid experiment states */
var validStates = ['empty', 'defined', 'designed', 'inProgress', 'completed', 'analized'];

/** Valid data natures */
var validNatures = ['normal', 'non-normal', 'binomial', 'poisson', 'categorical'];

/** Class representing a generic experiment. */
//export default

var Experiment = exports.Experiment = function () {
    function Experiment(experimentData) {
        _classCallCheck(this, Experiment);

        //{comment = '', parameters = {}, responses = {}, factors = {}} = {}) {
        var data = experimentData || {};
        this.meta = data.meta || defaultMeta;
        this.parameters = new Map(data.parameters) || new Map();
        this.responses = data.responses || [];
        this.factors = data.factors || [];
        this.blocks = data.blocks || [];
        this.results = data.results || {};
    }

    _createClass(Experiment, [{
        key: 'updateState',
        value: function updateState() {
            return this.meta.state;
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
    }, {
        key: 'checkData',
        value: function checkData() {
            var _this = this;

            var errors = [];
            // Checks for empty objects     
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.keys(defaultMeta)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var key = _step.value;

                    if (!this.meta.hasOwnProperty(key)) {
                        errors.push('Experiment object does not have meta property "' + key + '"');
                    }
                }
                // Checks for defined objects
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (this.meta.state === validStates[0] || errors.length > 0) {
                return errors;
            }
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop = function _loop() {
                    var response = _step2.value;
                    var _iteratorNormalCompletion8 = true;
                    var _didIteratorError8 = false;
                    var _iteratorError8 = undefined;

                    try {
                        for (var _iterator8 = Object.keys(defaultResponse)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                            var key = _step8.value;

                            if (!response.hasOwnProperty(key)) {
                                errors.push('Experiment object does not have response property "' + key + '" on all responses');
                            }
                        }
                    } catch (err) {
                        _didIteratorError8 = true;
                        _iteratorError8 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                                _iterator8.return();
                            }
                        } finally {
                            if (_didIteratorError8) {
                                throw _iteratorError8;
                            }
                        }
                    }

                    if (response.hasOwnProperty('nature')) {
                        if (validNatures.findIndex(function (item) {
                            return item === response.nature;
                        }) < 0) {
                            errors.push('Experiment object have an invalid response nature  "' + response.nature + '"');
                        }
                    }
                };

                for (var _iterator2 = this.responses[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop2 = function _loop2() {
                    var factor = _step3.value;
                    var _iteratorNormalCompletion9 = true;
                    var _didIteratorError9 = false;
                    var _iteratorError9 = undefined;

                    try {
                        for (var _iterator9 = Object.keys(defaultFactor)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                            var key = _step9.value;

                            if (!factor.hasOwnProperty(key)) {
                                errors.push('Experiment object does not have factor property "' + key + '" on all factors');
                            }
                        }
                    } catch (err) {
                        _didIteratorError9 = true;
                        _iteratorError9 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion9 && _iterator9.return) {
                                _iterator9.return();
                            }
                        } finally {
                            if (_didIteratorError9) {
                                throw _iteratorError9;
                            }
                        }
                    }

                    if (factor.hasOwnProperty('nature')) {
                        if (validNatures.findIndex(function (item) {
                            return item === factor.nature;
                        }) < 0) {
                            errors.push('Experiment object have an invalid factor nature  "' + factor.nature + '"');
                        }
                    }
                };

                for (var _iterator3 = this.factors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    _loop2();
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                var _loop3 = function _loop3() {
                    var block = _step4.value;
                    var _iteratorNormalCompletion10 = true;
                    var _didIteratorError10 = false;
                    var _iteratorError10 = undefined;

                    try {
                        for (var _iterator10 = Object.keys(defaultBlock)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                            var key = _step10.value;

                            if (!block.hasOwnProperty(key)) {
                                errors.push('Experiment object does not have block property "' + key + '" on all blocks');
                            }
                        }
                    } catch (err) {
                        _didIteratorError10 = true;
                        _iteratorError10 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion10 && _iterator10.return) {
                                _iterator10.return();
                            }
                        } finally {
                            if (_didIteratorError10) {
                                throw _iteratorError10;
                            }
                        }
                    }

                    if (block.hasOwnProperty('nature')) {
                        if (validNatures.findIndex(function (item) {
                            return item === block.nature;
                        }) < 0) {
                            errors.push('Experiment object have an invalid block nature  "' + block.nature + '"');
                        }
                    }
                };

                for (var _iterator4 = this.blocks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    _loop3();
                }
                // Check for designed objects
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (this.meta.state === validStates[1] || errors.length > 0) {
                return errors;
            }
            /*for (const response of this.responses) {
                
            }*/
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.factors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var _factor = _step5.value;

                    if (_factor.nature === 'categorical') {
                        if (_factor.unitLevels.length <= 1) {
                            errors.push('Factor (' + _factor.name + ') should have more than one category element');
                        } else if (_factor.isUncontrollable === false) {
                            var levels = [].concat(_toConsumableArray(new Set(_factor.array))); //extract the unique elements
                            if (levels.length !== _factor.unitLevels.length) {
                                errors.push('All the categories of factor (' + _factor.name + ') should be present in the factor array');
                            } else {
                                var catCounts = new Array(levels.length);
                                catCounts.fill(0);
                                var _iteratorNormalCompletion11 = true;
                                var _didIteratorError11 = false;
                                var _iteratorError11 = undefined;

                                try {
                                    for (var _iterator11 = _factor.array[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                                        var item = _step11.value;

                                        catCounts[item]++;
                                    }
                                } catch (err) {
                                    _didIteratorError11 = true;
                                    _iteratorError11 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                                            _iterator11.return();
                                        }
                                    } finally {
                                        if (_didIteratorError11) {
                                            throw _iteratorError11;
                                        }
                                    }
                                }

                                if ([].concat(_toConsumableArray(new Set(catCounts))).length > 1) {
                                    errors.push('The categories of factor (' + _factor.name + ') should be repeated the same number of times (' + catCounts + ')');
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = this.blocks[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var _block = _step6.value;

                    if (_block.nature === 'categorical') {
                        if (_block.unitLevels.length <= 1) {
                            errors.push('Block (' + _block.name + ') should have more than one category element');
                        } else {
                            var levels = [].concat(_toConsumableArray(new Set(_block.array))); //extract the unique elements
                            if (levels.length !== _block.unitLevels.length) {
                                errors.push('All the categories of block (' + _block.name + ') should be present in the block array');
                            } else {
                                var catCounts = new Array(levels.length);
                                catCounts.fill(0);
                                var _iteratorNormalCompletion12 = true;
                                var _didIteratorError12 = false;
                                var _iteratorError12 = undefined;

                                try {
                                    for (var _iterator12 = _block.array[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                                        var item = _step12.value;

                                        catCounts[item]++;
                                    }
                                } catch (err) {
                                    _didIteratorError12 = true;
                                    _iteratorError12 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                                            _iterator12.return();
                                        }
                                    } finally {
                                        if (_didIteratorError12) {
                                            throw _iteratorError12;
                                        }
                                    }
                                }

                                if ([].concat(_toConsumableArray(new Set(catCounts))).length > 1) {
                                    errors.push('The categories of block (' + _block.name + ') should be repeated the same number of times (' + catCounts + ')');
                                }
                            }
                        }
                    } else {
                        errors.push('Block (' + _block.name + ') nature is not categorical');
                    }
                }
                // Check for inProgress objects
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            if (this.meta.state === validStates[2] || errors.length > 0) {
                return errors;
            }
            // Check for complete objects
            if (this.meta.state === validStates[3] || errors.length > 0) {
                return errors;
            }
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.responses[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var _response = _step7.value;

                    if (_response.array.length !== _response.timeArray.length) {
                        errors.push('Response array length is not equal to timeArray length');
                    }
                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {
                        var _loop4 = function _loop4() {
                            var factorName = _step13.value;

                            var relFactor = _this.factors.find(function (f) {
                                return f.name === factorName;
                            });
                            if (relFactor == undefined) {
                                errors.push('Factor (' + factorName + ') of response (' + _response.name + ') not found');
                            } else if (_response.array.length !== relFactor.array.length) {
                                errors.push('Factor (' + factorName + ') array length (' + _response.array.length + ') is not equal to response array length (' + relFactor.array.length + ')');
                            }
                        };

                        for (var _iterator13 = _response.factors[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            _loop4();
                        }
                    } catch (err) {
                        _didIteratorError13 = true;
                        _iteratorError13 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion13 && _iterator13.return) {
                                _iterator13.return();
                            }
                        } finally {
                            if (_didIteratorError13) {
                                throw _iteratorError13;
                            }
                        }
                    }

                    var _iteratorNormalCompletion14 = true;
                    var _didIteratorError14 = false;
                    var _iteratorError14 = undefined;

                    try {
                        var _loop5 = function _loop5() {
                            var blockName = _step14.value;

                            var relBlock = _this.blocks.find(function (b) {
                                return b.name === blockName;
                            });
                            if (relBlock == undefined) {
                                errors.push('Block (' + blockName + ') of response (' + _response.name + ') not found');
                            } else if (_response.array.length !== relBlock.array.length) {
                                errors.push('Factor (' + blockName + ') array length (' + _response.array.length + ') is not equal to response array length (' + relBlock.array.length + ')');
                            }
                        };

                        for (var _iterator14 = _response.blocks[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                            _loop5();
                        }
                    } catch (err) {
                        _didIteratorError14 = true;
                        _iteratorError14 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion14 && _iterator14.return) {
                                _iterator14.return();
                            }
                        } finally {
                            if (_didIteratorError14) {
                                throw _iteratorError14;
                            }
                        }
                    }
                }
                /*
                for (const factor of this.factors) {
                    
                }
                for (const block of this.blocks) {
                    
                }
                */
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            return errors;
        }
    }]);

    return Experiment;
}();