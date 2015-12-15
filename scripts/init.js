var scene;
var camera;
var renderer;
var controls;
var updateFcts = [];

var gameIsOver = false;
var gameIsPaused = true;
var gameIsWon = false;

var freeFlight = false;

var qdb;

var dFactor = 0.000002; // distance factor (lower = less distance)
var au = 92955807;	   	// distance from earth to sun in miles (used for scale)

var clock = new THREE.Clock();

var ship = new Ship();
var fuel = 100;
var shipEnabled = false;
var controlsEnabled = false;
var usingFuel = false;

var originalX, originalZ;

var sun, mercury, venus, earth, moon, mars,
	jupiter, saturn, uranus, neptune, pluto;

var d, dPlanet, dSun, dMercury, dVenus, dEarth, dMoon,
	dMars, dJupiter, dSaturn, dUranus, dNeptune, dPluto;

var	dSunVec = new THREE.Vector3(),
	dMercuryVec = new THREE.Vector3(),
	dVenusVec = new THREE.Vector3(),
	dEarthVec = new THREE.Vector3(),
 	dMoonVec = new THREE.Vector3(),
	dMarsVec = new THREE.Vector3(),
	dJupiterVec = new THREE.Vector3(),
	dSaturnVec = new THREE.Vector3(),
	dUranusVec = new THREE.Vector3(),
	dNeptuneVec = new THREE.Vector3(),
	dPlutoVec = new THREE.Vector3();

var visited = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function init() {
	// Create the THREE.js scene
	scene = new THREE.Scene();

	// Create the camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 15000);
	camera.position.set(39.51 * au * dFactor, 0, 0);
//	camera.rotation.set(10, 0, 0);
// 	camera.up.set( 0, 0, 1 );
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	controls = new THREE.FlyControls( camera );
	controls.movementSpeed = 1000;
	controls.rollSpeed = Math.PI / 24;
	controls.autoForward = false;
	controls.dragToLook = true;

	// Create the render
	renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(0x000000, 1);
	document.body.appendChild(renderer.domElement);

	// Resize renderer and adjust camera aspect
	window.addEventListener('resize', onWindowResize, false);

	var ambLight = new THREE.AmbientLight(0x888888);
	scene.add(ambLight);

	var light = new THREE.DirectionalLight(0xcccccc, 1);
	light.position.set(-5, 0, 0);
	scene.add(light);
	light.castShadow = true;
	light.shadowCameraNear = 0.01;
	light.shadowCameraFar = 1000;
	light.shadowCameraFov = 45;
	light.shadowCameraLeft = -1;
	light.shadowCameraRight = 1;
	light.shadowCameraTop = 1;
	light.shadowCameraBottom = -1;
	// light.shadowCameraVisible = true;
	light.shadowBias = 0.001;
	light.shadowDarkness = 0.2;
	light.shadowMapWidth = 1024;
	light.shadowMapHeight = 1024;

	addStarfield();

	// mesh, radius (in miles), full rotation time (in milliseconds), x position, atmosphere color (optional)
	sun = new Planet(THREEx.Planets.createSun(), 432376, 2160000000, 0, 0xFFD82B, 0xFFD82B);
	mercury = new Planet(THREEx.Planets.createMercury(), 1516, 15120000000, 0.387, 0, 0);
	venus = new Planet(THREEx.Planets.createVenus(), 3760, 10087000000, 0.722, 0, 0);
	earth = new Planet(THREEx.Planets.createEarth(), 3959, 86400000, 1, 0x2B95FF, 0);
		addClouds(3959, 86400000, 1);
	moon = new Planet(THREEx.Planets.createMoon(), 1079, 2592000000, 1 + 0.00256, 0, 0);
	originalX = moon.getMesh().position.x;
	originalZ = moon.getMesh().position.z;
	mars = new Planet(THREEx.Planets.createMars(), 2106, 88740000, 1.52, 0, 0);
	jupiter = new Planet(THREEx.Planets.createJupiter(), 43441, 35700000, 5.203, 0, 0);
	saturn = new Planet(THREEx.Planets.createSaturn(), 36184, 37920000, 9.572, 0, 0);
	saturn.getMesh().rotation.set(-0.3, 0, 0);
		addSaturnRing(36184, 9.572);
	uranus = new Planet(THREEx.Planets.createUranus(), 15759, 62040000, 19.194, 0, 0);
	uranus.getMesh().rotation.set(-0.3, 0, 0);
		addUranusRing(15759, 19.194);
	neptune = new Planet(THREEx.Planets.createNeptune(), 15299, 57996000, 30.066, 0, 0);
	pluto = new Planet(THREEx.Planets.createPluto(), 736, 551820000, 39.5, 0, 0);

	loadSounds();

	var questions = loadQuestions("questions.json", function() {
		console.log(this);
		qdb = this;
	});

	bindKeys();

	document.getElementById("ans-a").addEventListener("click", function() { submitAnswer("a"); }, false);
	document.getElementById("ans-b").addEventListener("click", function() { submitAnswer("b"); }, false);
	document.getElementById("ans-c").addEventListener("click", function() { submitAnswer("c"); }, false);
	document.getElementById("ans-d").addEventListener("click", function() { submitAnswer("d"); }, false);

	render();
}

function bindKeys() {

	Mousetrap.bind('space', function() {
		if(gameIsWon === true) {
			freeFlight = true;
			usingFuel = true;
			fuel = 100;
			updateFuel();

			shipEnabled = true;
			controlsEnabled = true;
			spaceshipAmbient.play().fadeIn(0.5, 2000);

			var youWonBox = document.getElementsByClassName("youWon")[0];
			youWonBox.style.opacity = "0.0";
			setTimeout ( function() {
				youWonBox.style.display = "none";
			}, 500 );
		}
	});

	// Pause game
	Mousetrap.bind('p', function() {
		if(gameIsPaused) {
			startGame();
		} else {
			pauseGame();
		}
	});

	// Demo Speed
	Mousetrap.bind('b', function() {
		fSpeedFactor = 0.88;
	});
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function orbitAroundSun(mesh, distance) {

	var radius = distance*au*dFactor;
	var dd = 0.2;
	var newX, newZ;
	var angle = 0;

	angle += Math.acos(1-Math.pow(dd/radius,2)/2);

	// calculate the new ball.x / ball.y
	newX = radius * Math.cos(angle);
	newZ = radius * Math.sin(angle);

	mesh.position.x = newX;
	mesh.position.z = newZ;
}

var radius = 0.00256 * au * dFactor;
var dd = 0.002;
var newX, newZ;
var angle = 0;

function moonOrbit() {

	angle += Math.acos(1 - Math.pow(dd/radius, 2) / 2);
	newX = originalX + radius * Math.cos(angle) - 0.00256 - 0.5;
	newZ = originalZ + radius * Math.sin(angle);

	moon.getMesh().position.x = newX;
	moon.getMesh().position.z = newZ;

}

function startGame() {

	popup.play();

	var welcomeBox = document.getElementsByClassName("welcome")[0];
	welcomeBox.style.opacity = "0.0";
	setTimeout ( function() {
		welcomeBox.style.display = "none";
	}, 500 );

	gameIsPaused = false;
	shipEnabled = true;
	controlsEnabled = true;

	if(!freeFlight)
		usingFuel = true;

	music.play();
	spaceshipAmbient.play().fadeIn(0.5, 2000);
}

function pauseGame() {

	popup.play();

	var welcomeBox = document.getElementsByClassName("welcome")[0];
	welcomeBox.style.display = "block";
	setTimeout ( function() {
		welcomeBox.style.opacity = "1.0";
	}, 200 );

	gameIsPaused = true;
	shipEnabled = false;
	controlsEnabled = false;
	usingFuel = false;
	music.pause();
	spaceshipAmbient.fadeOut(0, 2000);
}

function gameOver() {

	var gameOverBox = document.getElementsByClassName("gameOver")[0];
	gameOverBox.style.display = "block";

	setTimeout ( function() {
		gameOverBox.style.opacity = "1.0";
	}, 100 );

	gameIsOver = true;
	music.stop();
}

function gameWon() {
	var youWinBox = document.getElementsByClassName("youWin")[0];
	youWinBox.style.display = "block";

	setTimeout ( function() {
		youWinBox.style.opacity = "1.0";
	}, 100 );

	gameIsWon = true;
	gameIsOver = true;
}

function animate() {

	if(!gameIsOver && !gameIsPaused) {

		updateHud();

		if(controlsEnabled)
			slowNearPlanets();

		moonOrbit();

		if(usingFuel)
			updateFuel();

		TWEEN.update();
	}
}

function render() {
	requestAnimationFrame(render);

	animate();

	renderer.render(scene, camera);
}

window.onload = init;
