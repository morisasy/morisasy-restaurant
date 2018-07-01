

let restaurantsJSON,
request,
objectStore,
tx;

const dbName = "dbRestaurant-static";
const URL = `http://localhost:1337/restaurants`;
const opt = {credentials: 'include'};
var db;


fetch(URL,opt)
.then(response => response.json())
.then(json => {
 restaurantsJSON = json;
 console.log('Sw JSON response',restaurantsJSON);
 
})
.catch((error) => {
 console.log('There has been a problem with your fetch operation: ', error.message);
 
});
 
request = indexedDB.open(dbName, 1);

request.onerror = (event) => {
 // Handle errors.
 console.log("Error: Couldn't open database ...");
};


request.onsuccess = (event) => {
  db = request.result;
 console.log('Success: db opened');
};

   
 request.onupgradeneeded = function(event) { 
  
   var db = event.target.result;
   // Create an objectStore for this database
   if(!db.objectStoreNames.contains('restaurants')){
     objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
   }
   //objectStore = db.createObjectStore("restaurants", { keyPath: "id" });
  // var objectStore = db.createObjectStore("restaurants");
 
   // Each restaurant has unique id.
   objectStore.createIndex("id", "id", { unique: true });
 
   objectStore.transaction.oncomplete = (event)=>{
    
     tx = db.transaction("restaurants", "readwrite");
     let restaurantObjectStore = tx.objectStore("restaurants");
     restaurantsJSON.forEach((restaurant) => {
       restaurantObjectStore.add(restaurant);
     });
   };
 };
 



 function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return db;
}

export default function IndexController(container) {
  this._container = container;
  this._fetchNeighborhoods=  fetchNeighborhoods(this._container);
  this._fetchCuisines = fetchCuisines(this._container);
  this._lostConnectionToast = null;
  this._dbPromise = openDatabase();
  this._registerServiceWorker();
  this._cleanImageCache();

  var indexController = this;

  setInterval(function() {
    indexController._cleanImageCache();
  }, 1000 * 60 * 5);

  this._showCachedMessages().then(function() {
    indexController._openSocket();
  });
}

IndexController.prototype._registerServiceWorker = function() {
  if (!navigator.serviceWorker) return;

  var indexController = this;

  navigator.serviceWorker.register('/sw.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      indexController._trackInstalling(reg.installing);
    });
  });

  // Ensure refresh is only called once.
  // This works around a bug in "force update on reload".
  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

IndexController.prototype._showCachedMessages = function() {
  var indexController = this;

  return this._dbPromise.then(function(db) {
    // if we're already showing posts, eg shift-refresh
    // or the very first load, there's no point fetching
    // posts from IDB
    if (!db || indexController._postsView.showingPosts()) return;

    var index = db.transaction('wittrs')
      .objectStore('wittrs').index('by-date');

    return index.getAll().then(function(messages) {
      indexController._postsView.addPosts(messages.reverse());
    });
  });
};

IndexController.prototype._trackInstalling = function(worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }
  });
};

IndexController.prototype._updateReady = function(worker) {
  var toast = this._toastsView.show("New version available", {
    buttons: ['refresh', 'dismiss']
  });

  toast.answer.then(function(answer) {
    if (answer != 'refresh') return;
    worker.postMessage({action: 'skipWaiting'});
  });
};

// open a connection to the server for live updates
IndexController.prototype._openSocket = function() {
  var indexController = this;
  var latestPostDate = this._postsView.getLatestPostDate();

  // create a url pointing to /updates with the ws protocol
  var socketUrl = new URL('/updates', window.location);
  socketUrl.protocol = 'ws';

  if (latestPostDate) {
    socketUrl.search = 'since=' + latestPostDate.valueOf();
  }

  // this is a little hack for the settings page's tests,
  // it isn't needed for Wittr
  socketUrl.search += '&' + location.search.slice(1);

  var ws = new WebSocket(socketUrl.href);

  // add listeners
  ws.addEventListener('open', function() {
    if (indexController._lostConnectionToast) {
      indexController._lostConnectionToast.hide();
    }
  });

  ws.addEventListener('message', function(event) {
    requestAnimationFrame(function() {
      indexController._onSocketMessage(event.data);
    });
  });

  ws.addEventListener('close', function() {
    // tell the user
    if (!indexController._lostConnectionToast) {
      indexController._lostConnectionToast = indexController._toastsView.show("Unable to connect. Retrying…");
    }

    // try and reconnect in 5 seconds
    setTimeout(function() {
      indexController._openSocket();
    }, 5000);
  });
};

IndexController.prototype._cleanImageCache = function() {
  return this._dbPromise.then(function(db) {
    if (!db) return;

    var imagesNeeded = [];

    var tx = db.transaction('wittrs');
    return tx.objectStore('wittrs').getAll().then(function(messages) {
      messages.forEach(function(message) {
        if (message.photo) {
          imagesNeeded.push(message.photo);
        }
        imagesNeeded.push(message.avatar);
      });

      return caches.open('wittr-content-imgs');
    }).then(function(cache) {
      return cache.keys().then(function(requests) {
        requests.forEach(function(request) {
          var url = new URL(request.url);
          if (!imagesNeeded.includes(url.pathname)) cache.delete(request);
        });
      });
    });
  });
};

// called when the web socket sends message data
IndexController.prototype._onSocketMessage = function(data) {
  var messages = JSON.parse(data);

  this._dbPromise.then(function(db) {
    if (!db) return;

    var tx = db.transaction('wittrs', 'readwrite');
    var store = tx.objectStore('wittrs');
    messages.forEach(function(message) {
      store.put(message);
    });

    // limit store to 30 items
    store.index('by-date').openCursor(null, "prev").then(function(cursor) {
      return cursor.advance(30);
    }).then(function deleteRest(cursor) {
      if (!cursor) return;
      cursor.delete();
      return cursor.continue().then(deleteRest);
    });
  });

  this._postsView.addPosts(messages);
};