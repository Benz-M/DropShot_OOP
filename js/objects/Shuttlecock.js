//File Purpose: Handles ShuttleCock Class
import { Sprite, Texture } from "https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs";

// Shuttlecock encapsulates physics and presentation for the projectile.
// Implements: Encapsulation (private fields), Abstraction,
export class Shuttlecock {
    #app;
    #sprite;
    #position;
    #velocity;
    #gravity = 0.35;
    #drag = 0.995;
    #bounce = 0.25;
    #alive = true;
    #groundOffset = 15;
    #width = 15;
    #height = 15;

    constructor(app, x, y, velocity) {
        this.#app = app;

        this.#sprite = new Sprite(Texture.from("assets/images/match/ShuttleCock.png")); // Load shuttlecock texture
        this.#sprite.anchor.set(0.5);
        this.#sprite.width = this.#width;
        this.#sprite.height = this.#height;

        this.#position = { x, y };
        this.#velocity = { x: velocity.x ?? 0, y: velocity.y ?? 0 }; // Initial velocity

        this.#sprite.x = x;
        this.#sprite.y = y;

        app.stage.addChild(this.#sprite);
    }

// Update method to handle physics and position
    update(delta, floorY) {
        if (!this.#alive) return;

        // Apply physics
        this.#velocity.y += this.#gravity * delta;
        this.#velocity.x *= this.#drag;
        this.#velocity.y *= this.#drag;

        // Update position
        this.#position.x += this.#velocity.x * delta;
        this.#position.y += this.#velocity.y * delta;

        // Update sprite position
        this.#sprite.x = this.#position.x;
        this.#sprite.y = this.#position.y;

        // Floor collision
        if (this.#position.y + this.#groundOffset >= floorY) {
            this.#position.y = floorY - this.#groundOffset;
            this.#velocity.y = -Math.abs(this.#velocity.y) * this.#bounce;

            if (Math.abs(this.#velocity.y) < 0.8) {
                this.#alive = false;
            }
        }
    }

    destroy() { // Clean up the sprite from the stage
        if (this.#sprite.parent) {
            this.#sprite.parent.removeChild(this.#sprite);
        }
    }

    // Launchers / actions
    launchVertical(power = 10) {
        this.#velocity.x = 0;
        this.#velocity.y = -power;
    }

    launchCrossCourt(direction = "right", powerX = 9, powerY = -6) { // direction: "left" or "right"
        this.#velocity.x = direction === "right" ? powerX : -powerX;
        this.#velocity.y = powerY;
    }

    hitBy(player) { // player: instance of BasePlayer or object with getX(), getY(), getFacing()
        const dir = (typeof player.getFacing === 'function' ? player.getFacing() : player.facing) === "right" ? 1 : -1;
        this.#velocity.x = 7 * dir;
        this.#velocity.y = -7;
    }

    isAlignedWith(player, range = 50) {
        const px = (typeof player.getX === 'function') ? player.getX() : player.x;
        const py = (typeof player.getY === 'function') ? player.getY() : player.y;
        const dx = Math.abs(this.#position.x - px);
        const dy = Math.abs(this.#position.y - py);
        return dx < range || dy < range;
    }

// Public getter & setter Methods | Part of Abstraction
    getPosition() {
        return { x: this.#position.x, y: this.#position.y };
    }

    getX() { return this.#position.x; }
    getY() { return this.#position.y; }

    setPosition(x, y) {
        this.#position.x = x;
        this.#position.y = y;
        this.#sprite.x = x;
        this.#sprite.y = y;
    }

    getVelocity() { return { x: this.#velocity.x, y: this.#velocity.y }; }
    setVelocity(vx, vy) { this.#velocity.x = vx; this.#velocity.y = vy; }

    getWidth() { return this.#width; }
    getHeight() { return this.#height; }

    getBounds() {
        return {
            left: this.#position.x - this.#width / 2,
            right: this.#position.x + this.#width / 2,
            top: this.#position.y - this.#height / 2,
            bottom: this.#position.y + this.#height / 2,
        };
    }

    isAlive() { 
        return this.#alive; 
    }

    reflectX() {
        this.#velocity.x = -this.#velocity.x;
    }

    reflectY() {
        this.#velocity.y = -this.#velocity.y;
    }

    applyImpulse(dx, dy) { // Apply an impulse to the shuttlecock's velocity
        this.#velocity.x += dx;
        this.#velocity.y += dy;
    }

    reset(x, y, velocity = { x: 0, y: 0 }) {
        this.#position.x = x;
        this.#position.y = y;
        this.#velocity.x = velocity.x;
        this.#velocity.y = velocity.y;
        this.#alive = true;
        this.#sprite.x = x;
        this.#sprite.y = y;
    }
}
