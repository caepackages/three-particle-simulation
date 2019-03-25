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
      data: {...},
      fps: 20,
      colormap: 'map.png',
      sprite: 'sprite.png',
    } );
```
