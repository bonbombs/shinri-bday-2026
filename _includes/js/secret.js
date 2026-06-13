const key = "77656c6f76657368696e7269";
const encoded = "5c585f15420b571217555a5c5a51164f574d531751535a5544175450550c5b0317524454505c584b"
let attempts = 0;
function checkPassword (input) {
    if (input == "") return;
    if (XORCipher.encode(key, input) === encoded) {
        sessionStorage.setItem("dt-secret", input)
		// document.getElementById("gate").style.display = "none";
		// document.getElementById("table").style.display = null;
        return true;
	}
    else {
        attempts++;
        if (attempts > 3) {
            document.getElementById("hint").innerHTML = "<i>Password incorrect. Try again.</i><p><a href='/hint'>Hint: Try looking for the puzzles throughout the site.</a></p>"
        }
        else {
            document.getElementById("hint").innerHTML = "<i>Password incorrect. Try again.</i>"
        }
        if (location.pathname != "/category/password-protected/") {
            location.pathname = "/category/password-protected/";
        }
        return false;
    }
}