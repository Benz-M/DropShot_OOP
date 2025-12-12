 // Scoreboard & UI
import {Texture,Sprite} from 'https://cdn.jsdelivr.net/npm/pixi.js@7.2.4/dist/pixi.min.mjs';


export async function Scoreboard(app) { // Adds ScoreBoard
    const Scoreboard_Texture = await Texture.from('assets/images/ScoreBoard/ScoreboardUI.png');
    const Scoreboard = new Sprite(Scoreboard_Texture);

    app.stage.addChild(Scoreboard);

    Scoreboard.width = 130;
    Scoreboard.height = 65;
    Scoreboard.x = 10;
    Scoreboard.y = 10;


}

export async function Scores(app) { // Handles ScoreBoard Logic
    const numberTextures = {};
    for (let i = 0; i <= 11; i++) {
        numberTextures[i] = Texture.from(`assets/images/ScoreBoard/${i}.png`); // Preload textures for 0–5
    }

    // Starting Score
    let player1Score = 0;
    let player2Score = 0;

    // Creates new score image for every point added
    const Player1_Number = new Sprite(numberTextures[player1Score]);
    Player1_Number.width = 25;
    Player1_Number.height = 25;
    Player1_Number.x = 105;
    Player1_Number.y = 20;

    // Same Goes
    const Player2_Number = new Sprite(numberTextures[player2Score]);
    Player2_Number.width = 25;
    Player2_Number.height = 25;
    Player2_Number.x = 105;
    Player2_Number.y = 42;

    // Adds to screen
    app.stage.addChild(Player1_Number);
    app.stage.addChild(Player2_Number);

    return { Player1_Number, Player2_Number, player1Score, player2Score, numberTextures };
}
