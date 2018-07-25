/**
 * Common database helper functions.
 */







 class DBHelper {
  
 /** constructor(){
  dbPromise
    this._dbPromise = createIndexedDB();
  }
  static get staticVariable(){
    return dependency;
    }
  */
  static get dbName(){
    return "dbRestaurant-static";
  }
  static get dbVersion(){
    return 1;
  }
  static get dbStoreName(){
    return "restaurants";
  }
  

 
 // create DB function createIndexedDB()
static createIndexedDB() {
  
  if (!('indexedDB' in window)) {return null;}
  return idb.open(DBHelper.dbName, DBHelper.dbVersion, (upgradeDb) =>  {
    if (!upgradeDb.objectStoreNames.contains('restaurants')) {
      const store = upgradeDb.createObjectStore(DBHelper.dbStoreName, {keyPath: 'id'});
      //const store = upgradeDb.createObjectStore(dbStoreName);
      store.createIndex('name', 'name', {unique: true});
     // return store;
    }
  }); 
}
 
  /**
   * python3 -m http.server 3500
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    //const port = 3500 // Change this to your server port
    //return `http://localhost:${port}/data/restaurants.json`;
    // http://localhost:1337/restaurants
    const port = 1337 // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static getObjectStore(dbs,storeName, mode) {
            let tx = dbs.transaction(storeName, mode);
        return tx.objectStore(storeName);
              
  }

// save data from network to local indexDB
 static saveData(restaurantsJSON) {
    
    let restaurants = restaurantsJSON;
    console.log('restaurantsJSON ', restaurantsJSON);
    const dbPromise = DBHelper.createIndexedDB();

     dbPromise.then(db => {
     const store = DBHelper.getObjectStore(db, DBHelper.dbStoreName, 'readwrite');

       restaurants.forEach((restaurant) => {
        store.put(restaurant);
       })
     });
  }

  // Fetch all restaurants.
  
  static fetchRestaurants(callback) {
    const URL = DBHelper.DATABASE_URL;
    const opt = {
    credentials: 'include'
    } 
    fetch(URL,opt)
    .then(response => response.json())
    .then(json => {
      const restaurants = json;
      DBHelper.saveData(restaurants);
      console.log('Request succeeded with JSON response', json);
      callback(null, restaurants);
    })
    .catch((error) => {
      /* 
      fetch(YOUR_RESTAURANTS_API_URL).catch(IF_CANT_FETCH_GET_DATA_FROM_indexedDB)
      .then(YOUR_CREATE_HTML_FUNCTION)
      */
      const restaurantsDB = getLocalData();
        restaurantsDB.then((restaurants) => {
          //console.log('Restaurants by id:', restaurants);
          callback(null, restaurants);
        });
      console.log('There has been a problem with your fetch operation: ', error.message);
      //callback(error, null);
    });
  }

  /**
   * Fetch data from local indexdb.
   */
  static getLocalData() {

    const dbPromise = DBHelper.createIndexedDB();
    
    return dbPromise.then((db) => {
          if (!db) return;
          const store = DBHelper.getObjectStore(db, DBHelper.dbStoreName, 'readonly');

          return store.getAll();
        }).then((items) => {
         // console.log('Restaurants by id:', items);
        });
  }
   
  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    // restaurant.photograph is missing on the last object
    // I have to use id instead if it.
    let urlForImage =restaurant.id + '.jpg';
     return (`/img/${urlForImage}`);
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP}
    );
    return marker;
  }

}
