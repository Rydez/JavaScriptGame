// This file is used to avoid mixing modules. Keep them separated by publishing
// and subscribing to events, rather than directly using the API of one module
// in some other module.

var pubsub = {
	events: {},
	// Subscribe to some published event
	subscribe: function(eventName, fn) {
		this.events[eventName] = this.events[eventName] || [];
		this.events[eventName].push(fn);
	},
	// Unsubscribe to some subscription
	unsubscribe: function(eventName, fn) {
		if (this.events[eventName]) {
			for (var i = 0; i < this.events[eventName].length; i++) {
				if (this.events[eventName][i] === fn) {
					this.events[eventName].splice(i, 1);
					break;
				}
			}
			// Possible replacement of for if
			// var fnIdx = this.events[eventName].indexOf(fn);
			// this.events[eventName].splice(fnIdx, 1);
		}
	},
	// Publish data for the function in some subscription
	publish: function(eventName, data) {
		if (this.events[eventName]) {
			this.events[eventName].forEach(function(fn) {
				fn(data);
			});
		}
	}
};