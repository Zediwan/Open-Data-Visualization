/*
function to read JSON with Data for the Sankey by Elias Wipfli and Pascal Gerig
Copyright (C) 2018  Elias Wipfli & Pascal Gerig
*/


/**
 read json and convert information into Array of Person Objects.
 call callback function in the end since this function is asynchronous
 */
function readData(callback) {
    //Read json and store data in array
    $(function () {
        $.getJSON('data/data.json', function (data) {
            $.each(data.person, function () {
                jsonData.push(this);
            });
            callback();
        });
    });
}