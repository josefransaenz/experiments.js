'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.confidenceIntervalForT = confidenceIntervalForT;
exports.confidenceIntervalForChi = confidenceIntervalForChi;
exports.confidenceIntervalForF = confidenceIntervalForF;
exports.confidenceIntervalForBinomial = confidenceIntervalForBinomial;
exports.confidenceIntervalForPoisson = confidenceIntervalForPoisson;

var _distributions = require('distributions.js');

var distributions = _interopRequireWildcard(_distributions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**  
 * Confidence interval for a variable with a T distribution
 * 
 * @param {number} standardError - standard error of the variable
 * @param {number} degreesOfFreedom - degree of freedom of the observations
 * @param {number} confidenceLevel - confidence level for calculating the confidence interval
 * @return {Array} [lowerLimit, higherLimit] - limits within the "true" mean is likely to be with the given confidence level
*/
function confidenceIntervalForT(mean, standardError, degreesOfFreedom, confidenceLevel) {
    var pLevel = (1 - confidenceLevel) / 2;
    var tConf = distributions.tInverse(pLevel, degreesOfFreedom);
    var delta = tConf * standardError;
    return [mean - delta, mean + delta];
}

/**
 * Confidence interval for a variable with a chi-squared distribution
 * 
 * @param {number} varianceEstimate - variance estimate of the variable
 * @param {number} degreesOfFreedom - degree of freedom of the observations
 * @param {number} confidenceLevel - confidence level for calculating the confidence interval
 * @return {Array} [lowerLimit, higherLimit] - limits within the "true" variance is likely to be with the given confidence level
*/
function confidenceIntervalForChi(varianceEstimate, degreesOfFreedom, confidenceLevel) {
    var pLevel = (1 - confidenceLevel) / 2,
        chiConf = distributions.chiInverse(pLevel, degreesOfFreedom),
        lowLimit = degreesOfFreedom * varianceEstimate / chiConf;

    pLevel = 1 - pLevel;
    chiConf = distributions.chiInverse(pLevel, degreesOfFreedom);
    var highLimit = degreesOfFreedom * varianceEstimate / chiConf;

    return [lowLimit, highLimit];
}

/**
 * Confidence interval for a variable with a F distribution
 * 
 * @param {number} varianceRatio - ratio between the variance of set 1 and the variance of set 2
 * @param {number} degreesOfFreedom1 - degree of freedom of the observations of set 1
 * @param {number} degreesOfFreedom2 - degree of freedom of the observations of set 2
 * @param {number} confidenceLevel - confidence level for calculating the confidence interval
 * @return {Array} [lowerLimit, higherLimit] - limits within the "true" variance ratio is likely to be with the given confidence level
*/
function confidenceIntervalForF(varianceRatio, degreesOfFreedom1, degreesOfFreedom2, confidenceLevel) {
    var pLevel = (1 - confidenceLevel) / 2,
        fConf = distributions.fInverse(pLevel, degreesOfFreedom1, degreesOfFreedom2),
        lowLimit = varianceRatio / fConf;
    pLevel = 1 - pLevel;
    fConf = distributions.fInverse(pLevel, degreesOfFreedom1, degreesOfFreedom2);
    var highLimit = varianceRatio / fConf;

    return [lowLimit, highLimit];
}

/**
 * Confidence interval for a variable with a Binomial distribution
 * 
 * @param {number} successes - number of successes or "yes" outcomes in the given sample size
 * @param {number} sampleSize - number of trials observed
 * @param {number} confidenceLevel - confidence level for calculating the confidence interval
 * @return {Array} [lowerLimit, higherLimit] - limits within the "true" probability to obtaining a success is likely to be with the given confidence level
*/
function confidenceIntervalForBinomial(successes, sampleSize, confidenceLevel) {
    var pLevel = (1 - confidenceLevel) / 2;
    var p0 = 0;
    var meanP = successes / sampleSize;
    while (p0 < meanP) {
        var pValue = distributions.binomial(successes, sampleSize, p0);
        if (pValue >= pLevel) {
            break;
        }
        p0 += 0.0001;
    }
    var lowLimit = p0;
    p0 = 1;
    while (p0 > meanP) {
        var pValue = distributions.binomial(successes, sampleSize, p0);
        /*let n;
        for (n=successes; n<=sampleSize;n++) {
            pValue += distributions.binomial(successes, sampleSize, p0);
        }*/
        if (pValue >= pLevel) {
            break;
        }
        p0 -= 0.0001;
    }
    var highLimit = p0;
    var n = undefined;
    var p = 0;
    for (n = 0.5278; n <= 0.9069; n += 0.0001) {
        p += distributions.binomial(successes, sampleSize, n);
    }
    debugger;
    return [lowLimit, highLimit];
}

/**
 * Confidence interval for a variable with a Poisson distribution
 * 
 * @param {number} successes - probability of successes or "yes" outcomes for trial unit
 * @param {number} confidenceLevel - confidence level for calculating the confidence interval
 * @return {Array} [lowerLimit, higherLimit] - limits within the "true" probability to obtaining a success is likely to be with the given confidence level
*/
function confidenceIntervalForPoisson(successes, confidenceLevel) {
    var pLevel = (1 - confidenceLevel) / 2,
        p0 = 0;
    while (p0 < successes) {
        var pValue = distributions.poisson(successes, p0);
        if (pValue >= pLevel) {
            break;
        }
        p0 += 0.01;
    }
    var lowLimit = p0;
    debugger;
    p0 = successes;
    while (p0 < (successes + 1) * 10) {
        var pValue = distributions.poisson(successes, p0);
        if (pValue <= pLevel) {
            break;
        }
        p0 += 0.01;
    }
    var highLimit = p0;

    return [lowLimit, highLimit];
}