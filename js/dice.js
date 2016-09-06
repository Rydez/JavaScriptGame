// Dice module... add more info

var dice = (function() {
	//--------SPRITES
	// Data to create the dice sprite sheet
	var diceSheetData = {
		images: ["images/d20-320x180.png"],
		frames: {width: 320, height: 180, count: 240, regX: 0, regY: 0, spacing: 0, margin: 0},
		animations: {
			roll1: [0, 11, false],
			roll2: [12, 23, false],
			roll3: [24, 35, false],
			roll4: [36, 47, false],
			roll5: [48, 59, false],
			roll6: [60, 71, false],
			roll7: [72, 83, false],
			roll8: [84, 95, false],
			roll9: [96, 107, false],
			roll10: [108, 119, false],
			roll11: [120, 131, false],
			roll12: [132, 143, false],
			roll13: [144, 155, false],
			roll14: [156, 167, false],
			roll15: [168, 179, false],
			roll16: [180, 191, false],
			roll17: [192, 203, false],
			roll18: [204, 215, false],
			roll19: [216, 227, false],
			roll20: [228, 239, false],
		}
	}
	// Create the sprite sheet using the relevant data
	var diceSheet = new createjs.SpriteSheet(diceSheetData);
	// Set initial animation to roll a one
	var diceAnimation = new createjs.Sprite(diceSheet, "roll1");
	// Get keycode for the r key
	
	//--------LOGIC QUANTITIES
	// Value of dice roll
	var diceValue = 1;
	// Set keycode for "r" key
	var KEYCODE_R = 82;

	//--------SUBSCRIPTIONS
	//


	//--------EVENT LISTENERS
	// Add an event listener to roll the die
	window.addEventListener("keydown", diceController, false);
	
	//--------KEYPRESS FUNCTION
	// Function to execute the die roll
	function diceController(e) {
		switch(e.keyCode) {
			case KEYCODE_R:
				// Math.floor(Math.random()*(max-min+1)+min);
				var randNumRoll = Math.floor(Math.random()*(20 - 1 + 1) + 1);
				var rollIndex = "roll" + randNumRoll;
				diceAnimation.gotoAndPlay(rollIndex);
				// Set the dice value
				diceValue = randNumRoll;
				// Turn on player choosing state after dice roll
				pubsub.publish('diceRolled', true);
				pubsub.publish('addOrRemoveSprite', null);
		}
	}

	//--------RETRIEVE FUNCTION	
	// Return the value on which the dice lands
	function getDiceValue() {
		return diceValue;
	}

	//--------RENDER	
	// Set the die on the canvas
	function setDice(stage) {		
		diceAnimation.x = 0;
		diceAnimation.y = 0;
		stage.addChild(diceAnimation);
	}

	//--------API
	// Return the dice functions needed outside of the module
	return {
		setDice: setDice,
		getDiceValue: getDiceValue
	};
})();