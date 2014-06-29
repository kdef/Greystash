
var greystash = greystash || {};
var site = null;
var siteTyped = null;
greystash.webGenerate = function() {
    var out = document.getElementById('output');
    var sitePass =  document.getElementById('site_pass').value;
    var siteName = site.value
    var extPass = document.getElementById('ext_pass').value; 
    siteName =greystash.getCanonicalURL(siteName);
    var whereClause = siteName;

    //decide if we are dealing with a typed url or a default supported one	
    if(siteTyped.style.visibility === "visible"){
	siteName = siteTyped.value;
	whereClause = "XXX";
	console.log("In deal with non supported sites " +  siteName + " " + whereClause);
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
greystash.updateFields = function(){
    if(site.value === "Other"){
	siteTyped.value = "";
	siteTyped.style.visibility = "visible";
    }else{
	siteTyped.style.visibility = "hidden";
    }
}
/**
  *  updateDropDown()
  *
  *  Dynamicly fill website drop down menu based on fusion table
  *
  *  @param void
  *  @return void
  */
var updateDropDown = function(){
    var urls = handleResponse(URLS)
    var dropDownName = 'site';//make more glamorous at some point
    for(var i = 0; i < urls.length; i++){
	var url = urls[i];
	var option = document.createElement("option");
	option.text = url;
	site.add(option);
    }
}
// attach the generatePass function to the generate button
onload = function() {
    requestTable(updateDropDown)
    site = document.getElementById('site');
    siteTyped = document.getElementById('site_typed');
    siteTyped.style.visibility = "visible";
    site.addEventListener('change',greystash.updateFields);
    var btn = document.getElementById('generate');
    btn.addEventListener('click', greystash.webGenerate);
}
