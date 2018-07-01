


let restaurants,
neighborhoods,
cuisines;
var map;
var markers = [];


/**
* Fetch neighborhoods and cuisines as soon as the page is loaded.
*/
document.addEventListener('DOMContentLoaded', (event) => {
    fetchNeighborhoods();
    fetchCuisines();
});


class MainController{
    constructor(container){
        this.container = container;
        this.marker = [];
    }

    fetchRestaurants(){

        return this.container;
    }

    /**
    * Fetch all neighborhoods and set their HTML.
    * 
    */
    fetchNeighborhoods() {
        // Fetch all restaurants
        // Get all neighborhoods from all restaurants
        let restaurants = this.container;
        
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
            // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        return uniqueNeighborhoods;
         
      
    }
    /**
    * Set neighborhoods HTML.
    */
    fillNeighborhoodsHTML(){
        let neighborhoods = fetchNeighborhoods();
        const select = document.getElementById('neighborhoods-select');
        neighborhoods.forEach(neighborhood => {

            const option = document.createElement('option');
            option.innerHTML = neighborhood;
            option.value = neighborhood;
            select.append(option);
        });
    }

    fetchCuisines() {

        let restaurants = this.container;
      // Get all cuisines from all restaurants
        let cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        let uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
       return uniqueCuisines;
      
    }


    /**
    * Set cuisines HTML.
    */

    fillCuisinesHTML(){
        let cuisines = uniqueCuisines();
        const select = document.getElementById('cuisines-select');
        cuisines.forEach(cuisine => {
            const option = document.createElement('option');
            option.innerHTML = cuisine;
            option.value = cuisine;
            select.append(option);
        });
        
    }

    
/**
 * Initialize Google map, called from HTML.
 */
    loadGoogleMap() {
        window.initMap = () => {
            let loc = {
              lat: 40.722216,
              lng: -73.987501
            };
            self.map = new google.maps.Map(document.getElementById('map'), {
              zoom: 12,
              center: loc,
              scrollwheel: false
            });
            updateRestaurants();
          }
        
    }

    /**
 * Update page and map for current restaurants.
 */

 
  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
    */
    fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
        // Fetch all restaurants
        fetchRestaurants((error, restaurants) => {
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
        
    updateRestaurants() {
        const cSelect = document.getElementById('cuisines-select');
        const nSelect = document.getElementById('neighborhoods-select');
    
        const cIndex = cSelect.selectedIndex;
        const nIndex = nSelect.selectedIndex;
    
        const cuisine = cSelect[cIndex].value;
        const neighborhood = nSelect[nIndex].value;
    
        fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
        if (error) { // Got an error!
            console.error(error);
        } else {
            resetRestaurants(restaurants);
            fillRestaurantsHTML();
        }
        });
    }


    urlForRestaurant(restaurant) {
        return (`./restaurant.html?id=${restaurant.id}`);
    }
    
    imageUrlForRestaurant(restaurant) {
        // restaurant.photograph is missing on the last object
        // I have to use id instead if it.
        let urlForImage =restaurant.id + '.jpg';
         return (`/img/${urlForImage}`);
      }


/**
* Create restaurant HTML.
*/
    createRestaurantHTML (restaurant) {
        const li = document.createElement('li');
        
        const image = document.createElement('img');
        image.className = 'restaurant-img';
        image.alt = restaurant.name;
        image.src = imageUrlForRestaurant(restaurant);
        li.append(image);
    
        const name = document.createElement('h2');
        name.innerHTML = restaurant.name;
        li.append(name);
        
        const neighborhood = document.createElement('p');
        neighborhood.innerHTML = restaurant.neighborhood;
        li.append(neighborhood);
        
        const address = document.createElement('p');
        address.innerHTML = restaurant.address;
        li.append(address);
        
        const more = document.createElement('a');
        more.innerHTML = 'View Details';
        more.href = urlForRestaurant(restaurant);
        li.append(more)
        
        return li
    }
    
  /**
   * Map marker for a restaurant.
   */
   mapMarkerForRestaurant(restaurant, map) {
        const marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url:urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP}
        );
        return marker;
    }

        
    addMarkersToMap(restaurants = self.restaurants) {
        restaurants.forEach(restaurant => {
        // Add marker to the map
        const marker = mapMarkerForRestaurant(restaurant, self.map);
        google.maps.event.addListener(marker, 'click', () => {
            window.location.href = marker.url
        });
        self.markers.push(marker);
        });
    }

}
/**
* END OF CLASS MAINCONTROLLER
*/