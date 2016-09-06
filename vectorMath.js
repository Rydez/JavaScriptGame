// Some vector functions for moving the player

var vectorMath = (function() {

	// Add two vectors and return the result
	function add(vect1, vect2) {
		var resultVect = [];
		for(var i = 0; i < vect1.length; i++) {
			resultVect[i] = vect1[i] + vect2[i];
		}
		return resultVect;
	}

	// Subtract to vectors and return the result
	function subtract(vect1, vect2) {
		var resultVect = [];
		for(var i = 0; i < vect1.length; i++) {
			resultVect[i] = vect1[i] - vect2[i];
		}
		return resultVect;
	}

	// Take the dot product of two vectors and return the result
	function dotProduct(vect1, vect2) {
		var resultNum = 0;
		for(var i = 0; i < vect1.length; i++) {
			resultNum += vect1[i]*vect2[i];
		}
		return resultNum;
	}

	// Calculate the magnitude/length of a vector and return the result
	function magnitude(vect) {
		var result = 0;
		var sumOfSquares = 0;
		for(var i = 0; i < vect.length; i++) {
			sumOfSquares += Math.pow(vect[i], 2);
		}
		result = Math.sqrt(sumOfSquares);
		return result;
	}

	// Return the unit vector of some vector
	function normalize(vect) {
		var resultVect = [];
		for(var i = 0; i < vect.length; i++) {
			resultVect[i] = (vect[i] / magnitude(vect));
		}
		return resultVect;
	}

	// Get the angle between to vectors and return the result
	function angleBetween(vect1, vect2) {
		// 0 to 360 degrees
		var numerator = dotProduct(vect1, vect2);
		// Don't divide by zero
		if (magnitude(vect1) != 0 && magnitude(vect2) != 0) {
			var denominator = magnitude(vect1)*magnitude(vect2);
		}
		else {
			console.log("angleBetween caused divide by zero.");
		}
		// Get the angle in radians and convert it to degrees
		var cosOfAngle = numerator/denominator;
		var radAngle = Math.acos(cosOfAngle);
		var degAngle = radAngle * (180/Math.PI);
		if(vect1[1] < 0 || vect2[1] < 0) {
			degAngle += 180;
		}
		return degAngle;
	}
	// Return vector math function
	return {
		subtract: subtract,
		angleBetween: angleBetween,
		normalize: normalize,
		magnitude: magnitude
	};
})();