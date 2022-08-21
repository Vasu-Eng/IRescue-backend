
const express = require("express");
const axios = require('axios');
const app = express();
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
 const ck = require('ckey'); 
 const api_key = ck.API_KEY; 
 const contact_no = ck.PHONE_NO; 
 const accountSid = ck.TWILIO_ACCOUNT_SID;
 const authToken = ck.TWILIO_AUTH_TOKEN;
 const client = require('twilio')(accountSid, authToken);

const nearby_link = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
const details_link = "https://maps.googleapis.com/maps/api/place/details/json?";
const  thingspeak_url = "https://api.thingspeak.com/channels/1819879/feeds.json?results=1";
var ResposeData; // places library response obeject 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//sagar-  (my home)        lat : 23.8479, lon : 78.6645
//indore- vallabh nagar    lat : 22.7284907 ,  lon : 75.8729906
// 9930 speces             lat : 22.6862  ,    lon :75.8598
// Json Objects imported data  
// send by hardware device 
//const alertData =  {
//	 device_id: "" ,
//  	  location: {
// 	  lat : 23.84 ,  lon :  78.66
 //       	     },
//  	  svr_level: ""
	
//}  ;

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


// Global variables : 
let alertData = {
	  device_id: "",
  	  location: {
 	  lat : "" ,  lon :  ""
         	     },
  	  svr_level: ""
   }
let parameters = {
  location: alertData.location,
  rankby: "",
  fields: ""
}	


//--------------------------------------------------- processing code ------------------------------------------------->

//get method 
 app.get("/", (req, res) => {
  res.send(" server is  running " + res.statusCode);
  process();
});




//custom functions

function send_sms(msg){
client.messages
   .create({
     body:  msg,
      from: '+17178958521',
      to: contact_no
    })
   .then(message => console.log(message.sid))
   .done();
}


function  process(){	
fetch(thingspeak_url)
.then(res => res.json())
.then(json => {
       // console.log("here is the whole response of thingspeak cloud :");
       //console.log(json);
alertData = {
	  device_id: json.feeds[0].field1 ,
  	  location: {
 	  lat : json.feeds[0].field2  ,  lon :  json.feeds[0].field3
         	     },
  	  svr_level: json.feeds[0].field4
   }
	  
parameters = {
  location: alertData.location,
  rankby: "distance",
  fields: "name,formatted_phone_number,rating"
}
 placesAPIResponseHandle("hospital");
      console.log("alertData : ");
      console.log(alertData);
      console.log("parameters : ");
      console.log( parameters);
console.log("sending massage : ");	  
var msg = " Alert accident is detected in lat : " + alertData.location.lat + " , long : " + alertData.location.lon + " . please call the ambulance !!"
send_sms(msg);
});
}


function URL(link, key, parameters, keyword, Place_id) {
  var url = link + "key=" + key + "&location=" + parameters.location.lat + "," + parameters.location.lon;
  if (link === nearby_link) {
    url = url + "&keyword=" + keyword + "&rankby=" + parameters.rankby;
  }
  else if (link === details_link) {
    url = url + "&fields=" + parameters.fields + "&place_id=" + Place_id;
  }
  return url;
}  

function placesAPIResponseHandle(nearbysearch) {
  var config = {
    method: 'get',
    url:URL(nearby_link,api_key,parameters,nearbysearch,"null"),
    headers: {}
  };
  axios(config)
    .then(function (response) {
      ResposeData = response.data ;
      // console.log("statusCode : " + ResposeData.status);
      //  Place_id =  ResposeData.results[0].place_id
      // console.log("place_id :"+ Place_id);
      // console.log("Places API for nearby "+ nearbysearch + " : " + config.url );
	   console.log("ResposeData from google places library  : ");
      console.log(ResposeData);
      //console.log(config.url);
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
  console.log(URL(details_link, api_key, parameters, "null", Place_id));
  }
}
// In developing stage 
function shortListPlaces() {
  // use the google response.data and sort the data according the function input parameter 
}

app.listen(3000, () => {
  console.log("server is starting at port 3000");
});
//------------------------------- END --------------------------
