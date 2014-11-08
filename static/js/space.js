
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;

var mesh;

var vrEffect, vrControls;

var headPosition;

var uniforms;

function init() {

    container = document.getElementById( 'container' );

    //

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 5, 1000 );

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    //


    var scope = this;
    var loader = new THREE.XHRLoader( scope.manager );
    loader.setCrossOrigin( this.crossOrigin );
    loader.load( '/static/star1.json', function ( text ) {
      var starsData = JSON.parse(text);
      var particles = starsData.length;
      console.log(particles);
      var attributes = {

				size:        { type: 'f', value: null },
				customColor:       { type: 'c', value: null }

			};

			uniforms = {

				color:     { type: "c", value: new THREE.Color( 0xffffff ) },
				texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "/static/halo.png" ) }

			};

      var shaderMaterial = new THREE.ShaderMaterial( {

				uniforms:       uniforms,
				attributes:     attributes,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

				blending:       THREE.NormalBlending,
				depthTest:      false,
				transparent:    true

			});


      var geometry = new THREE.BufferGeometry();

      var positions = new Float32Array( particles * 3 );
      var colors = new Float32Array( particles * 3 );
      var values_size = new Float32Array( particles );

      var color = new THREE.Color();

      var n = 5, n2 = n / 2; // particles spread in the cube

      for ( var i = 0; i < positions.length; i += 3 ) {


          // positions
          /*if(starsData[i/3].lum<200)
            values_size[i/3] = 1;
          else*/
            values_size[i/3] = starsData[i/3].lum/10;
          var x = starsData[i/3].pos[0] * n - n2;
          var y = starsData[i/3].pos[1] * n - n2;
          var z = starsData[i/3].pos[2] * n - n2;

          positions[ i ]     = x;
          positions[ i + 1 ] = y;
          positions[ i + 2 ] = z;

          // colors

          var vx = 1;
          var vy = 1;
          var vz = 1;

          color.setRGB( vx, vy, vz );

          colors[ i ]     = color.r;
          colors[ i + 1 ] = color.g;
          colors[ i + 2 ] = color.b;

      }

      geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
      geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
      geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

      geometry.computeBoundingSphere();

      //
      var texture = THREE.ImageUtils.loadTexture( "/static/halo.jpg" );
      var material = new THREE.PointCloudMaterial( { size: 1, map: texture, vertexColors: THREE.VertexColors} );

      particleSystem = new THREE.PointCloud( geometry, shaderMaterial);
      scene.add( particleSystem );


    } );



    //

    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setClearColor( scene.fog.color, 1 );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    //

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    //

    window.addEventListener( 'resize', onWindowResize, false );

    //VR Stuff
    headPosition = new THREE.Vector3(0,0,0);
    vrEffect = new THREE.VREffect(renderer, VREffectLoaded);
    vrControls = new THREE.VRControls(camera);
    function VREffectLoaded(error) {
      if (error) {
        document.getElementById("toggle-render").innerHTML = error;
        document.getElementById("toggle-render").classList.add('error');
      }
    }

    //add event listener for VR button
    document.getElementById("toggle-render").addEventListener("click", function(){
      vrEffect.setFullScreen( true );
    });

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();

}

function render() {

    vrControls.update(headPosition);
		vrEffect.render( scene, camera );

}
