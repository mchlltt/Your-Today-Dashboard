$(document).ready(function() {

    // Configure and initialize Firebase.
    var config = {
        apiKey: "AIzaSyDCO42TtlK2h-MzIpVt1qGGQR-AmpwQVS0",
        authDomain: "your-today-dashboard.firebaseapp.com",
        databaseURL: "https://your-today-dashboard.firebaseio.com",
        storageBucket: "your-today-dashboard.appspot.com",
        messagingSenderId: "840765761710"
    };
    firebase.initializeApp(config);

    // Assign the Firebase database to a variable.
    var database = firebase.database();

    // Assign sub-level of the databse to variables.
    var users = database.ref('users');
    var displayNames = database.ref('displayNames');
    var locations = database.ref('locations');

    // Initialize variables that will be written to or read from Firebase.
    var displayName;
    var location;
    var lat;
    var long;
    
    // *** Hard-coded test username. This will have been received through log-in process.
    var username = 'mchlltt';

    // Fake-simulating logging in.
    // This event listener will be replaced with what actually happens when you log in successfully.
    $('#login-button').on('click', function() {

        $('#login-button').hide();
        // Check whether you need to show the form.
        $.when(isUserInfoNeeded()).done(showForm);

        // Don't refresh.
        return false;
    });
    
    // Check whether we have the form inputs already.
    isUserInfoNeeded = function() {
        // Check if a display name is already known for this username.
        displayNames.child(username).once('value', function(snapshot) {
            if (snapshot.exists()) {
                displayName = snapshot.val().displayName;
                $('#displayName').val(displayName);
            }
        });

        // Check if a location is already known for this username.
        return locations.child(username).once('value',function(snapshot) {
            if (snapshot.exists()) {
                location = snapshot.val().location;
                $('#location').val(location);
            }
        });
    };

    // If we found that we have a display name and location already, hide the form.
    showForm = function() {
        if (displayName === undefined || location === undefined) {
            $('.form').show();
        } else {
            $('.welcome').show();
            $('.change').show();
        }
    };

    $('#change-button').on('click', function() {
        $('.form').show();
        $('.welcome').hide();
        $('.change').hide();
    });

    // Get location from 'Auto-Locate' button.
    $('#auto-locate').on('click', function() {
        if (navigator.geolocation) {
            // Hand the results to savePosition.
            navigator.geolocation.getCurrentPosition(savePosition, positionError);
        } else {
            // Very basic error handling for now. Indicates browser incompatibility.
            console.log('Geolocation not possible.');
        }

        // Don't refresh.
        return false;
    });

    // If auto-locate is successful, write it to the location input..
    savePosition = function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // Write the truncated coordinates to the location input.
        $('#location').val(lat.toFixed(3) + ',' + long.toFixed(3));
    };

    // If auto-locate fails, display error text.
    positionError = function() {
        $('#form-submit-message').text('Error getting address.');
    };


    // When the form is submitted with the display name and location,
    $('#submit-button').on('click', function() {
        // Get contents of displayName input.
        displayName = $('#displayName').val();

        // Verify that a name was input before sending it to Firebase.
        if (displayName.length > 0) {
            var displayNameObj = {};
            displayNameObj[username] = {
                displayName: displayName
            };
            displayNames.update(displayNameObj);
        }

        // Get contents of location input.
        location = $('#location').val();

        // Verify that a location was input before geocoding & sending it to Firebase.
        if (location.length > 0) {
            // Initialize geocoder.
            var geocoder = new google.maps.Geocoder();

            // Geocode location input.
            geocoder.geocode({
                'address': location
            }, function(results, status) {
                // If geocoding was successful,
                if (status == google.maps.GeocoderStatus.OK) {
                    // Save latitude and longitude.
                    lat = results[0].geometry.location.lat();
                    long = results[0].geometry.location.lng();

                    // Write location and lat/long to Firebase.            
                    var locationObj = {};
                    locationObj[username] = {
                        location: location,
                        lat: lat,
                        long: long
                    };
                    locations.update(locationObj);

                    // Hide form and show change button only if geocoding was successful.
                    $('.form').hide();
                    $('.welcome').show();
                    $('.change').show();

                    // Display success message.
                    console.log('Name and location set!');

                } else {
                    // Display a basic error code. Need better handling but this works for now.
                    console.log("Geocode was not successful for the following reason: " + status);
                }
            });
        }

        return false;
    });


    // Listen for changes in name.
    displayNames.on('value', function(snapshot) {
        displayName = snapshot.child(username).val().displayName;
        $('#hello').text('Hello ' + displayName + '!');
    });

    
    // Listen for changes in location.
    locations.on('value', function(snapshot) {
        lat = snapshot.child(username).val().lat;
        long = snapshot.child(username).val().long;
    });

    // Fetch weather.
    $('#weather-button').on('click', function() {
        var apiKey = '0b3cbdf73e99584a55eddd1b6bd851f6';
        var url = 'https://api.forecast.io/forecast/';

        $.getJSON(url + apiKey + "/" + lat + "," + long + "?callback=?", function(data) {
            // console.log(data);
            $('#weather').html('The temperature: ' + data.currently.temperature + ' degrees');
            $('#summary').html(data.currently.summary);
        });
        //https://api.forecast.io/forecast/0b3cbdf73e99584a55eddd1b6bd851f6

        return false;

    });

});
