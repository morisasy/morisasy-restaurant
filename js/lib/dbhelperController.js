


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
 

function retrieveAll(){
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
 
  return objectStore;
 
 }



 function retrieveRestaurants() {
  // If the browser doesn't support service worker,
  // we don't care about having a database
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return retrieveAll();
}

export class IndexController extends DBHelper{
  constructor(container) {
    
    this._container = container;
   // this._mainController=  MainController(this._container);
    this._lostConnectionToast = null;
    this._db = retrieveRestaurants();
    this._registerServiceWorker();
    this._cleanImageCache();
    this.dataStore= []
    
  }
  


  _showCachedMessages() {
  _openSocket();
  }

  _registerServiceWorker() {
        if (!navigator.serviceWorker) return;
        
            var indexController = this;
        
        navigator.serviceWorker.register('/sw.js')
            .then( reg => {
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
            
                reg.addEventListener('updatefound', () => {
                    indexController._trackInstalling(reg.installing);
                });
            });


        // Ensure refresh is only called once.
        // This works around a bug in "force update on reload".

        
        var refreshing;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
        });
     }
     
    fetchRestaurants(callback){
        var indexControllerDB = this.container;

       super().fetchRestaurants();
          

       
    }


   
} // End of the class 

