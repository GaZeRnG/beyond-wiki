<?php
    declare(strict_types=1);
    require_once $_SERVER["DOCUMENT_ROOT"] . "/features/db.php";

    // Detect HTTPS
    $isSecure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') 
        || (isset($_SERVER['SERVER_PORT']) && $_SERVER['SERVER_PORT'] == 443) 
        || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https');

    // Security Headers
    header("X-Frame-Options: DENY");
    header("X-Content-Type-Options: nosniff");
    header("Referrer-Policy: strict-origin-when-cross-origin");

    // Session
    session_start([
        'cookie_httponly' => true,
        'cookie_secure' => $isSecure,
        'cookie_samesite' => 'Strict',
        'use_strict_mode' => true
    ]);

    // CSRF
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    function csrf_token(): string {
        return $_SESSION['csrf_token'] ?? '';
    }

    function validate_csrf_token(string $token): bool {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
    }

    // Rate Limit
    $ip = $_SERVER['REMOTE_ADDR'];
    $attempts_key = 'login_attempts_' . $ip;

    if (!isset($_SESSION[$attempts_key])) {
        $_SESSION[$attempts_key] = ['count' => 0, 'timestamp' => time()];
    }

    if ($_SESSION[$attempts_key]['count'] >= 5 && time() - $_SESSION[$attempts_key]['timestamp'] < 60) {
        die("Too many login attempts. Please try again after 1 minute.");
    }

    function check_rate_limit(string $ip): bool {
        global $conn;

        $conn -> query("DELETE FROM login_attempts WHERE attempted_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)");

        $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM login_attempts WHERE ip = ? AND attempted_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)");
        $stmt->bind_param("s", $ip);
        $stmt->execute();
        $count = $stmt->get_result()->fetch_assoc()['count'];

        return $count < 5;
    }

    function log_login_attempt(string $ip, bool $success): void {
        global $conn;

        $stmt = $conn->prepare("INSERT INTO login_attempts (ip, success, attempted_at) VALUES (?, ?, NOW())");
        $int_success = $success ? 1 : 0;
        $stmt->bind_param("si", $ip, $int_success);
        $stmt->execute();
    }

    // Auto Login
    if (isset($_SESSION["user_id"])) return;

    if (!empty($_COOKIE["remember_me"])) {
        $token = $_COOKIE["remember_me"];
        $hash = hash("sha256", $token);

        $stmt = $conn->prepare("SELECT u.user_id, u.user_name, u.user_pfp FROM cookie_tokens ct JOIN users u ON u.user_id = ct.user_id WHERE ct.token_hash = ? AND ct.expires_at > NOW()");
        $stmt->bind_param("s", $hash);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        if ($user) {
            session_regenerate_id(true);
            $_SESSION["user_id"] = $user["user_id"];
            $_SESSION["user_name"] = $user["user_name"];
            $_SESSION["user_pfp"] = $user["user_pfp"];
            error_log("Remember-me login: user_id={$user['user_id']}, ip=" . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
        } else {
            setcookie("remember_me", "", [
                'expires' => time() - 3600,
                'path' => "/",
                'secure' => $isSecure,
                'httponly' => true,
                'samesite' => "Strict"
            ]);
        }
    }
?>