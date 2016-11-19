(function(){
		  // Initialize Firebase
	  var config = {
	    apiKey: "AIzaSyAXVzoEw5AtdvkKKaqM_sUVpqxEqSYaAEk",
	    authDomain: "authorizationtest-5f461.firebaseapp.com",
	    databaseURL: "https://authorizationtest-5f461.firebaseio.com",
	    storageBucket: "authorizationtest-5f461.appspot.com",
	    messagingSenderId: "372220140044"
	  };

		  //INIT FIREBASE
		  firebase.initializeApp(config);



			var txtEmail = document.getElementById('txtEmail');
			var txtPassword = document.getElementById('txtPassword');
			var btnLogin = document.getElementById('btnLogin');
			var btnSignUp = document.getElementById('btnLogout');
			var btnLogout = document.getElementById('btnLogin');

	btnLogin.addEventListener('click', function(e) {
		//GET EMAIL AND PASSWORD
			var email = txtEmail.value;
			var pass = txtPassword.value;
			var auth = firebase.auth();

			console.log(email);

		//SIGN IN
		auth.signInWithEmailAndPassword(email,pass);
		promise.catch(function (e) {console.log(e.message);});

		});


		//ADD SIGNUP AND EVENT
		btnSignUp.addEventListener('click', function(e){
			
			//GET EMAIL AND PASSWORD
				var email = txtEmail.value;
				var pass = txtPassword.value;
				var auth = firebase.auth();

				// SIGN IN
				var promise = auth.createUserWithEmailAndPassword(email,pass);

			promise
				.catch(function(e){
					console.log(e.message)
				})
		});

		//ADD A REALTIME LISTENER
		firebase.auth().onAuthStateChanged(function(firebaseUser) {

			if(firebaseUser){

				console.log("You are logged in as: ", firebaseUser);
			}else{
				console.log("you are NOT logged in")
			}
		
		});


}());