/**
 * @author dmarcos / https://github.com/dmarcos
 */

THREE.VRControls = function ( camera, done ) {

	this._camera = camera;

	this._init = function () {
		var self = this;
		if ( !navigator.mozGetVRDevices && !navigator.getVRDevices ) {
			if ( done ) {
				done("Your browser is not VR Ready");
			}
			return;
		}
		if ( navigator.getVRDevices ) {
			navigator.getVRDevices().then( gotVRDevices );
		} else {
			navigator.mozGetVRDevices( gotVRDevices );
		}
		function gotVRDevices( devices ) {
			var vrInput;
			var error;
			for ( var i = 0; i < devices.length; ++i ) {
				if ( devices[i] instanceof PositionSensorVRDevice ) {
					vrInput = devices[i]
					self._vrInput = vrInput;
					break; // We keep the first we encounter
				}
			}
			if ( done ) {
				if ( !vrInput ) {
				 error = 'HMD not available';
				}
				done( error );
			}
		}
	};

	this._init();

	this.update = function(headPosition) {
		var camera = this._camera;
		var quat;
		var vrState = this.getVRState();
		if ( !vrState ) {
			return;
		}
		// Applies head rotation from sensors data.
		if ( camera ) {
			headPosition.x = vrState.hmd.position.x;
      headPosition.y = vrState.hmd.position.y;
      headPosition.z = vrState.hmd.position.z;
			camera.quaternion.fromArray( vrState.hmd.rotation );
			return camera.quaternion;
		}
	};

	this.getVRState = function() {
		var vrInput = this._vrInput;
		var orientation;
		var position;
		var vrState;
		if ( !vrInput ) {
			return null;
		}
		hmdState	= vrInput.getState();

		vrState = {
			hmd : {
				position : {
					x: hmdState.position.x,
					y: hmdState.position.y,
					z: hmdState.position.z
				},
				rotation : [
					hmdState.orientation.x,
					hmdState.orientation.y,
					hmdState.orientation.z,
					hmdState.orientation.w
				]
			}
		};
		return vrState;
	};

};
