'use strict';

var Handsontable = require('Handsontable');

/**
 * Snedecor's F distribution (https://en.wikipedia.org/wiki/F-distribution)(http://www.math.ucla.edu/~tom/distributions/Fcdf.html)
 * @param {number} fStatistic F-ratio 
 * @param {number} degreesOfFreedom1 Degree of freedom of numerator
 * @param {number} degreesOfFreedom2 Degree of freedom of denumerator
 * @returns {number} probability value
 */

function fSnedecor(fStatistic, degreesOfFreedom1, degreesOfFreedom2) {