

createMap(["a.tmx","b.tmx","c.tmx","d.tmx"])

function createMap(mapList){
    var docs = [];
    var widths=[];
    var heights=[];
    var fixed_tilewidth =70;
    var fixed_tileheight =70;
    var currentFile= 0;
    var nFile=0;
    var collisPoints = []
    var relativePoints =[]
    var max;
    var new_doc;
    var s;


    nFile = mapList.length;
    for(var i=0; i<mapList.length; i++){
        getXML(mapList[i]);
    }

    function getXML(name){

        var url = "data/"+name;
        doJSONRequest(url,myCallback)

    }

    function doJSONRequest(url, callback){

        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.onload = function(e) {
            callback(xhr.responseText);
        }
        xhr.send();
    }

    function myCallback(doc) {

        var parser = new DOMParser();
        var doc = parser.parseFromString(doc, "application/xml");
        docs.push(doc);
        widths.push(parseInt(doc.querySelectorAll("map")['0'].attributes.width.value));
        heights.push(parseInt(doc.querySelectorAll("map")['0'].attributes.height.value));
        collisPoints.push(parseInt(doc.querySelectorAll("properties")['0'].children['0'].attributes['1'].nodeValue.split(",")[0]));
        collisPoints.push(parseInt(doc.querySelectorAll("properties")['0'].children['0'].attributes['1'].nodeValue.split(",")[1]));

        currentFile++;
        if(currentFile==nFile) {
            createNewXMLFile(function(map) {
                console.log(map)
                //Map Load
            });

        }
    }

    function createNewXMLFile(callback){
        new_doc = document.implementation.createDocument("","", null)

        var mapTag = new_doc.createElement("map");
        var width = 0;
        var height = 0;

        for (var i = 0; i < widths.length; ++i) {
            width += widths[i];
        }

        for(var x=0;x<heights.length;x ++){
            relativePoints[x]=0;
        }

        resizeMap()

        mapTag.setAttribute("version", "1.0")
        mapTag.setAttribute("orientation", "orthogonal")
        mapTag.setAttribute("renderorder", "right-down")
        mapTag.setAttribute("width", width)
        mapTag.setAttribute("height", max)
        mapTag.setAttribute("tilewidth", fixed_tilewidth)
        mapTag.setAttribute("tileheight", fixed_tileheight)

        var tilesetTag = new_doc.createElement("tileset")

        tilesetTag.setAttribute("firstgid", "1")
        tilesetTag.setAttribute("name", "tiles_map")
        tilesetTag.setAttribute("tilewidth", fixed_tilewidth)
        tilesetTag.setAttribute("tileheight", fixed_tileheight)

        var imageTag = new_doc.createElement("image")

        imageTag.setAttribute("source", "../images/tiles_map.png")
        imageTag.setAttribute("width", "700")
        imageTag.setAttribute("height", "140")

        var layerTag = new_doc.createElement("layer")

        layerTag.setAttribute("name", "background")
        layerTag.setAttribute("width", width)
        layerTag.setAttribute("height", max)

        var dataTag = new_doc.createElement("data")

        for (var y=0; y<max;y++){
            for (var w=0; w< widths.length;w++){
                for( var x=0; x<widths[w];x++){
                    if ((calcShift(w)-y)>0 || y>=(heights[w]+calcShift(w))){
                        var tileTag = new_doc.createElement("tile");
                        tileTag.setAttribute("gid", "9")
                        dataTag.appendChild(tileTag)
                    }else{
                        var tileTag = new_doc.createElement("tile")
                        tileTag.setAttribute("gid", docs[w].querySelectorAll("data")['0'].children[((y-calcShift(w))*widths[w])+x].attributes['0'].nodeValue)
                        dataTag.appendChild(tileTag)
                    }
                }
            }
        }

        tilesetTag.appendChild(imageTag)
        layerTag.appendChild(dataTag)
        mapTag.appendChild(tilesetTag)
        mapTag.appendChild(layerTag)

        var layerTag = new_doc.createElement("layer")

        layerTag.setAttribute("name", "collision")
        layerTag.setAttribute("width", width)
        layerTag.setAttribute("height", max)

        var dataTag = new_doc.createElement("data")
        var propertiesTag = new_doc.createElement("properties")
        var propertyTag=new_doc.createElement("property")

        propertyTag.setAttribute("collision","true")
        propertiesTag.appendChild(propertyTag)
        dataTag.appendChild(propertiesTag)

        for (var y=0; y<max;y++){
            for (var w=0; w< widths.length;w++){
                for( var x=0; x<widths[w];x++){

                    if ((calcShift(w)-y)>0 || y>=(heights[w]+calcShift(w))){
                        var tileTag = new_doc.createElement("tile");
                        tileTag.setAttribute("gid", "0")
                        dataTag.appendChild(tileTag)
                    }else{
                        var tileTag = new_doc.createElement("tile");
                        tileTag.setAttribute("gid", docs[w].querySelectorAll("data")['1'].children[((y-calcShift(w))*widths[w])+x].attributes['0'].nodeValue)
                        dataTag.appendChild(tileTag)
                    }
                }
            }
        }

        layerTag.appendChild(dataTag)
        mapTag.appendChild(layerTag)
        new_doc.appendChild(mapTag)
        s=(new XMLSerializer()).serializeToString(new_doc);
        callback(s)

    }

    function resizeMap(){
        max=heights[0];
        for(var x=1; x<collisPoints.length-2;x+=2){
            if(collisPoints[x+1]>(collisPoints[x]+relativePoints[parseInt(x/2)])){
                for (var i=0;i<=parseInt(x/2);i++){
                    relativePoints[i]+=(Math.abs(collisPoints[x+1]-(collisPoints[x])));
                }
                max+=(Math.abs(collisPoints[x+1]-(collisPoints[x])));
            }else{
                relativePoints[parseInt(x/2)+1]=(collisPoints[x]+relativePoints[parseInt(x/2)])- collisPoints[x+1]
            }
            if((heights[parseInt(x/2)+1]+relativePoints[parseInt(x/2)+1])>max){
                max=heights[parseInt(x/2)+1]+relativePoints[parseInt(x/2)+1]
            }
        }
    }

    function calcShift(x){
        return (max-relativePoints[x]-heights[x])
    }

}



