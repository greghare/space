function updateHud() {
	document.getElementById("xPos").innerHTML = Math.floor(camera.position.x);
	document.getElementById("zPos").innerHTML = Math.floor(camera.position.z);
	document.getElementById("yPos").innerHTML = Math.floor(camera.position.y);
	document.getElementById("level").innerHTML = Math.floor(camera.rotation.z);
	document.getElementById("distance").innerHTML = Math.floor(d);
}
