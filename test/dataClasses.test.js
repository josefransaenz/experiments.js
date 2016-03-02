'use strict'
const expect = require('chai').expect;
const Experiment = require('../lib/dataClasses.js').Experiment;
const fs = require('fs');
const filename = './samples/descriptiveNormalSample.json';
const experimentData = JSON.parse(fs.readFileSync(filename));
let experimentObj = {};

describe('Experiment class', function() {
    it('should create valid empty experiment objects', function() {
        experimentObj = new Experiment();
        //expect an object with the valid structure
        expect(experimentObj).to.be.an.instanceOf(Experiment);
        expect(experimentObj).to.contains.all.keys('meta','parameters','responses','factors','blocks','results');
        expect(experimentObj.meta.state).to.be.equal('empty');
    });
    it('should create valid complete experiment objects from data object', function() {
        experimentObj = new Experiment(experimentData);
        //expect an object with the valid structure
        expect(experimentObj).to.contains.all.keys('meta','parameters','responses','factors','blocks','results');
        expect(experimentObj.meta.state).to.be.equal('completed');
    });
    it('should know how to check/update its state', function(){
        expect(Experiment).to.respondTo('updateState');
    });    
    it('should know how to analyze itself by default', function(){
        expect(Experiment).to.respondTo('defaultAnalysis');
    });
    /*
    describe('updateState method', function() {
        it('should update the state property of experiment', function () {
            experimentObj = new Experiment(experimentData);
            expect(experimentObj.updateState).to.change(experimentObj.meta, 'state');
        });
        it('should properly identify empty experiments', function () {
            experimentObj = new Experiment();
            expect(experimentObj.updateState()).to.be.equal('empty');
        });
        it('should properly identify designed (but not running) experiments', function () {
            //load designed experiment
            expect(experimentObj.updateState()).to.be.equal('designed');
        });
        it('should properly identify running (but not completed) experiments', function () {
            //load designed experiment
            expect(experimentObj.updateState()).to.be.equal('running');
        });
        it('should properly identify completed (but not analyzed) experiments', function () {
            //load designed experiment
            expect(experimentObj.updateState()).to.be.equal('completed');
        });
        it('should properly identify analyzed experiments', function () {
            //load designed experiment
            expect(experimentObj.updateState()).to.be.equal('analyzed');
        });
    });
    describe('defaultAnalysis method', function() {
        it('should update the results of the experiment', function () {
            expect(experimentObj.defaultAnalysis).to.change(experimentObj, 'results');
        });
    });
    */
});