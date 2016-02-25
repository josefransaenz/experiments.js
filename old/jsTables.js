/* my tabel javascript library
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
        g.tables = f();
    }
}(function() {
    // # jsTables
    //
    // useful table library for experiments
    var tables = {};
    
    function createSimpleTable (htmlDivId, data, changeFcn) {
        this.htmlDivId = htmlDivId;
        this.options = {
                data: data,
                height: 396,
                colHeaders: true,
                rowHeaders: true,
                type: 'numeric',
                format: '0,0.00[0000]',
                correctFormat: true,
                //stretchH: 'all',
                /*columns: [
                    //{type: 'date', dateFormat: 'DD/MM/YYYY', correctFormat: true},
                    {type: 'numeric', format: '0,0.00[0000]', correctFormat: true},
                    {type: 'numeric', format: '0,0.00[0000]', correctFormat: true}
                ],*/
                //columnSorting: true,
                contextMenu: true,
                afterChange: changeFcn,
                //enterBeginsEditing: false,
                //enterMoves: enterMovesFcn
            }
        var table = new Handsontable(this.htmlDivId, this.options);
        /*enterMovesFcn = function (event) {
            console.log(event);
            var sel = this.getSelected();
            var rows = this.countRows();
            if (sel[2] === rows - 1) {
                this.alter('insert_row', null);
            }
            return {row: 1, col: 0};
        };*/
        return table;    
    };
    
    function foo(){
        console.log('ciao!');
    }

    tables.createSimpleTable = createSimpleTable;
    tables.foo= foo;

    return tables;
}));

        




