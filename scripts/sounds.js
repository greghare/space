
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
}
