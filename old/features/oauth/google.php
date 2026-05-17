<?php
// try {
    require_once $_SERVER['DOCUMENT_ROOT'] . '/features/db.php';
    require_once __DIR__ . '/../../vendor/autoload.php';
    session_start();

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->load();

    $clientId     = $_ENV['GOOGLE_CLIENT_ID'];
    $clientSecret = $_ENV['GOOGLE_CLIENT_SECRET'];
    $redirectUri  = $_ENV['GOOGLE_REDIRECT_URI'];

    // Step 1: Redirect to Google
    if (!isset($_GET['code'])) {
        $params = [
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'email profile',
            'access_type' => 'online',
            'prompt' => 'select_account',
        ];
        $authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
        header("Location: $authUrl");
        exit;
    }

    // Step 2: Exchange code for token
    $code = $_GET['code'];

    if (!$code) die('No authorisation code from Google');

    $ip = '142.250.185.77';
    $host = 'oauth2.googleapis.com';

    curl_setopt_array($ch = curl_init(), [
        CURLOPT_URL => "https://oauth2.googleapis.com/token",
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query([
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $redirectUri
        ]),
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/x-www-form-urlencoded',
            'User-Agent: mysite/1.0 (https://beyond-wiki.yzz.me)',
        ],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    // Step 3: fetch user info
    $json = file_get_contents("https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=$accessToken");

    // Check if user exists
    $stmt = $conn->prepare('SELECT * FROM users WHERE oauth_provider = "google" AND oauth_id = ? LIMIT 1');
    $stmt->bind_param('s', $userInfo['id']);
    $stmt->execute();
    $res = $stmt->get_result();
    $user = $res->fetch_assoc();

    // Insert new user/Set Session
    $pictureRaw = $userInfo['picture'] ?? '';
    $picture = trim($pictureRaw);
    $provider = 'google';

    if (!$user) {
        $stmt = $conn->prepare("INSERT INTO users (user_name, user_email, user_pfp, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param('sssss', $userInfo['name'], $userInfo['email'], $userInfo['avatar'], $provider, $userInfo['id']);
        $stmt->execute();
        $user_id = $conn->insert_id;
    } else {
        $user_id = $user['user_id'];
    }

    // Set Session
    $_SESSION['user_id']   = $user_id;
    $_SESSION['user_name'] = $userInfo['name'];
    $_SESSION['user_pfp']  = $picture;

    // Remember Me
    $token = bin2hex(random_bytes(16));
    $hash = hash("sha256", $token);
    $exp = date("Y-m-d H:i:s", strtotime('+30 days'));

    $stmt2 = $conn->prepare("REPLACE INTO cookie_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)");
    $stmt2->bind_param("iss", $user_id, $hash, $exp);
    $stmt2->execute();

    setcookie("remember_me", $token, strtotime('+30days'), "/", "", true, true);

    header('Location: /');
    exit;
?>