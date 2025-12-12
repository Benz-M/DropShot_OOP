// Player controls (keyboard/gamepad) with shuttlecock integration
import { Shuttlecock } from "/js/objects/Shuttlecock.js";
import { AudioSystem } from "./systems/AudioSystem.js";
import { AudioPreload } from "./assets.js";

export function Movement(app, Player1, keys, Player2) { //<- Movement Logic 

    const audiosystem = app.audio || new AudioSystem(); // reuse existing audio system when available
    app.audio = audiosystem;
    if (!app.audioInitialized) {
        AudioPreload(audiosystem);
        app.audioInitialized = true;
    }

    let lastDirection1 = null;
    let lastDirection2 = null;

    const gravity = 0.8;
    const jumpStrength = -15;

    // Initialize player physics state using Player API
    Player1.setVy(0);
    Player1.setJumping(false);
    Player1.setGroundY(Player1.getY());
    Player1.setFacing('right');
    Player1.setHitting(false);

    Player2.setVy(0);
    Player2.setJumping(false);
    Player2.setGroundY(Player2.getY());
    Player2.setFacing('left');
    Player2.setHitting(false);

    window.addEventListener('keydown', (e) => keys[e.keyCode] = true); // KeyStrokeDetection

    window.addEventListener('keyup', (e) => { // Release of KeyStroke
        keys[e.keyCode] = false;

        if (e.keyCode === 70) Player1.setHitting(false); // F
        if (e.keyCode === 76) Player2.setHitting(false); // L
        if (e.keyCode === 77) Player2.setHitting(false); // M
        if (e.keyCode === 69) Player1.setHitting(false); // E
        if (e.keyCode === 17) Player2.setHitting(false); // CTRL
    });

    app.ticker.add(() => {

        // Player 1 Movement Logic
        let moving1 = false;
        let direction1 = null;

        // Gravity
        let vy1 = Player1.getVy();
        vy1 += gravity;
        Player1.setVy(vy1);
        Player1.setPosition(Player1.getX(), Player1.getY() + vy1);

        // Landing detection
        if (Player1.getY() >= Player1.getGroundY()) {
            Player1.setPosition(Player1.getX(), Player1.getGroundY());
            Player1.setVy(0);

            if (Player1.isJumping()) {
                Player1.setJumping(false);
                Player1.setState('stand');
                Player1.setFacing(Player1.getFacing());
                Player1.stop();
            }
        }

        // Move Left (A)
        if (keys[65]) {
            Player1.move(-2);
            moving1 = true;
            direction1 = "left";
            Player1.setFacing("left");
        }

        // Move Right (D)
        if (keys[68]) {
            Player1.move(2);
            moving1 = true;
            direction1 = "right";
            Player1.setFacing("right");
        }

        // Jump (SPACE)
        if (keys[32] && !Player1.isJumping()) {
            app.audio.playSound('jump');
            Player1.setVy(jumpStrength);
            Player1.setJumping(true);
            Player1.setState('jump');
            Player1.setScale(0.3, 0.3);
        }

        // Walk animations
        if (!Player1.isJumping()) {
            if (direction1 && direction1 !== lastDirection1) {
                Player1.setState('walk');
                Player1.setFacing(direction1 === "left" ? 'left' : 'right');
                Player1.play();
                lastDirection1 = direction1;
            }

            // If stop moving stops the animation
            if (!moving1) {
                Player1.stop();
                lastDirection1 = null;
            }
        }

        // Player 2 Logic
        let moving2 = false;
        let direction2 = null;

        // Gravity
        let vy2 = Player2.getVy();
        vy2 += gravity;
        Player2.setVy(vy2);
        Player2.setPosition(Player2.getX(), Player2.getY() + vy2);

        // Landing Detection
        if (Player2.getY() >= Player2.getGroundY()) {
            Player2.setPosition(Player2.getX(), Player2.getGroundY());
            Player2.setVy(0);

            if (Player2.isJumping()) {
                Player2.setJumping(false);
                Player2.setState('stand');
                Player2.setFacing(Player2.getFacing());
                Player2.stop();
            }
        }

        // Move Left (Arrow Left)
        if (keys[37]) {
            Player2.move(-2);
            moving2 = true;
            direction2 = "left";
            Player2.setFacing("left");
        }

        // Move Right (Arrow Right)
        if (keys[39]) {
            Player2.move(2);
            moving2 = true;
            direction2 = "right";
            Player2.setFacing("right");
        }

        // Jump (Arrow Up)
        if (keys[38] && !Player2.isJumping()) {
            app.audio.playSound('jump');
            Player2.setVy(jumpStrength);
            Player2.setJumping(true);
        }

        // Walk animations
        if (!Player2.isJumping()) {
            if (direction2 && direction2 !== lastDirection2) {
                Player2.setState('walk');
                Player2.setFacing(direction2 === "left" ? 'left' : 'right');
                Player2.play();
                lastDirection2 = direction2;
            }

            // Detects again if stops
            if (!moving2) {
                Player2.stop();
                lastDirection2 = null;
            }
        }

        // Jump animations
        if (Player2.isJumping()) {
            Player2.setState('jump');
            Player2.setFacing(Player2.getFacing());
        }

        // Shuttle Cock Hits & Smash Logic
        // Player 1 Serving (E key) or Hitting
        if (!window.currentShuttlecock && keys[69] && Player1.isServing()) { // E key - SERVE
            app.audio.playSound('hit');
            window.currentShuttlecock = new Shuttlecock(app, // Create shuttlecock if no current shuttlecocks exist
                Player1.getX(),
                Player1.getY() - Player1.getHeight() * 0.4,
                { x: 0, y: 0 }
            );
            Player1.setState('hit'); 
            window.currentShuttlecock.launchVertical(12); // Launchs up
        }

        // Player 1 Regular Hit (F key)
        if (window.currentShuttlecock && keys[70]) { // F key
            app.audio.playSound('hit');
            Player1.setState(Player1.isJumping() ? 'jumpHit' : 'hit');
            Player1.setScale(0.3, 0.3);

            if (window.currentShuttlecock.isAlignedWith(Player1, 50)) { // if its in the same x axis as the shuttlecock 
                window.currentShuttlecock.launchCrossCourt(Player1.getFacing(), 9, -6); // it will launch the shuttlecock
            }
        }

        // Player 2 Serving (CTRL key) or Hitting
        if (!window.currentShuttlecock && keys[17] && Player2.isServing()) { // CTRL key - SERVE
            app.audio.playSound('hit');
            window.currentShuttlecock = new Shuttlecock(app, // Create shuttlecock if no current shuttlecocks exist
                Player2.getX(),
                Player2.getY() - Player2.getHeight() * 0.4,
                { x: 0, y: 0 }
            );
            Player2.setState('hit'); 
            window.currentShuttlecock.launchVertical(12); // Launchs up
        }

        // Player 2 Regular Hit (M key)
        if (keys[77]) { // M key
            app.audio.playSound('hit');
            Player2.setState(Player2.isJumping() ? 'jumpHit' : 'hit');
            Player2.setScale(-0.3, 0.3);

            if (window.currentShuttlecock && window.currentShuttlecock.isAlignedWith(Player2, 30)) { // if the player is in the same x axis as the shuttlecock
                window.currentShuttlecock.hitBy(Player2); // sets who hits 
            }
        }

        if (window.currentShuttlecock) {
            window.currentShuttlecock.update(1, app.screen.height - 50);

            if (!window.currentShuttlecock.isAlive()) {
                window.currentShuttlecock.destroy();
                window.currentShuttlecock = null;
            }
        }

    }); // END
} 
