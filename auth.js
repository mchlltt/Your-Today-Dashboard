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


		const txtEmail = document.getElementById('txtEmail');
		const txtPassword = document.getElementById('txtPassword');
		const btnLogin = document.getElementById('btnLogin');
		const btnSignUp = document.getElementById('btnLogout');
		const btnLogout = document.getElementById('btnLogin');

	btnLogin.addEventListener('click', e => {
		//GET EMAIL AND PASSWORD
		const email = txtEmail.value;
		const pass = txtPassword.value;
		const auth = firebase.auth();
			console.log(email);

		//SIGN IN
		auth.signInWithEmailAndPassword(email,pass);
		promise.catch(e => console.log(e.message));

		});


		//ADD SIGNUP AND EVENT
		btnSignUp.addEventListener('click', e =>{
			
			//GET EMAIL AND PASSWORD
			const email = txtEmail.value;
			const pass = txtPassword.value;
			const auth = firebase.auth();

				// SIGN IN
			const promise = auth.createUserWithEmailAndPassword(email,pass);
			promise
				.catch(e => console.log(e.message))
		});

		//ADD A REALTIME LISTENER
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if(firebaseUser){

				console.log("You are logged in as: ", firebaseUser);
			}else{
				console.log("you are NOT logged in")
			}
		});


}());