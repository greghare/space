function Ship() {

    this.engineOn = false;

    this.startEngine = function() {
        if(!rocket.isPlaying)
            rocket.play();

        this.engineOn = true;
    };

    this.stopEngine = function() {

        if(rocket.isPlaying)
            rocket.pause();

        this.engineOn = false;
    };

    this.toggleEngine = function() {

        if(this.engineOn === false)
			this.startEngine();
		else if(this.engineOn === true)
			this.stopEngine();

    };

}

function startFlyingAgain() {

    moveShipBack();
	shipEnabled = true;
	document.getElementsByClassName("trivia")[0].style.marginTop = "20em";
	console.log("Correct! you can move again " + (controls.movementSpeed = 0.33 * d));

}

// Move the ship away from the planet
function moveShipBack() {

	var position = camera.position;
	var planetTween = new TWEEN.Tween(position)
		.to({
			x: camera.position.x - 25,
			z: camera.position.z
		}, 500)
		.onUpdate(function() {
			camera.position.x = position.x;
			camera.position.z = position.z;
		})
		.start();

}
