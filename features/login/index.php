<?php 
    require_once $_SERVER["DOCUMENT_ROOT"] . "/features/boot.php";

    $page = 'login';

    $errors = [];

    if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["username"]) && isset($_POST["password"])) {
        if (!validate_csrf_token($_POST["csrf-token"] ?? '')) {
            $errors[] = "Invalid CSRF token.";
        } else {
            $login = trim($_POST["username"]);
            $password = $_POST["password"];

            if(str_contains($login, '@') && !filter_var($login, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Invalid email format.";
            }

            if (empty($login) || empty($password)) {
                $errors[] = "All fields are required.";
            } else {
                $stmt = $conn->prepare("SELECT * FROM users WHERE user_name = ? OR user_email = ? LIMIT 1");
                $stmt->bind_param("ss", $login, $login);
                $stmt->execute();
                $res = $stmt->get_result();
                $user = $res->fetch_assoc();

                if ($user && password_verify($password, $user["user_password"])) {
                    $_SESSION["user_id"] = $user["user_id"];
                    $_SESSION["user_name"] = $user["user_name"];
                    $_SESSION["user_pfp"] = $user["user_pfp"];

                    // Remember Me
                    if (!empty($_POST["remember"])) {
                        $token = bin2hex(random_bytes(16));
                        $hash = hash("sha256", $token);
                        $exp = date("Y-m-d H:i:s", strtotime('+30 days'));

                        $stmt2 = $conn->prepare("REPLACE INTO cookie_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)");
                        $stmt2->bind_param("iss", $user["user_id"], $hash, $exp);
                        $stmt2->execute();

                        setcookie("remember_me", $token, [
                            "expires" => strtotime('+30days'),
                            "path" => "/",
                            "domain" => "",
                            "secure" => true,
                            "httponly" => true,
                            "samesite" => "Strict"
                        ]);
                    };

                    session_regenerate_id(true);
                    header(header: "Location: /");
                    exit();

                } else {
                    $errors[] = "Invalid username/email or password.";
                }
            }
        }
    }
?>

<html>
    <head>
        <title>Login - Beyond Wiki</title>
        <link rel="icon" type="image" href="/Images/Logo/Beyond_Wiki_logo.png">
        <link rel="stylesheet" href="/src/output.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale= 1.0">
    </head>
    <body class="login-page pb-0">
        <!-- Navbar -->
        <?php require_once $_SERVER["DOCUMENT_ROOT"] . '/features/navbar.php'; ?>

        <section class="login-whole">
            <div class="login-container ">
                <section class="login-title">LOGIN</section>

                <!-- For Errors -->
                <?php if (!empty($errors)): ?>
                    <div class="text-red-500 text-center mb-3">
                        <?php foreach ($errors as $e): ?>
                            <p><?= htmlspecialchars($e) ?></p>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>

                <!-- Form -->
                <form method="POST" class="login-form">
                    <!-- csrf -->
                    <input type="hidden" name="csrf-token" value="<?= csrf_token() ?>">
                    <!-- Username or Email -->
                    <label for="username" class="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Username or Email</span>
                        <input type="text" id="username" name="username" required placeholder="Username or Email" pattern="[A-Za-z][A-Za-z0-9\-]*" minlength="3" maxlength="30" title="Only letters, numbers or dash"/>
                    </label>
                    <p class="validator-hint hidden mt-0">Must be 3 to 30 characters<br>Containing only letters, numbers or dash</p>

                    <!-- Password -->
                    <label for="password" class=" floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round-icon lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                        <span>Password</span>
                        <input type="password" id="password" name="password" required placeholder="Password" minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
                        <button type="button" onclick="togglePassword()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <!-- Close Eye -->
                            <svg id="close-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
                            <!-- Open Eye -->
                            <svg id="open-eye" style="display: none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </label>
                    <p class="validator-hint hidden mt-0">Must be more than 8 characters, including number, lowercase letter, uppercase letter</p>
                    
                    <!-- Remember Me -->
                    <label class="login-remember">
                        <input type="checkbox" id="remember-link" name="remember" class="checkbox bg-neutral-800 checked:bg-green-500" value="1">
                        Remember Me
                    </label>

                    <button type="submit" class="login-submit">Login</button>
                    
                    <div class="login-others">
                        <!-- Google -->
                        <button class="login-google">
                            <a href="/features/oauth/google.php" id="google-link" name="google">
                                <img class="w-5 h-5" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo">
                                Google</a>
                        </button>

                        <!-- Discord -->
                        <button class="login-discord">
                            <a href="/features/oauth/discord.php" id="discord-link" name="discord">
                                <img class="w-5 h-5" src="https://www.svgrepo.com/show/353655/discord-icon.svg" loading="lazy" alt="discord logo">
                                Discord</a>
                        </button>
                    </div>

                    <a href="/features/register" class="login-register">New to Beyond Wiki? Create Account here</a>
                </form>
            </div>
        </section>
        <script src="/features/login/login.js"></script>
    </body>
</html>