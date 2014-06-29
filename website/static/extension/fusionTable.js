
var greystash = greystash || {};

//constants for the rules fusion table
greystash.tabID = '1IB-gYKQWxGyVW6U7RQqdhfGgWus8BH0aX_BxEyRo';
greystash.apiKey = 'AIzaSyDPIDblZh-H55gEkg7u6KVry1OZ-pgGpsQ';
greystash.NAME = 0;
greystash.URLS = 1;
greystash.RULE = 2;
greystash.MAX_LEN = 3;

/**
  *  handelResponse()
  *
  *  Grabs response from google fusion table.
  *
  *  @param column The column to parse from the table. If null,
  *	return entire response
  *  @return array of items in that column or the entire response
  */
function handleResponse(column) {
    var retArray = [];
    if(httpRequest.readyState === 4) {
	if(httpRequest.status === 200) {
	    // The code reaches this point because the Google server
	    // responded with some useful data.
	    var response = JSON.parse(httpRequest.responseText);
	    console.log(response);
	    if(column == null){
		return response;
	    }
	    if(response["rows"] != undefined) {
		for(var i = 0; i < response["rows"].length; i++){
		    retArray.push(response["rows"][i][column])
		}
	    }
	}
    }
    return retArray
};

/**
  *  requestTable()
  *
  *  Helper function to query the rules fusion table
  *  
  *  @param callback Function to call when request is done
  *  @param col The column(s) to select
  *  @param whreExp WHERE clause of the query
  *  @return void
  */
var requestTable = function(callback,col,whereExp) {
    if(col == null){
	col = '*'
    }
    if(whereExp == null){
	whereExp = '';
    }
    makeRequestor();         
    var query = "SELECT " + col +" FROM " + greystash.tabID + " " + whereExp;
    var url = "https://www.googleapis.com/fusiontables/v1/query";
    url = url + "?sql=" + query;
    url = url + "&key=" + greystash.apiKey;
    console.log('First request URL: '+ url); 
    sendRequest(url, callback);
};

/**
  *  makeRequestor()
  *
  *  This function makes an object to make http requests.
  *
  *  This function is adapted from:
  *    https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
  *
  *  This application calls this function only once; it uses only
  *  one httpRequest object to send all subsequent GET requests.
  *
  *  @param void
  *  @return void
  */
var makeRequestor = function() {
    if(window.XMLHttpRequest) {// Mozilla, Safari, ...
	    httpRequest = new XMLHttpRequest();
	} else if(window.ActiveXObject) {// IE
	    try {
		httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
	    } catch (e) {
		try {
		    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
		}
	    }
	}

	if(!httpRequest) {
	    alert('Cannot create http requestor!');
	    return false;
    }
};

/**
  *  sendRequest()
  *
  *  This function utlizes the namespace's httpRequest object to make
  *  http requests.  It sets up the httpRequest onreadystatechange
  *  property to be the response function passed to this function.
  *
  *  This function is adapted from:
  *    https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
  *
  *  @param url The well-formed url representing the http request.
  *  @param response The function describing the behavior that should
  *         occur after the httpRequest object gets a response.
  *  @return void
  */
var sendRequest = function(url, response) {
    httpRequest.onreadystatechange = response;
    httpRequest.open('GET', url);
    httpRequest.send();
}
