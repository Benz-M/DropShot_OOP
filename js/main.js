import {Application} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import { AudioPreload} from '/js/assets.js';
import { MenuUILoader,MenuLoader} from './ui/Menu.js';
import { AudioSystem,startMenuMusic } from '/js/systems/AudioSystem.js';
import { startGame } from '/js/config.js';
let gameBoard = document.getElementById('gameBoard'); // Canvas
let menuMusicStarted = false; // Track if menu music has been started

// MAIN GAME
// OR STARTING POINT OF GAME 

(async () => { // Game Start
    const app = new Application({background: "#c16d6dff",width: 500,height: 500,view: gameBoard});
    document.body.appendChild(app.view);
    
    // Starts Audio System
    const audioSystem = new AudioSystem();
    app.audio = audioSystem;
    await AudioPreload(audioSystem);
    
    
    // Load Main Menu
    await MenuLoader(app);
    MenuUILoader(app, () => {
        app.audio.playSound('click');
        app.audio.stopMusic();  // Stop menu music completely before starting game
        menuMusicStarted = false; // Reset the flag
        setTimeout(() => { 
            startGame(app);}, 10);});
            menuMusicStarted = startMenuMusic(app,menuMusicStarted); // Start menu music immediately after menu loads
})();
