/* useful graphs javascript library
 by Josefran Saenz
 */
'use strict';

(function(f) {
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
        g.graphs = f();
    }
}(function() {
    // # jsGraphs
    //
    // useful graphs for experiments
    var graphs = {};
    
    function normalPlot(measures, mean, standard_deviation, graph_div){
        var graphData = [];
        var n;
        var sortMeasures = measures.slice(0);
        sortMeasures.sort(function(a, b){return a-b});
        for (n = 0; n < measures.length; n++){
            var zScores = ss.zScore(sortMeasures[n], mean, standard_deviation);
            graphData.push([sortMeasures[n], zScores]);
        }
        graph_div.style.width = Math.round(window.innerWidth*0.45).toString() + 'px';
        graph_div.style.height = Math.round(window.innerWidth*0.25).toString() + 'px';
        var g1 = new Dygraph(
            graph_div, 
            graphData, 
            {
                labels: ["Index", "Data"],
                xlabel: "Measures", 
                ylabel: "Normal scores (z)", 
                title: "Normal probability plot",
                drawPoints: true,
                //drawAxesAtZero: true,
                strokeWidth: 0.0,
                xRangePad: window.innerWidth*0.01
            }
        ); 
    }

    function seriesPlot(x, y, graph_div){
        var graphData = [];
        var n;
        for (n = 0; n < x.length; n++){
            graphData.push([x[n], y[n]]);
        }
        graph_div.style.width = Math.round(window.innerWidth*0.45).toString() + 'px';
        graph_div.style.height = Math.round(window.innerWidth*0.25).toString() + 'px';
        var g2 = new Dygraph(
            graph_div, 
            graphData, 
            {
                labels: ["Index", "Data"],
                xlabel: "Index", 
                ylabel: "Measures", 
                title: "Series plot",
                drawPoints: true,
                //drawAxesAtZero: true,
                //strokeWidth: 0.0,
                xRangePad: window.innerWidth*0.01
            }
        ); 
    }

    function histogram(measures, max, min, canvasId){
        var bins = 10;
        var binWidth = (max - min) / bins;
        var sortMeasures = measures.slice(0);
        sortMeasures.sort(function(a, b){return a-b});
        var n;
        var counts = new Array(bins);
        var edges = new Array(bins);
        for (n = 0; n < bins; n++){
            counts[n] = 0;
            var lowEdge = min + binWidth * n;
            var highEdge = min + binWidth * (n+1);
            for (var k = 0; k < measures.length; k++){            
                if (measures[k] >= lowEdge && measures[k] < highEdge){
                    counts[n]++;
                }
            }
            edges[n] = ((lowEdge + highEdge)/2).toFixed(2);
        }
        var graphData = {
            labels: edges,
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,0.8)",
                    highlightFill: "rgba(220,220,220,0.75)",
                    highlightStroke: "rgba(220,220,220,1)",
                    data: counts
                }
            ]
        };
        var canvasDim;
        if (window.innerWidth > window.innerHeight){
            canvasDim = Math.round(window.innerHeight*0.45);
        } else {
            canvasDim = Math.round(window.innerWidth*0.45);
        }
        canvasId.width = canvasDim;
        canvasId.height = canvasDim;
        var ctx = canvasId.getContext("2d");
        var myBarChart = new Chart(ctx).Bar(graphData);    
    }
    
    function dotPlot(measures, graph_div){
        var graphData = [];
        var n;
        var sortMeasures = measures.slice(0);
        sortMeasures.sort(function(a, b){return a-b});
        var cont = 1;
        var maxCont = 0;
        for (n = 0; n < measures.length; n++){
            if (n > 0 && sortMeasures[n] === sortMeasures[n-1]){
                cont++;
            } else {
                if (cont > maxCont){
                    maxCont = cont;
                }
                cont = 1;
            }
            graphData.push([sortMeasures[n], cont]);
        }
        graph_div.style.width = Math.round(window.innerWidth*0.45).toString() + 'px';
        graph_div.style.height = Math.round(window.innerWidth*0.15).toString() + 'px';
        let rangePad = Math.round(window.innerWidth*0.15/(maxCont*3))*2;
        var g2 = new Dygraph(
            graph_div, 
            graphData, 
            {
                labels: ["Index", "Data"],
                xlabel: "Measures", 
                ylabel: "Frequency", 
                title: "Dot plot",
                drawPoints: true,
                pointSize : Math.round(window.innerWidth*0.15/(maxCont*4 + 2)),
                drawAxesAtZero: true,
                strokeWidth: 0.0,
                xRangePad: rangePad,
                yRangePad: rangePad
            }
        ); 
    }
    
    graphs.normalPlot = normalPlot;
    graphs.seriesPlot = seriesPlot;
    graphs.histogram = histogram;
    graphs.dotPlot = dotPlot;

    return graphs;
}));
