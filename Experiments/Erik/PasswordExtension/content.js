console.log("Made it to the content script.\n");
var passwords = document.getElementsByTagName("input");
if (passwords != null && passwords != undefined)
   chrome.extension.sendMessage("show_page_action");
for (var i = 0; i < passwords.length; i++){
   if (passwords[i].type == "password")
        passwords[i].style.backgroundColor = "red";
}
