// Player module... add more info

var player = (function() {
	//--------SPRITES
	// Data for the tile highlight sprite
	var highlightData = {
		images: ["images/blue-tile-highlight.png"],
		frames: {width: 64, height: 32, count: 1, regX: 0, regY: 0, spacing: 0, margin: 0}
	};
	// Data for the player sprite sheet
	var dragonSheetData = {
		images: ["images/wyvern_sheet_35percent.png"],
		frames: {width: 89.6, height: 89.6, count: 448, regX: 22.4, regY: 44.8, spacing: 0, margin: 0},
		animations: {
			hoverUpRight: [168, 175],
			hoverUp: [112, 119],
			hoverUpLeft: [56, 63],
			hoverLeft: [0, 7],
			hoverDownLeft: [392, 399],
			hoverDown: [336, 343],
			hoverDownRight: [280, 287],
			hoverRight: [224, 231],

			flyUpRight: [176, 183],
			flyUp: [120, 127],
			flyUpLeft: [64, 71],
			flyLeft: [8, 15],
			flyDownLeft: [400, 407],
			flyDown: [344, 351],
			flyDownRight: [288, 295],
			flyRight: [232, 239]
		}
	};
	// Create player sprite sheet from relevant data
	var dragonSheet = new createjs.SpriteSheet(dragonSheetData);
	// Create tile highlight sheet from relevant data
	var highlightSheet = new createjs.SpriteSheet(highlightData);
	// Create container for the player
	var playerContainer = new createjs.SpriteContainer(dragonSheet);
	// Create container for the players movement options
	var moveOptionsContainer = new createjs.SpriteContainer()
	// Create starting animation and add it to container
	var playerAnimation = new createjs.Sprite(dragonSheet, "hoverDownRight");
	playerContainer.addChild(playerAnimation);

	//--------ATTRIBUTES
	// Multiplier for dice roll
	var moveAbility = 1;

	//--------LOGIC QUANTITIES
	// Player indices to determine player position 
	var playerIndexX = 4;
	var playerIndexY = 8;
	// Boolean to determine when player space chooses should be shown
	var playerIsChoosing = false;
	// Keycode for enter key
	var KEYCODE_ENTER = 13;

	//--------SUBSCRIPTIONS
	// Subscribe to dice roll
	pubsub.subscribe('setMovementOptions', setMovementOptions);
	pubsub.subscribe('diceRolled', setChoosingStateOn);

	//--------EVENT LISTENERS
	// Add event listener for when player makes a movement decision
	window.addEventListener("keydown", playerController, false);

	//--------STATE FUNCTIONS
	// Functions for changing or getting the player choosing state
	function setChoosingStateOn() {
		playerIsChoosing = true;
	}
	function setChoosingStateOff() {
		playerIsChoosing = false;
	}

	//--------KEYPRESS FUNCTION
	// Function for handling the players movement decision
	function playerController(e) {
		switch(e.keyCode) {
			case KEYCODE_ENTER:
				// Get information about map and tile cursor
				var cursorPosition = map.getCursorPosition();
				var cursorIndexX = cursorPosition.cursorIndexX;
				var cursorIndexY = cursorPosition.cursorIndexY;
				var tileCursor = cursorPosition.tileCursor;
				// Set player indices for seting move options
				playerIndexX = cursorIndexX;
				playerIndexY = cursorIndexY;
				// Get information about how to move
				var cursorVect = [tileCursor.x, -tileCursor.y];
				var playerVect = [playerContainer.x, -playerContainer.y]
				var playerDirection = getPlayerDirection(cursorVect, playerVect);
				var flightAnimation = "fly" + playerDirection;
				var hoverAnimation = "hover" + playerDirection;
				// Play appropriate flight animation
				playerAnimation.gotoAndPlay(flightAnimation);
				// Move, then play appropriate hover animation
				moveToCursor(cursorVect, playerVect, hoverAnimation);
				// Turn off choosing state after decision made
				setChoosingStateOff();
				// Turn on updates
				pubsub.publish('addOrRemoveSprite', null);
		}
	}

	//--------MOVEMENT FUNCTIONS
	// Function to move the player sprite to the cursor
	function moveToCursor(cursorVect, startPlayerVect, hoverAnimation) {
		// Target vector is a vector from the player to the cursor to which it will move
		var targetVect = vectorMath.subtract(cursorVect, startPlayerVect);
		var targetNorm = vectorMath.normalize(targetVect);
		var targetMagnitude = vectorMath.magnitude(targetVect);
		// Number of steps taken from "point A to point B"
		var NUM_OF_STEPS = 100;
		// Calculate the size of each step
		var stepSize = targetMagnitude/NUM_OF_STEPS;
		// Progress vector goes from the players original position to the players current position
		var progressMagnitude = 0;
		// Function to be called recursively until player gets to destination
		var stepTo = function() {
			// Determine if player has reached destination
			if(progressMagnitude < targetMagnitude) {
				// Take a step
				playerContainer.x += stepSize * targetNorm[0];
				playerContainer.y -= stepSize * targetNorm[1];
				// Current player vector goes from page window origin to current player location
				var currentPlayerVect = [playerContainer.x, -playerContainer.y];
				var progressVect = vectorMath.subtract(currentPlayerVect, startPlayerVect);
				progressMagnitude = vectorMath.magnitude(progressVect);
				// Take a step every 10 milliseconds
				setTimeout(stepTo, 10);
			}
			// Play hover animation when player arrives at destination
			else {
				playerAnimation.gotoAndPlay(hoverAnimation);
			}
		};
		// Initiate movement 10 milliseconds after stepTo returns
		setTimeout(stepTo, 10);
	}
	// Add or remove movement options
	function setMovementOptions(stage) {
		if (playerIsChoosing) {
			addMovementOptions(stage);
		}
		else {
			removeMovementOptions();
		}
	}
	// Set the tile highlights which represent movement options
	function addMovementOptions(stage) {
		var rollValue = dice.getDiceValue();
		// Set origin at which to start drawing movement options
		var originX = playerContainer.x - rollValue * 32;
		var originY = playerContainer.y - rollValue * 16;
		// Draw as map is drawn (see setMap function)
		var offSet = 0;
		var variableAddOne = 1;
		for (var i = 0; i < (2 * rollValue + 1); i++) {
			offSet = i%2 == 0 ? 0 : 32;
			// VariableAddOne  makes sure the movement options are square
			variableAddOne = i%2 == 0 ? 1 : 0;
			for (var j = 0; j < (rollValue + variableAddOne); j++) {
				var blueTileHighlight = new createjs.Sprite(highlightSheet, 0);
				blueTileHighlight.x = originX + offSet + j * 64;
				blueTileHighlight.y = originY + i * 16;
				moveOptionsContainer.addChild(blueTileHighlight);
			}
		}
		pubsub.publish('movementOptionsSet', null)
		stage.addChild(moveOptionsContainer);
	}
	function removeMovementOptions() {
		moveOptionsContainer.removeAllChildren();
	}
	// Function to return the players current direction
	function getPlayerDirection(cursorVect, playerVect) {
		// Terminal vector goes from player to tile cursor
		var terminalVect = vectorMath.subtract(cursorVect, playerVect);
		// Determine which initial vector to use based on sign of y-component of terminal vector
		if(terminalVect[1] < 0) {
			var initialVect = [-1, 0];
		}
		else {
			var initialVect = [1, 0];
		}
		// Get the angle in degrees
		var angleBetween = vectorMath.angleBetween(terminalVect, initialVect);
		// Make array of directions for the player animation
		var directions = ["UpRight", "Up", "UpLeft", "Left", "DownLeft", "Down", "DownRight", "Right"]
		var movementDirection = "DownRight";
		// Offset to provide eight different ranges with centers at 45 degree angles of unit circle
		var OFF_SET = 22.5;
		// Loop through until direction is found and return it
		for (var i = 0; i < directions.length; i++) {
			if( angleBetween >= (45*i + OFF_SET) && angleBetween < ( 45*(i + 1) + OFF_SET) ) {
				movementDirection = directions[i];
				return movementDirection;
			}
			else if( angleBetween >= 0 && angleBetween < OFF_SET) {
				movementDirection = directions[directions.length - 1];
				return movementDirection;
			}
		}
	}

	//--------RENDER
	// Set the player to the stage
	function setPlayer(stage) {
		var offSet = playerIndexY%2 == 0 ? 0 : 32;		
		playerContainer.x = offSet + playerIndexX * 64;
		playerContainer.y = playerIndexY * 16;
		stage.addChild(playerContainer);
	}

	//--------API
	// Return the functions needed outside of this module
	return {
		setChoosingStateOn: setChoosingStateOn,
		addMovementOptions: addMovementOptions,
		removeMovementOptions: removeMovementOptions,
		setPlayer: setPlayer
	};
})();