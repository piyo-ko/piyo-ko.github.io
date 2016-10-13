function toggle (targetID) {
	if (document.getElementById(targetID).style.display=="none") {
		document.getElementById(targetID).style.display="inline";
	} else {
		document.getElementById(targetID).style.display="none";
	}
}
