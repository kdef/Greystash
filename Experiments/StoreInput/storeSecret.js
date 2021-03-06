/*
 * storeSecret.js
 *
 * Content script for experimental extension.  
 * 
 * This experiment currently explores the relationship between the
 * extension's content script, the extension's popup page, the
 * browser's current tab, and the extension's background page.
 * 
 * To test this code, point the browser at some page that has a
 * password form.  The form should turn red.  Click on the Purple P
 * icon for the extension to reveal the popup for the extension; the
 * extension's password form should turn red.  After clicking the
 * "submit" button on the popup page, the master password shall be
 * logged to the popup console and and message sent to the background
 * page.
 * 
 *
 * @author Team Failing
 * @since 10/13/2013
 */

// Create a namespace for this extension.
var Greystash = Greystash || {};



/*
 * processForm()
 * 
 * Eventually this function should take on the same functionality as
 * in Joe Devlin's processForm in findPass.js.  For now, just log
 * the form.
 */
Greystash.processForm = function(form)
{
	console.log(form);	
}

/*
 * instrumentPopup()
 * 
 * Add a listener to the popup page so that user's may sign in with'
 * their master password.
 * 
 */
Greystash.instrumentPopup = function()
{
	console.log('Popup Instrumented.');

	var inputForm = document.getElementById("password");
	var submitForm = document.getElementById("signIn");

	if(!(inputForm === null))
	{ 	
	    inputForm.style.backgroundColor = 'red';
		
	    // Alter the submit form's onclick behaviour to
	    // send a WTF message to the background page.  
	    submitForm.onclick =function(){ 

		// This shall be logged to the popup's console.
		console.log(inputForm.value);

		// This shall be sent to the background page.  A
		// response will be issued by the background page.
		chrome.runtime.sendMessage({greeting: "User submitted a master password"}, function(response) {
  		    console.log(response.farewell);

		});
	    };
	}
}

/*
 * instrumentPage()
 * 
 * Find the password input field on the page and add a listener
 * to it.  Based on Joe Devlin's experiment source, findPass.js.
 * 
 */
Greystash.instrumentPage = function()
{ 
    console.log('Page Instrumented.');
    
    // Grab all of the forms on the page.
    var allForms = document.getElementsByTagName('form');
    
    // Search through all the forms on the page, looking for the 
    // password input and the submit button.      
    for(var j = 0; j < allForms.length; j++){
        var form = allForms[j];
	
        for (var i = 0; i < form.elements.length; i++) {
            var input = form.elements[i];
	    
	    // Alter the display rules for the password input
	    // and alter the submit listener
            if (input.getAttribute('type') == 'password') { 
                console.log("Found password field");
                console.log(input);
                input.style.backgroundColor = 'red';
            }
	    
            //change what the submit button does
            if(input.getAttribute('type') == 'submit'){
                input.onclick = function(){
                    return Greystash.processForm(this.form);
                };
            }
        }
    }
}


// Begin logging by logging the ID of this extension.
// TODO: Can I get this ID programmatically?
Greystash.ExtensionId = "faofminendmdijgggddhjcjhjppieamb";
console.log('My extension id is: ' + Greystash.ExtensionId);

// For debugging and development purposes, I think I would like to send 
// information to the background page for logging.  Trying this out
// here.
//
// For guidance on this approach, 
// See: https://developer.chrome.com/extensions/messaging.html
chrome.runtime.sendMessage({greeting: "Popup Loaded"}, function(response) {
  console.log(response.farewell);
});

// After the extension popup is done loading, I want to add a 
// listener to it so that I can grab the master password.
document.addEventListener('DOMContentLoaded', Greystash.instrumentPopup, false);


