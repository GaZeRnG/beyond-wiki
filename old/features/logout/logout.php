<?php
    require_once $_SERVER["DOCUMENT_ROOT"] ."/features/db.php";
    session_start();

    $uid = $_SESSION["user_id"] ?? null;

    session_destroy();

    if ($uid) {
        $stmt = $conn->prepare("DELETE FROM cookie_tokens WHERE user_id = ?");
        $stmt->bind_param("i", $uid);
        $stmt->execute();
    }

    setcookie("remember_me", "", time() - 3600, "/", "", true, true);
    header("Location: /features/login");
    exit();
?>