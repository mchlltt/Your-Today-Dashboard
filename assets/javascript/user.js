$(document).ready(function () {

    // Firebase Set-Up ---->
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

    // Assign authentication tools to variables.
    var auth = firebase.auth();
    // <---- Firebase Set-Up


    // Initialize variables --->
    var email = $('#email').val();
    var password = $('#password').val();
    var name;
    var displayName;
    var location;
    var lat;
    var long;
    var photoURL;
    var skycons = new Skycons({
        "color": "orange"
    });
    // <--- Initialize variables.


    // Authentication ---->
    // Realtime authentication state listener.
    // This will run on pageload and then anytime the auth state changes.
    auth.onAuthStateChanged(function (firebaseUser) {
        // If you are logged in,
        if (firebaseUser) {
            // Update variables and DOM based on user that is logged in.
            afterLogIn(firebaseUser);
        } else {
            // Logged out view.
            showLoggedOutSite();
            // Clear any data variables.
            clearUserData();
        }
    });

    showLoggedOutSite = function () {
        // Some of this may already be true, but since we are simultaneously accounting 
        // for on-pageload and on-signout, we are a bit more verbose.

        // Hide logged in only content.
        $('.logged-in').hide();

        // Make sure the login box is showing.
        $('.login').show();

        // Set background image to logged out default.
        $('body').css('background-image', '../images/background/old_wall.png')

        // Make sure any welcome message content is erased.
        $('hello').empty();
    };

    clearUserData = function () {
        // Reset variables. Some of this may already be true, but we want to be careful.
        email = '';
        password = '';
        name = '';
        displayName = '';
        photoURL = '';
        location = '';
        lat = '';
        long = '';
    };

    // What to do when the user is or becomes authenticated.
    afterLogIn = function (firebaseUser) {
        // Hide the login section.
        $('.login').hide();
        // Show the logged in site.
        $('.logged-in').show();

        // Clear out any email/password values.
        // We do this here instead of after login-button click
        // because we do not want to delete their info if the login fails.
        $('#email').val('');
        $('#password').val('');

        // name is a temporary workaround for username, because an email address cannot be a variable name in Firebase.
        // This wouldn't work in a scaled application, but with our set-up, it does.
        name = firebaseUser.email.split('@')[0];

        // Check whether we need displayName and location from the user.
        $.when(isUserInfoNeeded()).done(showForm);
    };

    // On login-button click.
    $('#login-button').on('click', function (e) {

        // Get email & password.
        email = $('#email').val();
        password = $('#password').val();

        // Promise attempts to sign in.
        var promise = auth.signInWithEmailAndPassword(email, password);

        // If it fails, log the error message.
        // TODO: Depending on error message, let the user know what happened.
        promise.catch(function (e) {
            console.log(e.message);
        });

        // Don't refresh.
        return false;
    });


    // On logout-button click.
    $('#logout-button').on('click', function () {
        // Sign out. The auth listener will handle the rest.
        auth.signOut();

        // Don't refresh.
        return false;
    });
    // <---- Authentication


    // Page Element Logic ----->

    // Check whether we need displayName or location.
    isUserInfoNeeded = function () {

        // Check if a display name is already known for this email.
        displayNames.child(name).once('value', function (snapshot) {
            // If so, set the value of the displayName input to the displayName.
            if (snapshot.exists()) {
                displayName = snapshot.val().displayName;
                $('#displayName').val(displayName);
            }
        });

        // Check if a location is already known for this email.
        return locations.child(name).once('value', function (snapshot) {
            // If so, set the value of the location input to the location.
            if (snapshot.exists()) {
                lat = snapshot.val().lat;
                long = snapshot.val().long;
                location = snapshot.val().location;
                locationName = snapshot.val().locationName;
                placeID = snapshot.val().placeID;
                photoURL = snapshot.val().photoURL;
                $('#location').val(location);
            }
        });
    };

    // If we found that we have a display name and location already, hide the form.
    showForm = function () {
        if (displayName === undefined || location === undefined) {
            $('.update-form-container').show();
        } else {
            updateDisplayName();
            $('.welcome').show();
            $('.change').show();
        }
    };

    $('#change-button').on('click', function () {
        $('.update-form-container').show();
        $('.welcome').hide();
        $('.change').hide();
    });


    // Auto-Location ---->
    // Get location from 'Auto-Locate' button.
    $('#auto-locate').on('click', function () {
        $('#form-submit-message').text('');
        $('.gps-svg').css('display', 'block');
        if (navigator.geolocation) {
            // If geolocation is available, hand the results to savePosition.
            navigator.geolocation.getCurrentPosition(savePosition, positionError);
        } else {
            // Since the response is the same in both cases -- asking the user to
            // enter their location manually, use the same error handler for a failed
            // geolocation as for geolocation being unavailable.
            positionError();
        }

        // Don't refresh.
        return false;
    });

    // If auto-locate is successful, write it to the location input.
    savePosition = function (position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // Write the truncated coordinates to the location input. 
        // It's precise enough and neater.
        $('#location').val(lat.toFixed(3) + ',' + long.toFixed(3));
        $('.gps-svg').hide();
    };

    // If auto-locate fails, display error text.
    positionError = function () {
        $('#form-submit-message').text('Error auto-locating. Please enter your location manually.');
        $('.gps-svg').hide();
    };
    // <----- Auto-Location


    // When the form is submitted with the display name and location,
    $('#submit-button').on('click', function () {
        // Clear out any previous error message.
        $('#form-submit-message').text('');

        // Get contents of displayName input.
        displayName = $('#displayName').val();

        // Verify that a name was input before sending it to Firebase.
        if (displayName.length > 0) {
            var displayNameObj = {};
            displayNameObj[name] = {
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
            }, function (results, status) {
                // If geocoding was successful,
                if (status == google.maps.GeocoderStatus.OK) {
                    // Save latitude and longitude.
                    lat = results[0].geometry.location.lat();
                    long = results[0].geometry.location.lng();
                    locationName = results[0].formatted_address;
                    placeID = results[0].place_id;
                    photoURL = '';

                    // Write location and lat/long to Firebase.            
                    var locationObj = {};
                    locationObj[name] = {
                        location: location,
                        locationName: locationName,
                        placeID: placeID,
                        lat: lat,
                        long: long
                    };
                    locations.update(locationObj);


                    // Hide form and show change button only if geocoding was successful.
                    $('.update-form-container').hide();
                    $('.welcome').show();
                    $('.change').show();

                } else {
                    $('#form-submit-message').text('Your location couldn\'t be found. Try auto-location or a postal code.');
                }
            });
        }

        return false;
    });


    updateDisplayName = function () {
        $('#hello').text('Hello ' + displayName + '!');
    };

    // Listen for displayName initial value and changes.
    database.ref().on('value', function (snapshot) {
        // Name becomes defined once there is successful authentication.
        if (name !== undefined) {
            updateDisplayName(snapshot);
        }
    });


    // Listen for changes in location once logged in.
    // Background image ---->
    locations.on('value', function (snapshot) {
        // If location is defined and length > 0, this means that placeID has been captured.
        if (location !== undefined) {
            if (location.length > 0) {
                if (photoURL === undefined || photoURL.length === 0) {
                    // Fetch image by placeid.
                    var placeIDURL = "https://jsonp.afeld.me/?url=https%3A%2F%2Fmaps.googleapis.com%2Fmaps%2Fapi%2Fplace%2Fdetails%2Fjson%3Fplaceid%3D" + placeID + "%26key%3DAIzaSyBsgQ07A5r52jQrex89eg_mSYCoQME2v1g";
                    $.ajax({
                        url: placeIDURL,
                        method: 'GET'
                    }).done(
                        function (response) {
                            // If you get a response in which the photos array isn't empty, set the background image's src to the URL on the first image.
                            if (response.result.photos !== undefined) {
                                var reference = response.result.photos[0].photo_reference;
                                photoURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=" + reference + "&key=AIzaSyBYWYrtTu9U0zgCOTpVKL_WyLsaB365exk";
                                $('body').css('background-image', 'url(' + photoURL + ')');
                                var newPhotoURLObj = {};
                                newPhotoURLObj[name] = {
                                    location: location,
                                    locationName: locationName,
                                    placeID: placeID,
                                    lat: lat,
                                    long: long,
                                    photoURL: photoURL
                                };
                                locations.update(newPhotoURLObj);
                            } else {
                                // Otherwise, we're going to look for a more broad location.
                                var newTerm = response.result.vicinity;
                                var geocoderVicinity = new google.maps.Geocoder();
                                geocoderVicinity.geocode({
                                    'address': newTerm
                                }, function (results, status) {
                                    // If geocoding was successful,
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        // Save placeID locally and to Firebase.
                                        placeID = results[0].place_id;
                                        var newPlaceIDObj = {};
                                        newPlaceIDObj[name] = {
                                            location: location,
                                            locationName: locationName,
                                            placeID: placeID,
                                            lat: lat,
                                            long: long
                                        };
                                        locations.update(newPlaceIDObj);
                                    }
                                });
                            }
                        }
                    );
                } else {
                    // Unless we already have the photoURL from Firebase, in which case just use that.
                    $('body').css('background-image', 'url(' + photoURL + ')');
                }
            }
        }
    });
    // <---- Background image.


    // Fetch weather ---->
    $('#weather-button').on('click', function () {
        var apiKey = '0b3cbdf73e99584a55eddd1b6bd851f6';
        var url = 'https://api.forecast.io/forecast/';

        $.getJSON(url + apiKey + "/" + lat + "," + long + "?callback=?", function (data) {
            $('#weatherLocation').text('The weather for ' + locationName);
            $('#weather').text('Current temperature: ' + data.currently.temperature + ' °F');
            $('#weatherReport').text('Next Hour: ' + data.currently.summary);
            $('#precipitationReport').text('Chance of precipitation: ' + data.currently.precipProbability * 100 + '%');
            var icon = data.currently.icon;
            icon.toUpperCase();
            skycons.set('icon1', icon);
            skycons.play();
        });

        return false;

    });
    // <---- Fetch weather.

});