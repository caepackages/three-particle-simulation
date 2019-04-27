# three-particle-simulation

## NPM

```
npm i three-particle-simulation
```

## Example

```javascript
// index.js
var THREE = require('three')
require('three-particle-simulation')(THREE)

var particleSim = new THREE.GPUParticleSimulation( {
      maxParticles: 25000,
      data: [...],
      fps: 20
    } );
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
