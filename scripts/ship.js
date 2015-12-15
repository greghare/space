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

    console.log("startFlyingAgain()");
    moveShipForward();
	shipEnabled = true;
	document.getElementsByClassName("trivia")[0].style.marginTop = "30em";

}

// Move the ship away from the planet
function moveShipForward() {

    var away;

    if(planet == 1) {
        away = 10;
    } else if(planet == 3) {
        away = 30;
    } else {
        away = 25;
    }

	var position = camera.position;
	var planetTween = new TWEEN.Tween(position)
		.to({
			x: camera.position.x - away,
		}, 2000)
		.onUpdate(function() {
			camera.position.x = position.x;
		})
		.start();

}
