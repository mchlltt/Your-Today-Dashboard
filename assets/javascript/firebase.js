$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyDCO42TtlK2h-MzIpVt1qGGQR-AmpwQVS0",
        authDomain: "your-today-dashboard.firebaseapp.com",
        databaseURL: "https://your-today-dashboard.firebaseio.com",
        storageBucket: "your-today-dashboard.appspot.com",
        messagingSenderId: "840765761710"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    var name;

    var users = database.ref('users');

    $('#submit-button').on('click', function() {
        name = $('#username').val();
        users.child(name).once('value', function(snapshot) {
            if (snapshot.exists()) {
                console.log(snapshot);
            } else {
                var obj = {};
                obj[name] = {
                    name: name
                };
                users.update(obj);
            }
            $('#username').val('');
        });
    });

});
