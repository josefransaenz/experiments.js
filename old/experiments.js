/** experiments.js javascript library
 by Josefran Saenz

 * @license
 * Copyright 2015 Josefran Saenz (josefsaenz@gmail.com)
 * MIT-licensed (http://opensource.org/licenses/MIT)
 */
(function(f) {
    'use strict';
    if (typeof exports === 'object' && typeof module !== 'undefined'){
        module.exports = f();
    } else if (typeof define === 'function' && define.amd) {
        define([], f);
    } else {
        var g;
        if (typeof window !== 'undefined') {
            g = window;
        } else if (typeof global !== 'undefined') {
            g = global;
        } else if (typeof self !== 'undefined'){
            g = self;
        } else {
            g = this;
        }
        g.experiments = f();
    }
}(function() {
    'use strict';
    // # experiments.js
    //
    // library for experiments
    var experiments = {};
    
    // # [Comparing the means of two sets with a reference set]
    //
    // Input:
    //      baseSet: set of observations with the "standard conditions"
    //      testSet:  set of observations with the new conditions 
    //      refSet: large set of observations with the same conditions as the baseSet
    // Output: (object)
    //      meanDifference: difference between the means: E(testSet) - E(baseSet)
    //      probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
    function twoSetsRefSet (baseSet, testSet, refSet) { 
        if (baseSet.length !== testSet.length) { 
            throw 'base set and test set does not have the same length';
        }
        if (refSet.length < baseSet.length * 3) { 
            throw 'Reference set is too small';
        }
        let mBaseSet = ss.mean(baseSet);
        let mTestSet = ss.mean(testSet);
        let diffMeans = mTestSet - mBaseSet;
        let diffInRefSet;
        let diffsGreaterThanObserved = 0;
        let n;
        for (n = 0; n < refSet.length - baseSet.length * 2; n++) {
            diffInRefSet = ss.mean(refSet.slice(n + baseSet.length, n + baseSet.length * 2)) - ss.mean(refSet.slice(n, n + baseSet.length));
            if (diffMeans >= 0 && diffInRefSet > diffMeans){
                diffsGreaterThanObserved++;
            } else if (diffMeans < 0 && diffInRefSet < diffMeans){
                diffsGreaterThanObserved++;
            }
        }
        n++;
        let probabilityLevel = diffsGreaterThanObserved / n;  
        
        return {meanDifference : diffMeans, probabilityLevel: probabilityLevel};
    }
    
    // # [Comparing the means of two sets using a T-test]
    //
    // Input:
    //      baseSet: set of observations with the "standard conditions"
    //      testSet:  set of observations with the new conditions 
    //      confidenceLevel: confidence level for calculating the confidence range
    // Output: (object)
    //      meanDifference: difference between the means: E(testSet) - E(baseSet)
    //      probabilityLevel: probability that a difference between the means equal or bigger than the observed is due to chance assuming E(testSet) = E(baseSet)
    //      confidenceRange: deviation from the meanDifference where the "true" difference between the means is likely to be with the given confidence level
    function twoSetsTtest (baseSet, testSet, confidenceLevel) {         
        if (confidenceLevel === undefined) { 
            confidenceLevel = 0.95;
        }
        let mBaseSet = ss.mean(baseSet),
            mTestSet = ss.mean(testSet),
            diffMeans = mTestSet - mBaseSet,
            vBaseSet = ss.sampleVariance(baseSet),
            vTestSet = ss.sampleVariance(testSet),
            pooledVariance = ((baseSet.length - 1) * vBaseSet + (testSet.length - 1) * vTestSet) / (baseSet.length + testSet.length - 2),
            stError = Math.sqrt(pooledVariance * (1 / baseSet.length + 1 / testSet.length)),            
            tStatistic = diffMeans / stError,//ss.tTestTwoSample(baseSet, testSet);
            degreesOfFreedom = baseSet.length + testSet.length - 2,
            probabilityLevel;
        if (tStatistic < 0) { 
            probabilityLevel = distributions.tStudent (tStatistic, degreesOfFreedom);
        } else {
            probabilityLevel = 1 - distributions.tStudent (tStatistic, degreesOfFreedom);
        }
        let delta = confidenceRangeForT (stError, degreesOfFreedom, confidenceLevel);
        
        return {meanDifference : diffMeans, probabilityLevel: probabilityLevel, confidenceRange: delta};
    }
    
    
    // # [Comparing the means of two sets using a paired T-test]
    //
    // Input:
    //      baseSet: set of observations with the "standard conditions"
    //      testSet:  set of observations with the new conditions 
    //      confidenceLevel: confidence level for calculating the confidence range
    // Output: (object)
    //      meanDifference: mean difference between sets: E(testSet - baseSet)
    //      probabilityLevel: probability that a mean difference equal or bigger than the observed is due to chance assuming E(testSet - baseSet) = 0
    //      confidenceRange: deviation from the meanDifference where the "true" difference between the means is likely to be with the given confidence level
    function twoSetsTtestPaired (baseSet, testSet, confidenceLevel) { 
        if (baseSet.length !== testSet.length) { 
            throw 'base set and test set does not have the same length';
        }
        if (confidenceLevel === undefined) { 
            confidenceLevel = 0.95;
        }
        let diffSet = [];
        for (let n = 0; n < baseSet.length; n++) {
            diffSet.push(testSet[n] - baseSet[n]);
        }
        let mDiffSet = ss.mean(diffSet),
            sDiffSet = ss.sampleStandardDeviation(diffSet),
            stError = sDiffSet / Math.sqrt(baseSet.length),
            tStatistic = mDiffSet / stError,
            degreesOfFreedom = baseSet.length  - 1,
            probabilityLevel;
        if (tStatistic < 0) { 
            probabilityLevel = distributions.tStudent (tStatistic, degreesOfFreedom);
        } else {
            probabilityLevel = 1 - distributions.tStudent (tStatistic, degreesOfFreedom);
        }
        let delta = confidenceRangeForT (stError, degreesOfFreedom, confidenceLevel);
       
        return {meanDifference : mDiffSet, probabilityLevel: probabilityLevel, confidenceRange: delta};
    }
        
    // # [Confidence range for a variable with a T distribution]
    //
    // Input:
    //      standardError: standard error of the variable
    //      degreesOfFreedom:  degree of freedom of the observations
    //      confidenceLevel: confidence level for calculating the confidence range
    // Output: deviation from the mean where the "true" mean is likely to be with the given confidence level
    function confidenceRangeForT (standardError, degreesOfFreedom, confidenceLevel) {
        let pLevel = (1 - confidenceLevel) / 2,
            tConf = distributions.tInverse (pLevel, degreesOfFreedom),
            delta = tConf * standardError;
        return delta;
    }
    
    
    // # [Confidence range for a variable with a chi-squared distribution]
    //
    // Input:
    //      varianceEstimate: variance estimate of the variable
    //      degreesOfFreedom:  degree of freedom of the observations
    //      confidenceLevel: confidence level for calculating the confidence range
    // Output: (object) 
    //      highLimit: higher limit where the "true" variance is likely to be with the given confidence level
    //      lowLimit: lower limit where the "true" variance is likely to be with the given confidence level
    function confidenceIntervalForChi (varianceEstimate, degreesOfFreedom, confidenceLevel) {
        let pLevel = (1 - confidenceLevel) / 2,
            chiConf = distributions.chiInverse (pLevel, degreesOfFreedom),
            highLimit = (degreesOfFreedom * varianceEstimate) / chiConf;
        
        pLevel = 1 - pLevel;
        chiConf = distributions.chiInverse (pLevel, degreesOfFreedom);
        let lowLimit = (degreesOfFreedom * varianceEstimate) / chiConf;
            
        return {highLimit: highLimit, lowLimit: lowLimit};
    } 
    
    // # [Confidence range for a variable with a F distribution]
    //
    // Input:
    //      varianceRatio: ratio between the variance of set 1 and the variance of set 2
    //      degreesOfFreedom1:  degree of freedom of the observations of set 1 
    //      degreesOfFreedom2:  degree of freedom of the observations of set 2
    //      confidenceLevel: confidence level for calculating the confidence interval
    // Output: (object) 
    //      highLimit: higher limit where the "true" ratio is likely to be with the given confidence level
    //      lowLimit: lower limit where the "true" ratio is likely to be with the given confidence level
    function confidenceIntervalForF (varianceRatio, degreesOfFreedom1, degreesOfFreedom2, confidenceLevel) {
        let pLevel = (1 - confidenceLevel) / 2,
            fConf = distributions.fInverse(pLevel, degreesOfFreedom1, degreesOfFreedom2),
            highLimit = varianceRatio / fConf;
        
        pLevel = 1 - pLevel;
        fConf = distributions.fInverse(pLevel, degreesOfFreedom1, degreesOfFreedom2);
        let lowLimit = varianceRatio / fConf;
            
        return {highLimit: highLimit, lowLimit: lowLimit};
    } 
    
    
    // # [Confidence range for a variable with a Binomial distribution]
    //
    // Input:
    //      successes: number of successes or "yes" outcomes in the given sample size
    //      sampleSize:  number of trials observed
    //      confidenceLevel: confidence level for calculating the confidence interval
    // Output: (object) 
    //      highLimit: higher limit where the "true" probability to obtaining a success is likely to be with the given confidence level
    //      lowLimit: lower limit where the "true" probability to obtaining a success is likely to be with the given confidence level
    function confidenceIntervalForBinomial (successes, sampleSize, confidenceLevel) {
        let pLevel = (1 - confidenceLevel) / 2,
            p0 = 0;
        while (p0 < 1) {
            let pValue = 1 - distributions.binomialCumulative(successes - 1, sampleSize, p0);
            if (pValue >= pLevel) {
                break;
            }
            p0 += 0.0001;
        }
       let  highLimit = p0;
        
        pLevel = 1 - pLevel;
        while (p0 <= 1) {
            let pValue = 1 - distributions.binomialCumulative(successes - 1, sampleSize, p0);
            if (pValue >= pLevel) {
                break;
            }
            p0 += 0.0001;
        }
        let lowLimit = p0;
            
        return {highLimit: highLimit, lowLimit: lowLimit};
    } 
    
    // # [Confidence range for a variable with a Poisson distribution]
    //
    // Input:
    //      successes: number of successes or "yes" outcomes in the given sample size
    //      confidenceLevel: confidence level for calculating the confidence interval
    // Output: (object) 
    //      highLimit: higher limit where the "true" probability to obtaining a success is likely to be with the given confidence level
    //      lowLimit: lower limit where the "true" probability to obtaining a success is likely to be with the given confidence level
    function confidenceIntervalForPoisson (successes, confidenceLevel) {
        let pLevel = (1 - confidenceLevel) / 2,
            p0 = 0.0001;
        while (p0 < 1) {
            let pValue = 1 - distributions.poissonCumulative(successes, p0);
            if (pValue >= pLevel) {
                break;
            }
            p0 += 0.0001;
        }
       let  highLimit = p0;
        
        pLevel = 1 - pLevel;
        while (p0 <= 1) {
            let pValue = 1 - distributions.poissonCumulative(successes, p0);
            if (pValue >= pLevel) {
                break;
            }
            p0 += 0.0001;
        }
        let lowLimit = p0;
            
        return {highLimit: highLimit, lowLimit: lowLimit};
    } 
    
    experiments.twoSetsRefSet = twoSetsRefSet;
    experiments.twoSetsTtest = twoSetsTtest;
    experiments.twoSetsTtestPaired = twoSetsTtestPaired;    
    experiments.confidenceRangeForT = confidenceRangeForT;    
    experiments.confidenceIntervalForChi = confidenceIntervalForChi;
    experiments.confidenceIntervalForF = confidenceIntervalForF;
    experiments.confidenceIntervalForBinomial = confidenceIntervalForBinomial;
    experiments.confidenceIntervalForPoisson = confidenceIntervalForPoisson;

    return experiments;
}));
