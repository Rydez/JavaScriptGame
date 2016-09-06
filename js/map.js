// Map module... player module

var map = (function () {
	//--------SPRITES
	// Data for the map spritesheet
	var mapSheetData = {
		images: ["images/iso-64x64-outside.png"],
		frames: [
			//x, y, width, height, imageIndex(not frameindex), regX, regY
			//Flat grass tiles
			[  0, 32, 64, 32, 0, 0, 0],
			[ 64, 32, 64, 32, 0, 0, 0],
			[128, 32, 64, 32, 0, 0, 0],
			[192, 32, 64, 32, 0, 0, 0],
			[256, 32, 64, 32, 0, 0, 0],
			[320, 32, 64, 32, 0, 0, 0],
			[384, 32, 64, 32, 0, 0, 0],

			[  0, 96, 64, 32, 0, 0, 0],
			[ 64, 96, 64, 32, 0, 0, 0],
			[128, 96, 64, 32, 0, 0, 0],
			[192, 96, 64, 32, 0, 0, 0],
			[256, 96, 64, 32, 0, 0, 0],
			[320, 96, 64, 32, 0, 0, 0],
			[384, 96, 64, 32, 0, 0, 0],
			[448, 96, 64, 32, 0, 0, 0],

			[  0, 160, 64, 32, 0, 0, 0],
			[ 64, 160, 64, 32, 0, 0, 0],
			[128, 160, 64, 32, 0, 0, 0],
			[192, 160, 64, 32, 0, 0, 0]
		]
	};
	// Get sprite sheet from data
	var mapSheet = new createjs.SpriteSheet(mapSheetData);
	// Containter for map tiles
	var mapContainer = new createjs.SpriteContainer(mapSheet);
	// Get bitmap for the tile cursor
	var tileCursor = new createjs.Bitmap("images/tileHighlight.png");

	//--------LOGIC QUANTITIES	
	// Number of tiles wide and high
	var MAP_WIDTH = 19;
	var MAP_HEIGHT = 40;
	// The number of grass tiles
	var NUM_GRASS_TILES = 19;
	// Set original cursor indices to zero
	var cursorIndexX = 0;
	var cursorIndexY = 0;
	// Get relevant keycodes for keypresses
	var KEYCODE_LEFT  = 37,
		KEYCODE_UP    = 38,
		KEYCODE_RIGHT = 39,
		KEYCODE_DOWN  = 40;
	
	//--------SUBSCRIPTIONS
	pubsub.subscribe('movementOptionsSet', cacheMap);

	//--------EVENT LISTENERS	
	// Create an event listener for tile cursor movement
	window.addEventListener("keydown", cursorController, false);
	
	//--------KEYPRESS FUNCTION
	// Function to move cursor tile upon keypresses
	function cursorController(e) {
		// Each case has an if statement which checks for out-
		// of-bounds movements. Commented out lines are for
		// vertical and horizontal control instead of diagonal
		switch(e.keyCode) {
			case KEYCODE_LEFT:	
				if(tileCursor.x > 0 && tileCursor.y > 0) {
					cursorIndexX -= 1;
					tileCursor.x = (cursorIndexX - cursorIndexY) * 32;
					tileCursor.y = (cursorIndexX + cursorIndexY) * 16;
					//tileCursor.x = cursorIndexX * 64;	
					//tileCursor.y = cursorIndexY * 32;
					break;
				}
				break;
			case KEYCODE_RIGHT:
				if(tileCursor.x < (1248 - 64) && tileCursor.y < (656 - 32)) {
					cursorIndexX += 1;
					tileCursor.x = (cursorIndexX - cursorIndexY) * 32;
					tileCursor.y = (cursorIndexX + cursorIndexY) * 16;
					//tileCursor.x = cursorIndexX * 64;	
					//tileCursor.y = cursorIndexY * 32;
					break;
				}
				break;
			case KEYCODE_DOWN: 
				if(tileCursor.y < (656 - 32) && tileCursor.x > 0) {
					cursorIndexY += 1;
					tileCursor.x = (cursorIndexX - cursorIndexY) * 32;
					tileCursor.y = (cursorIndexX + cursorIndexY) * 16;
					//tileCursor.x = cursorIndexX * 64;	
					//tileCursor.y = cursorIndexY * 32;
					break;	
				}
				break;
			case KEYCODE_UP: 
				if(tileCursor.y > 0 && tileCursor.x < (1248 - 64)){
					cursorIndexY -= 1;
					tileCursor.x = (cursorIndexX - cursorIndexY) * 32;
					tileCursor.y = (cursorIndexX + cursorIndexY) * 16;
					//tileCursor.x = cursorIndexX * 64;	
					//tileCursor.y = cursorIndexY * 32;
					break;					
				}
				break;
		}
	}

	//--------CACHE FUNCTION
	// Cache map
	function cacheMap() {
		mapContainer.cache(0, 0, 1248, 656);
	}

	//--------RETRIEVE FUNCTION
	// Return the tile cursor indices and bitmap
	function getCursorPosition() {
		return {
			cursorIndexX: cursorIndexX,
			cursorIndexY: cursorIndexY,
			tileCursor: tileCursor
		};
	}

	//--------RENDER	
	// Put the map tiles on the stage
	function setMap(stage) {
		// Off set used to stagger step the tiles
		var OFF_SET = 0;
		for (var i = 0; i < MAP_HEIGHT; i++) {
			// Switch the offset based on odd or even rows
			OFF_SET = i%2 == 0 ? 0 : 32;
			for (var j = 0; j < MAP_WIDTH; j++) {
				// Get a random tile and place add it to the stage
				var randTileIndex = Math.floor(Math.random()*(NUM_GRASS_TILES + 1));
				var mapTile = new createjs.Sprite(mapSheet, randTileIndex);
				mapTile.paused = true;
				mapTile.x = OFF_SET + j * 64;
				mapTile.y = i * 16;
				mapContainer.addChild(mapTile);
			}
		}
		cacheMap();
		stage.addChild(mapContainer);
	}
	// Set the tile cursor on the stage
	function setTileCursor(stage) {
		tileCursor.x = cursorIndexX * 64;	
		tileCursor.y = cursorIndexY * 16;
		stage.addChild(tileCursor);
	}

	//--------API	
	// Return the map functions
	return {
		setMap: setMap,
		setTileCursor: setTileCursor,
		getCursorPosition: getCursorPosition,
	};
})();