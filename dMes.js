// set the value of these variables for later use
let liID = 0;
let prevElement = null;
// when the document is ready according to jquery
$(document).ready(()=>{
	// The text value of the element with the id intro will be itself with the URL parameter sName at the end
	$("#intro").text($("#intro").text()+(new URLSearchParams(window.location.search)).get('sName'))
	//Get a JSON file from http://localhost:3000/deletedMessages.json, include the url parameter sId which is equal to the url parameter of this website sId 
	$.getJSON("http://localhost:3000/deletedMessages.json?sId=" + (new URLSearchParams(window.location.search)).get('sId'), (data) =>{
	// for every key-pair value in the received data
	for(key in data){
		//for every key pair value in the received data's key pair values
			for(e in data[key]){
			
			
			if(prevElement==null){
				// if the variable prevElement is null, then add a list element to the element with the id content
				// with the text of the value of the nested key-value pairs and the id of 0
				$("<li></li>", {
					text: JSON.stringify(data[key][e]),
					id: liID
				}).prependTo("#content")
				// sets prevElement = 0
				prevElement = liID;
				// adds an h2 element to the previous element, the most recent element with the id 0
				$("<h2></h2>", {
					text: "This message is: "
				}).appendTo("#" + prevElement)
			}
			//Otherwise if prevElement isn't null
			else{
				//If the data says that it isn't a bot add an h5 element to the previous element with the text "from a bot"
 
				if(!JSON.stringify(data[key][e].bot)){
					$("<h5></h5>", {
						text: "from a bot"
					}).appendTo("#" + prevElement)
				}
				//Otherwise, add an h5 element with the text "not from a bot"				
				else{
							$("<h5></h5>", {
								text: "not from a bot"
							}).appendTo("#" + prevElement)
				}
				//
			
				// create a variable unquoted that contains a string "from (the usernname of the key-value pair)#(the discriminator value of the key value pair)". This is how discord formats their usernames 
				let unquoted = "from " + JSON.stringify(data[key][e].username) + "#" + JSON.stringify(data[key][e].discriminator);
				// run through all instances of a " and remake the string into the first part of it and the second part of it, split by the index of the ", but not included. This deletes the "
				while(unquoted.indexOf('"')!=-1){
						unquoted = unquoted.substring(0, unquoted.indexOf('"')) + unquoted.substring(unquoted.indexOf('"') +1)
					}
// add an h5 element with the text value of the previously created unquoted variable to the previous element. 
				$("<h5></h5>", {
					text: unquoted
				}).appendTo("#" + prevElement)
				// set the value of prevElement to be null so when the next value is processed in the for each loops, the program will handle the appropriate data
				prevElement = null;
			}
			
			}
		}
	})
})