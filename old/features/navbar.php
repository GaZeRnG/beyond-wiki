<?php 
    require_once $_SERVER["DOCUMENT_ROOT"] . "/features/boot.php";
?>

<section class="nav">
    <!-- Logo -->
    <section>
        <?php if (isset($page) && $page !== 'hub'): ?>
            <a href="/" class="nav_logo">
                <img src="/Images/Logo/Beyond_Wiki_logo_crop.webp" alt="Beyond Wiki Logo">
            </a>
        <?php else: ?>
            <img src="/Images/Logo/Beyond_Wiki_logo_crop.webp" alt="Beyond Wiki Logo">
        <?php endif; ?>
    </section>

    <!-- Search -->
    <section class="search">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search-icon lucide-search"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
        <input type="search" placeholder="Search">
    </section>

    <!-- User -->
    <section class="drop">
        <div class="user" tabindex="0" role="button">
            <!-- If logged in -->
            <?php if (isset($_SESSION["user_name"])): ?>
                <p><?= htmlspecialchars($_SESSION["user_name"]) ?></p>
                <div class="user-icon" id="user-icon">
                    <?php if (!empty($_SESSION["user_pfp"])): ?>
                        <img src="<?= htmlspecialchars($_SESSION["user_pfp"]) ?>" alt="User Profile Picture" class=" avatar rounded-full">
                    <!-- If logged in but no pfp -->
                    <?php else: ?>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <?php endif; ?>
                </div>
            
            <!-- If not logged in -->
            <?php else: ?>
                <p>Guest</p>
                <div class="user-icon" id="user-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-icon lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
            <?php endif; ?>
        </div>
        
        <!-- Dropdown menu -->
        <ul tabindex="-1" class="drop_menu dropdown-content">
            <?php if (isset($_SESSION["user_name"])): ?>
                <li><a href="/features/profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2"/><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/><circle cx="10" cy="7" r="4"/></svg>
                    Profile</a></li>
                <hr class="my-2 border-[rgb(123,123,123)]">
                <li><a href="/features/logout/logout.php">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon lucide-log-out"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
                    Logout</a></li>
            <?php else: ?>
                <li><a href="/features/login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-in-icon lucide-log-in"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg>
                    Login</a></li>
            <?php endif; ?>
        </ul>
    </section>
</section>