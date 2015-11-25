var sFactor = 0.0001;   // speed factor    (lower = faster rotation)
var rFactor = 0.0001; 	// radius factor   (lower = smaller size)
var dFactor = 0.000001; // distance factor (lower = less distance)
var au = 92955807;	   	// distance from earth to sun in miles (used for scale)

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
function Planet(mesh, radius, speed, distance, atmColor) {

	this.mesh = mesh;
	this.radius = radius;
	this.scale = radius * rFactor;
	this.speed = speed * sFactor;

	scene.add(this.mesh);
	this.mesh.scale.set(this.scale, this.scale, this.scale);
	console.log(distance*au*dFactor);
    this.mesh.position.set(distance * au * dFactor, 0, 0);

	rotatePlanet(this.mesh, this.speed);

	if(atmColor !== 0)
	{
		var glowColor = new THREE.Color(atmColor);
		var atmG = mesh.geometry.clone();
		var atmM = THREEx.createAtmosphereMaterial();
		atmM.uniforms.glowColor.value = glowColor;
		var atm = new THREE.Mesh(atmG, atmM );
		atm.scale.multiplyScalar(this.scale * 1.04);
		atm.position.set(distance * au * dFactor, 0, 0);
		scene.add( atm );
	}

	this.getScale = function() { return this.scale; };
	this.getRadius = function() { return this.radius; };
	this.getMesh = function() { return this.mesh; };
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
