
   

  
  

   
  const form = document.getElementById("commentForm");
  //const submitBtn = document.querySelector('button');
    
  function submitReviws() {
   
     // Access the form element...
    const d = new Date();
    const n = d.toDateString();
    const m = n.split(" ");
  
    const dateString = m[1] + [2] + ', '+ m[3];

   
      // These variables are used to store the form data
    const  restImgLink = document.getElementById("restaurant-img").src;
    console.log("grabbed link", restImgLink);
    let j = restImgLink.indexOf("/img/");
    let k = restImgLink.indexOf(".jpg");
    //let restaurant_ID =restImgLink.substring(j, k).split("/img/");
    let rest_ID =restImgLink.split("/img/");
   // let restaurant_ID =restImgLink.substring(j, k)
    

   
    let restaurant_ID = rest_ID.pop().split(".").shift();
    console.log('String grabed', rest_ID);

    console.log("Image No grabbed", restaurant_ID);
    //const ele = document.getElementById("restaurant_id").value;
    const commentorName = document.getElementById("username").value;
    const aComment = document.getElementById("comments").value;
    const restaurant_id = restaurantID;
  
    const starList = document.getElementsByName("star");
    let isFavorite = document.getElementsByName("favorite");
    //const result = starList.filter(astar => w.length > 6);
    let aRate;
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
        "date":dateString,
        "rating": aRate,
        "comments": aComment,
        "isFavorite": isFavorite
    };
    const formString = JSON.stringify(FormData);
     let opts = {
      method: 'POST',
      mode: 'cors',
      cache: "no-cache",
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body:formString
    }; 

    fetch({urlsReviews, opts})
        .then(res => res.json())
        .then(data =>  console.log(data))
        .catch(error => console.log('Erro', error.message));

  } 


  // ...to take over the submit event
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    submitReviws();
  });