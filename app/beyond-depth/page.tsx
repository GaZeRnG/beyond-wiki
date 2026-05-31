"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@components/navbar";

interface Tip {
    tip_id: number;
    tip_title: string;
    tip_content: string;
    author: string | null;
    created_at: string;
}

interface Boss {
    name: string;
    href?: string;
    external?: boolean;
}

const miniBosses: Boss[] = [
    { name: "Forgotten Guardian", href: "https://the-undergarden-mod.fandom.com/wiki/Forgotten_Guardian", external: true },
    { name: "Eel", href: "https://github.com/ObscuriaLithium/Aquamirae/wiki/Creatures", external: true },
    { name: "Mother of the Maze", href: "https://github.com/ObscuriaLithium/Aquamirae/wiki/Creatures", external: true },
    { name: "Warped Mosco", href: "https://alexs-mobs-unofficial.fandom.com/wiki/Warped_Mosco", external: true },
    { name: "Gum Worm", href: "https://alexscaves.wiki.gg/wiki/Gum_Worm", external: true },
    { name: "Farseer", href: "https://alexs-mobs-unofficial.fandom.com/wiki/Farseer", external: true },
    { name: "Forsaken", href: "https://alexscaves.wiki.gg/wiki/Forsaken", external: true },
    { name: "Magnetron", href: "http://alexscaves.wiki.gg/wiki/Magnetron", external: true },
    { name: "Hullbreaker", href: "https://alexscaves.wiki.gg/wiki/Hullbreaker", external: true },
    { name: "Warden", href: "https://minecraft.wiki/w/Warden", external: true },
    { name: "Void's Wrath", href: "https://voidscape.tamaized.com/index.php/Void%27s_Wrath", external: true },
    { name: "Corpse Warlock", href: "https://www.curseforge.com/minecraft/mc-mods/eeeabs-mobs", external: true },
]

const earlyBosses: Boss[] = [
    { name: "Chaos Spawner" },
    { name: "Tongbi" },
    { name: "Frostmaw" },
    { name: "Ferrous Wroughtnaut" },
    { name: "Sunbird" },
]

const midBosses: Boss[] = [
    { name: "Boros" },
    { name: "Ouros" },
    { name: "Frostbitten Golem" },
    { name: "Possessed Paladin" },
    { name: "Ancient Guardian" },
    { name: "Cloud Golem" },
    { name: "Dune Sentinel" },
    { name: "Overgrown Colossus" },
    { name: "Skeletosaurus" },
    { name: "Lava Eater" },
    { name: "Withered Abomination" },
    { name: "Shulker Mimic" },
    { name: "Endersent" },
    { name: "Night Licht" },
    { name: "Void Blossom" },
    { name: "Nether Gauntlet" },
    { name: "Obsidilith" },
    { name: "Captain Cornelia" },
    { name: "Luxtructosaurus" },
    { name: "Void Worm" },
];

const lateBosses: Boss[] = [
    { name: "Wither" },
    { name: "Ender Dragon" },
    { name: "Stalker" },
    { name: "Corrupted Pawn" },
    { name: "Servants" },
    { name: "Remnant" },
    { name: "Maledictus" },
    { name: "Scylla" },
    { name: "Leviathan" },
    { name: "Harbinger" },
    { name: "Netherite Monstrosity" },
    { name: "Ignis" },
    { name: "Ender Guardian" },
    { name: "Nameless Guardian" },
    { name: "Immortal" },
    { name: "Wither Storm" },
];

const itemCategories = [
    "Weapons", "Tools", "Armor", "Accessories", "Ammo",
    "Bars", "Ores", "Potions", "Minions", "Blocks", "Crafting Stations",
];

const dimensions = [
    { name: "Undergarden", href: "https://the-undergarden-mod.fandom.com/wiki/The_Undergarden_Mod_Wiki", external: true },
    { name: "Nether" },
    { name: "End" },
    { name: "Otherside", href: "https://github.com/KyaniteMods/DeeperAndDarker/wiki", external: true },
    { name: "Voidscape", href: "https://voidscape.tamaized.com/index.php/Main_Page", external: true },
];

function BossLink({boss}: {boss: Boss}) {
    if (boss.href) {
        return (
            <a href={boss.href} target="_blank" rel="noopener noreferrer">
                {boss.name}*
            </a>
        );
    }
    return <span>{boss.name}</span>;
}

function BossSection({title, bosses}: {title: string; bosses: Boss[]}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="boss-tier">
            <button onClick={() => setOpen(!open)} className="drop">
                <b>{title}</b>
            </button>
            <ul className={`drop-content ${open ? "active" : ""}`}>
                {bosses.map((boss, i) => (
                    <li key={i}>
                        <BossLink boss={boss} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TipModal({tip, onClose}: {tip: Tip; onClose: () => void}) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        }
    }, [onClose]);

    return (
        <div className="tip-modal" onClick={onClose}>
            <div className="tip-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="tip-top">
                    <h2 className="tip-title">{tip.tip_title}</h2>
                    <button onClick={onClose}className="tip-close">
                        <CloseIcon />
                    </button>
                </div>

                <div className="divider m-0" />
                
                <div className="tip-content">
                    {tip.tip_content}
                </div>

                <div className="divider m-0" />
                
                <div className="tip-bottom">
                    <span>By: {tip.author || "Anonymous"}</span>
                    <span>{new Date(tip.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    )
}

export default function BeyondDepthPage() {
    const [tips, setTips] = useState<Tip[]>([]);
    const [tipsLoading, setTipsLoading] = useState(true);
    const [selectedTip, setSelectedTip] = useState<Tip | null>(null);
    const [showAddedToast, setShowAddedToast] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem("tipAdded") === "true") {
            setShowAddedToast(true);
            sessionStorage.removeItem("tipAdded");
            const timer = setTimeout(() => setShowAddedToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    useEffect(() => {
        fetch("/api/tips?pack=beyond-depth")
            .then((res) => res.json())
            .then((data) => {
                setTips(data.tips || []);
                setTipsLoading(false);
            })
            .catch(() => setTipsLoading(false));
    }, []);

    return (
        <main className="bd-page">
            <div className="bd-bg" />

            <Navbar />

            <div className="h-20" />

            {/* Toast */}
            {showAddedToast && (
                <div className="add-tip-toast">
                    Tip added successfully!
                </div>
            )}

            {/* Warning */}
            <section className="warning">
                <h2>⚠️ This wiki is currently under development and will have LIMITED, INACCURATE or NO INFO at all.</h2>
                <p>Any categories in here that have (*), will be redirected to their official and/or fandom wiki</p>
            </section>

            {/* Logo */}
            <section className="logo">
                <Image src="/logo/Beyond_Depth_logo_crop.png" alt="Beyond Depth Logo" width={300} height={128} priority />
            </section>

            {/* Content */}
            <div className="full">
                <section className="what">
                    <p className="sector-title">What is Beyond Depth?</p>
                    <p>Beyond Depth is an adventure and exploration modpack fully optimized with 400+ mods designed for players seeking new challenges. 
                        It features unique progression, expanded biomes, tougher bosses, and new mechanics, focusing on survival and discovery. 
                        Without relying too much on quests. With unique structures, enhanced combat, pet systems, and Building contraptions, 
                        the pack caters to various playstyles.
                    </p>
                </section>

                <section className="others">
                    <p className="sector-title"><b>Other Modpacks:</b></p>
                    Upcoming Feature
                </section>
            </div>

            {/* Categoris */}
            <div className="categories">
                <section className="items">
                    <p className="sector-title"><b>Items</b></p>
                    <ul>
                        {itemCategories.map((item, i) => (
                            <li key={i}><span>{item}</span></li>
                        ))}
                    </ul>
                </section>

                <section className="dimensions">
                    <p className="sector-title"><b>Dimensions</b></p>
                    <ul>
                        {dimensions.map((dim, i) => (
                            <li key={i}>
                                {dim.href ? (
                                    <a href={dim.href} target="_blank" rel="noopener noreferrer">
                                        <span>{dim.name}*</span>
                                    </a>
                                ) : (
                                    <span>{dim.name}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </section>
            </div>

            {/* Bosses */}
            <div className="full">
                <section className="bosses">
                    <p className="sector-title"><b>Bosses</b></p>
                    <div className="tier">
                        <div className="mini">
                            <BossSection title="Mini-Bosses" bosses={miniBosses} />
                        </div>
                        <div className="early">
                            <BossSection title="Early-Game" bosses={earlyBosses} />
                        </div>
                        <div className="mid">
                            <BossSection title="Mid-Game" bosses={midBosses} />
                        </div>
                        <div className="late">
                            <BossSection title="End-Game" bosses={lateBosses} />
                        </div>
                    </div>
                </section>
            </div>

            {/* Tips */}
            <section className="tips">
                <p className="sector-title">
                    <b>General Tips</b>
                    <Link href="/beyond-depth/tips/add-tip" className="add-tip">
                        <button className="open-add-tip">
                            <PlusIcon />
                            Add Tip
                        </button>
                    </Link>
                </p>
                {tipsLoading ? (
                    <ul><li>Loading tips...</li></ul>
                ) : tips.length > 0 ? (
                    <ul className="tips-list">
                        {tips.map((tip) => (
                            <li key={tip.tip_id}>
                                <button onClick={() => setSelectedTip(tip)} className="tip-button">
                                    Tip #{tip.tip_id}: {tip.tip_title}
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <ul><li>No tips available.</li></ul>
                )}
            </section>

            {/* Modal */}
            {selectedTip && (
                <TipModal 
                    tip={selectedTip} 
                    onClose={() => setSelectedTip(null)} 
                />
            )}
        </main>
    )
}

function PlusIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    );
}