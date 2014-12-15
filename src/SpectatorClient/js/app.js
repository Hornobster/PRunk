window.onload = function () {	
	window.client = new ClientWebSocket();
	var id = window.location.hash.substring(1); 
	if(id){		
		client.view(id);
	}else{
		client.listPlayer();
	}
}
window.onhashchange = function(){
	window.onload()
	location.reload();
}

function getGetParams(){
	/*
	var getParamsList = window.location.search.replace("?", "").split('&');    
    var getParamsDict = {};
    getParamsList.forEach(function(elem){
    	var supp = elem.split('=');
    	getParamsDict[supp[0]] = supp[1];    	
    })*/
	return window.location.hash.substring(1);    
}

function listPlayer(list){
	html = '<tr><th>Player</th><th>Link</th></tr>';	
	list.forEach(function(elem){
		html += '<tr><td><a href="#'+elem.id+'">'+elem.name+'</a></td><td>http://link.com/?id='+elem.id+'</td></tr>';
	});
	document.getElementById('playerListTable').innerHTML = html;
	document.getElementById('playerListDiv').style.display = 'block';
	document.getElementById('vote').style.display = 'none';
}

function view(){		
	document.getElementById('playerListDiv').style.display = 'none';
	document.getElementById('objectListDiv').style.display = 'flex';
}

