$(document).ready(function() {

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
    var vicinity;
    var errorTimeout;
    var skycons = new Skycons({
        "color": "orange"
    });
    // <--- Initialize variables.


    // Authentication ---->
    // Realtime authentication state listener.
    // This will run on pageload and then anytime the auth state changes.
    auth.onAuthStateChanged(function(firebaseUser) {
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

    // Show the user the logged out version of the site.
    showLoggedOutSite = function() {
        // Some of this may already be true, but since we are simultaneously accounting 
        // for on-pageload and on-signout, we are a bit more verbose.
        // Hide logged in only content.
        $('.logged-in').hide();

        // Make sure the login box is showing.
        $('.login').css('display', 'flex');
        $('.logged-out').show();

        // Set background image to logged out default.
        $('body').css('background-image', 'url("assets/images/background/congruent_pentagon.png")');

        // Make sure any welcome, weather, and news content is erased.
        $('#hello').empty();
        $('.weather-details').empty();
        $('#icon1').hide();
        $('.article').empty();
        $('#source-name').text('Your News');
    };

    // Reset variables. Some of this may already be true, but we want to be careful.
    clearUserData = function() {
        $('#displayName').val('');
        $('#location').val('');
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
    afterLogIn = function(firebaseUser) {
        // Hide the login section.
        $('.logged-out').hide();
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
    $('#login-button').on('click', function(e) {

        clearTimeout(errorTimeout);

        // Get email & password.
        email = $('#email').val();
        password = $('#password').val();

        // Promise attempts to sign in.
        var promise = auth.signInWithEmailAndPassword(email, password);

        // If it fails, notify the user via popover.
        promise.catch(function(e) {
            $('#login-button').popover('toggle');
            errorTimeout = setTimeout(
                function() {
                    $('#login-button').popover('hide');
                }, 3000);
        });

        // Don't refresh.
        return false;
    });


    // On logout-button click.
    $('#logout-button').on('click', function() {
        // Sign out. The auth listener will handle the rest.
        auth.signOut();

        // Don't refresh.
        return false;
    });
    // <---- Authentication


    // Page Element Logic ----->

    // Check whether we need displayName or location.
    isUserInfoNeeded = function() {

        // Check if a display name is already known for this email.
        displayNames.child(name).once('value', function(snapshot) {
            // If so, set the value of the displayName input to the displayName.
            if (snapshot.exists()) {
                displayName = snapshot.val().displayName;
                $('#displayName').val(displayName);
                setDisplayName(snapshot);
            }
        });

        // Check if a location is already known for this email.
        return locations.child(name).once('value', function(snapshot) {
            // If so, set the value of the location input to the location.
            if (snapshot.exists()) {
                lat = snapshot.val().lat;
                long = snapshot.val().long;
                location = snapshot.val().location;
                locationName = snapshot.val().locationName;
                placeID = snapshot.val().placeID;
                photoURL = snapshot.val().photoURL;
                $('#location').val(location);
                setBackground(snapshot);
            }
        });
    };

    // If we found that we have a display name and location already, hide the form.
    showForm = function() {
        if (displayName.length === 0 || location.length === 0) {
            $('.update-form-container').show();
        } else {
            $('.welcome').css('display', 'inline-block');
            $('.change').show();
        }

        startListening();
    };


    $('#change-button').on('click', function() {
        $('.update-form-container').show();
        $('.welcome').hide();
        $('.change').hide();
    });


    // Auto-Location ---->
    // Get location from 'Auto-Locate' button.
    $('#auto-locate').on('click', function() {
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
    savePosition = function(position) {
        lat = position.coords.latitude;
        long = position.coords.longitude;

        // Write the truncated coordinates to the location input. 
        // It's precise enough and neater.
        $('#location').val(lat.toFixed(3) + ',' + long.toFixed(3));
        $('.gps-svg').remove();
    };

    // If auto-locate fails, display error text.
    positionError = function() {
        $('#auto-locate').popover('toggle');
        setTimeout(
            function() {
                $('#auto-locate').popover('hide');
            }, 3000);

        $('.gps-svg').remove();
    };
    // <----- Auto-Location


    // If the user hits enter in the change info form, submit the form instead of autolocating.
    $('.change-input').on('keypress', function(e) {
        if (e.which === 13) {
            submitForm();
            return false;
        }
    });


    submitForm = function() {
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
            }, function(results, status) {
                // If geocoding was successful, check if the location has changed.
                if (status == google.maps.GeocoderStatus.OK) {
                    // If the placeID hasn't changed, we're not going to change anything.
                    if (placeID !== results[0].place_id) {
                        // But if it has, save location data to variables and Firebase.
                        lat = results[0].geometry.location.lat();
                        long = results[0].geometry.location.lng();
                        locationName = results[0].formatted_address;
                        photoURL = '';
                        placeID = results[0].place_id;

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
                    }

                    // Hide form and show change button only if geocoding was successful.
                    $('.update-form-container').hide();
                    $('.welcome').show();
                    $('.change').show();

                } else {
                    $('#submit-button').popover('toggle');
                    setTimeout(
                        function() {
                            $('#submit-button').popover('hide');
                        }, 3000);
                }
            });
        }

        return false;
    };

    // When the form is submitted with the display name and location,
    $('#submit-button').on('click', submitForm);

    // Attach event handlers once we know `name`.
    startListening = function() {
        // Listen for displayName initial value and changes.
        displayNames.child(name).on('value', function(snapshot) {
            setDisplayName(snapshot);
        });

        // Listen for location initial value and changes.
        locations.child(name).on('value', function() {
            setBackground();
        });
    };

    setDisplayName = function(snapshot) {
        if (displayName !== undefined && displayName.length !== 0) {
            $('#hello').text('Hello ' + snapshot.val().displayName + '!');
        }
    };

    // Background image ---->
    setBackground = function() {
        // If location is defined and length > 0, this means that placeID has been captured.
        if (location !== undefined && location.length > 0) {
            // If we don't have photoURL yet, get it.
            if (photoURL === undefined || photoURL.length === 0) {
                // Fetch image by placeid.
                var placeIDURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeID + "&key=AIzaSyBsgQ07A5r52jQrex89eg_mSYCoQME2v1g";
                $.getJSON({
                    url: placeIDURL,
                }).done(
                    function(response) {
                        // If you get a response in which the photos array isn't empty, set the background image's src to the URL on the first image.
                        if (response.result.photos !== undefined) {
                            var reference = response.result.photos[0].photo_reference;
                            newPhotoURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=" + reference + "&key=AIzaSyBYWYrtTu9U0zgCOTpVKL_WyLsaB365exk";
                            // Check whether the URL has actually changed. If not, we don't want to reset it or it will flash as it reloads.
                            // There also isn't any reason to write to Firebase if nothing has changed.
                            if (newPhotoURL !== photoURL) {
                                photoURL = newPhotoURL;
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
                            }
                        } else {
                            // Otherwise, we're going to look for a more broad location.
                            // Make sure the vicinity is in the response and length > 0.
                            // Also, make sure it's not the same vicinity we just checked.
                            // Between these two things, we avoid infinite loops.
                            if (response.result.vicinity !== undefined && response.result.vicinity.length > 0) {
                                if (response.result.vicinity !== vicinity) {
                                    vicinity = response.result.vicinity;
                                    var geocoderVicinity = new google.maps.Geocoder();
                                    geocoderVicinity.geocode({
                                        'address': vicinity
                                    }, function(results, status) {
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
                        }
                    }
                );
            } else {
                // If we already photoURL from Firebase, just use that.
                $('body').css('background-image', 'url(' + photoURL + ')');
            }
        }
    };

    // <---- Background image.


    // Fetch weather ---->
    $('#weather-button').on('click', function() {
        var apiKey = '0b3cbdf73e99584a55eddd1b6bd851f6';
        var url = 'https://api.forecast.io/forecast/';

        $.getJSON(url + apiKey + "/" + lat + "," + long + "?callback=?", function(data) {
            $('#weatherLocation').text('The weather for ' + locationName);
            $('#weather').text('Current temperature: ' + data.currently.temperature + ' °F');
            $('#weatherReport').text('Next Hour: ' + data.currently.summary);
            $('#precipitationReport').text('Chance of precipitation in the next hour: ' + Math.round(data.currently.precipProbability * 100) + '%');
            var icon = data.currently.icon;
            icon.toUpperCase();
            skycons.set('icon1', icon);
            skycons.play();
            $('#icon1').show();
        });

        return false;

    });
    // <---- Fetch weather.

});
