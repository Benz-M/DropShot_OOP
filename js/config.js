import { Scoreboard,Scores } from './ui/HUD.js';
import { updateScore } from './systems/ScoreSystem.js';
import { Movement } from '/js/input.js';
import { ScoreBoard_Initilization,Player_Initilization} from '/js/assets.js';
import { matchEnd } from './systems/MatchSystem.js';
import { BaseMap } from '/js/MapGeneration.js';
import { WallCollision,NetCollision,ShuttleCollision } from '/js/physics/CollisionHandling.js';
import { initializeTimer } from './systems/TimerSystem.js';

export async function startGame(app) { // Main Game Logic 
    console.log("Starting Game...");
    app.stage.removeChildren();

    let keys = {};

    // Stop menu music, start gameplay music
    app.audio.stopMusic();
    app.audio.playMusic('Countdown')
    const Map = new BaseMap()

    // Initilize the Map Assets
    await Map.Background_INI(app);
    await Map.Floor_INI(app);
    await Map.Net_INI(app);
    
    await ScoreBoard_Initilization(app); // Show Countdown before starting the match
    
    await Scoreboard(app);
    
    app.audio.stopMusic();
    app.audio.playMusic('gameplay');
    
    const {Player1, Player2} = await Player_Initilization(app, Map.StartBlock); // Creates the Player

    // Initialize scores
    const scoreData = await Scores(app); 
    
    // Initialize timer
    const timer = initializeTimer(app);
    
    const maxScore = 11;
    const floorY = app.screen.height - 50;
    
    // Initialize serving rights - Player1 starts serving
    Player1.setServing(true);
    Player2.setServing(false);
    
    Movement(app, Player1, keys, Player2); // For Movement
    
    const wallCollision = new WallCollision(app, Player1, Player2, Map.NetLocation);
    const netCollision  = new NetCollision(app, Player1, Player2, Map.NetLocation);
    const shuttlecollision = new ShuttleCollision(app, Player1, Player2, Map.NetLocation);

    console.log(Map.NetLocation.x)
    app.ticker.add(() => { // Loops the game to update value and detect collision & Score and other things
        

        // Wall & net collisions
        wallCollision.CollisionLogic();
        netCollision.CollisionLogic();
        
        // Checks if the shuttlecock lands
        let haslanded = null;
        
        // Handles Scoring Logic aswell
        if (window.currentShuttlecock) { // Checks if there is an actually shuttlecock
            window.currentShuttlecock.update(0.01, floorY);  // Updates
            // Check if shuttlecock hits the floor
            const scPos = window.currentShuttlecock.getPosition();
            console.log(scPos.y) // Pang Debug lng
            if (scPos.y <= floorY) { // If it hits the floor
                if (scPos.y >= floorY - 18 && scPos.x > Map.NetLocation.x) { // If its from the side of  {
                    
                    app.audio.playSound('score');
                    console.log('score!');
                    scoreData.player2Score++;
                    haslanded = true;
                    updateScore(1, scoreData.player2Score, scoreData.Player1_Number, scoreData.Player2_Number, scoreData.numberTextures);
                        // Player1 scored (player2Score is actually Player1's score)
                        // If Player1 was serving, they continue. If Player2 was serving, Player1 gets serving rights
                        if (!Player1.isServing()) {
                            Player2.setServing(false);
                            Player1.setServing(true);
                    }
            } 
            if (scPos.y >= floorY - 18 && scPos.x < Map.NetLocation.x) {
                    // Landed on Player2's side → Player2 scores (player1Score is actually Player2's score)
                app.audio.playSound('score');
                console.log('score!');
                scoreData.player1Score++;
                haslanded = true;
                updateScore(2, scoreData.player1Score, scoreData.Player1_Number, scoreData.Player2_Number, scoreData.numberTextures);
                    // Player2 scored
                    // If Player2 was serving, they continue. If Player1 was serving, Player2 gets serving rights
                    if (!Player2.isServing()) {
                        Player1.setServing(false);
                        Player2.setServing(true);
                }
            }
        }
        shuttlecollision.CollisionLogic(window.currentShuttlecock, Map.NetLocation, app) 
        if(haslanded) {
            window.currentShuttlecock.destroy(); // or reset its position
            window.currentShuttlecock = null;}
}
        // Win condition
        if (scoreData.player1Score >= maxScore) {
            console.log("Player 1 Wins!");
            matchEnd(app, "Player2", Player1, Player2);
        } else if (scoreData.player2Score >= maxScore) {
            console.log("Player 2 Wins!");
            matchEnd(app, "Player1", Player1, Player2);
        }
    

    
    });
}

