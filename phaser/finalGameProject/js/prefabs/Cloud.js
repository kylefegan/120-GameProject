//Cloud prefab
//Player constructor
var Cloud = function(game, x, y, key, scrollSpeed)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);
	
	this.speed = scrollSpeed;
	this.checkWorldBounds = true;
	this.events.onOutOfBounds.add(resetCloud, this);
};

//inherit prototype from Phaser.Sprite and set constructor to Cloud
//the Object.create method creates a new object w/ the specified prototype object and properties
Cloud.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
Cloud.prototype.constructor = Cloud;  

//override the Phaser.Sprite update function
Cloud.prototype.update = function()
{
	this.x = this.x + this.speed;
};

//Helper Function --> Reset Cloud Position
function resetCloud(Cloud)
{
    Cloud.reset(-1000, 0);
}
