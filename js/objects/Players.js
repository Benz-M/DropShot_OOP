// File Purpose: Handles Player Class
import {AnimatedSprite, Texture } from "https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs"; // Importation

// BasePlayer implements Encapsulation and Abstraction for player entities.
class BasePlayer { //Parent Class   
    
    // Private Fields | Part of Encapsulation
    #app;
    #sprite;
    #animations;
    #width;
    #height;
    #vy = 0;
    #isJumping = false;
    #groundY = 0;
    #facing = 'right';
    #scaleMagnitude = 0.3;
    #isHitting = false;
    #isServing = false;

    constructor(app, startX, startY, width, height, animations, flip) {
        this.#app = app; 
        this.#animations = animations;
        this.#width = width;
        this.#height = height;

        this.#sprite = new AnimatedSprite(Array.isArray(animations.stand) ? animations.stand : [animations.stand]); // Handles How the animation plays for the character
        this.#sprite.animationSpeed = 0.1;
        this.#sprite.loop = true;
        this.#sprite.play();

        this.#sprite.width = width;
        this.#sprite.height = height;

        this.#sprite.anchor.set(0.5, 1);
        this.#sprite.x = startX;
        this.#sprite.y = startY;

        this.#facing = flip ? 'left' : 'right';
        this.#sprite.scale.x = flip ? -this.#scaleMagnitude : this.#scaleMagnitude;
        this.#sprite.scale.y = this.#scaleMagnitude;

        this.#app.stage.addChild(this.#sprite);
    }

// Public getter & setter Methods | Part of Abstraction
    getSprite() { 
        return this.#sprite; 
    }

    getPosition() { 
        return { x: this.#sprite.x, y: this.#sprite.y }; 
    }
    getX() { 
        return this.#sprite.x; 
    }
    getY() { 
        return this.#sprite.y; 
    }
    setPosition(x, y) { 
        this.#sprite.x = x; this.#sprite.y = y; 
    }
    getWidth() { 
        return this.#width; 
    }
    getHeight() { 
        return this.#height; 
    }
    getBounds() {
        return { 
            left: this.getX() - this.#width/2, right: this.getX() + this.#width/2, top: this.getY() - this.#height, bottom: this.getY()
        };
    }

    getVy() { 
        return this.#vy; 
    }
    setVy(v) { 
        this.#vy = v; 
    }
    isJumping() { 
        return this.#isJumping; 
    }
    setJumping(v) { 
        this.#isJumping = v; 
    }
    getGroundY() { 
        return this.#groundY;
    }
    setGroundY(y) { 
        this.#groundY = y; 
    }
    isHitting() { 
        return this.#isHitting; 
    }
    setHitting(v) { 
        this.#isHitting = v; 
    }
    isServing() { 
        return this.#isServing; 
    }
    setServing(v) { 
        this.#isServing = v; 
    }

    setFacing(dir) {
        this.#facing = dir;
        const mag = Math.abs(this.#sprite.scale.x) || this.#scaleMagnitude;
        this.#sprite.scale.x = dir === 'left' ? -mag : mag;
    }
    getFacing() { 
        return this.#facing; 
    }
        
    setScale(x,y) { 
        this.#sprite.scale.x = x; this.#sprite.scale.y = y; 
    }

    setState(state) {
        const anim = this.#animations[state];
        if (!anim) return;
        const textures = Array.isArray(anim) ? anim : [anim];
        this.#sprite.textures = textures;
        if (state === 'stand' || state === 'lose' ) {
            this.#sprite.stop();
        } else {
            this.#sprite.play();
        }
    }
    play() { 
        this.#sprite.play(); 
    }
    stop() { 
        this.#sprite.stop(); 
    }

    move(dx) { 
        this.#sprite.x += dx; 
    }
    jump(strength) { 
        this.#vy = strength; this.#isJumping = true; this.setState('jump'); 
    }
}

// Child Classe inherits from BasePlayer
export class Player1 extends BasePlayer {
    constructor(app, StartBlock) {
        const animations = {
            stand:[Texture.from("assets/images/Player1/Player1_Stand.png")],
            walk: [
                Texture.from("assets/images/Player1/Player1_Stand.png"),
                Texture.from("assets/images/Player1/Player1_Walk1.png"),
                Texture.from("assets/images/Player1/Player1_Walk2.png"),
            ],
            jump: [Texture.from("assets/images/Player1/Player1_Jump.png")],
            hit:  [Texture.from("assets/images/Player1/Player1_Hit.png")],
            jumpHit: [Texture.from("assets/images/Player1/Player1_Jumphit.png")],
            victory: Texture.from("assets/images/Player1/Player1_Victory.png"),
            lose:    Texture.from("assets/images/Player1/Player1_Defeat.png"),
        };

        super(
            app,
            50,
            app.screen.height - StartBlock.height + 6,
            90,
            110,
            animations,
            false
        );
        this.setGroundY(app.screen.height - StartBlock.height + 6);
    }
}

// Child Classe inherits from BasePlayer
export class Player2 extends BasePlayer {
    constructor(app, StartBlock) {
        const animations = {
            stand: [Texture.from("assets/images/Player2/Player2_Stand.png")],
            walk: [
                Texture.from("assets/images/Player2/Player2_Stand.png"),
                Texture.from("assets/images/Player2/Player2_Walk1.png"),
                Texture.from("assets/images/Player2/Player2_Walk2.png"),
            ],
            jump: [Texture.from("assets/images/Player2/Player2_Jump2.png")],
            hit: [
                Texture.from("assets/images/Player2/Player2_Hit.png"),
                Texture.from("assets/images/Player2/Player2_Stand.png"),
            ],
            jumpHit: [Texture.from("assets/images/Player2/Player2_JumpHit.png")],
            victory: Texture.from("assets/images/Player2/Player2_Victory.png"),
            lose:    Texture.from("assets/images/Player2/Player2_Defeat.png"),
        };

        super(
            app,
            440,
            app.screen.height - StartBlock.height + 10,
            90,
            110,
            animations,
            true
        );
        this.setGroundY(app.screen.height - StartBlock.height + 10);
    }
}
