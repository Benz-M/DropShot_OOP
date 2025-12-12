// Match start/end logic
import {Texture,Sprite} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';


// Handles Match ending scene when One player wins the game
export function matchEnd(app, winnerPlayer, Player1, Player2) {

    // Victory Texture
    const victoryTexture = Texture.from('assets/images/match/Matchend/victory_banner.png'); 
    const victorySprite = new Sprite(victoryTexture);

    // Defeat Texture
    const DefeatTexture = Texture.from('assets/images/match/Matchend/defeat_banner.png'); 
    const DefeatSprite = new Sprite(DefeatTexture);

    // Size
    victorySprite.scale.set(0.3);
    DefeatSprite.scale.set(0.3)

    // Adds to screen
    app.stage.addChild(victorySprite);
    app.stage.addChild(DefeatSprite);

    // Winner Text
    const imagePath = `assets/images/match/Matchend/${winnerPlayer}_Wins.png`;
    const WinnerTexture = Texture.from(imagePath);
    const WinnerTextureSprite = new Sprite(WinnerTexture);

    // Size
    WinnerTextureSprite.scale.set(0.1);   

    // Location of text
    WinnerTextureSprite.anchor.set(0.5);
    WinnerTextureSprite.x = app.screen.width / 2 + 10;
    WinnerTextureSprite.y = app.screen.height / 2 - 50;



    // Add to screen
    app.stage.addChild(WinnerTextureSprite);
    // Handles Validation of winning
    app.audio.playMusic('Victory'); // Play Victory music
    if (winnerPlayer === "Player1") { //<- If Player 1 wins
        // Set player states using Player API
        if (typeof Player1.setState === 'function') Player1.setState('victory');
        if (typeof Player1.setScale === 'function') Player1.setScale(0.3, 0.3);

        if (typeof Player2.setState === 'function') Player2.setState('lose');
        if (typeof Player2.setScale === 'function') Player2.setScale(-0.3, 0.3);

        victorySprite.x = app.screen.width / 2 - 200; // Location | Win Assett
        victorySprite.y =  app.screen.height / 2 + 10 ;

        DefeatSprite.x = app.screen.width / 2 + 70; // Location | Defeat Assett
        DefeatSprite.y = app.screen.height / 2 + 5;
    } else if (winnerPlayer === "Player2") { // If Player 2 Wins
        if (typeof Player2.setState === 'function') Player2.setState('victory');
        if (typeof Player2.setScale === 'function') Player2.setScale(-0.35, -0.35 * -1 ? 0.35 : 0.35);

        if (typeof Player1.setState === 'function') Player1.setState('lose');
        if (typeof Player1.setScale === 'function') Player1.setScale(0.3, 0.3);

        victorySprite.x = app.screen.width / 2 + 70; // Location | Win asset
        victorySprite.y =  app.screen.height / 2 + 5; 

        DefeatSprite.x = app.screen.width / 2 -200; // Location | Defeat Asset
        DefeatSprite.y = app.screen.height / 2 + 10;
    }
}


