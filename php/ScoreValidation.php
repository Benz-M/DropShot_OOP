<?php

class ScoreValidation {

    private const MIN_SCORE = 0;
    private const MAX_SCORE = 11;

// Validate a single score value
    public static function validateScore($score) {
        if (!is_numeric($score)) {
            return ['valid' => false, 'error' => 'Score must be a number'];
        }

        $score = intval($score);

        if ($score < self::MIN_SCORE) {
            return ['valid' => false, 'error' => 'Score is too low'];
        }

        if ($score > self::MAX_SCORE) {
            return ['valid' => false, 'error' => 'Score is too high'];
        }

        return ['valid' => true];
    }

// Validate match duration time (seconds)
    public static function validateDuration($seconds) {
        if (!is_numeric($seconds)) {
            return ['valid' => false, 'error' => 'Duration must be a number'];
        }

        $seconds = intval($seconds);

        if ($seconds < 5) {
            return ['valid' => false, 'error' => 'Match too short'];
        }

        if ($seconds > 3600) {
            return ['valid' => false, 'error' => 'Match too long'];
        }

        return ['valid' => true];
    }

// Detect suspicious score based on match speed
    public static function isSuspicious($score, $duration) {
        if ($duration <= 0) return false;

        $rate = $score / $duration; // points per second

        // More than 2 points per second is suspicious
        return $rate > 2;
    }

    public static function validateMatch($matchData) {
        $errors = [];
        $warnings = [];

        // Validate Player 1 score
        $p1 = self::validateScore($matchData['player1'] ?? null);
        if (!$p1['valid']) $errors['player1'] = $p1['error'];

        // Validate Player 2 score
        $p2 = self::validateScore($matchData['player2'] ?? null);
        if (!$p2['valid']) $errors['player2'] = $p2['error'];

        // Validate duration
        $duration = self::validateDuration($matchData['duration'] ?? null);
        if (!$duration['valid']) {
            $errors['duration'] = $duration['error'];
        }

        // Suspicious score detection (only if no errors)
        if (empty($errors)) {
            if (self::isSuspicious($matchData['player1'], $matchData['duration'])) {
                $warnings['player1'] = "Player 1 score looks suspicious.";
            }

            if (self::isSuspicious($matchData['player2'], $matchData['duration'])) {
                $warnings['player2'] = "Player 2 score looks suspicious.";
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'warnings' => $warnings
        ];
    }
}
?>
