/*var getVolume = function() {
	return $("#slider").slider("value");
}*/

function playExample() {
	/*
	var VariableNode = function(audiolet) {
		AudioletNode.call(this, audiolet, 0, 1);
	}
	extend(VariableNode, AudioletNode);
	
	VariableNode.prototype.generate = function(inputBuffers, outputBuffers) {
		var volume = getVolume();
		var outputBuffer = outputBuffers[0];
		var numberOfChannels = outputBuffer.numberOfChannels;
		var bufferLength = outputBuffer.length;
		for (var i = 0; i < numberOfChannels; i++) {
			var outputChannel = outputBuffer.getChannelData(i);
			for (var j = 0; j < bufferLength; j++) {
				outputChannel[j] = volume;
			}
		}
	};
	
	VariableNode.prototype.toString = function() {
		return 'VariableNode';
	};
	*/
	
	/*var FunctionNode = function(audiolet, func) {
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
	};*/
	
	var MySine = function(audiolet) {
		AudioletGroup.call(this, audiolet, 0, 1);
		this.sine = new Sine(audiolet);
		this.gain = new Gain(audiolet);
		this.pan = new Pan(audiolet);
		
		this.sinControl = new FunctionNode(audiolet, function() { return audio.freq * 400; } );
		this.gainControl = new FunctionNode(audiolet, function() { return audio.gain; } );
		this.panControl = new FunctionNode(audiolet, function() { return audio.pan; } );
		
		this.sinControl.connect(this.sine);
		this.gainControl.connect(this.gain, 0, 1);
		this.panControl.connect(this.pan, 0, 1);
		
		this.sine.connect(this.gain);
		this.gain.connect(this.pan);
		this.pan.connect(this.outputs[0]);
	}
	extend(MySine, AudioletGroup);
	
	var Demo = function() {
		this.audiolet = new Audiolet();
		this.playSine();
	}
	
	Demo.prototype.playSine = function() {
		this.sine = new MySine(this.audiolet);
		this.sine.connect(this.audiolet.output);
	}
	
	var demo = new Demo();
};

/*
function lowerVolume() {
	volume -= 0.1;
};

function raiseVolume() {
	volume += 0.1;
};
*/