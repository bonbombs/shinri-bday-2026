const key = "77656c6f76657368696e7269";
const encoded = "5c585f15420b571217555a5c5a51164f574d531751535a5544175450550c5b0317524454505c584b"
const form = document.getElementById("form");
let attempts = 0;
document.addEventListener("DOMContentLoaded", function() {
    const input = sessionStorage.getItem("dt-secret") ?? "";
    checkPassword(input);
})
form.addEventListener("submit", (e) => {
	e.preventDefault();
	const data = new FormData(e.target);
	checkPassword(data.get("secret").toLowerCase());
})

function checkPassword (input) {
    if (input == "") return;
    if (XORCipher.encode(key, input) === encoded) {
        sessionStorage.setItem("dt-secret", input)
		document.getElementById("gate").style.display = "none";
		document.getElementById("table").style.display = null;
	}
    else {
        attempts++;
        if (attempts > 3) {
            document.getElementById("hint").innerHTML = "<i>Password incorrect. Try again.</i><p>Hint: Try looking for the puzzles throughout the site.</p>"
        }
        else {
            document.getElementById("hint").innerHTML = "<i>Password incorrect. Try again.</i>"
        }
    }
}