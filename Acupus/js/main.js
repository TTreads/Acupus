// Game namespace
var game = {
	
	onload: function() {	
			// Initialize the video. If it doesn't work, alert the user
			if (!me.video.init('gamescreen', 1280, 1000, false, 0.5)) {
				console.log('browser doesn\'t support html 5 canvas');
				return;
			}
			// Add a custom loading screen
			me.state.set(me.state.LOADING, new game.CustomLoadScreen());
			
			// Initialize audio and the preloader
			me.audio.init('mp3, ogg');
			me.loader.onload = this.loaded.bind(this);
			this.load();
			
			// Change the state to the loading screen
			me.state.change(me.state.LOADING);
	},
	
	// Loading function: takes the list of resources from resources.js and pushed them into an
	// array to be handled by the preloader
	load: function() {
		var resources = [];
		
		this.resources['img'].forEach(function (value) {
			resources.push({
				name: value,
				type: "image",
				src: "img/" + value + ".png"
			})
		});
		
		this.resources['map'].forEach(function (value) {
			resources.push({
				name: value,
				type: "tmx",
				src: "tiles/" + value + ".tmx"
			})
		});
		
		me.loader.preload(resources);
	},
	
	"isObject" : function isObject(object) {
        try {
            return (!Array.isArray(object) && Object.keys(object));
        }
        catch (e) {
            return false;
        }
    },

	// Loaded call back: sets a new playscreen state, adds the player, coins, and enemies,
	// set the key bindings, and changes the state to the new playscreen
	loaded: function() {
			me.state.set(me.state.PLAY, new game.PlayScreen());
			me.state.set(me.state.MENU, new game.TitleScreen());
			
			me.entityPool.add("player", game.PlayerEntity);
			me.entityPool.add("coin", game.CoinEntity);
			me.entityPool.add("enemy", game.EnemyEntity);
			me.entityPool.add("flyingenemy", game.FlyingEnemyEntity);
			me.entityPool.add("levelchange", game.LevelChangeEntity);
			me.entityPool.add("itementity", game.PickupEntity);
			me.entityPool.add("evententity", game.EventEntity);

			//me.debug.renderHitBox = true
			
			me.input.bindKey(me.input.KEY.LEFT, "left");
			me.input.bindKey(me.input.KEY.RIGHT, "right");
			me.input.bindKey(me.input.KEY.W, "jump", true);
			me.input.bindKey(me.input.KEY.D, "attack");
			// me.input.bindKey(me.input.KEY.C, "switch", true);
			me.input.bindKey(me.input.KEY.SPACE, "fly");
			
			// Go to the main menu!
			me.state.change(me.state.MENU);
			
	}

};