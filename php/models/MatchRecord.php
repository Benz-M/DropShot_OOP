// Match result object
<?php
header('Content-Type: application/json');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['player1Score']) || !isset($input['player2Score'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing score data']);
    exit;
}

$player1Score = intval($input['player1Score']);
$player2Score = intval($input['player2Score']);

// Anti-cheat verification
$maxScore = 5; // same as in your JS
if ($player1Score > $maxScore || $player2Score > $maxScore) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid score detected']);
    exit;
}

// Score is valid
echo json_encode(['status' => 'success', 'message' => 'Score verified']);
?>
