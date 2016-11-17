$(document).ready(function() {

    // Function for use when determining whether to display the form asking for user info.
    isUserInfoNeeded = function() {
        var nameLocal = localStorage.getItem('name');
        var latLocal = localStorage.getItem('lat');
        var longLocal = localStorage.getItem('long');

        // This is broken. need to find the right way to determine if a key is set in localStorage.
        // if (nameLocal.length > 0 && latLocal.length > 0 && longLocal.length > 0) {
        //     return false;
        // } else {
        return true;
        // }
    };

    // Determine whether to display the form.
    hideForm = function() {
        if (isUserInfoNeeded()) {
            $('form').show();
        } else {
            $('form').hide();
        }
    };

    // Check on pageload.
    hideForm();

    // Initialize user variables.
    var name;
    var rawAddress;
    var lat;
    var long;

    // This variable indicates whether the address was input manually by the user and needs to be geocoded.
    // It is true by default.
    var inputAddress = true;

    // It is also true if the user has typed in the location box.
    $('#location').on('keyup', function() {
        inputAddress = true;
    });

    // Get input from input boxes.
    $('#submit-button').on('click', function() {

        // Get name input.
        name = $('#username').val();
        localStorage.setItem('name', name);

        // If the address was not automatically collected by the browser, geocode it.
        if (inputAddress) {

            // User's raw address.
            rawAddress = $('#location').val();
            localStorage.setItem('rawAddress', rawAddress);

            // Initialize geocoder.
            var geocoder = new google.maps.Geocoder();

            // Geocode raw address input.
            geocoder.geocode({
                'address': rawAddress
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // Save latitude and longitude.
                    lat = results[0].geometry.location.lat();
                    long = results[0].geometry.location.lng();

                    localStorage.setItem('lat', lat);
                    localStorage.setItem('long', long);

                } else {
                    // Log error code. We'll need to have an error display for the user but this works for now.
                    $('#form-submit-message').text("Geocode was not successful for the following reason: " + status);
                }
            });
        } else {
            localStorage.setItem('lat', lat);
            localStorage.setItem('long', long);
        }

        // Clear form.
        $('#location').val('');

        // Indicate success.
        $('#form-submit-message').text('Sucess!');

        // Don't refresh.
        return false;
    });

    // Get location from 'Auto-Locate' button.
    $('#auto-locate').on('click', function() {
        if (navigator.geolocation) {
            // Hand the results to savePosition.
            navigator.geolocation.getCurrentPosition(savePosition, positionError);
        } else {
            // Very basic error handling for now.
            $('#form-submit-message').text('Error getting address.');
        }

        // Don't refresh.
        return false;
    });

    savePosition = function(position) {
        // Save results of geolocation.    
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // Write the truncated coordinates to the location input to show the user that it was completed successfully.
        $('#location').val(lat.toFixed(3) + ',' + long.toFixed(3));

        // Tell the program not to geocode ('#location').val() since we already have the full coordinates saved to lat and long.
        // This will be overwritten back to true if the user types in the location box.
        inputAddress = false;
    };

    positionError = function() {
        $('#form-submit-message').text('Error getting address.');
    };

});
