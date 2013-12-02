/*
 * contentScript.js
 *
 * The content script initially injects an icon into the password field and
 * attaches an event listener to the page’s form submit button.  Once a 
 * secure password has been generated, the content script can submit the login
 * form with the secure password to the website.
 *
 * @author Kyle DeFrancia, Joey Devlin, Erik Paulson, Tanya Crenshaw
 * @version 11/21/2013
 */

// Create a namespace for this extension.
var greystash = greystash || {};


/*
 * initInjection()
 * 
 * Find password fields and attach a Greystash icon to them.  Find the form
 * submit button and attach a listener to it. 
 *
 * Green is default icon to insert, but check if there are multiple password
 * fields and if there is a stale password for this site to try and guess when
 * we should insert a yellow icon instead.
 * 
 * This code runs when the background page detects a page has been loaded in
 * the browser.
 */
greystash.initInjection = function() { 

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
                    return greystash.processForm(this.form);
                };
            }
        }
    }
}


/*
 * processForm()
 * 
 * Handles submitting a form to a web site.  First the form is cloned
 * and all the required parameters to generate a secure password are gathered:
 * the canonical URL, the typed password, and the extension password.
 *
 * A secure password is then generated, input into the dummy form and
 * submitted to the web site.
 *
 * @param form The login form being submitted
 */
greystash.processForm = function(form) {
    console.log(form);
    var typedPass = "";
    //grab typed password
    for(var obj = 0; obj < form.elements.length; obj++){
        var unit = form.elements[obj];
        //edit password field with new password
		if (unit.getAttribute('type') == 'password') {
            typedPass = unit.value;
        }
    }

    //for now assume we are only talking about a static extension password
    greystash.getExtPass(function(response){
        //get all the parts to make a password
        var extPass = response.farewell;
        var url = greystash.getCanonicalURL();

        //print for debug
        console.log("extPass: " + extPass);
        console.log("url: " + url);
        console.log("typed: " + typedPass);
    
        var genPass = greystash.generatePassword(url,typedPass,extPass);

        //now would inject new password into the form

        //send the form with new password
        form.submit();
    });
    return false;//makes it so we don't submit before we are ready
}


/*
 * changeIcon()
 *
 * Iterates the Greystash icon attached to a password field to the next icon
 * according to the order: Green, Yellow, Red.
 *
 * The three icons are:
 *  Green: this is the 'on' icon.  Password fields with this icon will
 *         transform the user input into a generated password using the
 *         extension password.
 *
 *  Yellow: this is the 'old password' icon.  Password fields with this icon
 *          will transform the user input into a generated password but using
 *          the stale password associated with the site.
 *
 *          NOTE: this icon is only available if there is currently a stale
 *                password associated with the site.
 *
 *  Red: this is the 'off' icon.  Password fields with this icon will not have
 *       the user input changed into a generated password and will be submitted
 *       to the website as typed by the user.
 *
 * @param password The password field whose icon is to be changed
 */
greystash.changeIcon = function(password) {
}


/*
 * checkStale()
 *
 * Checks if the given URL has a stale password associated with it.
 *
 * @param url The url of the web site to check
 *
 * @return True is a stale password exists, false if not.
 */
greystash.checkStale = function(url) {
    return true;
}


/*
 * confirmStalePassChange()
 *
 * Has the user confirm if they just changed their password on the web site
 * by prompting them with an alert box.
 * 
 * If the user confirms they changed a password, a message is sent to the
 * background page to update the stale state of the web site.
 */
greystash.confirmStalePassChange = function() {
    alert('Did you change your password yet??');
}


// Begin logging by logging the ID of this extension.
greystash.ExtensionId = chrome.runtime.id;
console.log('My extension id is: ' + greystash.ExtensionId);