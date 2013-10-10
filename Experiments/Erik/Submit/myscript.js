var buttons = document.getElementsByTagName("button");
var textFields = document.getElementsByTagName("input");
var forms = document.getElementsByTagName("form");

function doSubmit() {
   console.log("Made it to doSubmit");
   for (var j = 0; j < textFields.length; j++){
      if (textFields[j].type == "password") {
         textFields[j].value = textFields[j].value + "123";
      }
   }
   return true;         
}

for (var i = 0; i < forms.length; i++){
   for (var k = 0; k < forms[i].elements.length; k++) {
      if (forms[i].elements[k].type == "password") {
         forms[i].addEventListener("submit", doSubmit);
      }
   }
/*
   if (buttons[i].type == "submit") {
      console.log(buttons[i]);
      buttons[i].addEventListener("click", doSubmit); 
   }
*/
}
