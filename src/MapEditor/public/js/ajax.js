/* AJAX */

/* The doRequest function handles AJAX calls to the server.

 * Exercise 3a: BEGIN

 * The function must check that:
 *  - all the arguments are passed when called
 *  - type has one of the following value: "GET", "POST", "PUT", "DELETE"
 *  - the data (data parameter) is in JSON format
 * If a check fails the function must throw an error.

 * Exercise 3a: END

 * Exercise 3b: BEGIN

 * The function must open a connection to the server according to the type and url parameters
 * The function must correctly set the Request Headers according to the headers parameter, 
 * additionally to the ones needed by the JSON interaction according to the type parameter
 * The function must correctly set the data to be sent according to the data parameter

 * Exercise 3b: END

 * Exercise 3c: BEGIN

 * The function must call the callback function when the response is ready, passing the JSON object parsed from the response, if there is one,
 * or return in case of errors.

 * Exercise 3c: END

 * 
 * @param {String} type The type of the AJAX request. One of: "GET", "POST", "PUT", "DELETE".
 * @param {String} url The url of the API to call, optionally with parameters.
 * @param {Object} headers The Associative Array containing the Request Headers. It must be null if there are no headers.
 * @param {JSON} data The data in the JSON format to be sent to the server. It must be null if there are no data.
 * @param {Function} callback The function to call when the response is ready.
 */
 function doJSONRequest(type, url, headers, data, callback){
     if (arguments.length!=5){
         throw ("Uncorrect number of parameters.")
     }else{
         var newHeaderObject=headers;
         switch (type) {
             case "GET":
                 break;
             case "PUT": newHeaderObject=appendHeader(headers,"Content-Type","application/json;charset=utf-8");
                 break;
             case "POST": newHeaderObject=appendHeader(headers,"Content-Type","application/json;charset=utf-8");
                 break;
             case "DELETE":
                 break;
             default:
                 throw ("type parameter must be a GET, a POST, a PUT or a DELETE.");
         }
         if (data){
             if (data.constructor!={}.constructor){
                 console.log("data")
                 throw ("data parameter must be a valid JSON.")
             }
         }
         //console.log("Header:", headers);
         var req = new XMLHttpRequest();
         req.open(type, url, true);
         req.setRequestHeader("Accept", "application/json");

         for (var k in newHeaderObject){
             if((type!='GET')||(k!="Content-Type")) {
                 req.setRequestHeader(k, newHeaderObject[k]);
             }
         }
         req.onreadystatechange = function () {
             //correctly handle the errors based on the HTTP status returned by the called API
             if (req.readyState == 4){
                 if(req.status>=200 && req.status<300){
                     callback(req.responseText);
                 }
             }
             //call the showSearchResults passing the search results

         };

         req.send(JSON.stringify(data));


     }

 }


function appendHeader(object,headerType, header){
    if (!(headerType in Object.keys(object))){
        object[headerType]=header;
    }
    return object;
}


//function isValidJSON(str) {
//    try {
//        JSON.parse(str);
//    } catch (e) {
//        return false;
//    }
//    return true;
//}

/* AJAX */
