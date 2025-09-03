// This service worker is required for Manifest V3 extensions.
// For this specific extension, its primary role is to be declared in the manifest.
// More complex extensions could use this for event handling, such as listening
// for updates to tabs, alarms, or messages from content scripts.

chrome.runtime.onInstalled.addListener(() => {
  console.log('FactCheckify extension installed.');
});

