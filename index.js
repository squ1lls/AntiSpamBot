//import libraries, spoken about in the video. These are used throughout the program
const Discord = require("discord.js");
const client = new Discord.Client();
const firebase = require('firebase');
const path = require('path');
const express = require('express');
const app = express();
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const url = require("url");
const querystring = require("querystring");
const fetch = require("node-fetch");
const $ = require( "jquery" )( window );

//Code to connect run Python in JavaScript by Michael Obasi



//options is the directory location on my computer. This is used to find the file to send to the user
const options = {root: path.join(__dirname)}

//references express.js, when express gets a url called example.com/, it will route here
//the two parameters to the callback function include information about the request, (req), and methods to send as a respond (res)
app.get("/", (req, res)=>{
  //If there is information in the url (example.com/?yo=3), then send the file that displays the person's servers. This information in the URL is from Discord which is sent
  //when it redirects you to the discord site if there is no information.
  if(Object.keys(req.query).length==0){
        res.redirect("https://discord.com/api/oauth2/authorize?client_id=845846360045125633&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2reformat.htm&response_type=token&scope=identify%20guilds")
    }else{
    res.sendFile("index.html", options, (err)=>{})}
})
//sends a file that reformats the URL of the website so I can read it in the index.html file efficiently
// not really necessary, but I wasn't sure how to do it at the time
// and put it in a separate file
app.get("/oauth2reformat.htm", (req, res) =>{

    res.sendFile("oauth2reformat.htm", options, (err)=>{});
})
//sends the code to the user to get what Discord servers they are in
app.get("/app.js", (req, res) =>{
    res.sendFile("app.js", options, (err)=>{})
})
//Sends the code to the user that makes the website look cool (CSS)
app.get("/stylesheet.css", (req, res) => {
    res.sendFile("stylesheet.css", options, (err) => {});
})
//Sends the HTML code to the user to get the deleted messages of a particular Discord server
app.get("/getDeletedMessages", (req, res) =>{
  res.sendFile("getDeletedMessages.html", options, (err) =>{})
})
//Sends the JQuery code necessary to get the deleted messsages' value and info from the backend 
app.get("/dMes.js", (req, res)=>{
    res.sendFile("dMes.js", options, (err)=>{})
})
//Sends the user information about the deleted messages of their server
app.get("/deletedMessages.json", (req, res) => {
//helper variable to get the id of the server from the variables in the url
//urlParams is now an object with each key/value as the variables in the url
let urlParams = querystring.parse(url.parse(req.url));
//Code to get data from the firebase database, it gets all values under the server id
//which is what I send all the deleted message information to below
  let fReq = firebase.database().ref(req.query.sId)
    fReq.once("value", snapshot => {
//send the user what firebase gives me about their server
      res.json(snapshot);
    })

})

//like the others, it handles the request "yo.json"
app.get('/yo.json', (req, res) =>{
//gets the token and accesstoken from the url
  let parsedUrl = url.parse(req.url);
  let parsedQueries = querystring.parse(parsedUrl.query);
  const tokenType = parsedQueries.token_type;
  const accessToken = parsedQueries.access_token;
//discordjs documentation
//uses node-fetch library to contact discord with the accessToken they gave me
//They give me the server's the user is in and then I turn it into a JSON structure
//and then I send that to the user using res.json
 fetch("https://discord.com/api/users/@me/guilds", {

  headers: {authorization: `${tokenType} ${accessToken}`}
 }).then(response => response.json()).then(
   response => {res.json(response)} 
 );

})

//Tells discord that I am an authorized bot. 
//The parameter would be the token that Discord gave me to prove
//that I own the bot, but for security reasons it's redacted
client.login("ODQ1ODQ2MzYwMDQ1MTI1NjMz.YKm5zw.sn1UK2yZjrsxU-SNGvTSTRwYdYU");
  // Tells the firebase library who I am and what database I am going to be accessing
  var firebaseConfig = {
    apiKey: "AIzaSyBSsFTwiLn9gCXFk1zoHYKxKoszheY7G8c",
    authDomain: "csfinal-59d5f.firebaseapp.com",
    projectId: "csfinal-59d5f",
    storageBucket: "csfinal-59d5f.appspot.com",
    messagingSenderId: "226173212980",
    appId: "1:226173212980:web:e3284802df50c06050ad61"
  };
  firebase.initializeApp(firebaseConfig);

//When my bot is in a server where a message is sent
client.on("message", message =>{
    //If it's spam (determined by code by Daniel George) and it's not sent by myself
  onMessage(message)

})
 function onMessage(message){
  let ailog;
if(message.author.id!=845846360045125633){
  $.getJSON("http://127.0.0.1:5000/?message=" + message.content, data => {
  
    if(data.isSpam){
      //Log the message in the database that can be referenced using the id of the server, or guild, that the message was sent in
     //It logs the message content and the author of it
     
       let a = firebase.database().ref(message.guild.id).push({"message": message.content, "username": message.author});
  
       //Reply to the message not to spam
      message.reply("No spam please senor");
      //and deletes the message
      message.delete();   }


    })
  }

 
}
//Whenever the bot is invited to a server (aka guild), this is called. The function that is called as a result of it takes a guild parameter
client.on("guildCreate", guild =>{
  //Sets the reference value of the server ID in the database to be an object containing the key settings and value 'none'.
  //If I ever add more preferences, it would be in that object
  //Also good if I ever want to count how many servers have my bot in it
  //Even though Discord has a feature like that
    firebase.database().ref(guild.id).set({settings: "none"});
})

//Tells express.js to respond to calls to either the website that this is hosted on or localhost:3000/whatever
app.listen(process.env.PORT || 3000);


//Bot invite links and OAuth2 request link, used elsewhere
//https://discord.com/oauth2/authorize?client_id=845846360045125633&scope=bot&permissions=8
//https://discord.com/api/oauth2/authorize?client_id=845846360045125633&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2reformat.htm&response_type=token&scope=identify%20guilds