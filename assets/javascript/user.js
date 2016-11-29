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
    var photos = database.ref('photos');

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
    var placeID;
    var backgroundPlaceID;
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
        displayName = undefined;
        placeID = '';
        backgroundPlaceID = '';
        photoURL = '';
        location = undefined;
        vicinity = '';
        lat = '';
        long = '';
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


    // Listener for the button that allows a user to change their name or location.
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

    // User form submission ------->
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

    // Submit the form by clicking submit,
    $('#submit-button').on('click', submitForm);

    // or by hitting enter in any input. This avoids enter triggering auto-location.
    $('.change-input').on('keypress', function(e) {
        if (e.which === 13) {
            submitForm();
            return false;
        }
    });
    // <----- User form submission.

    showForm = function() {
        if (displayName !== undefined && location !== undefined) {
            if (displayName.length === 0 || location.length === 0) {
                $('.update-form-container').show();
            }
        } else {
            $('.welcome').css('display', 'inline-block');
            $('.change').show();
        }
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
        $.when(checkData()).done(showForm);
    };

    // <---- Authentication


    // Page Element Logic ----->

    // Attach event handlers once we know `name`.
    checkData = function() {
        // Listen for displayName initial value and changes.
        displayNames.child(name).on('value', function(snapshot) {
            if (snapshot.exists()) {
                displayName = snapshot.val().displayName;
                // Set local display name variables when we get them.
                showDisplayName(snapshot.val().displayName);
            }
        });

        // Listen for photo initial value and changes.
        photos.child(name).on('value', function(snapshot) {
            if (snapshot.exists()) {
                photoURL = snapshot.val().photoURL;
                backgroundPlaceID = snapshot.val().placeID;
                showBackground();
            }
        });

        // Listen for location initial value and changes.
        locations.child(name).on('value', function(snapshot) {
            if (snapshot.exists()) {
                // Set local location variables when we get them.
                // This isn't necessarily shown anywhere except that 
                // we should check now whether we need to find a background image.
                lat = snapshot.val().lat;
                long = snapshot.val().long;
                location = snapshot.val().location;
                locationName = snapshot.val().locationName;
                placeID = snapshot.val().placeID;
                $('#location').val(location);
                backgroundCheck();
            }
        });

        return displayName;
    };

    // Check whether we need to find a background image.
    backgroundCheck = function() {
        if (placeID.length > 0) {
            if (isBackgroundImageNeeded()) {
                findBackground(placeID);
            }
        }
    };

    // To decide whether we need to find a new background image,
    isBackgroundImageNeeded = function() {
        // First check whether we have a backgroundPlaceID. If we don't, we need to find an image.
        if (backgroundPlaceID === undefined || backgroundPlaceID.length === 0) {
            return true;
            // If we have a backgroundPlaceID, check whether it's the same as our placeID. If isn't, we need to find a new image.
        } else if (placeID !== backgroundPlaceID) {
            return true;
            // Otherwise, we are set and don't need to find a new image.
        } else {
            return false;
        }
    };

    // Change the places that display name is shown.
    showDisplayName = function(displayName) {
        if (displayName.length > 0) {
            $('#displayName').val(displayName);
            $('#hello').text('Hello ' + displayName + '!');
        }
    };

    // Change the background image.
    showBackground = function() {
        if (photoURL.length > 0) {
            $('body').css('background-image', 'url(' + photoURL + ')');
        }
    };


    // Find a background image based on placeID.
    findBackground = function(placeID) {
        // Get Place Details, which may include a photos array.
        var placeIDURL = "https://crossorigin.me/https://maps.googleapis.com/maps/api/place/details/json?placeid=" + placeID + "&key=AIzaSyBsgQ07A5r52jQrex89eg_mSYCoQME2v1g";
        $.getJSON({
            url: placeIDURL,
        }).done(function(response) {
            // If you get a response in which the photos array isn't empty, send the place ID and URL on the first image to Firebase.
            // This database update will trigger the local changes.
            if (response.result.photos !== undefined) {
                var reference = response.result.photos[0].photo_reference;
                photoURL = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=1600&photoreference=" + reference + "&key=AIzaSyBYWYrtTu9U0zgCOTpVKL_WyLsaB365exk";
                var newPhotoURLObj = {};
                newPhotoURLObj[name] = {
                    photoURL: photoURL,
                    placeID: placeID
                };
                photos.update(newPhotoURLObj);
                // But, if we didn't get any photos, check if we can't get around that.
            } else {
                // Did the response have a 'vicinity' value?
                if (response.result.vicinity !== undefined && response.result.vicinity.length > 0) {
                    // And, if so, is it the same vicinity variable we just tried?
                    if (response.result.vicinity !== vicinity) {
                        // If it had a value that we haven't already tried, set vicinity.
                        vicinity = response.result.vicinity;
                        // Geocode vicinity.
                        var geocoderVicinity = new google.maps.Geocoder();
                        geocoderVicinity.geocode({
                            'address': vicinity
                        }, function(results, status) {
                            // If geocoding was successful,
                            if (status == google.maps.GeocoderStatus.OK) {
                                // Save new placeID locally then repeat this.
                                placeID = results[0].place_id;
                                findBackground(placeID);
                            }
                        });
                    }
                }
            }
        });
    };




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
