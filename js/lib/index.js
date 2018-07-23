'use strict';

let restaurantsJSON,
request,
objectStore,
tx,
reateIndexedDB;
const dataStore= [];

const dbName = "dbRestaurant-static";
const URL = `http://localhost:1337/restaurants`;
const opt = {credentials: 'include'};
var db;


// create indexDb
function createIndexedDB() {
  
  return idb.open(dbName, 1,(upgradeDb) => {
    var store = upgradeDb.createObjectStore('restaurants', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'time');
    console.log('idb implemented');
  });
}

const dbPromise = createIndexedDB();

//  add people to "people"

function saveData(restaurantsJSON) {
  let events = restaurantsJSON;
  console.log('restaurantsJSON ', restaurantsJSON);
  
  return dbPromise.then(db => {
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    
    
    return Promise.all(events.map(event => store.add(event)))
    .catch(() => {
      tx.abort();
      throw Error('Events were not added to the store');
    });
  });
}


// get data from the server
 
fetch(URL,opt)
        .then(response => response.json())
        .then(json => {
         restaurantsJSON = json;
         saveData(restaurantsJSON);
         console.log('fetchData: ',restaurantsJSON);
         
        })
        .catch((error) => {
         console.log('There has been a problem with your fetch operation: ', error.message);
         
        });




// get local data
// get all restaurants
function getLocalData() {
  
  return dbPromise.then((db) => {
        var tx = db.transaction('restaurants', 'readonly');
        var store = tx.objectStore('restaurants');
        return store.getAll();
      }).then((items) => {
        console.log('Restaurants by id:', items);
      });
}
let locaDataDb = getLocalData();
console.log('All Restaurants:', getLocalData);

/*


// get all restaurants 
dbPromise.then((db) => {
  var tx = db.transaction('restaurants', 'readonly');
  var store = tx.objectStore('restaurants');
  return store.getAll();
}).then((items) => {
  console.log('Restaurants by id:', items);
});

dbPromise.then((db) => {
  var tx = db.transaction('restaurants', 'readwrite');
  //var peopleStore = tx.objectStore('restaurants');
  let restaurantObjectStore = tx.objectStore("restaurants");
  //tx = db.transaction("restaurants", "readwrite");
  //let jsonData = fetchData();
 // console.log('jsonData ', jsonData);

  console.log('restaurantsJSON ', restaurantsJSON);
 
  
  restaurantsJSON.forEach((restaurant) => {
    restaurantObjectStore.add(restaurant);
  });

  return tx.complete;
  }).then(function() {
  console.log('restaurants added');
});

// get all restaurants 
dbPromise.then((db) => {
  var tx = db.transaction('restaurants', 'readonly');
  var store = tx.objectStore('restaurants');
  return store.getAll();
}).then((items) => {
  console.log('Restaurants by id:', items);
});





// restaurant by id
dbPromise.then((db) => {
  var tx = db.transaction('restaurants');
  var restaurantStore = tx.objectStore('restaurants');
  var idIndex = restaurantStore.index('id');

  return idIndex.getAll();
}).then((restaurantsList) => {
  console.log('Restaurants by id:', restaurantsList);
});

async function fetchData() {
  try {
    let response = await fetch(URL,opt);
    let json = await response.json();
    restaurantsJSON = json;
    let restaurantsJSON = await response.json();
    //let json = restaurantsJSON;
    console.log('fetchData :', restaurantsJSON);
    return json;
  }
  catch(e) {
    console.log('Error!', e);
  }
}
function fetchData() {
   return fetch(URL,opt)
        .then(response => response.json())
        .then(json => {
         restaurantsJSON = json;
         console.log('Sw JSON response',restaurantsJSON);
         
        })
        .catch((error) => {
         console.log('There has been a problem with your fetch operation: ', error.message);
         
        });
}



var dbPromise = idb.open('dbRestaurant-static-1', 1, function(upgradeDb) {
  var store = upgradeDb.createObjectStore('restaurantsDB', {
    keyPath: 'id'
  });
  store.createIndex('by-date', 'time');
  console.log('idb implemented');
});

var openDatabase = function openDB() {
  return idb.open('dbRestaurant-static-1', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('restaurantsDB', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'time');
    console.log('idb implemented');
  });
};



function createIndexedDB() {
  if (!('indexedDB' in window)) {return null;}
  return idb.open('dashboardr', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('events')) {
      const eventsOS = upgradeDb.createObjectStore('events', {keyPath: 'id'});
    }
  });
}

import idb from 'idb';

var openDatabase= function openDB() {

 
  return idb.open('dbRestaurant-static-1', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('restaurantsDB', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'time');
    console.log('idb implemented');
  });
};

function openDatabase() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('dbRestaurant-static', 1, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('restaurants', {
      keyPath: 'id'
    });
    store.createIndex('by-date', 'time');
  });
}




*/


/*

let restaurantsJSON,
request,
objectStore,
tx,
dataStore= [];

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
  //db = request.result;
 console.log('Success: db opened');
};

   
 request.onupgradeneeded = function(event) { 
  
    db = event.target.result;
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
   //retrieveAll(db);
 };
 
 */

 
 /** 
function retrieveAll(db){
 var objectStore = db.transaction("restaurants").objectStore("restaurants");
      objectStore.openCursor().onsuccess = (event) =>{
        let cursor = event.target.result;
        if (cursor) {
          dataStore.push(cursor.value);
          cursor.continue();
        }
        else {
          console.log ('All restaurants ', restaurants);
        }
      };

 return dataStore;

}
*/
//let dataGrabbed = retrieveAll(); 
//console.log( "Object retrieved", dataGrabbed);
