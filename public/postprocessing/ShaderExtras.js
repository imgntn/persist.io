/**
 * @author alteredq / http://alteredqualia.com/
 *
 * ShaderExtras - required shaders for post-processing effects
 */

THREE.ShaderExtras = {

	/* -------------------------------------------------------------------------
	//	Screen shader - copies texture to screen
	 ------------------------------------------------------------------------- */

	"screen": {

		uniforms: {

			"tDiffuse": { type: "t", value: 0, texture: null },
			"opacity":  { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float opacity;",
			"uniform sampler2D tDiffuse;",
			"varying vec2 vUv;",

			"void main() {",

				"vec4 texel = texture2D( tDiffuse, vUv );",
				"gl_FragColor = opacity * texel;",

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Convolution shader - for blur effects
	 ------------------------------------------------------------------------- */

	"convolution": {

		uniforms: {

			"tDiffuse":        { type: "t", value: 0, texture: null },
			"uImageIncrement": { type: "v2", value: new THREE.Vector2( 0.001953125, 0.0 ) },
			"cKernel":         { type: "fv1", value: [] }

		},

		vertexShader: [

			"uniform vec2 uImageIncrement;",
			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv - ( ( KERNEL_SIZE - 1.0 ) / 2.0 ) * uImageIncrement;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float cKernel[ KERNEL_SIZE ];",
			"uniform sampler2D tDiffuse;",
			"uniform vec2 uImageIncrement;",
			"varying vec2 vUv;",

			"void main() {",

				"vec2 imageCoord = vUv;",
				"vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );",

				"for( int i = 0; i < KERNEL_SIZE; i ++ ) {",

					"sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];",
					"imageCoord += uImageIncrement;",

				"}",

				"gl_FragColor = sum;",

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Film grain & scanlines shader
	 ------------------------------------------------------------------------- */

	"film": {

		uniforms: {

			"tDiffuse":   { type: "t", value: 0, texture: null },
			"time":       { type: "f", value: 0.0 },
			"nIntensity": { type: "f", value: 0.5 },
			"sIntensity": { type: "f", value: 0.05 },
			"sCount":     { type: "f", value: 4096 },
			"grayscale":  { type: "i", value: 1 }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform float time;",
			"uniform bool grayscale;",
			"uniform float nIntensity;",
			"uniform float sIntensity;",
			"uniform float sCount;",
			"uniform sampler2D tDiffuse;",
			"varying vec2 vUv;",

			"void main() {",

				// sample the source
				"vec4 cTextureScreen = texture2D( tDiffuse, vUv );",

				// make some noise
				"float x = vUv.x * vUv.y * time *  1000.0;",
				"x = mod( x, 13.0 ) * mod( x, 123.0 );",
				"float dx = mod( x, 0.01 );",

				// add noise
				"vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx * 100.0, 0.0, 1.0 );",

				// get us a sine and cosine
				"vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",

				// add scanlines
				"cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

				// interpolate between source and result by intensity
				"cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",

				// convert to grayscale if desired
				"if( grayscale ) {",

					"cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );",

				"}",

				"gl_FragColor =  vec4( cResult, cTextureScreen.a );",

			"}"

		].join("\n")

	},

	/* -------------------------------------------------------------------------
	//	Dot screen shader
	 ------------------------------------------------------------------------- */

	"dotscreen": {

		uniforms: {

			"tDiffuse": { type: "t", value: 0, texture: null },
			"tSize":    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
			"center":   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
			"angle":    { type: "f", value: 1.57 },
			"scale":    { type: "f", value: 1.0 }

		},

		vertexShader: [

			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"

		].join("\n"),

		fragmentShader: [

			"uniform vec2 center;",
			"uniform float angle;",
			"uniform float scale;",
			"uniform vec2 tSize;",
			"uniform sampler2D tDiffuse;",
			"varying vec2 vUv;",

			"float pattern() {",

				"float s = sin( angle ), c = cos( angle );",
				"vec2 tex = vUv * tSize - center;",
				"vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",
				"return ( sin( point.x ) * sin( point.y ) ) * 4.0;",

			"}",

			"void main() {",

				"vec4 color = texture2D( tDiffuse, vUv );",
				"float average = ( color.r + color.g + color.b ) / 3.0;",
				"gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",

			"}"

		].join("\n")

	}

};

/* -------------------------------------------------------------------------
//	Utility function to build Gaussian blur kernel
 ------------------------------------------------------------------------- */

THREE.ShaderExtras.buildKernel = function( sigma ) {

	// We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

	function gauss( x, sigma ) {

		return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

	}

	var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

	if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
	halfWidth = ( kernelSize - 1 ) * 0.5;

	values = new Array( kernelSize );
	sum = 0.0;
	for ( i = 0; i < kernelSize; ++i ) {

		values[ i ] = gauss( i - halfWidth, sigma );
		sum += values[ i ];

	}

	// normalize the kernel
	for ( i = 0; i < kernelSize; ++i ) values[ i ] /= sum;

	return values;

};
