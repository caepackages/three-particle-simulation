# three-particle-simulation

## NPM

```
npm i three
npm install three-orbitcontrols
npm i three-particle-simulation
```

## Example

```javascript
// main.js
var THREE = require('three')
var OrbitControls = require('three-orbitcontrols')
require('three-particle-simulation')(THREE)
 
var camera, tick = 0,
    scene, renderer, clock = new THREE.Clock(), container,
    options, spawnerOptions, particleSystem;
 
var stats;
 
init();
animate();
 
function init() {
 
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 28, window.innerWidth / window.innerHeight, 0.01, 1000 );
    camera.position.z = 1;
 
    scene = new THREE.Scene();
 
    function generateData () {
        
        var data = [];
        
        var nParticles = 200;
        var nFrames = 180;
        var r1 = 0.3;
        var r2 = 0.2
 
        for (var n = 0; n < nFrames; n ++) {
        
            var angle1 = n/nFrames * Math.PI * 2.0;
            var rotY = new THREE.Matrix4().makeRotationY(angle1);
            
            var frameData = [];
            for (var i = 0; i < nParticles; i ++) {
                var angle2 = Math.PI * 2.0 * Math.random() ;
                
                var p = new THREE.Vector3(0, 0, r2).applyAxisAngle ( new THREE.Vector3(0, 1, 0), angle2 );
                p.add(new THREE.Vector3(r1, 0, 0));
                p.applyAxisAngle ( new THREE.Vector3(0, 0, 1), angle1 );
                frameData.push([p.x, p.y, p.z, 0.5 * Math.random() - 0.05, 0.5 * Math.random() - 0.05, 0.5 * Math.random() - 0.05, (1.0 + Math.sin(angle1 * 2.0 )) * 0.5]);
            }
            data.push(frameData);
        }
        
        return data;
    }
    
    var pdata = generateData();
    
    particleSystem = new THREE.GPUParticleSimulation( {
        maxParticles: 250000,
        fps: 60,
        data: pdata,
        colormapMaxPressure: 1.0,
        colormapMinPressure: 0.0,
        reverseColormap: false,
        hideParticleOutOfRange: false,
        sizeOutOfFocus: 2.5,
        size:10,
        lifetime: 6,
    } );
 
    // ToDo: implement scaling option <> 1.0
    particleSystem.scale.x = 1,
    particleSystem.scale.y = 1,
    particleSystem.scale.z = 1,
    scene.add( particleSystem );
 
    var geometry = new THREE.SphereGeometry( 1.0, 10, 10 );
    var material = new THREE.MeshBasicMaterial( {wireframe: true, color: 0x00ff00, transparent : true , opacity: 0.1} );
 
    sphere = new THREE.Mesh( geometry, material );
    sphere.position.x = 0.0
    scene.add( sphere );
    
    // options passed during each spawned
    options = {
        lifetime: 2,
        size: 5,
        colormapMaxPressure: 1.0,
        colormapMinPressure: 0,
        reverseColormap: false,        
        hideParticleOutOfRange: false,
    };
 
    spawnerOptions = {
        spawnRate: 15000,
        timeScale: 1
    };
 
    sphereOptions = {
        useFocusSphere: true,
        spherePositionX: 0.0,
        spherePositionY: 0.0,
        spherePositionZ: 0.0,        
        sphereRadius: 0.3
    };      
 
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
	
	var controls = new OrbitControls(camera, renderer.domElement)
	
	camera.position.set( 10, 20, 100 );
	controls.update();
    window.addEventListener( 'resize', onWindowResize, false );
}
 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
 
function animate() {
    requestAnimationFrame( animate );
    var delta = clock.getDelta() * spawnerOptions.timeScale;
 
    tick += delta;
 
    if ( tick < 0 ) tick = 0;
 
    if ( delta > 0 ) {
 
        for ( var x = 0; x < spawnerOptions.spawnRate * delta; x ++ ) {
 
            // Spawning particles is super cheap, and once you spawn them, the rest of
            // their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
  
            options.time = clock.getElapsedTime( );
            particleSystem.spawnParticle( options ); 
        }
    }
 
    spherePosition = new THREE.Vector3(sphereOptions.spherePositionX, sphereOptions.spherePositionY, sphereOptions.spherePositionZ)
 
    sphereRadius = sphereOptions.sphereRadius * ( Math.sin(tick * 0.5)  * 0.05 + 0.5 );
      
      sphere.scale.x = sphereRadius
      sphere.scale.y = sphereRadius
      sphere.scale.z = sphereRadius
      
      sphere.position.x = spherePosition.x
      sphere.position.y = spherePosition.y
      sphere.position.z = spherePosition.z
      
    particleSystem.update( tick, sphereOptions.useFocusSphere, [spherePosition], sphereRadius);
	
    render();
}
 
function render() {
 
    renderer.render( scene, camera );
}
```

## Browserify

```
browserify main.js -o bundle.js
```

## HTML
```html
<html>
	<head>
		<title>gpu - particle simulation</title>
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body>
		<div id="container"></div>
		<script src="bundle.js"></script>
	</body>
</html>
```

## Particle Data
```javascript
[
	// frame 1
	[	
		// first particle on frame 1	
		// [ x,     y,     z,    vx,    vy,   vz,  p ]		 
		[-0.04,	-0.08, -0.01, -0.01, -0.04, 0.03, 62.73],
		
		// second particle on frame 1
		[-0.04, -0.09, -0.01, -0.01, -0.06, 0.03, 73.45], 	
		
		// ...

		// last particle on frame 1
		[-0.04, -0.02, -0.01, 0.05, -0.10, -0.66, 51.52]
	],

	// frame 2
	[
		[-0.04, -0.08, -0.06, 0.04, -0.4, 0.02, 37.23],
		[-0.05, -0.08, -0.01, 0.00, -0.0, -0.04, 16.61],
		//...
		[-0.07, -0.08, -0.16, 0.61, -0.01, -0.08, 31.32]
	],
	
	// ...

	// n-th frame
	[
		[-0.04, -0.08, -0.05, 0.01, -0.04, 0.08, 37.23],
		[-0.05, -0.08, -0.06, 0.13, -0.07, -0.42, 16.60],
		//...
		[-0.07, -0.08, -0.14, 0.61, -0.13, -0.09, 31.35]
	]
]
```

## Examples
<a href="https://zealous-aurora.glitch.me">Default Particle</a>

## License
```
(c) Copyright 2020 Frank Rettig, all rights reserved.
```
