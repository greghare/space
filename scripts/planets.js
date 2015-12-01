var sFactor = 0.0001;   // speed factor    (lower = faster rotation)
var rFactor = 0.0001; 	// radius factor   (lower = smaller size)
var dFactor = 0.000002; // distance factor (lower = less distance)
var au = 92955807;	   	// distance from earth to sun in miles (used for scale)
var planetName = "";

// Adds a starfield earth to the scene
function addStarfield() {
	var starfield = THREEx.Planets.createStarfield();
	scene.add(starfield);
    starfield.scale.set(100, 100, 100);
}

// Creates a planet with the given mesh
// Planet will be scaled to radius*rFactor
// Planet will rotate at speed in milliseconds
// Planet will be placed at x = distance, y = 0, z = 0
// Planet will have an atmosphere with atmColor (if 0, there will be no atmosphere)
// Planet will have a fading glowColor around it (if 0, there will be no glow)
function Planet(mesh, radius, speed, distance, atmColor, glowColor) {

	this.mesh = mesh;
	this.radius = radius;
	this.scale = radius * rFactor;
	this.speed = speed * sFactor;

	scene.add(this.mesh);
	this.mesh.scale.set(this.scale, this.scale, this.scale);
    this.mesh.position.set(distance * au * dFactor, 0, 0);

	rotatePlanet(this.mesh, this.speed);

	// If not the moon
	if(mesh.material.map.sourceFile != "images/planets/moonmap1k.jpg")
	{
		var rotPathG = new THREE.CylinderGeometry( distance * au * dFactor, distance * au * dFactor, 0.1, 256, 1, true, 0, 6.2 );
		var rotPathM = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
		var rotPath = new THREE.Mesh( rotPathG, rotPathM );
		rotPath.rotation.set(0, Math.PI / 2 + 0.04, 0);
		scene.add( rotPath );
	}

	// If an atomosphere color was set
	if(atmColor !== 0)
	{
		var atmGlowColor = new THREE.Color(atmColor);
		var atmG = mesh.geometry.clone();
		var atmM = THREEx.createAtmosphereMaterial();
		atmM.uniforms.glowColor.value = atmGlowColor;
		var atm = new THREE.Mesh(atmG, atmM );
		atm.scale.multiplyScalar(this.scale * 1.04);
		atm.position.set(distance * au * dFactor, 0, 0);
		scene.add( atm );
	}

	// If a glow color was set
	if(glowColor !== 0)
	{
		var spriteMaterial = new THREE.SpriteMaterial(
		{
			map: new THREE.ImageUtils.loadTexture( 'images/glow.png' ),
			color: glowColor, transparent: false, blending: THREE.AdditiveBlending
		});
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(2, 2, 1.0);
		mesh.add(sprite); // this centers the glow at the mesh
	}

	this.getScale = function() { return this.scale; };
	this.getRadius = function() { return this.radius; };
	this.getMesh = function() { return this.mesh; };
}

function addClouds(radius, speed, distance) {
	var cloud = THREEx.Planets.createEarthCloud();
	var scale = radius * rFactor;
	cloud.scale.set(scale, scale, scale);
	cloud.position.set(distance * au * dFactor, 0, 0);
	scene.add(cloud);
	speed = speed * sFactor * 1.3;
	rotatePlanet(cloud, speed);
}

function addSaturnRing(radius, distance) {
	var ring = THREEx.Planets.createSaturnRing();
	ring.receiveShadow = true;
	ring.castShadow = true;
	var scale = radius * rFactor;
	ring.scale.set(scale, scale, scale);
	ring.position.set(distance * au * dFactor, 0, 0);
	scene.add(ring);
}

function addUranusRing(radius, distance) {
	var ring = THREEx.Planets.createUranusRing();
	ring.receiveShadow = true;
	ring.castShadow = true;
	var scale = radius * rFactor;
	ring.scale.set(scale, scale, scale);
	ring.position.set(distance * au * dFactor, 0, 0);
	scene.add(ring);
}

function slowNearPlanets() {

	var delta = clock.getDelta();

	dPlanet = camera.position.length();

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
		shipEnabled = (d / sun.getRadius() <= 0.00004) ? false : true;
		planetName = "the Sun";
	}
	else if( dMercury == minDist && dMercury <= dPlanet )
	{
		// console.log("dMercury < dPlanet");
		d = ( dMercury - mercury.getScale() * 1.01 );
		shipEnabled = (d / mercury.getRadius() <= 0.00004) ? false : true;
		planetName = "Mercury";
	}
	else if( dVenus == minDist && dVenus <= dPlanet )
	{
		// console.log("dVenus < dPlanet");
		d = ( dVenus - venus.getScale() * 1.01 );
		shipEnabled = (d / venus.getRadius() <= 0.00004) ? false : true;
		planetName = "Venus";
	}
	else if( dEarth == minDist && dEarth <= dPlanet )
	{
		// console.log("dEarth < dPlanet");
		d = ( dEarth - earth.getScale() * 1.01 );
		shipEnabled = (d / earth.getRadius() <= 0.00004) ? false : true;
		planetName = "Earth";
	}
	else if( dMoon == minDist && dMoon <= dPlanet )
	{
		// console.log("dMoon < dPlanet");
		d = ( dMoon - moon.getScale() * 1.01 );
		shipEnabled = (d / moon.getRadius() <= 0.00004) ? false : true;
		planetName = "the Moon";
	}
	else if( dMars == minDist && dMars <= dPlanet )
	{
		d = ( dMars - mars.getScale() * 1.01 );
		shipEnabled = (d / mars.getRadius() <= 0.00004) ? false : true;
		planetName = "Mars";
	}
	else if( dJupiter == minDist && dJupiter <= dPlanet )
	{
		d = ( dJupiter - jupiter.getScale() * 1.01 );
		shipEnabled = (d / jupiter.getRadius() <= 0.00004) ? false : true;
		planetName = "Jupiter";
	}
	else if( dSaturn == minDist && dSaturn <= dPlanet )
	{
		d = ( dSaturn - saturn.getScale() * 1.01 );
		shipEnabled = (d / saturn.getRadius() <= 0.00004) ? false : true;
		planetName = "Saturn";
	}
	else if( dUranus == minDist && dUranus <= dPlanet )
	{
		d = ( dUranus - uranus.getScale() * 1.01 );
		shipEnabled = (d / uranus.getRadius() <= 0.00004) ? false : true;
		planetName = "Uranus";
	}
	else if( dNeptune == minDist && dUranus <= dPlanet )
	{
		d = ( dNeptune - neptune.getScale() * 1.01 );
		shipEnabled = (d / neptune.getRadius() <= 0.00004) ? false : true;
		planetName = "Neptune";
	}
	else if( dPluto == minDist && dPluto <= dPlanet )
	{
		d = ( dPluto - pluto.getScale() * 1.01 );
		shipEnabled = (d / pluto.getRadius() <= 0.00004) ? false : true;
		planetName = "Pluto";
	}

	// console.log(d);

	if(shipEnabled === true) {
		document.getElementById("approaching").innerHTML = "Approaching " + planetName;
		controls.movementSpeed = 0.33 * d;
	} else {
		controls.movementSpeed = 0;
		document.getElementById("trivia-title").innerHTML = "Welcome to " + planetName + "!";
		document.getElementsByClassName("trivia")[0].style.marginTop = "-12em";
	}

	controls.update( delta );
}

// Rotate a given planet at the specified speed (in milliseconds)
function rotatePlanet(planet, speed) {
    var rotation = planet.rotation;
    var planetTween = new TWEEN.Tween(rotation)
        .to({
            y: "-" + Math.PI / 2
        }, speed)
        .onUpdate(function() {
            planet.rotation.y = rotation.y;
        })
        .onComplete(function() {
            if (Math.abs(planet.rotation.y) >= 2 * Math.PI) {
                planet.rotation.y = planet.rotation.y % (2 * Math.PI);
            }
        })
        .repeat(Infinity)
        .start();
}
