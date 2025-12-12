 // Public endpoint: GET saved records

<?php
header('Content-Type: application/json');

$file = 'game_scores.json';

if (!file_exists($file)) {
    echo json_encode(['player1Score' => 0, 'player2Score' => 0]);
    exit;
}

$data = json_decode(file_get_contents($file), true);

echo json_encode($data);
?>
