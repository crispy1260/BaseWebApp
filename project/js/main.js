$(document).ready(function() {
  getPosts();
});

function getWeather(searchQuery) {
  var url="http://api.openweathermap.org/data/2.5/weather?zip=" + searchQuery + ",us&units=imperial&APPID=" + apiKey;
  
  $(".city").text("");
    $(".temp").text("");

  $.ajax(url,{success: function(data){
    console.log(data);
    $(".city").text(data.name);
    $(".temp").text(data.main.temp);
  }, error: function(error){
    $(".error-message").text("An error occured");
  }});
}

function searchWeather() {
  var searchQuery = $(".search").val();
  getWeather(searchQuery);
}

function handleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // ...
    console.log(user.email);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
   
}

function addMessage(postTitle,postBody){
  var postData = {
    title: postTitle,
    body: postBody
  }

  var database = firebase.database().ref("posts");

  // Create a new post reference with an auto-generated id
  var newPostRef = database.push();
  newPostRef.set(postData, function(error) {
    if (error) {
      // The write failed
      $(".firebase-error-message").text("Our database seems to be having issues or you're not connected to the internet. Please try posting later.");
    } else {
      // Data saved successfully!
      $("#post-title, #post-body").val("");
      window.location.reload();
    }
  });

}

function handleMessageFormSubmit() {
  var postTitle= $("#post-title").val();
  var postBody= $("#post-body").val();
  
  addMessage(postTitle,postBody);
}

function getPosts() {
  return firebase.database().ref('posts').once('value').then(function(postList) {
    var posts = postList.val();
    console.log(posts);
    // ...

    for (var postKey in posts){
      var post = posts[postKey];
      $('#post-listing').append("<div>" + post.title + " - " + post.body + "</div>")
    }
  });
  
}