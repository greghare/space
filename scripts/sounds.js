
// Path to sounds
var basePath = "sounds/";

// File names
var rocket;

function loadSounds() {

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
