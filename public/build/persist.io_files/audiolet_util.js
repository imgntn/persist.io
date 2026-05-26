var gainDivisor = 100;
var gainLimit = 0.95;

function filterNegative(val) { return val > 0 ? val : 0; }

function getGain(source, listener) {
	var distance = listener.position.distanceTo(source.position) / gainDivisor;
	return filterNegative(gainLimit - (Math.atan(distance) / (Math.PI / 2.0)));
}

//might need some help cleaning up this function
function getPan(source, listener, camera) {
	var vectorTo = source.position.clone();
	vectorTo.subSelf(listener.position);
	vectorTo.normalize();
	var camDir = camera.rotation.y;
	var pan = - vectorTo.z * Math.sin(camDir) + vectorTo.x * Math.cos(camDir);
	return (1.0 + pan) / 2.0;
}

	var FunctionNode = function(audiolet, func) {
		AudioletNode.call(this, audiolet, 0, 1);
		this.func = func;
	}
	extend(FunctionNode, AudioletNode);
	
	FunctionNode.prototype.generate = function(inputBuffers, outputBuffers) {
		var variable = this.func();
		var outputBuffer = outputBuffers[0];
		var numberOfChannels = outputBuffer.numberOfChannels;
		var bufferLength = outputBuffer.length;
		for (var i = 0; i < numberOfChannels; i++) {
			var outputChannel = outputBuffer.getChannelData(i);
			for (var j = 0; j < bufferLength; j++) {
				outputChannel[j] = variable;
			}
		}
	};
	
	FunctionNode.prototype.toString = function() {
		return 'FunctionNode';
	};