var buttons = document.getElementsByTagName("button");
var textFields = document.getElementsByTagName("input");
buttons[0].addEventListener("click", function() {
	localStorage["inputText"] = textFields[0].value;
	console.log("Input saved to local storage", localStorage["inputText"]);
});
