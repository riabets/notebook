importScripts("/precache-manifest.4aca6b5c06fa6653b5a4be4d88421be5.js", "https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/* eslint-disable */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// install new service worker when ok, then reload page.
let storageNotesAout = this.notesReminder;

console.log(storageNotesAout);

self.addEventListener('sync', event => {
    if (event.tag === 'send-chats') {
      event.waitUntil(
        getMessagesFromOutbox().then(messages => {
          // Post the messages to the server
          return fetch('/send', {
            method: 'POST',
            body: JSON.stringify(messages),
            headers: { 'Content-Type': 'application/json' }
          }).then(() => {
            // Success! Remove them from the outbox
            return removeMessagesFromOutbox(messages);
          });
        }).then(() => {
          // Tell pages of your success so they can update UI
          return clients.matchAll({ includeUncontrolled: true });
        }).then(clients => {
          clients.forEach(client => client.postMessage('outbox-processed'))
        })
      );
    }
});



