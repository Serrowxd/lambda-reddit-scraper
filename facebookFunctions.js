
  window.fbAsyncInit = function() {
    FB.init({
      appId            : '2073427282942956',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v3.0'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));




uploadPhoto = () => {
	FB.api('/me/photos', 'post', {url: `${img}`}, (response) => {
		if (!response || response.error) {
			console.log(error);
		}
	})
}

FB.api(
    "/{group-id}/feed",
    "POST",
    {
        "message": "This is a test message"
    },
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);