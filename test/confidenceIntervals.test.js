'use strict'
const expect = require('chai').expect;
const ci = require('../lib/confidenceIntervals.js');

describe('Confidence interval for a T distribution', function() {
   it('should calculate some valid intervals', function() {
       let interval = ci.confidenceIntervalForT (0.41, 0.12, 9, 0.95);
       expect(interval[0]).to.be.closeTo(0.14, 0.005);
       expect(interval[1]).to.be.closeTo(0.68, 0.005);
       interval = ci.confidenceIntervalForT (0.41, 0.12, 9, 0.999);
       expect(interval[0]).to.be.closeTo(-0.16, 0.005);
       expect(interval[1]).to.be.closeTo(0.98, 0.005);
       interval = ci.confidenceIntervalForT (1.69, 3.82, 9, 0.95);
       expect(interval[0]).to.be.closeTo(-6.95, 0.005);
       expect(interval[1]).to.be.closeTo(10.33, 0.005);
   });
});

describe('Confidence interval for a Chi distribution', function() {
   it('should calculate some valid intervals', function() {
       let interval = ci.confidenceIntervalForChi (13, 5, 0.95);
       expect(interval[0]).to.be.closeTo(5.07, 0.01);
       expect(interval[1]).to.be.closeTo(78.22, 0.1);
   });
});

describe('Confidence interval for a F distribution', function() {
   it('should calculate some valid intervals', function() {
       let interval = ci.confidenceIntervalForF (2.95, 12, 9, 0.90);
       expect(interval[0]).to.be.closeTo(0.96, 0.01);
       expect(interval[1]).to.be.closeTo(8.26, 0.05);
   });
});

describe('Confidence interval for a Binomial distribution', function() {
   it('should calculate some valid intervals', function() {
       //Examples from the book Statistics for experimenters p.106-107
       let interval = ci.confidenceIntervalForBinomial (15, 20, 0.95);
       expect(interval[0]).to.be.closeTo(0.51, 0.05);
       expect(interval[1]).to.be.closeTo(0.94, 0.05);
       interval = ci.confidenceIntervalForBinomial (37, 100, 0.95);
       expect(interval[0]).to.be.closeTo(0.275, 0.05);
       expect(interval[1]).to.be.closeTo(0.475, 0.05);
   });
});

describe('Confidence interval for a Poisson distribution', function() {
   it('should calculate some valid intervals', function() {
       //Examples from the book Statistics for experimenters p.106-107
       let interval = ci.confidenceIntervalForPoisson (0, 0.99);
       expect(interval[0]).to.be.closeTo(0, 0.05);
       expect(interval[1]).to.be.closeTo(5.3, 0.05);
       interval = ci.confidenceIntervalForPoisson (5, 0.95);
       expect(interval[0]).to.be.closeTo(1.6, 0.2);
       expect(interval[1]).to.be.closeTo(11.7, 1);
       interval = ci.confidenceIntervalForPoisson (50, 0.99);
       expect(interval[0]).to.be.closeTo(33.6, 5);
       expect(interval[1]).to.be.closeTo(71.3, 5);
   });
});
