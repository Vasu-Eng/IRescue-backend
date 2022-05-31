
const express = require("express");
const axios = require('axios');
const app = express();
const bodyParser = require("body-parser");
require('dotenv').config();
const api_key = process.env.API_KEY;
const nearby_link = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


//sagar-  (my home)        lat : 23.8479, lon : 78.6645
//indore- vallabh nagar    lat : 22.7284907 , lon : 75.8729906


// Json Objects  data 

// send by hardware device 
const alertData = {
  device_id: "",
  location: {
    lat: 22.7284907
    , lon: 75.8729906

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
  } ,
person_2: {
    contact_no: [],
    email_id: "",
    address: "",
    relation_: ""
  } ,
  person_3: {
    contact_no: [],
    email_id: "",
    address: "",
    relation_: ""
  }
}








//get method 
app.get("/", (req, res) => {
  res.send(" server is  running " + res.statusCode);
  NearbySearch(alertData.location, 50000, "police");
});


//custom functions

function NearbySearch(location, radius, type) {
  var config = {
    method: 'get',
    url: url(nearby_link, location, radius, api_key, type, "cruise"),
    headers: {}
  };
  console.log(config.url);
  axios(config)
    .then(function (response) {
      console.log("statusCode : " + response.statusCode);
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// url generator 
function url(link, location, radius, api_key, type, keyword) {
  const url = link + "location=" + location.lat + "," + location.lon + "&radius=" + radius + "&type=" + type + "&keyword=" + keyword + "&key=" + api_key;
  return url;
}





app.listen(3000, () => {
  console.log("server is starting at port 3000");
});

