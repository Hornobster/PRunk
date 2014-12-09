/**
 * Created by usi-stefano on 12/3/14.
 */


function createMap(mapList, path ,load){

    var docs = [];
    var docsCopy = [];
    var newDoc;

    var widths = [];
    var partialWidth = 0;
    var heights=[];
    var width = 0;
    var height = 0;
    var tileWidth;
    var tileHeight;
    var maxHeight;
    var currTileset="";

    var currentFile = 0;
    var nFile;

    var collisPoints = [];
    var relativePoints = [];

    var stringXML;
    var block_properties = {};
    var objCounter=0;

    nFile = mapList.length;

    for(var i=0; i<mapList.length; i++){
        getXML(mapList[i]);
    }

    function getXML(name){

        var url = path+name;
        doJSONRequest(url,myCallback, name);

    }

    function doJSONRequest(url, callback ,name){

        var xhr = new XMLHttpRequest();

        xhr.open("GET", url, true);
        xhr.onload = function(e) {
            callback(xhr.responseText, name);
        }
        xhr.send();
    }

    function myCallback(doc, name) {

        var parser = new DOMParser();
        var doc = parser.parseFromString(doc, "application/xml");
        docs[name] = doc;
        tileWidth=doc.querySelectorAll("map")['0'].attributes.tilewidth.value;
        tileHeight=doc.querySelectorAll("map")['0'].attributes.tileheight.value;
        currentFile++;
        if (currentFile==nFile) {
            createNewXMLFile(load);
        }
    }

    function createNewXMLFile(callback){

        orderedXMLs();

        setXMLProperties();




        stringXML=(new XMLSerializer()).serializeToString(newDoc);
        callback(stringXML)

    }

    function resizeMap(){
        maxHeight=heights[0];
        for(var x=1; x<collisPoints.length-2;x+=2){
            if(collisPoints[x+1]>(collisPoints[x]+relativePoints[parseInt(x/2)])){
                for (var i=0;i<=parseInt(x/2);i++){
                    relativePoints[i]+=(Math.abs(collisPoints[x+1]-(collisPoints[x])));
                }
                maxHeight+=(Math.abs(collisPoints[x+1]-(collisPoints[x])));
            }else{
                relativePoints[parseInt(x/2)+1]=(collisPoints[x]+relativePoints[parseInt(x/2)])- collisPoints[x+1]
            }
            if((heights[parseInt(x/2)+1]+relativePoints[parseInt(x/2)+1])>maxHeight){
                maxHeight=heights[parseInt(x/2)+1]+relativePoints[parseInt(x/2)+1]
            }
        }
    }

    function calcShift(x){
        return (maxHeight-relativePoints[x]-heights[x])
    }

    function orderedXMLs(){

        for(var i=0; i<mapList.length; i++){
            docsCopy.push(docs[mapList[i]]);
            widths.push(parseInt(docs[mapList[i]].querySelectorAll("map")['0'].attributes.width.value));
            heights.push(parseInt(docs[mapList[i]].querySelectorAll("map")['0'].attributes.height.value));
            collisPoints.push(parseInt(docs[mapList[i]].querySelectorAll("properties")['0'].children['0'].attributes['1'].value.split(",")[0]));
            collisPoints.push(parseInt(docs[mapList[i]].querySelectorAll("properties")['0'].children['0'].attributes['1'].value.split(",")[1]));
        }

        docs = docsCopy;

    }

    function saveMapProperties(){

        block_properties["playerStart"]=relativePoints[0]+collisPoints[0];
        block_properties["pollStart"]=[];
        block_properties["pollStop"] =[];

        for (var z=0; z< collisPoints.length; z++){
            if (z%2==0){
                block_properties["pollStart"].push({"x":partialWidth, "passedTrough":false})
            }else{
                partialWidth += widths[parseInt(z/2)]
                block_properties["pollStop"].push({"x":partialWidth, "passedTrough":false})
            }

        }

        window.mapProperties = block_properties
    }

    function setObjectLayer(objectgroupTag,fromXML,objTagCounter,nObjects,mapTag){

        var objectTag = newDoc.createElement("object")
        var obj=docs[fromXML].querySelectorAll("objectgroup")[objTagCounter].children[nObjects]
        console.log(obj)
        Object.keys(obj.attributes).forEach(function(curr){
           if (curr!="length"){ //annoying length property in object WHY GOD???
               console.log(obj.attributes[curr])
               var value=obj.attributes[curr].value
               if (obj.attributes[curr].name=="x"){
                   value=parseInt((value))+((width-widths[fromXML])*tileHeight)
                   console.log(value)
                   console.log(widths[fromXML])
               }
               objectTag.setAttribute(obj.attributes[curr].name,value.toString())
           }
        })
        Object.keys(obj.children).forEach(function(curr){
            if (curr!="length") { //annoying length property in object WHY GOD???
                console.log(obj.children)
                var shapeTag = newDoc.createElement(obj.children[curr].tagName)
                Object.keys(obj.children[curr].attributes).forEach(function(c){
                    if (c!="length"){
                        shapeTag.setAttribute(obj.children[curr].attributes[c].name,obj.children[curr].attributes[c].value);
                    }
                })
                objectTag.appendChild(shapeTag)
            }
        })
        objectgroupTag.appendChild(objectTag)


    }

    function setCollisionLayer(mapTag){

        var layerTag = newDoc.createElement("layer");

        layerTag.setAttribute("name", "collision")
        layerTag.setAttribute("width", width)
        layerTag.setAttribute("height", maxHeight)

        var dataTag = newDoc.createElement("data")
        var propertiesTag = newDoc.createElement("properties")
        var propertyTag=newDoc.createElement("property")

        propertyTag.setAttribute("collision","true")
        propertiesTag.appendChild(propertyTag)
        dataTag.appendChild(propertiesTag)

        for (var y=0; y<maxHeight;y++){
            for (var w=0; w< widths.length;w++){
                for( var x=0; x<widths[w];x++){
                    if ((calcShift(w)-y)>0 || y>=(heights[w]+calcShift(w))){
                        var tileTag = newDoc.createElement("tile");
                        tileTag.setAttribute("gid", "0")
                        dataTag.appendChild(tileTag)
                    }else{
                        var tileTag = newDoc.createElement("tile");
                        tileTag.setAttribute("gid", docs[w].querySelectorAll("data")['1'].children[((y-calcShift(w))*widths[w])+x].attributes['0'].value)
                        dataTag.appendChild(tileTag)
                    }
                }
            }
        }

        layerTag.appendChild(dataTag)
        mapTag.appendChild(layerTag)

    }

    function setBackgroundLayer(mapTag,tilesetTag,imageTag){

        var layerTag = newDoc.createElement("layer")

        layerTag.setAttribute("name", "background")
        layerTag.setAttribute("width", width)
        layerTag.setAttribute("height", maxHeight)

        var dataTag = newDoc.createElement("data")

        for (var y=0; y<maxHeight;y++){
            for (var w=0; w< widths.length;w++){
                for( var x=0; x<widths[w];x++){
                    if ((calcShift(w)-y)>0 || y>=(heights[w]+calcShift(w))){
                        var tileTag = newDoc.createElement("tile");
                        tileTag.setAttribute("gid", "9")
                        dataTag.appendChild(tileTag)
                    }else{
                        var tileTag = newDoc.createElement("tile")
                        tileTag.setAttribute("gid", docs[w].querySelectorAll("data")['0'].children[((y-calcShift(w))*widths[w])+x].attributes['0'].value)
                        dataTag.appendChild(tileTag)
                    }
                }
            }
        }

        tilesetTag.appendChild(imageTag)
        layerTag.appendChild(dataTag)
        mapTag.appendChild(tilesetTag)
        mapTag.appendChild(layerTag)
    }

    function setXMLProperties(){

        newDoc = document.implementation.createDocument("","", null)

        width = widths.reduce(function(pre, cur) { return pre + cur; }); //obtain total width

        relativePoints = new Array(heights.length+1).join('0').split('').map(parseFloat); //initialize relativePoints [0]*n

        resizeMap();

        saveMapProperties()

        var mapTag = newDoc.createElement("map");

        mapTag.setAttribute("version", "1.0")
        mapTag.setAttribute("orientation", "orthogonal")
        mapTag.setAttribute("renderorder", "right-down")
        mapTag.setAttribute("width", width)
        mapTag.setAttribute("height", maxHeight)
        mapTag.setAttribute("tilewidth", tileWidth)
        mapTag.setAttribute("tileheight", tileHeight)

        var tilesetTag;
        var imageTag;

        Object.keys(docs).forEach(function(cur){
            var tilesets = docs[cur].querySelectorAll("tileset");
            Object.keys(tilesets).forEach(function(til){
                if(til!="length") {
                    var tilesetAttributes=tilesets[til].attributes;
                    if (tilesetAttributes.name.value!==currTileset){
                        tilesetTag = newDoc.createElement("tileset")
                        Object.keys(tilesetAttributes).forEach(function(tilattr){
                            if (tilattr!="length"){
                                tilesetTag.setAttribute(tilesetAttributes[tilattr].name,tilesetAttributes[tilattr].value)
                            }
                        })
                        imageTag = newDoc.createElement("image")
                        var image = tilesets[til].querySelectorAll("image")['0'].attributes
                        Object.keys(image).forEach(function(imgattr){
                            if (imgattr !="length"){
                                imageTag.setAttribute(image[imgattr].name, image[imgattr].value)
                            }
                        })
                        tilesetTag.appendChild(imageTag)
                        currTileset=tilesetAttributes.name.value;
                        mapTag.appendChild(tilesetTag)
                    }

                }
            })

        })

        setBackgroundLayer(mapTag,tilesetTag, imageTag)

        setCollisionLayer(mapTag)

        var c=0;
        for(var nDocs=0; nDocs < docs.length; nDocs++){
            for (var nObjectGroupTag=0; nObjectGroupTag<docs[nDocs].querySelectorAll("objectgroup").length; nObjectGroupTag++){
                var objectgroupTag = newDoc.createElement("objectgroup");
                objectgroupTag.setAttribute("color", docs[nDocs].querySelectorAll("objectgroup")[nObjectGroupTag].attributes[0].value)
                objectgroupTag.setAttribute("name", docs[nDocs].querySelectorAll("objectgroup")[nObjectGroupTag].attributes[1].value)
                var propertiesTag;
                var propertyTag;
                var objgroupattr=docs[nDocs].querySelectorAll("objectgroup")[nObjectGroupTag].children
                Object.keys(objgroupattr).forEach(function(attr){
                    if (objgroupattr[attr].nodeName=="properties"){
                        c++;
                        console.log(c)
                        var properties=objgroupattr[attr]
                        propertiesTag = newDoc.createElement("properties")
                        Object.keys(properties.children).forEach(function(prop){
                            if (prop!="length"){
                                propertyTag = newDoc.createElement("property")
                                Object.keys(properties.children[prop].attributes).forEach(function(propattr){
                                    if (propattr!="length"){
                                        propertyTag.setAttribute(properties.children[prop].attributes[propattr].name,properties.children[prop].attributes[propattr].value)
                                    }
                                })
                            }
                        })
                        propertiesTag.appendChild(propertyTag)
                    }
                })
                objectgroupTag.appendChild(propertiesTag)
                for (var nObjects=0; nObjects<docs[nDocs].querySelectorAll("object").length; nObjects++){
                    setObjectLayer(objectgroupTag,nDocs,nObjectGroupTag,nObjects,mapTag)
                }





                mapTag.appendChild(objectgroupTag)
            }
        }





        newDoc.appendChild(mapTag)

    }


}


