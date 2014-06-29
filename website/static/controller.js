var greystash = greystash || {};
greystash.site = null;//place holder for site drop down menu
greystash.siteTyped = null;//place holder for site input element

/**
  *  webGenerate()
  *
  *  Helper function to pass parameters to generate password
  *
  *  @param void
  *  @return void
  */
greystash.webGenerate = function() {
    var out = document.getElementById('output');
    var extPass = document.getElementById('ext_pass').value;
    var sitePass = document.getElementById('site_pass').value;
    var siteName= greystash.site.value; 
    siteName = greystash.getCanonicalURL(siteName);
    var whereClause = siteName;

    //decide if we are dealing with a typed url or a default supported one	
    if(greystash.siteTyped.style.visibility === "visible"){
	    siteName = greystash.siteTyped.value;
	    whereClause = "XXX";
	    console.log("In deal with non supported greystash.sites " +  siteName + " " + whereClause);
    }
    console.log("Parameters to gen password: " + siteName + " " + sitePass + " " + extPass)
    
    //get entry in fusion table and generate password
    requestTable(function(){
	    var response = handleResponse();
        console.log(response);
        if(response["rows"] != null && response["rows"][0] != null){
            out.innerHTML = greystash.generatePassword(siteName, sitePass, extPass,response["rows"][0]);
        }
	
    },null,"WHERE 'urls' LIKE '" + whereClause + "'")//need to check if works for multiple URLs
}

/**
  *  updateFields()
  *
  *  Hide or show the typed webgreystash.site field
  *
  *  @param void
  *  @return void
  */
greystash.updateFields = function(){
    if(greystash.site.value === "Other"){
	    greystash.siteTyped.value = "";
	    greystash.siteTyped.style.visibility = "visible";
    }else{
	    greystash.siteTyped.style.visibility = "hidden";
    }
}
/**
  *  updateDropDown()
  *
  *  Dynamicly fill webgreystash.site drop down menu based on fusion table
  *
  *  @param void
  *  @return void
  */
var updateDropDown = function(){
    var urls = handleResponse(greystash.URLS)
    var dropDownName = 'greystash.site';//make more glamorous at some point
    for(var i = 0; i < urls.length; i++){
	    var url = urls[i];
        //make sure isnt default rule
        if(url.search("XXX") == -1){
            var option = document.createElement("option");
            option.text = url;
            greystash.site.add(option);
        }
    }
}


/**
  *  onload()
  *
  *  Overide listener for submit button and typed webgreystash.site field
  *
  *  @param void
  *  @return void
  */
onload = function() {
    requestTable(updateDropDown)
    greystash.site = document.getElementById('site');
    greystash.siteTyped = document.getElementById('site_typed');
    greystash.siteTyped.style.visibility = "visible";
    greystash.site.addEventListener('change',greystash.updateFields);
    var btn = document.getElementById('generate');
    btn.addEventListener('click', greystash.webGenerate);
}
