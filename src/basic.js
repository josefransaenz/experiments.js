/* Basic javascript file
 by Josefran Saenz
 */
'use strict';
var data = [[0, 0], [1, 0]];
var dataTable = {};


function handleDataChange (changes, source) {
    if (changes === null) {
        return;
    }
    data = dataTable.getData(); 
    //console.log(JSON.stringify(data));
    var x = [];
    var y = [];
    for (var n = 0; n < data.length; n++) {
        if (data[n][0] !== null) {
            x.push(data[n][0]);
        } 
        if (data[n][1] !== null) {
            y.push(data[n][1]);
        }
    }
    var stats = ['max', 'min', 'mean', 'median', 'sampleStandardDeviation'];//add autocorrelation coefficient!
    var st;
    var statsObj = {};
    for (st in stats){
        statsObj[stats[st]] = ss[stats[st]](y);
        document.getElementById(stats[st]).innerHTML = statsObj[stats[st]].toFixed(4);
    }
    let stError = statsObj.sampleStandardDeviation / Math.sqrt(y.length);
    document.getElementById('confRange').innerHTML = experiments.confidenceRangeForT (stError, y.length - 1, .90).toFixed(4);
    //graphs.normalPlot(y, statsObj.mean, statsObj.standard_deviation, document.getElementById("graph1_div")); 
    graphs.dotPlot(y, document.getElementById("graph1_div"));  
    graphs.seriesPlot(x, y, document.getElementById("graph2_div"));    
    graphs.histogram(y, statsObj.max, statsObj.min, document.getElementById("myCanvas"));    
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