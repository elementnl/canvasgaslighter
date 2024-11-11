document.addEventListener('DOMContentLoaded', function () {
  // Check if the user is already authenticated
  chrome.storage.local.get('accessToken', (result) => {
    if (result.accessToken) {
      document.getElementById('status').innerText = "You are logged in!";
    } else {
      document.getElementById('status').innerText = "You are not logged in.";
      document.getElementById('loginBtn').addEventListener('click', () => {
        // Trigger the login flow
        chrome.runtime.sendMessage({ action: 'authenticate' });
      });
    }
  });
});
