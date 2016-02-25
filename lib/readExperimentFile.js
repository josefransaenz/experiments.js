'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (filename, callback) {
    fs.readFile(filename, function (err, data) {
        var experimentObj = {};
        if (err) {
            console.error('Error reading experiment file' + filename);
            //throw err;
        } else {
                try {
                    experimentObj = JSON.parse(data);
                } catch (err) {
                    console.error("Error parsing data from experiment file");
                    //throw err;
                }
            }
        callback(err, experimentObj);
    });
};

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }