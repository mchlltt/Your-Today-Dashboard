// $(document).ready(function() {

//     $('#weather-button').on('click', function() {
//         // HARD CODED TO RETURN CHICAGO AS LOCATION OF DATA
//         var apiKey = '0b3cbdf73e99584a55eddd1b6bd851f6';
//         var url = 'https://api.forecast.io/forecast/';
//         var lati = firebase.database.ref('locations').child(username).lat;
//         var longi = firebase.database.ref('locations').child(username).long;
//         var data;

//         //https://api.forecast.io/forecast/0b3cbdf73e99584a55eddd1b6bd851f6

//         $.getJSON(url + apiKey + "/" + lati + "," + longi + "?callback=?", function(data) {
//             console.log(data);
//             $('#weather').html('The temperature in Chicago: ' + data.currently.temperature + ' degrees');
//             $('#summary').html(data.currently.summary);

//             console.log("Summary ", data.currently.summary);

//         });
//     });


// });
