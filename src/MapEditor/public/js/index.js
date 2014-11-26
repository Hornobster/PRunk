var data={};
var whereamI="tracks";



function SetJSONRequestParams(link, method, cb, da){
    doJSONRequest(method,link,{},da,function(res){
        if(method!='DELETE' && method!='PUT'){
            var n=0;
            data=JSON.parse(res);

            whereamI=link.split('/')[1];
            if (link.split('/').length>2){
                n=1
            }
            displayAll(n)
        }
        if(cb && typeof cb === 'function'){
            cb(res);
        }
    })
}

function displayAll(n){
    var result = fuzzyFind( data ,"name", "")
    var obj ={}
    obj[whereamI] = result;
    if (n==1){
        whereamI="s"+whereamI;
    }
    if (whereamI=="tracks"){
        obj.tracks.forEach(function(current){
            current.duration=time_format(current.duration);
        })
    }
    if (whereamI=='salbums'){
        obj.albums[0].tracks.forEach(function(current){
            current.duration=time_format(current.duration);
        })

    }
    dust.render(whereamI, obj, function(err,out){
        var div =document.getElementById("article");
        div.innerHTML=out
    } )
}
//TODO remove redundant code merge the two display functions

function displayPartial(obj){
    dust.render(whereamI, obj, function(err,out){
        var div =document.getElementById("article");
        div.innerHTML=out
    } )
}

function time_format(time){
    time=parseInt(time);
    return Math.floor(time / 60) + ":"+ (time % 60 < 10 ? "0".concat(time % 60) : time % 60);
}

function search(){
    var x = document.getElementById("search");
    var result = fuzzyFind(data,"name",x.value);
    var obj ={}
    obj[whereamI] = result;
    displayPartial(obj);
}

function deleteSong(id,name,where){
    if (confirm("This will delete "+ name + ", Are you sure?") == true) {
        SetJSONRequestParams("/"+ where + "/"+id, "DELETE", function(){
           SetJSONRequestParams("/"+ where,"GET");
        });
    }
}

function editSongName(id,where){
    var edit = prompt("Please enter The New Song Name", "e.g. TNT");
    if (edit != null) {
        SetJSONRequestParams("/"+where + "/"+ id, "GET",function(json){
            json = JSON.parse(json);
            json[0].name=edit;
            SetJSONRequestParams("/"+ where + "/"+id,"PUT",function(){
                SetJSONRequestParams("/"+ where,"GET");
            },json[0]);
        })
    }
}

function upload(){
    var form = document.getElementById('file-form');
    var fileSelect = document.getElementById('file-select');
    var uploadButton = document.getElementById('upload-button');
    var x =document.getElementById("artistin")
    var y =document.getElementById("albumin")
    uploadButton.innerHTML = 'Uploading...';
    var files =(fileSelect.files)[0];
    var found;
    if (window.FormData) {
        formdata = new FormData();
    }
    formdata.append("songs",files,files.name);
    console.log(files)
    var req = new XMLHttpRequest();
    req.open('POST', '/', true);
    req.onload = function () {
        if (req.status === 200) {
            // File(s) uploaded.
            uploadButton.innerHTML = 'Upload';
        } else {
            alert('An error occurred!');
        }
    };
    req.send(formdata);
    doJSONRequest('GET','/tracks',{},null,function(res){
        var data = JSON.parse(res);
        data.forEach(function(cur){
            if (files.name==cur.name){
                found=true;
            }
        })
        if (found==true){
            var obj={name : 'Track',
                data : [
                    {
                        "_id"          : ObjectId,
                        "artist"       : x.value,
                        "album"        : y.value,
                        "name"         : files.name,
                        "duration"     : 442,
                        "file"         : "tracks_folder/1.mp3",
                        "id3Tags"      : "",
                        "dateReleased" : "Mon Sep 29 1986 00:00:00 GMT+0100 (CET)",
                        "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
                    }]
        }
        }

    })
}



function displayResult(n){
    if (n==0){
        var x =document.getElementById("artistin")
        var w ='artists'
        var r = document.getElementById("artistResult")
    }else{
        var x =document.getElementById("albumin")
        var w ='albums'
        var r = document.getElementById("albumResult")
    }
    var s=''
    doJSONRequest('GET','/'+w,{},null,function(res){
        data=JSON.parse(res);
        var result=fuzzyFind(data,"name", x.value)
        result.forEach(function(curr){
            s+=curr.name + "</br>";
        })
        r.innerHTML=s;
    })
}




function singleView(id,where){
    SetJSONRequestParams("/"+ where + "/"+id,"GET",function(){});
}

function fuzzyFind(arr, prop, term){
    var ret=[];
    for(var a in arr){
        if(arr[a][prop].toLowerCase().indexOf(term.toLowerCase())!=-1){
            ret.push(arr[a]);
        }
    }
    return ret;
}

