/* twoEntities javascript file
 by Josefran Saenz
 */
'use strict';
//import { experiment } from './src';
var data = [[0, 0, 0], [0, 0, 0]];
var dataTable = {};
var a = [];
var b = [];
var c = [];

function handleDataChange (changes, source) {
    if (changes === null) {
        return;
    }
    data = dataTable.getData(); 
    //console.log(JSON.stringify(data));
    a = [];
    b = [];
    c = [];
    for (let n = 0; n < data.length; n++) {
        if (data[n][0] !== null && data[n][0] !== "") {
            a.push(data[n][0]);
        } 
        if (data[n][1] !== null && data[n][1] !== "") {
            b.push(data[n][1]);
        }
        if (data[n][2] !== null && data[n][2] !== "") {
            c.push(data[n][2]);
        }
    }
    let result;
    try { // statements to try
        results = experiments.twoSetsRefSet(a, b, c);// function could throw exception
        document.getElementById("sigRefSet").innerHTML = result.probabilityLevel;
        document.getElementById("meanDiff").innerHTML = result.meanDifference;
    }
    catch (e) {
        //alert(e); // pass exception object to error handler
    }
    
    result = experiments.twoSetsTtest(a, b);
    document.getElementById("sigTtest").innerHTML = result.probabilityLevel.toFixed(4) + '+/-' + result.confidenceRange.toFixed(4) ;
    
    result = experiments.twoSetsTtestPaired(a, b);
    document.getElementById("sigTtestPD").innerHTML = result.probabilityLevel.toFixed(4) + '+/-' + result.confidenceRange.toFixed(4) ;
    
    
    graphs.normalPlot(a, ss.mean(a), ss.standardDeviation(a), document.getElementById("graph1_div"));
    graphs.normalPlot(b, ss.mean(b), ss.standardDeviation(b), document.getElementById("graph2_div")); 
    //graphs.dotPlot(a, document.getElementById("graph1_div"));  
    //graphs.dotPlot(b, document.getElementById("graph2_div")); 
    //graphs.seriesPlot(x, y, document.getElementById("graph2_div"));    
    graphs.histogram(c, ss.max(c), ss.min(c), document.getElementById("myCanvas"));    
}

   
dataTable = tables.createSimpleTable(document.getElementById("dataTable"), JSON.parse(JSON.stringify(data)), handleDataChange);

var setRows = document.getElementById("setRows");
setRows.addEventListener("change",addRows);
function addRows(){    
    let oldRows = dataTable.countRows();
    let newRows = setRows.value;
    if (newRows > oldRows) {
        for (let n = oldRows; n < newRows; n++) {
            dataTable.alter('insert_row', null, 1);
        }
    } else {
        for (let n = oldRows; n > newRows; n--) {
            dataTable.alter('remove_row', null, 1);
        }
    }
}

var confLevelRange = document.getElementById("confLevelRange");
confLevelRange.addEventListener("change",function(){
    document.getElementById("confLevel").value = confLevelRange.value;
});