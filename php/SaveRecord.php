// Public endpoint: POST scores here

<?php
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Get JSON body from request
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['player1Score']) || !isset($input['player2Score'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing score data']);
    exit;
}

// Anti-cheat check (simple example: scores must be integers >= 0)
$player1Score = intval($input['player1Score']);
$player2Score = intval($input['player2Score']);

if ($player1Score < 0 || $player2Score < 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid score']);
    exit;
}

// Save to JSON file
$scoreData = [
    'player1Score' => $player1Score,
    'player2Score' => $player2Score,
    'timestamp' => time()
];

$file = 'game_scores.json';
file_put_contents($file, json_encode($scoreData, JSON_PRETTY_PRINT));

echo json_encode(['status' => 'success', 'message' => 'Score saved']);
?>