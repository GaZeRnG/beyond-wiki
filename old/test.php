<?php 
    require_once $_SERVER["DOCUMENT_ROOT"] . "/features/boot.php";

    // For navbar wiki logo
    $page = 'bd';

    // For tips listing
    $tipslist = $conn->query("SELECT tip_id, tip_title, tip_content, author, created_at FROM tips ORDER BY created_at DESC");
?>

<html>
    <head>
        <link rel="stylesheet" href="/src/output.css">
        <link rel="stylesheet" href="/beyond-depth/style.css">
        <link rel="icon" type="image" href="/Images/Logo/Beyond_Wiki_logo.webp">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale= 1.0">
        <title>Beyond Wiki - Depth</title>
    </head>

    <body class="test-page">
        <!-- Background -->
        <div class="bd-bg">
            <div class="bd-blob-3"></div>
            <div class="bd-blob-4"></div>
        </div>

        <!-- Navbar -->
        <?php include_once __DIR__ . '/../features/navbar.php'; ?>

        <div class="h-20"></div>
        
        <!-- Warning -->
        <section class="warning">
            <h2>⚠️ This wiki is currently under development and will have LIMITED, INACCURATE or NO INFO at all.</h2>
            <p>Any categories in here that have (*), will be redirected to their official and/or fandom wiki</p>
        </section>

        <!-- Logo -->
        <section class="logo">
            <img src="/../Images/Logo/Beyond_Depth_logo_crop.webp">
        </section>

        <!--Content-->
        <div class="main">
            <section class="what">
                <p class="sector-title"><b>What is Beyond Depth?</b></p>
                Beyond Depth is an adventure and exploration modpack fully optimized with 400+ mods designed for players seeking new challenges. It features unique progression, expanded biomes, tougher bosses, and new mechanics, focusing on survival and discovery. Without relying too much on quests. With unique structures, enhanced combat, pet systems, and Building contraptions, the pack caters to various playstyles.
            </section>

            <section class="serverpack">
                <p class="sector-title"><b>Serverpack</b></p>
                <a>Download - Upcoming feature</a>
            </section>
        </div>
    
        <div class="categories">
            <section class="items">
                <p class="sector-title"><b>Items</b></p>
                <ul>
                    <li><span>Weapons</span></li>
                    <li><span>Tools</span></li>
                    <li><span>Armor</span></li>
                    <li><span>Accessories</span></li>
                    <li><span>Ammo</span></li>
                    <li><span>Bars</span></li>
                    <li><span>Ores</span></li>
                    <li><span>Potions</span></li>
                    <li><span>Minions</span></li>
                    <li><span>Blocks</span></li>
                    <li><span>Crafting Stations</span></li>
                </ul>
            </section>
        
            <section class="dimensions">
                <p class="sector-title"><b>Dimensions</b></p>
                <ul>
                    <li><span><a href="https://the-undergarden-mod.fandom.com/wiki/The_Undergarden_Mod_Wiki" target="_blank">Undergarden*</a></span></li>
                    <li><span>Nether</span></li>
                    <li><span>End</span></li>
                    <li><span><a href="https://github.com/KyaniteMods/DeeperAndDarker/wiki" target="_blank">Otherside*</a></a></span></li>
                    <li><span><a href="https://voidscape.tamaized.com/index.php/Main_Page" target="_blank">Voidscape*</a></span></li>
                </ul>
            </section>
        
            <section class="bosses">
                <p class="sector-title"><b>Bosses</b></p>
                <!-- Mini -->
                <div class="mini">
                    <button onclick="dropfunction()" class="drop"><b>Mini-Bosses</b></button>
                    <ul id="dropped" class="drop-content">
                        <li><a href="https://the-undergarden-mod.fandom.com/wiki/Forgotten_Guardian" target="_blank">Forgotten Guardian*</a></li>
                        <li><a href="https://github.com/ObscuriaLithium/Aquamirae/wiki/Creatures" target="_blank">Eel*</a></li>
                        <li><a href="https://github.com/ObscuriaLithium/Aquamirae/wiki/Creatures" target="_blank">Mother of the Maze*</a></li>
                        <li><a href="https://alexs-mobs-unofficial.fandom.com/wiki/Warped_Mosco" target="_blank">Warped Mosco*</a></li>
                        <li><a href="https://alexscaves.wiki.gg/wiki/Gum_Worm">Gum Worm*</a></li>
                        <li><a href="https://alexs-mobs-unofficial.fandom.com/wiki/Farseer" target="_blank">Farseer*</a></li>
                        <li><a href="https://alexscaves.wiki.gg/wiki/Forsaken" target="_blank">Forsaken*</a></li>
                        <li><a href="http://alexscaves.wiki.gg/wiki/Magnetron" target="_blank">Magnetron*</a></li>
                        <li><a href="https://alexscaves.wiki.gg/wiki/Hullbreaker" target="_blank">Hullbreaker*</a></li>
                        <li><a href="https://minecraft.wiki/w/Warden" target="_blank">Warden*</a></li>
                        <li><a href="https://voidscape.tamaized.com/index.php/Void%27s_Wrath" target="_blank">Void's Wrath*</a></li>
                        <li><a href="https://www.curseforge.com/minecraft/mc-mods/eeeabs-mobs" target="_blank">Corpse Warlock*</a></li>
                    </ul>
                </div>

                <div class="tier">
                    <!-- Early Game -->
                    <div class="early">
                        <button onclick="dropfunction()" class="drop"><b>Early-Game</b></button>
                        <ul id="dropped" class="drop-content">
                            <li><span>Chaos Spawner</span></li>
                            <li><span>Tongbi</span></li>
                            <li><span>Frostmaw</span></li>
                            <li><span>Ferrous Wroughtnaut</span></li>
                            <li><span>Sunbird</span></li>
                        </ul>
                    </div>

                    <!-- Mid Game -->
                    <div class="mid">
                        <button onclick="dropfunction()" class="drop"><b>Mid-Game</b></button>
                        <ul id="dropped" class="drop-content">
                            <li><span>Boros</span></li>
                            <li><span>Ouros</span></li>
                            <li><span>Frostbitten Golem</span></li>
                            <li><span>Possessed Paladin</span></li>
                            <li><span>Ancient Guardian</span></li>
                            <li><span>Cloud Golem</span></li>
                            <li><span>Dune Sentinel</span></li>
                            <li><span>Overgrown Colossus</span></li>
                            <li><span>Skeletosaurus</span></li>
                            <li><span>Lava Eater</span></li>
                            <li><span>Withered Abomination</span></li>
                            <li><span>Shulker Mimic</span></li>
                            <li><span>Endersent</span></li>
                            <li><span>Night Licht</span></li>
                            <li><span>Void Blossom</span></li>
                            <li><span>Nether Gauntlet</span></li>
                            <li><span>Obsidilith</span></li>
                            <li><span>Captain Cornelia</span></li>
                            <li><span>Luxtructosaurus</span></li>
                            <li><span>Void Worm</span></li>
                        </ul>
                    </div>

                    <!-- Late Game -->
                    <div class="late">
                        <button onclick="dropfunction()" class="drop"><b>End-Game</b></button>
                        <ul id="dropped" class="drop-content">
                            <li><span>Wither</span></li>
                            <li><span>Ender Dragon</span></li>
                            <li><span>Stalker</span></li>
                            <li><span>Corrupted Pawn</span></li>
                            <li><span>Servants</span></li>
                            <li><span>Remnant</span></li>
                            <li><span>Maledictus</span></li>
                            <li><span>Scylla</span></li>
                            <li><span>Leviathan</span></li>
                            <li><span>Harbinger</span></li>
                            <li><span>Netherite Monstrosity</span></li>
                            <li><span>Ignis</span></li>
                            <li><span>Ender Guardian</span></li>
                            <li><span>Nameless Guardian</span></li>
                            <li><span>Immortal</span></li>
                            <li><span>Wither Storm</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="tips">
                <p class="sector-title"><b>Tips</b>
                    <a href="/beyond-depth/tips/add-tip" rel="noopener noreferer" class="add-tip">
                        <button id="open-add-tip">Add Tip</button>
                    </a>
                </p>
                <?php if ($tipslist && $tipslist->num_rows > 0): ?>
                    <ul> 
                        <?php while ($tip = $tipslist->fetch_assoc()): ?>
                            <li>
                                <a href="/beyond-depth/tips/view-tip?id=<?= htmlspecialchars($tip['tip_id']) ?>">
                                    Tip #<?= htmlspecialchars($tip['tip_id']) ?> - <?= htmlspecialchars($tip['tip_title']) ?>
                                </a>
                            </li>
                        <?php endwhile; ?>
                    </ul>
                <?php else: ?>
                    <ul>No tips available.</ul>
                <?php endif; ?>
            </section>
        </div>

        <!--Bottom-->
        <div class="extra">
            <section class="others">
                <p class="sector-title"><b>Other Modpacks</b></p><br>
                <div class="pack">
                    <a>
                        <img src="/Images/Logo/Beyond_Ascension_logo_crop.webp">
                    </a>
                    <a>
                        <img src="/Images/Logo/Beyond_Cosmo_logo_crop.webp">
                    </a>
                    <a>
                        <img src="/Images/Logo/Beyond_Ocean_logo_crop.webp">
                    </a>
                    <a>
                        <img src="/Images/Logo/Beyond_Zombie_logo_crop.webp">
                    </a>
                    <a>
                        <img src="/Images/Logo/Beyond_Nightfall_logo_crop.webp">
                    </a>
                </div>
            </section>

            <section class="more">
                <b>Want to contribute in this wiki?</b>
                <p>Make sure to login so you can add infos</p>
                <p class="join">Support the packs creator: <a href="https://ko-fi.com/blueversal" target="_blank"><img src="/Images/Logo/kofi.webp"></a></p>
                <p class="join">Also join our Discord: <a href="https://discord.gg/VqrxmqZP" target="_blank"><img src="/Images/Logo/discord.webp"></a></p>
            </section>
        </div>

        <script src="/beyond-depth/script.js"></script>
    </body>
</html>