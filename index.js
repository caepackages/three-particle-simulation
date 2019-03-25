module.exports = function ParticleSimulation ( THREE ){
    
/*
 * GPU Particle Simulation
 */

THREE.GPUParticleSimulation = function ( options ) {

	THREE.Object3D.apply( this, arguments );

	options = options || {};

	// parse options and use defaults

	this.PARTICLE_COUNT = options.maxParticles || 1000000;
  
  this.data = options.data || [];
  
  this.colormap = options.colormap || "tests/assets/textures/colormap.png";
  this.sprite = options.sprite || "tests/assets/textures/particle2.png";
  
	this.fps = options.fps || 60.0;  
  
	this.PARTICLE_CONTAINERS = options.containerCount || 1;

	this.PARTICLE_NOISE_TEXTURE = options.particleNoiseTex || null;
	this.PARTICLE_SPRITE_TEXTURE = options.particleSpriteTex || null;

	this.PARTICLES_PER_CONTAINER = Math.ceil( this.PARTICLE_COUNT / this.PARTICLE_CONTAINERS );
	this.PARTICLE_CURSOR = 0;
	this.time = 0;
	this.particleContainers = [];
	this.rand = [];

	this.n_frames = this.data.length;
	this.fps = 20.0;  
    
	// custom vertex and fragement shader

	var GPUParticleShader = {
    
		vertexShader: [

			'uniform float uTime;',
      'uniform vec3 spherePosition1;',      
      'uniform vec3 spherePosition2;',
      'uniform vec3 spherePosition3;',

      'uniform vec3 spherePosition4;',      
      'uniform vec3 spherePosition5;',
      'uniform vec3 spherePosition6;', 
           
			'uniform float sphereRadius1;',
			'uniform float sphereRadius2;',
			'uniform float sphereRadius3;',
      
			'uniform float sphereRadius4;',
			'uniform float sphereRadius5;',
			'uniform float sphereRadius6;',
      
			'uniform float uScale;',
			'uniform sampler2D tNoise;',

			'attribute vec3 positionStart;',
			'attribute float startTime;',
			'attribute vec3 positionEnd;',
			'attribute float scalarColor;',
			'attribute float size;',

			'attribute float sizeOutOfFocus;',      
      
			'attribute float lifeTime;',

			'varying vec4 vColor;',
			'varying float lifeLeft;',
			'varying float alphaScale;',

			'void main() {',

			// unpack things from our attributes'
      
			'	vec3 cold = texture2D( tNoise, vec2( scalarColor, 0.2 )).rgb;',

			'	vColor = vec4( cold, 1.0 );',

			// convert our positionEnd back into a value we can use'

			'	vec3 newPosition;',
      
			'	vec4 newPositionWorld;',      

			'	float timeElapsed = uTime - startTime;',

			'	lifeLeft = 1.0 - ( timeElapsed / lifeTime );',

			'	newPosition = positionStart;',

      '	newPosition = mix( positionStart, positionEnd, ( timeElapsed / lifeTime ) );',
      
			' newPositionWorld = modelMatrix * vec4( newPosition, 1.0 );',
      
			' alphaScale = 1.0;',
 
		'	if( timeElapsed > 0.0 ) {',
 
      '	if( ( length(newPositionWorld.xyz - spherePosition1) < sphereRadius1 || length(newPositionWorld.xyz - spherePosition2) < sphereRadius2  || length(newPositionWorld.xyz - spherePosition3 ) < sphereRadius3    || length(newPositionWorld.xyz - spherePosition4 ) < sphereRadius4   || length(newPositionWorld.xyz - spherePosition5 ) < sphereRadius5   || length(newPositionWorld.xyz - spherePosition6 ) < sphereRadius6)    ) {',
 
			'		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );', 
       '	gl_PointSize = ( uScale * size ) * lifeLeft;',
 
 			'	} else {',
 
			'		gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );',
   
       '	gl_PointSize = ( uScale * sizeOutOfFocus ) * lifeLeft;',
      
      '	}',
      
			'	} else {',

			'		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			'		lifeLeft = 0.0;',
			'		gl_PointSize = 0.;',

			'	}',
      
      
      
                 
			'}'

		].join( '\n' ),

		fragmentShader: [

			'float scaleLinear( float value, vec2 valueDomain ) {',

			'	return ( value - valueDomain.x ) / ( valueDomain.y - valueDomain.x );',

			'}',

			'float scaleLinear( float value, vec2 valueDomain, vec2 valueRange ) {',

			'	return mix( valueRange.x, valueRange.y, scaleLinear( value, valueDomain ) );',

			'}',

			'varying vec4 vColor;',
			'varying float lifeLeft;',
			'varying float alphaScale;',

			'uniform sampler2D tSprite;',

			'void main() {',

			'	float alpha = 0.;',

			'	if( lifeLeft > 0.995 ) {',

			'		alpha = scaleLinear( lifeLeft, vec2( 1.0, 0.995 ), vec2( 0.0, 1.0 ) );',

			'	} else {',

			'		alpha = lifeLeft * 0.75;',

			'	}',

			'	vec4 tex = texture2D( tSprite, gl_PointCoord );',
			'	gl_FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a * alphaScale );',

			'}'

		].join( '\n' )

	};

	// preload a million random numbers

	var i;

	for ( i = 1e5; i > 0; i -- ) {

		this.rand.push( Math.random() - 0.5 );

	}

	this.random = function () {

		return ++ i >= this.rand.length ? this.rand[ i = 1 ] : this.rand[ i ];

	};

	var textureLoader = new THREE.TextureLoader();

	this.particleNoiseTex = this.PARTICLE_NOISE_TEXTURE || textureLoader.load( this.colormap );
	this.particleNoiseTex.wrapS = this.particleNoiseTex.wrapT = THREE.ClampToEdgeWrapping;

	this.particleSpriteTex = this.PARTICLE_SPRITE_TEXTURE || textureLoader.load( this.sprite );
	this.particleSpriteTex.wrapS = this.particleSpriteTex.wrapT = THREE.ClampToEdgeWrapping;

	this.particleShaderMat = new THREE.ShaderMaterial( {
		transparent: true,
		depthWrite: false,
		uniforms: {
			'uTime': {
				value: 0.0
			},
			'spherePosition':  new THREE.Uniform(new THREE.Vector3())
      ,
			'sphereRadius1': {
				value: 0.0
			},
			'sphereRadius2': {
				value: 0.0
			},
			'sphereRadius3': {
				value: 0.0
			},
			'sphereRadius4': {
				value: 0.0
			},
			'sphereRadius5': {
				value: 0.0
			},
			'sphereRadius6': {
				value: 0.0
			},
			'uScale': {
				value: 1.0
			},
			'tNoise': {
				value: this.particleNoiseTex
			},
			'tSprite': {
				value: this.particleSpriteTex
			}
		},
		blending: THREE.AdditiveBlending,
		vertexShader: GPUParticleShader.vertexShader,
		fragmentShader: GPUParticleShader.fragmentShader
	} );

	// define defaults for all values

	this.particleShaderMat.defaultAttributeValues.particlePositionsStartTime = [ 0, 0, 0, 0 ];
	this.particleShaderMat.defaultAttributeValues.particleVelColSizeLife = [ 0, 0, 0, 0 ];

	this.init = function () {

		for ( var i = 0; i < this.PARTICLE_CONTAINERS; i ++ ) {

			var c = new THREE.GPUParticleContainer( this.PARTICLES_PER_CONTAINER, this );
			this.particleContainers.push( c );
			this.add( c );

		}

	};

	this.spawnParticle = function ( options ) {

		this.PARTICLE_CURSOR ++;

		if ( this.PARTICLE_CURSOR >= this.PARTICLE_COUNT ) {

			this.PARTICLE_CURSOR = 1;

		}
    
    f = Math.floor((options.time * this.fps) % this.n_frames);
    p = Math.round((this.data[f].length - 1) * Math.random())
    
    pressure = this.data[f][p][6]
    
    var pDelta =  Math.max(options.colormapMaxPressure - options.colormapMinPressure, 1.0) 
    options.scalarColor = Math.max(Math.min( (pressure - options.colormapMinPressure)  / pDelta, 1.0), 0.0);
    
    if (options.reverseColormap == true) {
      options.scalarColor = 1 - options.scalarColor 
    }
    
    if (options.hideParticleOutOfRange == false || (this.data[f][p][6] > options.colormapMinPressure && this.data[f][p][6] < options.colormapMaxPressure)) {
     
      options.position = new THREE.Vector3();
      options.positionEnd = new THREE.Vector3();
      
      options.position.x = this.data[f][p][0]
      options.position.y = this.data[f][p][1] 
      options.position.z = this.data[f][p][2]

      options.positionEnd.x = (options.position.x + this.data[f][p][3] * 1.0 / this.fps )
      options.positionEnd.y = (options.position.y + this.data[f][p][4] * 1.0 / this.fps )
      options.positionEnd.z = (options.position.z + this.data[f][p][5] * 1.0 / this.fps )
        
      var currentContainer = this.particleContainers[ Math.floor( this.PARTICLE_CURSOR / this.PARTICLES_PER_CONTAINER ) ];

      currentContainer.spawnParticle( options );
    }
	};

	this.update = function ( time, useFocusSphere, spherePosition, shpereRadius) {

		for ( var i = 0; i < this.PARTICLE_CONTAINERS; i ++ ) {

			this.particleContainers[ i ].update( time , useFocusSphere, spherePosition, shpereRadius);

		}

	};

	this.dispose = function () {

		this.particleShaderMat.dispose();
		this.particleNoiseTex.dispose();
		this.particleSpriteTex.dispose();

		for ( var i = 0; i < this.PARTICLE_CONTAINERS; i ++ ) {

			this.particleContainers[ i ].dispose();

		}

	};

	this.init();

};

THREE.GPUParticleSimulation.prototype = Object.create( THREE.Object3D.prototype );
THREE.GPUParticleSimulation.prototype.constructor = THREE.GPUParticleSimulation;


// Subclass for particle containers, allows for very large arrays to be spread out

THREE.GPUParticleContainer = function ( maxParticles, particleSystem ) {

	THREE.Object3D.apply( this, arguments );

	this.PARTICLE_COUNT = maxParticles || 100000;
	this.PARTICLE_CURSOR = 0;
	this.time = 0;
	this.offset = 0;
	this.count = 0;
	this.DPR = window.devicePixelRatio;
	this.GPUParticleSimulation = particleSystem;
	this.particleUpdate = false;

	// geometry

	this.particleShaderGeo = new THREE.BufferGeometry();

	this.particleShaderGeo.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT * 3 ), 3 ).setDynamic( true ) );
	this.particleShaderGeo.addAttribute( 'positionStart', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT * 3 ), 3 ).setDynamic( true ) );
	this.particleShaderGeo.addAttribute( 'startTime', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT ), 1 ).setDynamic( true ) );
	this.particleShaderGeo.addAttribute( 'positionEnd', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT * 3 ), 3 ).setDynamic( true ) );
	this.particleShaderGeo.addAttribute( 'scalarColor', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT ), 1 ).setDynamic( true ) );
	this.particleShaderGeo.addAttribute( 'size', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT ), 1 ).setDynamic( true ) );
  
	this.particleShaderGeo.addAttribute( 'sizeOutOfFocus', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT ), 1 ).setDynamic( true ) );

  
	this.particleShaderGeo.addAttribute( 'lifeTime', new THREE.BufferAttribute( new Float32Array( this.PARTICLE_COUNT ), 1 ).setDynamic( true ) );

	// material

	this.particleShaderMat = this.GPUParticleSimulation.particleShaderMat;

	var position = new THREE.Vector3();
	var positionEnd = new THREE.Vector3();

	this.spawnParticle = function ( options ) {

		var positionStartAttribute = this.particleShaderGeo.getAttribute( 'positionStart' );
		var startTimeAttribute = this.particleShaderGeo.getAttribute( 'startTime' );
		var positionEndAttribute = this.particleShaderGeo.getAttribute( 'positionEnd' );
		var scalarColorAttribute = this.particleShaderGeo.getAttribute( 'scalarColor' );
		var sizeAttribute = this.particleShaderGeo.getAttribute( 'size' );

		var sizeOutOfFocusAttribute = this.particleShaderGeo.getAttribute( 'sizeOutOfFocus' );
    
		var lifeTimeAttribute = this.particleShaderGeo.getAttribute( 'lifeTime' );

		options = options || {};

		// setup reasonable default values for all arguments

		position = options.position !== undefined ? position.copy( options.position ) : position.set( 0, 0, 0 );
		positionEnd = options.positionEnd !== undefined ? positionEnd.copy( options.positionEnd ) : positionEnd.set( 0, 0, 0 );

		var scalarColor = options.scalarColor !== undefined ? options.scalarColor : 1;
		var lifetime = options.lifetime !== undefined ? options.lifetime : 5;
		var size = options.size !== undefined ? options.size : 10;
    
  	var sizeOutOfFocus = options.sizeOutOfFocus !== undefined ? options.sizeOutOfFocus : 2.5;
    
		if ( this.DPR !== undefined ) size *= this.DPR;

		var i = this.PARTICLE_CURSOR;
    
		positionStartAttribute.array[ i * 3 + 0 ] = position.x ;
		positionStartAttribute.array[ i * 3 + 1 ] = position.y ;
		positionStartAttribute.array[ i * 3 + 2 ] = position.z ;

		positionEndAttribute.array[ i * 3 + 0 ] = positionEnd.x;
		positionEndAttribute.array[ i * 3 + 1 ] = positionEnd.y;
		positionEndAttribute.array[ i * 3 + 2 ] = positionEnd.z;

		scalarColorAttribute.array[ i ] = scalarColor;
		sizeAttribute.array[ i ] = size;
    sizeOutOfFocusAttribute.array[ i ] = sizeOutOfFocus;    
    
		lifeTimeAttribute.array[ i ] = lifetime;
		startTimeAttribute.array[ i ] = this.time;

		// offset

		if ( this.offset === 0 ) {

			this.offset = this.PARTICLE_CURSOR;

		}

		// counter and cursor

		this.count ++;
		this.PARTICLE_CURSOR ++;

		if ( this.PARTICLE_CURSOR >= this.PARTICLE_COUNT ) {

			this.PARTICLE_CURSOR = 0;

		}

		this.particleUpdate = true;

	};

	this.init = function () {

		this.particleSystem = new THREE.Points( this.particleShaderGeo, this.particleShaderMat );
		this.particleSystem.frustumCulled = false;
		this.add( this.particleSystem );

	};

	this.update = function ( time , useFocusSphere, spherePosition, shpereRadius) {

		this.time = time;
		this.particleShaderMat.uniforms.uTime.value = time;
        
    if (useFocusSphere) {
      
      // first focus
      if (spherePosition.length > 0) {
        this.particleShaderMat.uniforms.spherePosition1 = new THREE.Uniform(spherePosition[0]);
        this.particleShaderMat.uniforms.sphereRadius1.value = shpereRadius;        
      } else {
        this.particleShaderMat.uniforms.spherePosition1 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius1.value = -1.0;      
      }
      
      // second focus
      if (spherePosition.length > 1) {
        this.particleShaderMat.uniforms.spherePosition2 = new THREE.Uniform(spherePosition[1]);
        this.particleShaderMat.uniforms.sphereRadius2.value = shpereRadius;
      } else {
        this.particleShaderMat.uniforms.spherePosition2 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius2.value = -1.0;      
      }    
      
      // 3rd focus
      if (spherePosition.length > 2) {
        this.particleShaderMat.uniforms.spherePosition3 = new THREE.Uniform(spherePosition[2]);
        this.particleShaderMat.uniforms.sphereRadius3.value = shpereRadius;
      } else {
        this.particleShaderMat.uniforms.spherePosition3 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius3.value = -1.0;      
      }
      
      // 4th focus
      if (spherePosition.length > 3) {
        this.particleShaderMat.uniforms.spherePosition4 = new THREE.Uniform(spherePosition[3]);
        this.particleShaderMat.uniforms.sphereRadius4.value = shpereRadius;
      } else {
        this.particleShaderMat.uniforms.spherePosition4 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius4.value = -1.0;      
      }

      // 5th focus
      if (spherePosition.length > 4) {
        this.particleShaderMat.uniforms.spherePosition5 = new THREE.Uniform(spherePosition[4]);
        this.particleShaderMat.uniforms.sphereRadius5.value = shpereRadius;
      } else {
        this.particleShaderMat.uniforms.spherePosition5 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius5.value = -1.0;      
      }

      // 6th focus
      if (spherePosition.length > 5) {
        this.particleShaderMat.uniforms.spherePosition6 = new THREE.Uniform(spherePosition[5]);
        this.particleShaderMat.uniforms.sphereRadius6.value = shpereRadius;
      } else {
        this.particleShaderMat.uniforms.spherePosition6 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius6.value = -1.0;      
      }
      
    } else {
        this.particleShaderMat.uniforms.spherePosition1 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius1.value = 9999999999999999;

        this.particleShaderMat.uniforms.spherePosition2 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius2.value = 9999999999999999;

        this.particleShaderMat.uniforms.spherePosition3 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius3.value = 9999999999999999;   
        
        this.particleShaderMat.uniforms.spherePosition4 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius4.value = 9999999999999999;   

        this.particleShaderMat.uniforms.spherePosition5 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius5.value = 9999999999999999;   

        this.particleShaderMat.uniforms.spherePosition6 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius6.value = 9999999999999999;           
    }

		this.geometryUpdate();
	};

	this.geometryUpdate = function () {

		if ( this.particleUpdate === true ) {

			this.particleUpdate = false;

			var positionStartAttribute = this.particleShaderGeo.getAttribute( 'positionStart' );
			var startTimeAttribute = this.particleShaderGeo.getAttribute( 'startTime' );
			var positionEndAttribute = this.particleShaderGeo.getAttribute( 'positionEnd' );
			var scalarColorAttribute = this.particleShaderGeo.getAttribute( 'scalarColor' );
			var sizeAttribute = this.particleShaderGeo.getAttribute( 'size' );
      
			var sizeOutOfFocusAttribute = this.particleShaderGeo.getAttribute( 'sizeOutOfFocus' );
      
			var lifeTimeAttribute = this.particleShaderGeo.getAttribute( 'lifeTime' );

			if ( this.offset + this.count < this.PARTICLE_COUNT ) {

				positionStartAttribute.updateRange.offset = this.offset * positionStartAttribute.itemSize;
				startTimeAttribute.updateRange.offset = this.offset * startTimeAttribute.itemSize;
				positionEndAttribute.updateRange.offset = this.offset * positionEndAttribute.itemSize;
				scalarColorAttribute.updateRange.offset = this.offset * scalarColorAttribute.itemSize;
				sizeAttribute.updateRange.offset = this.offset * sizeAttribute.itemSize;
        sizeOutOfFocusAttribute.updateRange.offset = this.offset * sizeOutOfFocusAttribute.itemSize;
        
				lifeTimeAttribute.updateRange.offset = this.offset * lifeTimeAttribute.itemSize;

				positionStartAttribute.updateRange.count = this.count * positionStartAttribute.itemSize;
				startTimeAttribute.updateRange.count = this.count * startTimeAttribute.itemSize;
				positionEndAttribute.updateRange.count = this.count * positionEndAttribute.itemSize;
				scalarColorAttribute.updateRange.count = this.count * scalarColorAttribute.itemSize;
				sizeAttribute.updateRange.count = this.count * sizeAttribute.itemSize;
				sizeOutOfFocusAttribute.updateRange.count = this.count * sizeOutOfFocusAttribute.itemSize;
        
				lifeTimeAttribute.updateRange.count = this.count * lifeTimeAttribute.itemSize;

			} else {

				positionStartAttribute.updateRange.offset = 0;
				startTimeAttribute.updateRange.offset = 0;
				positionEndAttribute.updateRange.offset = 0;
				scalarColorAttribute.updateRange.offset = 0;
				sizeAttribute.updateRange.offset = 0;
				sizeOutOfFocusAttribute.updateRange.offset = 0;
        
				lifeTimeAttribute.updateRange.offset = 0;

				// Use -1 to update the entire buffer, see #11476
				positionStartAttribute.updateRange.count = - 1;
				startTimeAttribute.updateRange.count = - 1;
				positionEndAttribute.updateRange.count = - 1;
				scalarColorAttribute.updateRange.count = - 1;
				sizeAttribute.updateRange.count = - 1;
				sizeOutOfFocusAttribute.updateRange.count = - 1;
        
				lifeTimeAttribute.updateRange.count = - 1;

			}

			positionStartAttribute.needsUpdate = true;
			startTimeAttribute.needsUpdate = true;
			positionEndAttribute.needsUpdate = true;
			scalarColorAttribute.needsUpdate = true;
			sizeAttribute.needsUpdate = true;
			sizeOutOfFocusAttribute.needsUpdate = true;
      
			lifeTimeAttribute.needsUpdate = true;

			this.offset = 0;
			this.count = 0;

		}

	};

	this.dispose = function () {

		this.particleShaderGeo.dispose();

	};

	this.init();

};

THREE.GPUParticleContainer.prototype = Object.create( THREE.Object3D.prototype );
THREE.GPUParticleContainer.prototype.constructor = THREE.GPUParticleContainer;
    
}
