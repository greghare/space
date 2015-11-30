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
