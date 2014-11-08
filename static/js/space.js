
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, renderer;

var mesh, pointer;

var vrEffect, vrControls;

var headPosition;

var uniforms;

var raycaster, mouse, points = [];

var particleSystem;

var isMobile;
var orbitControls;
var boolVR = false;


var listRef = new Firebase("https://unvrse.firebaseio.com/presence/");
var userRef = listRef.push();
var presenceRef = new Firebase('https://unvrse.firebaseio.com/.info/connected');
var currentRef = new Firebase('https://unvrse.firebaseio.com/current');

var boolMobile = false;

isMobile = {
Android: function() {
        return navigator.userAgent.match(/Android/i);
},
BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
},
iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
},
Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
},
Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
},
any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
}
};

boolMobile = isMobile.any();

function init() {
    /*otherUsersRef.transaction(function(currentUsers) {
      // If /users/fred/rank has never been set, currentRank will be null.
      return currentUsers+1;
    });*/
    presenceRef.on("value", function(snap) {
      if (snap.val()) {
        userRef.set(true);
        // Remove ourselves when we disconnect.
        userRef.onDisconnect().remove();
      }
    });

    container = document.getElementById( 'container' );

    //

    camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, .1, 5000 );
    camera.position.set(1,1,1);

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0x050505, 2000, 3500 );

    raycaster = new THREE.Raycaster();

    mouse = new THREE.Vector2();

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

    var positions = new Float32Array( 3 );
    var colors = new Float32Array( 3 );
    var values_size = new Float32Array( 1 );

    var color = new THREE.Color();

    positions[ 0 ] = 0;
    positions[ 1 ] = 0;
    positions[ 2 ] = 0;

    var vx = 1;
    var vy = 0;
    var vz = 0;

    color.setRGB( vx, vy, vz );

    colors[ 0 ] = color.r;
    colors[ 1 ] = color.g;
    colors[ 2 ] = color.b;

    values_size[0] = 500;

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
    geometry.addAttribute( 'size', new THREE.BufferAttribute( values_size, 1 ) );

    //pointer = new THREE.Mesh( geometry, shaderMaterial );
    var sphereGeometry = new THREE.SphereGeometry( .5, 32, 32 );
		var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, shading: THREE.FlatShading } );
    pointer = new THREE.Mesh( sphereGeometry, sphereMaterial );

    if(!boolMobile || !boolVR){
      scene.add( pointer );
    }

    //sun
    var sphereGeometry = new THREE.SphereGeometry( 1, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xFF8000} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(0,0,0);
    scene.add(planet);

    //mercury
    var sphereGeometry = new THREE.SphereGeometry( .05, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xFF0000} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(2.5,0,2.5);
    scene.add(planet);

    //venus
    var sphereGeometry = new THREE.SphereGeometry( .1, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xF5F5DC} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(5,0,5);
    scene.add(planet);

    //earth
    var sphereGeometry = new THREE.SphereGeometry( .1, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x2E2EFE} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(7.5,0,7.5);
    scene.add(planet);

    //mars
    var sphereGeometry = new THREE.SphereGeometry( .05, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xDF0101} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(10,0,10);
    scene.add(planet);

    //jupiter
    var sphereGeometry = new THREE.SphereGeometry( .5, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xD7DF01} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(12.5,0,12.5);
    scene.add(planet);

    //saturn
    var sphereGeometry = new THREE.SphereGeometry( .4, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0xF5DA81} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(15,0,15);
    scene.add(planet);

    //uranus
    var sphereGeometry = new THREE.SphereGeometry( .2, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x9FF781} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(17.5,0,17.5);
    scene.add(planet);

    //neptune
    var sphereGeometry = new THREE.SphereGeometry( .2, 32, 32 );
    var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x58D3F7} );
    planet = new THREE.Mesh( sphereGeometry, sphereMaterial );
    planet.position.set(20,0,20);
    scene.add(planet);

    //


    var scope = this;
    var loader = new THREE.XHRLoader( scope.manager );
    loader.setCrossOrigin( this.crossOrigin );
    loader.load( '/static/star1.json', function ( text ) {
      var starsData = JSON.parse(text);
      var particles = starsData.length;
      console.log(particles);


      var geometry = new THREE.BufferGeometry();

      var positions = new Float32Array( particles * 3 );
      var colors = new Float32Array( particles * 3 );
      var values_size = new Float32Array( particles );

      var color = new THREE.Color();

      var n = 7, n2 = n / 2; // particles spread in the cube

      for ( var i = 0; i < positions.length; i += 3 ) {


          // positions
          /*if(starsData[i/3].lum<10)
            values_size[i/3] = 1;
          else*/

            values_size[i/3] = Math.log(starsData[i/3].lum);
            if(boolMobile)
              {
                if(values_size[i/3]>2.5)
                  values_size[i/3]=2.5;
              }
          var x = starsData[i/3].pos[0];
          var y = starsData[i/3].pos[1];
          var z = starsData[i/3].pos[2];

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

    /*stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );*/

    //

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener("dblclick", onDoubleClick);

    //VR Stuff
    headPosition = new THREE.Vector3(0,0,0);
    vrEffect = new THREE.VREffect(renderer, VREffectLoaded);

   // If mobile device, add orientation controls.
    if(isMobile.any()) {
	     vrControls = new THREE.DeviceOrientationControls(camera, true);
       vrControls.connect();
    } else {
	     vrControls = new THREE.VRControls(camera);
       boolVR = true;
    }

    function VREffectLoaded(error) {
      if (error) {
        document.getElementById("toggle-render").innerHTML = error;
        document.getElementById("toggle-render").classList.add('error');
        if(boolMobile){
          document.getElementById("toggle-render").remove();
        }
        vrControls = false;
        orbitControls = new THREE.OrbitControls(camera, container);

      }
      else
        boolVR = true;
    }

    //add event listener for VR button
    if(!boolMobile){
      document.getElementById("toggle-render").addEventListener("click", function(){
        vrEffect.setFullScreen( true );
      });
    }
    function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		}

    function onDoubleClick( event ) {

        console.log(pointer.position);
        currentRef.update({ x: pointer.position.x, y: pointer.position.y, z: pointer.position.z });
        //mesh.position.copy(pointer.position)

    }

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
    //stats.update();

}

function render() {

    if(vrControls)
      vrControls.update(headPosition);
    else
      orbitControls.update();

    if(!boolMobile){
      var vector = new THREE.Vector3( mouse.x, mouse.y, 1 ).unproject(camera);

    	raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

      if(particleSystem) {
      	var intersects = raycaster.intersectObject(particleSystem, true);
        if ( intersects.length > 0 ) {

          var intersect = intersects[ 0 ];
          var selectPos = new THREE.Vector3( intersect.point.x, intersect.point.y, intersect.point.z )
          //intersects[ 0 ].point.material.color.setHex(0x00FF33)

          pointer.position.copy(intersect.point);

          //mesh.updateMatrix();

          //pointer.geometry.applyMatrix( mesh.matrix );

          //pointer.visible = true;

        } else {

          //pointer.visible = false;

        }
      }
    }


		vrEffect.render( scene, camera );

}

// Number of online users is the number of objects in the presence list.
listRef.on("value", function(snap) {
  console.log("online users = " + snap.numChildren());
  var otherUsers = snap.numChildren();
  var geometry = new THREE.BoxGeometry( 1, 1, 1);
  var material = new THREE.MeshBasicMaterial({color:0x00FF33});

  console.log("added cube")
});

// Number of online users is the number of objects in the presence list.
currentRef.on("value", function(snap) {
  if(boolVR || boolMobile) {
    camera.position.set(snap.val().x, snap.val().y, snap.val().z);
  }
});
