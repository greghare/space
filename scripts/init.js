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
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.001, 11000);
	camera.position.set(0, 0, 100);
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
	sun = new Planet(THREEx.Planets.createSun(), 432376, 2160000000, 0, 0xFFD82B);
	mercury = new Planet(THREEx.Planets.createMercury(), 1516, 15120000000, 0.387, 0);
	venus = new Planet(THREEx.Planets.createVenus(), 3760, 10087000000, 0.722, 0);
	earth = new Planet(THREEx.Planets.createEarth(), 3959, 86400000, 1, 0x2B95FF);
	moon = new Planet(THREEx.Planets.createMoon(), 1079, 2592000000, 1 + 0.00256, 0);
	earth = new Planet(THREEx.Planets.createEarth(), 3959, 86400000, 1, 0);

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

	dSun = dSunVec.subVectors( camera.position, sun.getMesh().position ).length();
	dMercury = dMercuryVec.subVectors( camera.position, mercury.getMesh().position ).length();
	dVenus = dVenusVec.subVectors( camera.position, venus.getMesh().position ).length();
	dEarth = dEarthVec.subVectors( camera.position, earth.getMesh().position ).length();
	dMoon = dMoonVec.subVectors( camera.position, moon.getMesh().position ).length();

	if( dSun < dPlanet )
	{
		d = ( dSun - sun.getRadius() * sun.getScale() * 1.01 );
	}
	else if( dMercury < dPlanet )
	{
		d = ( dMercury - mercury.getRadius() * mercury.getScale() * 1.01 );
	}
	else if( dVenus < dPlanet )
	{
		d = ( dVenus - venus.getRadius() * venus.getScale() * 1.01 );
	}
	else if( dEarth < dPlanet )
	{
		d = ( dEarth - earth.getRadius() * earth.getScale() * 1.01 );
	}
	else if( dMoon < dPlanet )
	{
		d = ( dMoon - moon.getRadius() * moon.getScale() * 1.01 );
	}
	else
	{
		d = ( dPlanet - 1.01 );
	}

	controls.movementSpeed = 0.33 * d;
	controls.update( delta );
}

function animate() {

	slowNearPlanets();

	TWEEN.update();
}

function render() {
	requestAnimationFrame(render);

	animate();


	renderer.render(scene, camera);
}

window.onload = init;
