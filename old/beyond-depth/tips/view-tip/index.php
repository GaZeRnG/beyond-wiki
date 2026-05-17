<?php 
    require_once $_SERVER["DOCUMENT_ROOT"] . "/features/boot.php";

    $page = 'view-tip';

    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    $stmt = $conn->prepare('SELECT tip_id, tip_title, tip_content, author, created_at FROM tips WHERE tip_id = ?');
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    $tip = $res->fetch_assoc();
    $stmt->close();

    if (!$tip) {
        http_response_code(404);
        header ('Location: /404.html');
        exit();
    }
?>

<html>
    <head>
        <link rel="icon" type="image" href="/Images/Logo/Beyond_Wiki_logo.png">
        <link rel="stylesheet" href="/src/output.css">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale= 1.0">
        <title>BD - View Tip #<?= htmlspecialchars($tip['tip_id']) ?></title>
    </head>

    <body class="view-tip-page">
        <!-- Background -->
        <div class="view-tip-bg"></div>

        <!-- Navbar -->
        <?php require_once $_SERVER["DOCUMENT_ROOT"] . '/features/navbar.php'; ?>

        <div class="h-20"></div>

        <!-- Tip Details -->
        <div class="tip-details">
            <section class="tip-title">
                <p><b><?= htmlspecialchars($tip['tip_title']) ?></b></p>
                <section class="tip-who">
                    <p><b>Author: </b><?= htmlspecialchars($tip['author'] ?: 'Anonymous') ?></p>
                    <p><b>Posted in: </b><?= htmlspecialchars($tip['created_at']) ?></p>
                </section>
            </section>

            <section class="tip-content">
                <p><?= htmlspecialchars($tip['tip_content']) ?></p>
            </section>
        
            <section class="tip-more">
                <a href="/beyond-depth" class="back"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back to Beyond Depth</a>
                <a href="add-tip" class="add">Add a Tip<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-plus-icon lucide-circle-plus"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg></a>
            </section>
        </div>
    </body>
</html>