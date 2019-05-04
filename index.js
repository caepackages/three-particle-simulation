module.exports = function ParticleSimulation ( THREE ){
    
/*
 * GPU Particle Simulation
 */

THREE.GPUParticleSimulation = function ( options ) {

	THREE.Object3D.apply( this, arguments );
	
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
	
	options = options || {};

	// parse options and use defaults

	this.PARTICLE_COUNT = options.maxParticles || 1000000;
  
	this.data = options.data || generateData ();
	
	this.colormap = options.colormap || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAECAYAAABhlOHEAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAGPSURBVFhH7ZRRlsIgDEUDVNcx+5v9f8yxhbk3tB51C5LKIcl7eQlULb8/f2PUiDEijhYRhZ0tyB3bS4yfPOOtJ9CJC3nrBquADbBey/Rv+jUKPHU6cQHTV2/uaDVzndoSwgFvAFZ18StJ+za5+pUcDcqpZ69yYzkfj7zMwysXz6eies2AtY24TSzo1eSLlVPDPDWXXxqXBKc5g32stU+KEasf5DxP4sb2YHE+D5w1zvTMTyxz+Nk7cx8YLyjnv/JX/LnTf3BZOcsz97kOlq3wTzzP4+z5EPUj30XmOxx7sg/2CpZ3nnn8HHvi8kY/388xMWuavrcCr42Z90uXMZihGm+8febr4O48E3V8cr5Gj3Fym/NIOZgNrFCX1528l5p9n7PCy3vYCZhZXn9wdrhaf8z5uuehTz/15SbPOYi7fSxXA07f5xkm79KAD48WM+/M8BR4rc9eYJEYWujnfKlns3d94+T66xS+6r2R3IUUPzWeC8wNzXq/+zNftmzZt9r6A1i27Itt/QEsW/a1FvEPOddBPCLzDH4AAAAASUVORK5CYII=";
	this.sprite = options.sprite || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REVGODRBRjIyRjU2MTFFNUExM0Y4OUExMTc4QTBCQUMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REVGODRBRjMyRjU2MTFFNUExM0Y4OUExMTc4QTBCQUMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpERUY4NEFGMDJGNTYxMUU1QTEzRjg5QTExNzhBMEJBQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpERUY4NEFGMTJGNTYxMUU1QTEzRjg5QTExNzhBMEJBQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgDz1z0AAAZeSURBVHja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";
  
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
	  function getSphereRadius (radius, index) {
		if (typeof radius === 'number') {
			return radius;
		}
		return radius[index];
	  };
	
      // first focus
      if (spherePosition.length > 0) {
        this.particleShaderMat.uniforms.spherePosition1 = new THREE.Uniform(spherePosition[0]);
        this.particleShaderMat.uniforms.sphereRadius1.value = getSphereRadius(shpereRadius, 0);        
      } else {
        this.particleShaderMat.uniforms.spherePosition1 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius1.value = -1.0;      
      }

      // second focus
      if (spherePosition.length > 1) {
        this.particleShaderMat.uniforms.spherePosition2 = new THREE.Uniform(spherePosition[1]);
        this.particleShaderMat.uniforms.sphereRadius2.value = getSphereRadius(shpereRadius, 1);
      } else {
        this.particleShaderMat.uniforms.spherePosition2 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius2.value = -1.0;      
      }    
      
      // 3rd focus
      if (spherePosition.length > 2) {
        this.particleShaderMat.uniforms.spherePosition3 = new THREE.Uniform(spherePosition[2]);
        this.particleShaderMat.uniforms.sphereRadius3.value = getSphereRadius(shpereRadius, 2);
      } else {
        this.particleShaderMat.uniforms.spherePosition3 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius3.value = -1.0;      
      }
      
      // 4th focus
      if (spherePosition.length > 3) {
        this.particleShaderMat.uniforms.spherePosition4 = new THREE.Uniform(spherePosition[3]);
        this.particleShaderMat.uniforms.sphereRadius4.value = getSphereRadius(shpereRadius, 3);
      } else {
        this.particleShaderMat.uniforms.spherePosition4 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius4.value = -1.0;      
      }

      // 5th focus
      if (spherePosition.length > 4) {
        this.particleShaderMat.uniforms.spherePosition5 = new THREE.Uniform(spherePosition[4]);
        this.particleShaderMat.uniforms.sphereRadius5.value = getSphereRadius(shpereRadius, 4);
      } else {
        this.particleShaderMat.uniforms.spherePosition5 = new THREE.Uniform(new THREE.Vector3());
        this.particleShaderMat.uniforms.sphereRadius5.value = -1.0;      
      }

      // 6th focus
      if (spherePosition.length > 5) {
        this.particleShaderMat.uniforms.spherePosition6 = new THREE.Uniform(spherePosition[5]);
        this.particleShaderMat.uniforms.sphereRadius6.value = getSphereRadius(shpereRadius, 5);
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
