var scene;
var camera;
var renderer;
var controls;
var updateFcts = [];
var keyboard = new THREEx.KeyboardState();

var clock = new THREE.Clock();

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
	camera.position.set(0, 0, 150);
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
	light.position.set(5, 5, 5);
	scene.add(light);
	light.castShadow = true;
	light.shadowCameraNear = 0.01;
	light.shadowCameraFar = 15;
	light.shadowCameraFov = 45;
	light.shadowCameraLeft = -1;
	light.shadowCameraRight = 1;
	light.shadowCameraTop = 1;
	light.shadowCameraBottom = -1;
	// light.shadowCameraVisible = true
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
	moon = new Planet(THREEx.Planets.createMoon(), 1079, 2592000000, 1 + 0.00256, 0, 0);
	mars = new Planet(THREEx.Planets.createMars(), 2106, 88740000, 1.52, 0, 0);

	render();
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

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

	var minDist = Math.min(dSun, dMercury, dVenus, dEarth, dMoon, dMars);

	// console.log(moon.getMesh().position);

		// console.log("dPlanet = " + dPlanet);
		// console.log("dSun = " + dSun);
		// console.log("dMercury = " + dMercury);
		// console.log("dVenus = " + dVenus);
		// console.log("dEarth = " + dEarth);
		// console.log("dMoon = " + dMoon);

	// console.log("dSun " + dSun);
	// console.log("dPlanet " + dPlanet);
	// console.log("Scale " + sun.getScale());

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
	// else
	// {
	// 	d = dPlanet - 1.01;
	// }

	controls.movementSpeed = 0.33 * d;
	controls.update( delta );
}

function animate() {

	// sun.getMesh().position.x += Math.sin(90)*0.01;
    // sun.getMesh().position.y = 0;

	slowNearPlanets();

	TWEEN.update();
}

function render() {
	requestAnimationFrame(render);

	animate();


	renderer.render(scene, camera);
}

window.onload = init;
