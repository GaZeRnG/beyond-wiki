<?php 
    require_once $_SERVER["DOCUMENT_ROOT"] . "/features/boot.php";

    $page = 'register';

    $errors = [];

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        if (!validate_csrf_token($_POST["csrf-token"] ?? '')) {
            $errors[] = "Invalid CSRF token.";
        } else {
            $username = trim($_POST["username"]);
            $email = trim($_POST["email"]);
            $password = $_POST["password"];
            $password_confirmation = trim($_POST["confirm-password"]);

            // Check for duplicates
            $check = $conn->prepare("SELECT user_name, user_email FROM users WHERE user_name = ? OR user_email = ? LIMIT 1");
            $check->bind_param("ss", $username, $email);
            $check->execute();
            $res = $check->get_result();

            if ($res->num_rows > 0) {
                $existing = $res->fetch_assoc();
                $errors[] = "Username or email already exists.";
            }

            // Validate inputs
            if ($password !== $password_confirmation) {
                $errors[] = "Passwords do not match.";
            }

            if (strlen($password) < 8) {
                $errors[] = "Password must be at least 8 characters long.";
            }

            if (empty($username) || empty($email) || empty($password) || empty($password_confirmation)) {
                $errors[] = "All fields are required.";
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors[] = "Invalid email format.";
            }

            if (!preg_match('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/', $password)) {
                $errors[] = "Password must contain at least one number, one lowercase and uppercase letter.";
            }

            if (empty($errors)) {
                $hash = password_hash($password, PASSWORD_DEFAULT);

                $stmt = $conn->prepare("INSERT INTO users (user_name, user_email, user_password, oauth_provider, oauth_id) VALUES (?, ?, ?, 'manual', NULL)");
                $stmt->bind_param("sss", $username, $email, $hash);
                $stmt->execute();
                
                header(header: "Location: /features/login");
                exit();
            }
        }
    }
?>

<html>
    <head>
        <title>Register - Beyond Wiki</title>
        <link rel="icon" type="image" href="/Images/Logo/Beyond_Wiki_logo.png">
        <link rel="stylesheet" href="/src/output.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale= 1.0">
    </head>
    
    <body class="register-page">
        <!-- Navbar -->
        <?php require_once $_SERVER["DOCUMENT_ROOT"] . '/features/navbar.php'; ?>

        <section class="register-whole">
            <div class="register-container">
                <section class="register-title">REGISTER</section>

                <!-- For Errors -->
                <?php if (!empty($errors)): ?>
                    <div style="color:red;">
                        <ul>
                            <?php foreach ($errors as $e): ?>
                                <li><?= htmlspecialchars($e) ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
                
                <!-- Form -->
                <form method="POST" class="register-form" enctype="multipart/form-data">
                    <!-- CSRF -->
                    <input type="hidden" name="csrf-token" value="<?= csrf_token() ?>">
                    <!-- Username -->
                    <label for="username" class="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        <span>Username</span>
                        <input type="text" id="username" name="username" required placeholder="Username" pattern="[A-Za-z][A-Za-z0-9\-]*" minlength="3" maxlength="30" title="Only letters, numbers or dash"/>
                    </label>
                    <p class="validator-hint hidden mt-0">Must be 3 to 30 characters<br>Containing only letters, numbers or dash</p>

                    <!-- Email -->
                    <label for="email" class="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                        <span>Email</span>
                        <input type="email" id="email" name="email" required placeholder="Email" title="Must be a valid email address"/>
                    </label>
                    <p class="validator-hint hidden mt-0">Enter valid email address</p>
                    
                    <!-- Password -->
                    <label for="password" class="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
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

                    <label for="confirm-password" class="floating-label input validator bg-neutral-800 rounded-md p-2.5 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key-round-icon lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                        <span>Confirm Password</span>
                        <input type="password" id="confirm-password" name="confirm-password" required placeholder="Confirm Password" minlength="8" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter"/>
                        <button type="button" onclick="toggleConfirmPassword()" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                            <!-- Close Eye -->
                            <svg id="confirm-close-eye" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-closed-icon lucide-eye-closed"><path d="m15 18-.722-3.25"/><path d="M2 8a10.645 10.645 0 0 0 20 0"/><path d="m20 15-1.726-2.05"/><path d="m4 15 1.726-2.05"/><path d="m9 18 .722-3.25"/></svg>
                            <!-- Open Eye -->
                            <svg id="confirm-open-eye" style="display: none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-icon lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                    </label>
                    <p class="validator-hint hidden mt-0">Must be more than 8 characters, including number, lowercase letter, uppercase letter</p>

                    <button type="submit" class="register-submit">Register</button>
                    <a href="/features/login" class="register-back">Back to Login</a>
                </form>
            </div>
        </section>
        <script src="/features/register/register.js"></script>
    </body>
</html>