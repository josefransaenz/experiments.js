'use strict'

// # experiment.js
//
// A library for statistics and analysis of experiments.

var experiments = module.exports = {};

experiments.confidenceIntervalForT = require('./lib/confidenceIntervals').confidenceIntervalForT;
experiments.confidenceIntervalForChi = require('./lib/confidenceIntervals').confidenceIntervalForChi;
experiments.confidenceIntervalForF = require('./lib/confidenceIntervals').confidenceIntervalForF;
experiments.confidenceIntervalForBinomial = require('./lib/confidenceIntervals').confidenceIntervalForBinomial;
experiments.confidenceIntervalForPoisson = require('./lib/confidenceIntervals').confidenceIntervalForPoisson;
experiments.refSetTest = require('./lib/twoSetsTests').refSetTest;
experiments.tTest = require('./lib/twoSetsTests').tTest;
experiments.tTestPaired = require('./lib/twoSetsTests').tTestPaired;
experiments.oneWayAnova = require('./lib/anova').oneWayAnova;
experiments.nWayAnova = require('./lib/anova').nWayAnova;

