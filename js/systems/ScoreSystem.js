// Handles Score logic
export function updateScore(player, newScore, Player1_Number, Player2_Number, numberTextures) {
    if (player === 1) { //<-- If Player 1 score increase the scoreboard
        Player1_Number.texture = numberTextures[newScore];
    } else if (player === 2) { //<-- If Player 1 score increase the scoreboard
        Player2_Number.texture = numberTextures[newScore];
    }
}
