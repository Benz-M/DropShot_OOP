// Loader for images/audio
import {Texture,Sprite} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';
import {Player1,Player2} from '/js/objects/Players.js';



export function Player_Initilization(app, StartBlock) { // <- Player Creation from its Class
    const p1 = new Player1(app, StartBlock);
    const p2 = new Player2(app, StartBlock);

    // Return player instances. Callers should use the Player API.
    return { Player1: p1, Player2: p2 };
}

export async function AudioPreload(audioSystem) { // Preload Audio so that it reduces the load
    try {
        await audioSystem.loadMusic('mainMenu', '/assets/audio/MenuMusic.mp3');
        await audioSystem.loadMusic('gameplay', '/assets/audio/MainGameMusicx.mp3');
        await audioSystem.loadSound('click', '/assets/audio/ButtonClick.mp3');
        await audioSystem.loadSound('hit', '/assets/audio/HitSFX.wav');
        await audioSystem.loadSound('jump', '/assets/audio/JumpSFX.mp3');
        await audioSystem.loadMusic('Countdown', '/assets/audio/Countdown.mp3');
        await audioSystem.loadSound('score', '/assets/audio/ScoreSFX.mp3');
        await audioSystem.loadMusic('Victory', '/assets/audio/VictoryMusic.mp3');    
        console.log('All audio files loaded successfully');
    } catch (error) {
        console.warn('Some audio files failed to load:', error);
    }
    return audioSystem
}


export async function ScoreBoard_Initilization(app) { // Sets Animation when Starting
    const Number1_T = Texture.from('assets/images/ScoreBoard/1.png');
    const Number2_T = Texture.from('assets/images/ScoreBoard/2.png');
    const Number3_T = Texture.from('assets/images/ScoreBoard/3.png');
    const Start_T = Texture.from('assets/images/match/Start.png');

    const Number1 = new Sprite(Number1_T);
    const Number2 = new Sprite(Number2_T);
    const Number3 = new Sprite(Number3_T);
    const Start = new Sprite(Start_T);

    [Number1,Number2,Number3,Start].forEach(sprite => {
        sprite.width = 50;
        sprite.height = 50;
    });

    [Number1, Number2, Number3, Start].forEach(sprite => {
        sprite.anchor.set(0.5); 
        sprite.x = app.screen.width / 2;
        sprite.y = app.screen.height / 2;
        sprite.scale.set(0); 
        app.stage.addChild(sprite);
    });

    // Helper function for animation
    function animateSprite(sprite, duration = 1000) {
        return new Promise(resolve => {
            let elapsed = 0;
            const targetScale = 0.1;

            const ticker = new PIXI.Ticker();
            ticker.add(delta => {
                elapsed += delta * (1000 / 60); 
                sprite.scale.set(Math.min(targetScale, elapsed / duration));
                if (elapsed >= duration) {
                    ticker.stop();
                    resolve();
                }
            });
            ticker.start();
        });
    }

    // Countdown sequence
    await animateSprite(Number3); // show 3
    app.stage.removeChild(Number3);

    await animateSprite(Number2); // show 2
    app.stage.removeChild(Number2);

    await animateSprite(Number1); // show 1
    app.stage.removeChild(Number1);

    await animateSprite(Start); // show START!
    app.stage.removeChild(Start);
}