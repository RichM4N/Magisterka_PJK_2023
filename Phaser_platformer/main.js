class GameScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'GameScene' });

        this.platforms;

        
    }

    preload ()
    {
        this.load.image('sky0', './assets/stringstar/background_0.png');
        this.load.image('sky1', './assets/stringstar/background_1.png');
        this.load.image('sky2', './assets/stringstar/background_2.png');
        this.load.image('tiles', './assets/tilesets/tileset_forest.png');
        this.load.spritesheet('playerIdle', './assets/hero_1/Idle.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('playerRun', './assets/hero_1/Run.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('playerJump', './assets/hero_1/Jump.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('playerFall', './assets/hero_1/Fall.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('playerAttack1', './assets/hero_1/Attack1.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('playerTakingDamage', './assets/hero_1/Take Hit - white silhouette.png', { frameWidth: 200, frameHeight: 200 });
        this.load.spritesheet('collectibleCoin', './assets/objects/coin_gold.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('collectibleGem', './assets/UI/gem.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('lava', './assets/deco/lava.png', { frameWidth: 48, frameHeight: 48 });

        this.load.spritesheet('enemyBear', './assets/enemies/bear_brown.png', { frameWidth:32, frameHeight: 32});

    }

    create ()
    {

        this.skyImageArr0 = [];
        this.skyImageArr1 = [];
        this.skyImageArr2 = [];

        this.camWidth = this.cameras.main.width;
        this.camHeight = this.cameras.main.height;

        //background
        let skyImage = this.add.image(0, 0, 'sky0');
        skyImage.setOrigin(0, 0);
        skyImage.setScale(this.camWidth/skyImage.width,this.camHeight/skyImage.height);
        this.skyImageArr0.push(skyImage);

        skyImage = this.add.image(this.camWidth, 0, 'sky0');
        skyImage.setOrigin(0, 0);
        skyImage.setScale(this.camWidth/skyImage.width,this.camHeight/skyImage.height);
        this.skyImageArr0.push(skyImage);

        //background parallax 1
        let skyImage1 = this.add.image(0, 0, 'sky1');
        skyImage1.setOrigin(0, 0);
        skyImage1.setScale(this.camWidth/skyImage1.width,this.camHeight/skyImage1.height);
        this.skyImageArr1.push(skyImage1);

        skyImage1 = this.add.image(this.camWidth, 0, 'sky1');
        skyImage1.setOrigin(0, 0);
        skyImage1.setScale(this.camWidth/skyImage1.width,this.camHeight/skyImage1.height);
        this.skyImageArr1.push(skyImage1);

        //background parallax 2
        let skyImage2 = this.add.image(0, 0, 'sky2');
        skyImage2.setOrigin(0, 0);
        skyImage2.setScale(this.camWidth/skyImage2.width,this.camHeight/skyImage2.height);
        this.skyImageArr2.push(skyImage2);

        skyImage2 = this.add.image(this.camWidth, 0, 'sky2');
        skyImage2.setOrigin(0, 0);
        skyImage2.setScale(this.camWidth/skyImage2.width,this.camHeight/skyImage2.height);
        this.skyImageArr2.push(skyImage2);

        //parse tileset for world
        const tiles = this.textures.get('tiles');
        const base = tiles.get();
        Phaser.Textures.Parsers.SpriteSheet(tiles, base.sourceIndex, base.x, base.y, base.width, base.height, {
            frameWidth: 16,
            frameHeight: 16
        });

        //world groups
        this.platforms = this.physics.add.staticGroup();
        this.platformMap = [];
        this.collectibles = this.physics.add.staticGroup();
        this.foliage = this.physics.add.staticGroup();
        this.lavaPools = this.physics.add.staticGroup();
        this.attackHitboxes = this.physics.add.staticGroup();
        this.endGems = this.physics.add.staticGroup();

        this.enemyBears = this.physics.add.group();
        this.physics.add.collider(this.enemyBears, this.platforms);
        this.physics.add.collider(this.enemyBears, this.enemyBarriers);

        this.enemyBarriers = this.physics.add.staticGroup();

        //prepare player
        this.player = this.physics.add.sprite(48, this.camHeight-200, 'playerIdle');
        this.player.setBounce(0);
        //this.player.setCollideWorldBounds(true);
        this.player.setBodySize(48,48);
        this.physics.add.collider(this.player, this.platforms);

        this.player.isAttacking = 0;
        this.player.isTakingDamage = 0;
        this.player.touchingLava = false;

        //player animations
        this.anims.create({
            key: 'playerIdleAnim',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'playerRunAnim',
            frames: this.anims.generateFrameNumbers('playerRun', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'playerJumpAnim',
            frames: this.anims.generateFrameNumbers('playerJump', { start: 0, end: 1 }),
            frameRate: 6,
        });

        this.anims.create({
            key: 'playerFallAnim',
            frames: this.anims.generateFrameNumbers('playerFall', { start: 0, end: 1 }),
            frameRate: 6,
        });

        this.anims.create({
            key: 'playerAttack1Anim',
            frames: this.anims.generateFrameNumbers('playerAttack1', { start: 0, end: 5 }),
            frameRate: 16,
            repeat: 0
        });

        this.anims.create({
            key: 'playerTakingDamageAnim',
            frames: this.anims.generateFrameNumbers('playerTakingDamage', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: 0
        });

        //world animations
        this.anims.create({
            key: 'collectibleCoinAnim',
            frames: this.anims.generateFrameNumbers('collectibleCoin', { start: 0, end: 7 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'collectibleGemAnim',
            frames: this.anims.generateFrameNumbers('collectibleGem', { start: 0, end: 4 }),
            frameRate: 16,
            repeat: -1
        });

        this.anims.create({
            key: 'lavaAnim',
            frames: this.anims.generateFrameNumbers('lava', { start: 0, end: 7 }),
            frameRate: 4,
            repeat: -1
        });

        //enemy animations
        this.anims.create({
            key: 'enemyBearRun',
            frames: this.anims.generateFrameNumbers('enemyBear', { start: 4, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        //setup controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.on('pointerdown', function (pointer)
        {
            if(this.player.isTakingDamage == 0 && this.player.isAttacking == 0)
            {
                this.createAttack(this.player.x, this.player.y);
            }
        }
        , this);

        //collisions
        this.physics.add.overlap(this.player, this.collectibles, this.collectCollectible, null, this);
        this.physics.add.overlap(this.player, this.lavaPools, this.lavaDamage, this.lavaPrecheck, this);
        this.physics.add.overlap(this.enemyBears, this.enemyBarriers, this.rerouteEnemy, null, this);
        this.physics.add.overlap(this.player, this.enemyBears, this.damageCharacter, null, this);
        this.physics.add.overlap(this.attackHitboxes, this.enemyBears, this.destroyEnemy, null, this);
        this.physics.add.overlap(this.player, this.endGems, this.endGame, null, this);
        

        //create world

        this.points = 0;
        this.lives = 3;

        this.createMap();

    }

    tileByCoord(x,y)
    {
        return y*(192/16) + x;
    }

    createPlatform(x,y, tileX, tileY)
    {
        let plat = this.platforms.create(x*32, this.camHeight-((y+1)*32), 'tiles', this.tileByCoord(tileX,tileY));
        plat.setBodySize(32,32);
        plat.setSize(32,32);
        plat.setScale(2,2);
        plat.setOrigin(0,0);
        plat.setOffset(8,8);

        if(this.platformMap[x] == undefined)
        {
            this.platformMap[x] = [];
        }

        this.platformMap[x][y] = plat;
    }

    createCollectible(x, y)
    {
        let collectible = this.collectibles.create(x*32, this.camHeight-(y*32), 'collectibleCoin');
        collectible.setBodySize(32,32);
        collectible.setSize(32,32);
        collectible.setScale(2,2);
        collectible.setOrigin(0,0);
        collectible.setOffset(8,8);
        collectible.anims.play('collectibleCoinAnim', true);

    }

    createEndGem(x,y)
    {
        let endGem = this.endGems.create(x*32, this.camHeight-(y*32), 'collectibleGem');
        endGem.setBodySize(32,32);
        endGem.setSize(32,32);
        endGem.setScale(2,2);
        endGem.setOrigin(0,0);
        endGem.setOffset(8,8);
        endGem.anims.play('collectibleGemAnim', true);
    }

    createLavaPool(x, y)
    {
        let lavaPool = this.lavaPools.create(x*32, this.camHeight-(y*32), 'lava');
        /*lavaPool.setBodySize(48,48);
        lavaPool.setSize(48,48);
        lavaPool.setOrigin(0,0);*/
        lavaPool.setBodySize(32,32);
        lavaPool.setSize(32,32);
        lavaPool.setScale(32/48,32/48);
        lavaPool.setOrigin(0,0);
        lavaPool.setOffset(24,24);
        lavaPool.anims.play('lavaAnim', true);
    }

    createEnemy(x,y)
    {
        let enemyBear = this.enemyBears.create(x*32, this.camHeight-((y+1)*32), 'enemyBear');
        enemyBear.setOrigin(0,0);
        enemyBear.setVelocityX(100);
        enemyBear.anims.play('enemyBearRun', true);

        //console.log(enemyBear.flipX);
    }

    createEnemyBarrier(x,y)
    {
        let enemyBarrier = this.enemyBarriers.create(x*32, this.camHeight-((y+1)*32));
        enemyBarrier.setOrigin(0,0);
        enemyBarrier.setBodySize(32,32);
        enemyBarrier.setOffset(16,16);
        enemyBarrier.visible = false;
    }

    createAttack(x, y)
    {
        if(this.player.flipX == true)
        {
            this.player.attackHitbox = this.attackHitboxes.create(x-72, y-24);
        }
        else
        {
            this.player.attackHitbox = this.attackHitboxes.create(x+24, y-24);
        }
        
        this.player.attackHitbox.setOrigin(0,0);
        this.player.attackHitbox.setBodySize(48,48);
        this.player.attackHitbox.setOffset(16,16);
        this.player.attackHitbox.visible = false;

        this.player.isAttacking = 1;

        let self = this;
        setTimeout(() => {
            this.player.attackHitbox.destroy();
        }, 200, self)

    }

    collectCollectible(player, collectible)
    {
        collectible.disableBody(true,true);
        this.events.emit('addScore');
    }

    lavaPrecheck(player, lava)
    {
        if(player.touchingLava == false)
        {
            player.touchingLava = true;
            return true;
        }
        else
        {
            return false;
        }
    }

    lavaDamage(player, lava)
    {
        player.x = 48;
        player.y = this.camHeight-200;
        this.damageCharacter();
    }

    rerouteEnemy(enemy, barrier)
    {
        enemy.setFlipX(!enemy.flipX);
        enemy.setVelocityX(enemy.body.velocity.x * -1);
    }

    damageCharacter()
    {
        if(this.player.isTakingDamage == 0)
        {
            this.player.isTakingDamage = 1;
            this.events.emit('reduceLives');
        }
        
    }

    destroyEnemy(attackHitbox, enemy)
    {
        enemy.destroy();
    }

    createMap()
    {

        //lava pools

        for(let i = 0; i < 60; i++)
        {
            this.createLavaPool(i,1);
        }
        
        /*this.createLavaPool(12,1);
        this.createLavaPool(13,1);
        this.createLavaPool(14,1);
        this.createLavaPool(15,1);
        this.createLavaPool(16,1);
        this.createLavaPool(17,1);
        this.createLavaPool(18,1);
        this.createLavaPool(19,1);
        this.createLavaPool(20,1);
        this.createLavaPool(21,1);
        this.createLavaPool(22,1);
        this.createLavaPool(23,1);
        this.createLavaPool(24,1);
        this.createLavaPool(25,1);*/


        //base layer
        for(let i = 0; i < 11; i++)
        {
            this.createPlatform(i,0,4,2);
        }

        //platform 1
        this.createPlatform(0,1,3,1);
        this.createPlatform(1,1,4,1);
        this.createPlatform(2,1,3,1);
        this.createPlatform(3,1,4,1);
        this.createPlatform(4,1,3,1);
        this.createPlatform(5,1,4,1);
        this.createPlatform(6,1,3,1);
        this.createPlatform(7,1,4,1);
        this.createPlatform(8,1,3,1);
        this.createPlatform(9,1,4,1);
        this.createPlatform(10,1,3,1);
        this.createPlatform(11,1,5,1);
        this.createPlatform(11,0,6,3);

        this.createPlatform(14,3,8,3);
        this.createPlatform(15,3,9,3);
        this.createPlatform(16,3,8,3);
        this.createPlatform(17,3,10,3);

        this.createPlatform(11,6,8,3);
        this.createPlatform(10,6,9,3);
        this.createPlatform(9,6,8,3);
        this.createPlatform(8,6,10,3);

        this.createEnemyBarrier(16,10);
        this.createPlatform(17,9,8,3);
        this.createPlatform(18,9,9,3);
        this.createPlatform(19,9,8,3);
        this.createPlatform(20,9,10,3);
        this.createEnemyBarrier(21,10);

        this.createPlatform(25,6,2,1);
        this.createPlatform(25,5,1,3);
        this.createPlatform(25,4,1,3);
        this.createPlatform(25,3,1,3);
        this.createPlatform(25,2,1,3);
        this.createPlatform(25,1,1,3);
        this.createPlatform(25,0,1,3);
        this.createPlatform(26,6,5,1);
        this.createPlatform(26,5,5,2);
        this.createPlatform(27,5,4,1);
        this.createPlatform(28,5,4,1);
        this.createPlatform(29,5,4,1);
        this.createPlatform(30,5,5,1);
        this.createPlatform(30,4,6,3);
        this.createPlatform(30,3,6,3);
        this.createPlatform(30,2,6,3);
        this.createPlatform(30,1,6,3);
        this.createPlatform(30,0,6,3);

        this.createPlatform(34,7,8,3);
        this.createPlatform(35,7,9,3);
        this.createPlatform(36,7,8,3);
        this.createPlatform(37,7,8,3);
        this.createPlatform(38,7,8,3);

        /*this.createPlatform(32,1,2,1);
        this.createPlatform(32,0,1,3);
        this.createPlatform(33,1,4,1);
        this.createPlatform(34,1,4,1);
        this.createPlatform(35,1,4,1);
        this.createPlatform(36,1,4,1);*/
        this.createPlatform(37,1,2,1);
        this.createPlatform(38,1,5,1);

        this.createEnemyBarrier(41,2);
        this.createPlatform(42,1,2,1);
        this.createPlatform(43,1,4,1);
        this.createPlatform(44,1,4,1);
        this.createPlatform(45,1,4,1);
        this.createPlatform(46,1,5,1);
        this.createEnemyBarrier(47,2);

        this.createPlatform(50,4,8,3);
        this.createPlatform(51,4,8,3);
        this.createPlatform(52,4,8,3);
        this.createPlatform(53,4,8,3);

        this.createEnemyBarrier(45,8);
        this.createPlatform(44,7,8,3);
        this.createPlatform(43,7,8,3);
        this.createPlatform(42,7,8,3);
        this.createEnemyBarrier(41,8);

        this.createEnemyBarrier(49,11);
        this.createPlatform(50,10,8,3);
        this.createPlatform(51,10,8,3);
        this.createPlatform(52,10,8,3);
        this.createPlatform(53,10,8,3);
        this.createEnemyBarrier(54,11);

        this.createEnemyBarrier(45,14);
        this.createPlatform(44,13,8,3);
        this.createPlatform(43,13,8,3);
        this.createPlatform(42,13,8,3);
        this.createEnemyBarrier(41,14);


        

        //collectibles
        this.createCollectible(4,4);
        this.createCollectible(19,6);
        this.createCollectible(44,3);

        this.createEndGem(50,18);


        

        this.createEnemy(17, 10);
        this.createEnemy(42, 2);
        this.createEnemy(44, 8);
        this.createEnemy(50, 11);
        this.createEnemy(44, 14);

        
    }

    endGame()
    {
        this.events.emit('gameWin');
    }

    

    update()
    {
        //this.cameras.main.scrollX++;

        if((this.player.x > this.cameras.main.width/2) && (this.player.x < this.cameras.main.width*1.5))
        {
            this.cameras.main.scrollX = this.player.x - this.cameras.main.width/2;

            for(let i = 0; i < this.skyImageArr1.length; i++)
            {
                this.skyImageArr1[i].x = (this.cameras.main.width*i) + (this.player.x - this.cameras.main.width/2)/2;
            }

            for(let i = 0; i < this.skyImageArr0.length; i++)
            {
                this.skyImageArr0[i].x = (this.cameras.main.width*i) + (this.player.x - this.cameras.main.width/2);
            }
        }
        else if(this.player.x < this.cameras.main.width/2)
        {
            this.cameras.main.scrollX = 0;

            for(let i = 0; i < this.skyImageArr1.length; i++)
            {
                this.skyImageArr1[i].x = (this.cameras.main.width*i);
            }

            for(let i = 0; i < this.skyImageArr0.length; i++)
            {
                this.skyImageArr0[i].x = (this.cameras.main.width*i);
            }
        }
        else if(this.player.x > this.cameras.main.width*1,5)
        {
            this.cameras.main.scrollX = this.cameras.main.width*1,5;

            for(let i = 0; i < this.skyImageArr1.length; i++)
            {
                this.skyImageArr1[i].x = (this.cameras.main.width*i) + this.cameras.main.width/2;
            }

            for(let i = 0; i < this.skyImageArr0.length; i++)
            {
                this.skyImageArr0[i].x = (this.cameras.main.width*i) + this.cameras.main.width;
            }
        }

        this.player.touchingLava = false;

        if(this.player.isAttacking == 0 )
        {
            if (this.cursors.left.isDown)
            {
                this.player.setVelocityX(-200);
            }
            else if (this.cursors.right.isDown)
            {
                this.player.setVelocityX(200);
            }
            else
            {
                this.player.setVelocityX(0);
            }

            if (this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-500);
            }

            //set player orientation
            if(this.player.body.velocity.x < 0)
            {
                this.player.setFlipX(true);
            }
            else if(this.player.body.velocity.x > 0)
            {
                this.player.setFlipX(false);
            }

            
        }
        
        if(this.player.isAttacking == 1 && this.player.isTakingDamage == 0)
        {
            if(this.player.anims.currentAnim != null)
            {
                if(this.player.anims.currentAnim.key != 'playerAttack1Anim')
                {
                    this.player.anims.play('playerAttack1Anim', true);
                    this.player.setVelocityX(0);

                }
                else if(this.player.anims.isPlaying == false)
                {
                    this.player.isAttacking = 0;
                }
            }
            else
            {
                this.player.anims.play('playerIdleAnim', true);
            }
        }
        else if(this.player.isTakingDamage == 1)
        {
            if(this.player.anims.currentAnim != null)
            {
                if(this.player.anims.currentAnim.key != 'playerTakingDamageAnim')
                {
                    this.player.anims.play('playerTakingDamageAnim', true);
                }
                else if(this.player.anims.isPlaying == false)
                {
                    this.player.isTakingDamage = 0;
                }
            }
            else
            {
                this.player.anims.play('playerIdleAnim', true);
            }
        }

        if(this.player.isTakingDamage == 0 && this.player.isAttacking == 0)
        {
            //run animations
            if(this.player.body.touching.down)
            {
                if(this.player.body.velocity.x < 0)
                {
                    this.player.anims.play('playerRunAnim', true);
                }
                else if(this.player.body.velocity.x > 0)
                {
                    this.player.anims.play('playerRunAnim', true);
                }
                else if(this.player.body.velocity.x == 0)
                {
                    this.player.anims.play('playerIdleAnim', true);
                }
            }
            else
            {
                if(this.player.body.velocity.y < 0)
                {
                    this.player.anims.play('playerJumpAnim', true);
                }

                if(this.player.body.velocity.y > 0)
                {
                    this.player.anims.play('playerFallAnim', true);
                }
            }
        }

        
    }
}

class UIScene extends Phaser.Scene
{
    constructor ()
    {
        super({ key: 'UIScene', active: true });

        this.score = 0;
        this.hasEnded = 0;
    }

    preload()
    {
        this.load.spritesheet('text', './assets/UI/text_fx.png', { frameWidth: 10, frameHeight: 16 });
        this.load.spritesheet('heart', './assets/UI/hearts.png', { frameWidth: 16, frameHeight: 16 });
    }

    create ()
    {
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.UI_points = this.physics.add.staticGroup();
        this.UI_lives = this.physics.add.staticGroup();

        this.points = 0;
        this.lives = 3;

        this.scene.get('GameScene').events.on('addScore', this.addPoint, this);
        this.scene.get('GameScene').events.on('reduceLives', this.reduceLives, this);
        this.scene.get('GameScene').events.on('gameWin', this.showWinScreen, this);

        console.log(this.scene.get('GameScene').scene);

        this.updateUI();
    }

    update()
    {
        /*if (this.restartKey.isDown && this.hasEnded == 1)
        {
            this.scene.get('GameScene').scene.restart();
            //this.scene.restart();
        }*/
    }

    addPoint()
    {
        this.points++;
        this.updateUI();
    }

    reduceLives()
    {
        this.lives--;
        this.updateUI();
        if(this.lives <= 0)
        {
            this.showLoseScreen();
            //showLoseScreen();
            //this.scene.get('GameScene').restart();
            //this.restart();
            //this.scene.get('GameScene').pause();
        }
    }

    showLoseScreen()
    {
        this.hasEnded = 1;
        this.scene.get('GameScene').scene.pause();
        let text = this.add.text(this.cameras.main.width/2, this.cameras.main.height/2, `GAME OVER\n Points: ${this.points}`, { font: '"Press Start 2P"'});
        text.setScale(6,6);
        text.x = text.x - (text.width/2)*6;
        text.y = text.y - (text.height/2)*6;
        console.log(text);
    }

    showWinScreen()
    {
        this.hasEnded = 1;
        this.scene.get('GameScene').scene.pause();
        let text = this.add.text(this.cameras.main.width/2, this.cameras.main.height/2, `YOU WON\n Points: ${this.points}`, { font: '"Press Start 2P"' });
        text.setScale(6,6);
        text.x = text.x - (text.width/2)*6;
        text.y = text.y - (text.height/2)*6;
        console.log(text);
    }

    updateUI(){

        this.UI_lives.clear(true, true);

        for(let i = 0; i < 3; i++)
        {
            if(this.lives > i)
            {
                let lives_heart = this.UI_lives.create(i*32, 0, 'heart', 1);
                lives_heart.setBodySize(32,32);
                lives_heart.setSize(32,32);
                lives_heart.setScale(2,2);
                lives_heart.setOrigin(0,0);
                lives_heart.setOffset(8,8);
            }
            else
            {
                let lives_heart = this.UI_lives.create(i*32, 0, 'heart', 3);
                lives_heart.setBodySize(32,32);
                lives_heart.setSize(32,32);
                lives_heart.setScale(2,2);
                lives_heart.setOrigin(0,0);
                lives_heart.setOffset(8,8);
            }
        }

        this.UI_points.clear(true, true);

        let pointsText = `${this.points}`;
        for(let i = 0; i < pointsText.length; i++) 
        {
            let points_digit = this.UI_points.create(i*20, 32, 'text', Number(pointsText.charAt(i)));
            points_digit.setBodySize(20,32);
            points_digit.setSize(20,32);
            points_digit.setScale(2,2);
            points_digit.setOrigin(0,0);
            points_digit.setOffset(5,8);
        }

    }
}


//game config
const config = {
    type: Phaser.AUTO,
    width: 600*1.6,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 1000 }
        }
    },
    pixelArt: true,
    scene: [GameScene, UIScene]
};

const game = new Phaser.Game(config);