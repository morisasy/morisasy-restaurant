
   

  
  

   // ...to take over the submit event
   form.addEventListener('submit', function (event) {
     event.preventDefault();
     sendData();
   });

    
  function submitReviws() {
     // Access the form element...
   var form = document.getElementById("commentForm");
      // These variables are used to store the form data
    var ele = document.getElementById("restaurant_id").value;
    var commentorName = document.getElementById("usaname").value;
    var comment = document.getElementById("comments").value;
    var restaurant_id = restaurantID;
  
    const starList = document.getElementsByName("star");
    var isFavorite = document.getElementsByName("favorite");
    //const result = starList.filter(astar => w.length > 6);
    var aRate;
    if (isFavorite.checked) {
        isFavorite = true;
      
    }
    var i;
        for (i = 0; i < starList.length; i++) {
            if (starList[i].checked) {
                aRate = starList[i].value
            }
        }
    const content = document.querySelector('textarea').value;
    const urlsReviews = 'http://localhost:1337/reviews/';
    const formData = {
        "restaurant_id": restaurant_id,
        "name": commentorName,
        "rating": rating,
        "comments": comment_text,
        "isFavorite": isFavorite
    };

     let opts = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(FormData)
    }; 

    fetch({urlsReviews, opts});

  

  /* // ...and take over its submit event.
  JSON.stringify(content)
        .then((res) => res.json())
        .then((data) =>  console.log(data))
        .catch((err)=>console.log(err))
   form.addEventListener("submit", function (event) {
     event.preventDefault();
 
     sendData();
   });

   */
  } 