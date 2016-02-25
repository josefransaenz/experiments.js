'use strict'
import * as fs from 'fs';

/**
 * Asyncronously Open a .json file containing experiment data
 * @param {string} filename - The name of the file to open and read.
 * @param {number} callback / Function to call after reading all data.
 */
export default function (filename, callback) {
    fs.readFile(filename, function (err, data) {	
        let experimentObj = {};
        if (err){            
            console.error('Error reading experiment file' + filename);
            //throw err;
        } else{
            try {
                experimentObj = JSON.parse(data);
            } catch (err){
                console.error("Error parsing data from experiment file");
                //throw err;
            }
        }
        callback(err, experimentObj);
    });	    
}