
// Path to sounds
var basePath = "sounds/";

// File names
var rocket;

function loadSounds() {
    // rocket = new Audio(basePath + "rocket2.mp3");
    rocket = new Howl({
        urls: [basePath + 'rocket4.mp3'],
        loop: true,
        onplay: function() {
            this.isPlaying = true;
        },
        onend: function() {
            this.isPlaying = false;
        },
        onpause: function() {
            this.isPlaying = false;
        }
    });

    music = new Howl({
        urls: [basePath + 'FromUnderAVision.mp3'],
        loop: true
    });

    spaceshipAmbient = new Howl({
        urls: [basePath + 'airplane-interior-2.mp3'],
        loop: true,
        volume: 0.5
    });

    bell = new Howl({
        urls: [basePath + 'small-bell-ring-01a.mp3']
    });

    error = new Howl({
        urls: [basePath + 'button-10.mp3']
    });

    popup = new Howl({
        urls: [basePath + 'button-27.mp3']
    });

}
