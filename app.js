
const express = require("express");
const axios = require('axios');
const app = express();
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
 const ck = require('ckey'); 
const { response } = require("express");
 const api_key = ck.API_KEY; 
 const contact_no = ck.PHONE_NO; 
 const accountSid = ck.TWILIO_ACCOUNT_SID;
 const authToken = ck.TWILIO_AUTH_TOKEN;
 const client = require('twilio')(accountSid, authToken);

const nearby_link = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
const details_link = "https://maps.googleapis.com/maps/api/place/details/json?";
const  thingspeak_url = "https://api.thingspeak.com/channels/1819879/feeds.json?results=1";
var ResponseData; // places library response obeject 
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
var hospitals = placesAPIResponseHandle("hospital");    // Json for nearby hospitals
var pcs= placesAPIResponseHandle("police");           // Json for nearby police stations

var datah,datapc;


hospitals.then(data=>{
  datah=data;
  console.log("hospitals :");
      console.log(data.results[0].name);
    
})
pcs.then(data=>{
  datapc=data;
  // var link="https://maps.google.com/?q="+alertData.location.lat +","+alertData.location.lon;
  // var msg = "\n\n   Alert ❗❗\n\n " +"Location:\n\n"+generateMAPLink(alertData.location.lat,alertData.location.lon)+"\n\n"+"Severity:   "+alertData.svr_level+" / 10 \n\n";
   var msg = "\n\n   Alert ❗❗\n\n " +"Location:\n\n"+generateMAPLink(alertData.location.lat,alertData.location.lon)+"\n\n"+"Severity:   "+alertData.svr_level+" / 10 \n\n"+"Nearby Hospitals:  \n\n"+datah.results[0].name+"\n "+generateMAPLink( datah.results[0].geometry.location.lat, datah.results[0].geometry.location.lng)+"\n\n"+datah.results[1].name+"\n "+generateMAPLink( datah.results[1].geometry.location.lat, datah.results[1].geometry.location.lng)+"\n\n"+datah.results[2].name+"\n "+generateMAPLink( datah.results[2].geometry.location.lat, datah.results[2].geometry.location.lng)+"\n\n"+"Nearby Police stations:  \n\n"+datapc.results[0].name+"\n "+generateMAPLink( datapc.results[0].geometry.location.lat, datapc.results[0].geometry.location.lng)+"\n\n"+datapc.results[1].name+"\n "+generateMAPLink( datapc.results[1].geometry.location.lat, datapc.results[1].geometry.location.lng)+"\n\n"+datapc.results[2].name+"\n "+generateMAPLink( datapc.results[2].geometry.location.lat, datapc.results[2].geometry.location.lng)+"\n\n";
send_sms(msg);
//latitude path: results[0].geometry.location.lat
})

      console.log("alertData : ");
      console.log(alertData);
      console.log("parameters : ");
      console.log( parameters);
console.log("sending massage : ");	 



//send_sms(msg);
});
}


function generateMAPLink(lat,long)
{
  return "https://maps.google.com/?q="+lat+","+long;
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

 async function placesAPIResponseHandle(nearbysearch) {
  var Response ;
  var config = {
    method: 'get',
    url:URL(nearby_link,api_key,parameters,nearbysearch,"null"),
    headers: {}
  };
 await axios(config)
    .then( function (response) {
      ResponseData =  response.data ;
      // console.log("statusCode : " + ResposeData.status);
      //  Place_id =  ResposeData.results[0].place_id
      // console.log("place_id :"+ Place_id);
      // console.log("Places API for nearby "+ nearbysearch + " : " + config.url );
	  //  console.log("ResposeData from google places library  : ");
    //   console.log(ResposeData);
      //console.log(config.url);
      //place_details(ResposeData,3);
      // console.log(URL(nearby_link,api_key,parameters,nearbysearch,"null"));
      // console.log(URL(nearby_link,api_key,parameters,"police","null"));
      Response = ResponseData;
      console.log('heheh');
      console.log(typeof(ResponseData));
    })
    .catch(function (error) {
      console.log(error);
    });  

    return Response;
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

app.listen( ck.PORT ||9000 , () => {
  console.log("server is starting at port 8080");
});
//------------------------------- END --------------------------
