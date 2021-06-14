let liID = 0;
let prevElement = null;
$(document).ready(()=>{
	$("#intro").text($("#intro").text()+(new URLSearchParams(window.location.search)).get('sName'))
	$.getJSON("http://localhost:3000/deletedMessages.json?sId=" + (new URLSearchParams(window.location.search)).get('sId'), (data) =>{
	console.log(data)
	for(key in data){
		console.log(data[key])			
			for(e in data[key]){
			
				console.log(data[key][e])
			if(prevElement==null){
				$("<li></li>", {
					text: JSON.stringify(data[key][e]),
					id: liID
				}).prependTo("#content")
				console.log(liID);
				prevElement = liID;
				$("<h2></h2>", {
					text: "This message is: "
				}).appendTo("#" + prevElement)
			}else{
				if(!JSON.stringify(data[key][e].bot)){
					$("<h5></h5>", {
						text: "from a bot"
					}).appendTo("#" + prevElement)
						}else{
							$("<h5></h5>", {
								text: "not from a bot"
							}).appendTo("#" + prevElement)
				}
				let unquoted = "from " + JSON.stringify(data[key][e].username) + "#" + JSON.stringify(data[key][e].discriminator).replace(/"([^"]+)":/g, '$1:');
					while(unquoted.indexOf('"')!=-1){
						unquoted = unquoted.substring(0, unquoted.indexOf('"')) + unquoted.substring(unquoted.indexOf('"') +1)
					}
				$("<h5></h5>", {
					text: unquoted
				}).appendTo("#" + prevElement)
				prevElement = null;
			}
			
			}
		}
	})
})