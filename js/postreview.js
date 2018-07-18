
   

  
  

   
  const form = document.getElementById("formcomment");
  //const submitBtn = document.querySelector('button');
  const urlsReviews = 'http://localhost:1337/reviews/';
    
  function postData() {
   
        // get form element
        const  restImgLink = document.getElementById("restaurant-img").src;
        console.log("grabbed link", restImgLink);
        let rest_ID =restImgLink.split("/img/");
        
        let restaurantID = rest_ID.pop().split(".").shift();
        
        // get a reviewer name.
        const commentorName = document.getElementById("username").value;
        const aComment = document.getElementById("comments").value;
        //const aComment = document.querySelector('textarea').value;
      // const restaurant_id = restaurant_ID;
      //favorite
       let isFavorite = false;


        let favorite = document.getElementById("favorite");
        if (favorite.checked) {
          isFavorite = true;
        } 

        const starList = document.getElementsByName("star");
        
          
        let aRate;
      
        var i;
        for (i = 0; i < starList.length; i++) {
            if (starList[i].checked) {
                aRate = starList[i].value;
            }
        }
        
        //const urlsReviews = 'http://localhost:1337/reviews/';
        const formData = {
            "restaurant_id": Number(restaurantID),
            "name": commentorName,
            "rating": Number(aRate),
            "comments": aComment,
            "is_favorite": isFavorite
        };
        console.log("New comment posted :", formData);
        // 'only-if-cached'  'same-origin' 'no-cache 
        // credentials: 'include'
        //  credentials: 'same-origin' no-cors
        const formString = JSON.stringify(formData);
        let opts = {
          method: 'POST',
          mode: 'no-cors',
          cache: "no-cache",
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body:formString
        }; 

    fetch(urlsReviews, opts)
        .then(res => res.json())
        .then(data =>  console.log(data))
        .catch(error => console.log('Erro', error.message));

   document.forms["formcomment"].reset(); 
    
 } 


  // ...to take over the submit event
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    postData();
  });