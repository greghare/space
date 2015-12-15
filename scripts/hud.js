function updateHud() {
	document.getElementById("xPos").innerHTML = Math.floor(camera.position.x);
	document.getElementById("zPos").innerHTML = Math.floor(camera.position.z);
	document.getElementById("yPos").innerHTML = Math.floor(camera.position.y);
	document.getElementById("level").innerHTML = Math.floor(camera.rotation.z);
	document.getElementById("distance").innerHTML = Math.floor(d);
}

function updateFuel() {
	fuel -= 0.01;
	document.getElementsByClassName("fuel")[0].style.height = fuel + "%";
	document.getElementsByClassName("fuel-value")[0].innerHTML = Math.floor(fuel);

	if(fuel < 1) {
		gameOver();
	}
}
