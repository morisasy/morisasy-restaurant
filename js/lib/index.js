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

const dbVersion = 1; // Use a long long for this value (don't use a float)
const dbStoreName = 'restaurants';


// create indexDb
function createIndexedDB() {
  
  return idb.open(dbName, dbVersion,(upgradeDb) => {
    var store = upgradeDb.createObjectStore(dbStoreName, {
      keyPath: 'id'
    });
    store.createIndex('by-name', 'name');
    console.log('idb implemented');
  });
}

const dbPromise = createIndexedDB();


/**
  * @param {string} dbs database name.
   * @param {string} store_name
   * @param {string} mode either "readonly" or "readwrite"
   */
  function getObjectStore(dbs,storeName, mode) {
            let tx = dbs.transaction(storeName, mode);
        return tx.objectStore(storeName);
              
  }

//  add people to "people"
//let restaurantsStore = getObjectStore(dbStoreName,'readonly');

function saveData(restaurantsJSON) {
  let events = restaurantsJSON;
  console.log('restaurantsJSON ', restaurantsJSON);
  
  return dbPromise.then(db => {
    //const tx = db.transaction('restaurants', 'readwrite');
    //const store = tx.objectStore('restaurants');
    const store = getObjectStore(db,dbStoreName, 'readwrite');
    
    
    return Promise.all(events.map(event => store.add(event)))
    .catch(() => {
      tx.abort();
      throw Error('Events were not added to the store');
    });
  });
}


// get data from the server
function fetchData(){
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

}




// get local data
// get all restaurants
function getLocalData() {
  
  return dbPromise.then((db) => {
        //var tx = db.transaction('restaurants', 'readonly');
        //var store = tx.objectStore('restaurants');
        const store = getObjectStore(db,dbStoreName, 'readonly');
       
        return store.getAll();
      }).then((items) => {
        console.log('Restaurants by id:', items);
      });
}
let locaDataDb = getLocalData();
console.log('All Restaurants:', getLocalData);
