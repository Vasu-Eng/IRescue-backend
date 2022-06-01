
const express = require("express");
const axios = require('axios');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();
const api_key = process.env.API_KEY;
const nearby_link = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
const details_link = "https://maps.googleapis.com/maps/api/place/details/json?";
var ResposeData; // places library response obeject 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//sagar-  (my home)        lat : 23.8479, lon : 78.6645
//indore- vallabh nagar    lat : 22.7284907 , lon : 75.8729906


// Json Objects imported data 

// send by hardware device 
const alertData = {
  device_id: "",
  location: {
    lat: 23.8479, lon: 78.6645
  },
  svr_level: ""
}

// Use post method to get the data using form 
const contactData = {
  device_id: "",
  person_1: {
    contact_no: [],
    email_id: "",
    address: "",
    relation_: ""
  },
  person_2: {
    contact_no: [],
    email_id: "",
    address: "",
    relation_: ""
  },
  person_3: {
    contact_no: [],
    email_id: "",
    address: "",
    relation_: ""
  }
}

//--------------------------------------------------- processing code ------------------------------------------------->

//get method 
app.get("/", (req, res) => {
  res.send(" server is  running " + res.statusCode);
  // nearbysearch algorithm
  placesAPIResponseHandle("hospital");
});


//custom functions
function placesAPIResponseHandle(nearbysearch) {
  var config = {
    method: 'get',
    url: url(nearby_link,api_key,parameters,nearbysearch,"null"),//hospital use last parameter for nearbysearch only
    headers: {}
  };
  axios(config)
    .then(function (response) {
      ResposeData = response.data ;
      console.log("statusCode : " + ResposeData.status);
       Place_id =  ResposeData.results[0].place_id
      console.log("place_id :"+ Place_id);
      console.log("Places API for nearby "+ nearbysearch + " : " + config.url );
      place_details(ResposeData,3);
    })
    .catch(function (error) {
      console.log(error);
    });
return 0;
}
function place_details(responseData,num) {
  for(var i=0; i<num ;i++){
  var Place_id = responseData.results[i].place_id;
  console.log(url(details_link, api_key, parameters, "null", Place_id));
  }
}
//url generator ------>
var parameters = {
  location: alertData.location,
  rankby: "distance",
  fields: "name,formatted_phone_number,rating"
}
function url(link, key, parameters, keyword, Place_id) {
  var url = link + "key=" + key + "&location=" + parameters.location.lat + "," + parameters.location.lon;
  if (link === nearby_link) {
    url = url + "&keyword=" + keyword + "&rankby=" + parameters.rankby;
  }
  else if (link === details_link) {
    url = url + "&fields=" + parameters.fields + "&place_id=" + Place_id;
  }
  return url;
}
// In developing stage 
function shortListPlaces() {
  // use the google response.data and sort the data according the function input parameter 
}




app.listen(3000, () => {
  console.log("server is starting at port 3000");
});
//------------------------------- END --------------------------
