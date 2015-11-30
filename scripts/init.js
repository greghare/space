var scene;
var camera;
var renderer;
var controls;
var updateFcts = [];

var dFactor = 0.000002; // distance factor (lower = less distance)
var au = 92955807;	   	// distance from earth to sun in miles (used for scale)

var clock = new THREE.Clock();

var ship = new Ship();

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

function init() {
	// Create the THREE.js scene
	scene = new THREE.Scene();

	// Create the camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 20000);
	camera.position.set(0 * au * dFactor, 0, 150);
	// camera.rotation.set(10, 0, 0);
 	// camera.up.set( 0, 0, 1 );
	//camera.lookAt(new THREE.Vector3(0, 0, 0));
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
	light.position.set(5, 0, 0);
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
	bindKeys();

	render();
}

function bindKeys() {

	Mousetrap.bind('space', function() {
		if(ship.engineOn === false)
			ship.startEngine();
		else if(ship.engineOn === true)
			ship.stopEngine();
	});
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function updateHud() {
	document.getElementById("xPos").innerHTML = Math.floor(camera.position.x);
	document.getElementById("zPos").innerHTML = Math.floor(camera.position.z);
	document.getElementById("yPos").innerHTML = Math.floor(camera.position.y);
	document.getElementById("level").innerHTML = Math.floor(camera.rotation.z);
	document.getElementById("distance").innerHTML = Math.floor(d);
}

function slowNearPlanets() {

	var delta = clock.getDelta();

	dPlanet = camera.position.length();


	var dist = [];

	dSunVec.subVectors( camera.position, sun.getMesh().position );
	dSun = dSunVec.length();

	dMercuryVec.subVectors( camera.position, mercury.getMesh().position );
	dMercury = dMercuryVec.length();

	dVenusVec.subVectors( camera.position, venus.getMesh().position );
	dVenus = dVenusVec.length();

	dEarthVec.subVectors( camera.position, earth.getMesh().position );
	dEarth = dEarthVec.length();

	dMoonVec.subVectors( camera.position, moon.getMesh().position );
	dMoon = dMoonVec.length();

	dMarsVec.subVectors( camera.position, mars.getMesh().position );
	dMars = dMarsVec.length();

	dJupiterVec.subVectors( camera.position, jupiter.getMesh().position );
	dJupiter = dJupiterVec.length();

	dSaturnVec.subVectors( camera.position, saturn.getMesh().position );
	dSaturn = dSaturnVec.length();

	dUranusVec.subVectors( camera.position, uranus.getMesh().position );
	dUranus = dUranusVec.length();

	dNeptuneVec.subVectors( camera.position, neptune.getMesh().position );
	dNeptune = dNeptuneVec.length();

	dPlutoVec.subVectors( camera.position, pluto.getMesh().position );
	dPluto = dPlutoVec.length();

	var minDist = Math.min(dSun, dMercury, dVenus, dEarth, dMoon, dMars, dJupiter, dSaturn, dUranus, dNeptune, dPluto);

	if( dSun == minDist && dSun <= dPlanet )
	{
		// console.log("dSun < dPlanet");
		d = ( dSun - sun.getScale() * 1.01 );
	}
	else if( dMercury == minDist && dMercury <= dPlanet )
	{
		// console.log("dMercury < dPlanet");
		d = ( dMercury - mercury.getScale() * 1.01 );
	}
	else if( dVenus == minDist && dVenus <= dPlanet )
	{
		// console.log("dVenus < dPlanet");
		d = ( dVenus - venus.getScale() * 1.01 );
	}
	else if( dEarth == minDist && dEarth <= dPlanet )
	{
		// console.log("dEarth < dPlanet");
		d = ( dEarth - earth.getScale() * 1.01 );
	}
	else if( dMoon == minDist && dMoon <= dPlanet )
	{
		// console.log("dMoon < dPlanet");
		d = ( dMoon - moon.getScale() * 1.01 );
	}
	else if( dMars == minDist && dMars <= dPlanet )
	{
		d = ( dMars - mars.getScale() * 1.01 );
	}
	else if( dJupiter == minDist && dJupiter <= dPlanet )
	{
		d = ( dJupiter - jupiter.getScale() * 1.01 );
	}
	else if( dSaturn == minDist && dSaturn <= dPlanet )
	{
		d = ( dSaturn - saturn.getScale() * 1.01 );
	}
	else if( dUranus == minDist && dUranus <= dPlanet )
	{
		d = ( dUranus - uranus.getScale() * 1.01 );
	}
	else if( dNeptune == minDist && dUranus <= dPlanet )
	{
		d = ( dNeptune - neptune.getScale() * 1.01 );
	}
	else if( dPluto == minDist && dPluto <= dPlanet )
	{
		d = ( dPluto - pluto.getScale() * 1.01 );
	}

	controls.movementSpeed = 0.33 * d;
	controls.update( delta );
}

function orbitAroundSun(mesh, distance) {

	var radius = distance*au*dFactor;
	var dd = 0.2;
	var newX, newY;
	var angle = 0;

	angle += Math.acos(1-Math.pow(dd/radius,2)/2);

	// calculate the new ball.x / ball.y
	newX = radius * Math.cos(angle);
	newZ = radius * Math.sin(angle);

	mesh.position.x = newX;
	mesh.position.z = newZ;
}

function animate() {

	// sun.getMesh().position.x += Math.sin(90)*0.01;
    // sun.getMesh().position.y = 0;

	updateHud();
	slowNearPlanets();

	TWEEN.update();
}

function render() {
	requestAnimationFrame(render);

	animate();

	renderer.render(scene, camera);
}

window.onload = init;
