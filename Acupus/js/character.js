// Basic 'Character Entity' that extends the basic Sprite drawing engine (see sprite.js)
// This is the basic model that both the player and all enemies are based off of
// It includes basic functionality such as gear and weapon addition, health addition
// and subtraction and animation checking

game.CharacterEntity = game.Sprite.extend({
	
	init: function(x, y, settings) {
		var self = this;
		settings.compose = '[{"name":"'+settings.name+'"}]';
		self.parent(x, y, settings);
		
		self.attacking = false;
		self.animated = false;
		self.standing = true;
		
		self.weapons = [];
		self.equipped = [];
		
		self.currentWep = null;
		self.currentGear = null;
		
		self.hp = 1;
		
		self.collidable = true;
		self.facing = 'right';
	},
	
	equipWep: function(wepstring) {
		if(this.equippedWep) {
			this.removeCompositionItem(this.equippedWep.name);
		}
		var wep = game.weapons[wepstring];
		this.equippedWep = wep; 
		this.addCompositionItem({"name":wep.name,"class":"game.weapon","image":wep.image, "spritewidth":wep.wWidth,"spriteheight":wep.wHeight});
		this.setCompositionOrder(wep.name, this.name, true);
	},
	
	equipGear: function(gearstring) {
		if(this.equippedGear) {
			this.removeCompositionItem(this.equippedGear.name);
		}
		var gear = game.equipable[gearstring];
		this.equippedGear = gear;
		this.addCompositionItem({"name":gear.name,"class":"game.gear","image":gear.image,"spritewidth":gear.width,"spriteheight":gear.height});
		this.setCompositionOrder(gear.name, this.name, false);
	},
	
	removeHP: function(dmg) {
		this.hp -= dmg;
		this.flicker(45);
		
		if(this.name === 'player') {
			me.game.HUD.updateItemValue("health", -dmg);
		}
		if(this.hp <= 0) {
			
			if(this.name === 'player') {
				var gib = new game.Death()
				me.game.add(gib, 2);
				me.game.sort();
				game.persistent.other.deathcounter += 1;
				me.game.remove(this);
				setTimeout(function() {
					me.state.change(me.state.MENU);
				}, 500);
				
			}
			me.game.remove(this);
		}
	},
	
	addHP: function(newhealth) {
		this.hp += newhealth;
	},
	
	checkAnimation: function(moving) {
		if(moving) {
			if(this.animated && !this.attacking) {
				return;
			} else {
				this.animated = true;
				this.standing = false;
				this.setCurrentAnimation("walk");
			}
		} else {
			if(this.standing) {
				return;
			} else {
				this.standing = true;
				this.animated = false;
				this.setCurrentAnimation("stand");
			}
		}		
	},
	
	getMovements: function(hit) {
		// Default movements (NPCs?)
	},

	update: function() {
		
		if(this.visible) {
			var hit = this.updateMovement();
			this.getMovements(hit);
			this.parent(this);
		}
		
		if(this.vel.x !=0 || this.vel.y != 0 || this.attacking) {
			return true;
		}
		
		return false;
		
	}
});