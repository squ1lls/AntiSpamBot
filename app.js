    let fetchUrl = "http://localhost:3000/yo.json" + window.location.search;
    $.getJSON(fetchUrl, data =>{
    	console.log(data);
        for(key in data){
            let textVal = data[key].name;
            let toDoItem = $("<li></li>", {
                text: textVal,
                id: data[key].id,
                onClick: "window.open('http://localhost:3000/getDeletedMessages?sId=' + this.id + '&sName=' + this.textContent)"
            }).prependTo("#content"); 
        }
    })