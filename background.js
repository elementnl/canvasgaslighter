chrome.runtime.onInstalled.addListener(() => {
  console.log("Canvas Gaslighter Extension Installed.");
});

// Start the OAuth flow when the user clicks on the extension icon
chrome.action.onClicked.addListener(() => {
  chrome.identity.launchWebAuthFlow({
    url: "https://canvas.instructure.com/login/oauth2/auth?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=https://YOUR_EXTENSION_URL",
    interactive: true
  }, (redirectUrl) => {
    if (redirectUrl) {
      const url = new URL(redirectUrl);
      const code = url.searchParams.get("code");
      if (code) {
        // Exchange the authorization code for an access token
        fetch('https://canvas.instructure.com/login/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            'client_id': 'YOUR_CLIENT_ID',
            'client_secret': 'YOUR_CLIENT_SECRET',
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': 'https://YOUR_EXTENSION_URL'
          })
        })
        .then(response => response.json())
        .then(data => {
          // Store the access token in chrome.storage
          chrome.storage.local.set({ accessToken: data.access_token });
        })
        .catch(error => console.error("Error exchanging code for token:", error));
      }
    }
  });
});
