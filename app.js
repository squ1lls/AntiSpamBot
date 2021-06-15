    let fetchUrl = "http://localhost:3000/yo.json" + window.location.search;
    // get information, formatted in JSON, from that API link with the parameters in the url
    $.getJSON(fetchUrl, data =>{
    	console.log(data);
        // for each message, or key value pair, in the data
        for(key in data){
            let textVal = data[key].name;
            // append a list element to the element with the id content. This lsit element has these features:
            let toDoItem = $("<li></li>", {
                // a text value of the received name from the api
                text: textVal,
                // an id with the value of the received id from the api
                id: data[key].id,
                // when it is clicked, open a window with the url http://localhost:3000/getDeletedMessages and the parameters sId = this element's id and sName = this element's text content
                onClick: "window.open('http://localhost:3000/getDeletedMessages?sId=' + this.id + '&sName=' + this.textContent)"
            }).prependTo("#content"); 
        }
    })