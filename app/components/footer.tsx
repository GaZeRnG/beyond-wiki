import Link from "next/link";
import Image from "next/image";

const curseforgeLinks = [
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-depth", img: "/logo/Beyond_Depth_logo.png", alt: "Beyond Depth" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-depth-insanity", img: "/logo/Beyond_Depth_Insanity_logo.png", alt: "Beyond Depth Insanity" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-ascension", img: "/logo/Beyond_Ascension_logo.png", alt: "Beyond Ascension" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-cosmo", img: "/logo/Beyond_Cosmo_logo.png", alt: "Beyond Cosmo" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-ocean", img: "/logo/Beyond_Ocean_logo.png", alt: "Beyond Ocean" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-shenanigans", img: "/logo/Beyond_Shenanigans_logo.png", alt: "Beyond Shenanigans" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-zombie", img: "/logo/Beyond_Zombie_logo.png", alt: "Beyond Zombie" },
    { href: "https://www.curseforge.com/minecraft/modpacks/beyond-nightfall", img: "/logo/Beyond_Nightfall_logo.png", alt: "Beyond Nightfall" },
]

export default function Footer() {
    return (
        <footer className="footer footer-center">
            <p className="official">Official CurseForge Links:
                <span className="cflink">
                    {curseforgeLinks.map((mod, i) => (
                        <a key={i} href={mod.href} target="_blank" rel="noopener noreferrer">
                            <Image src={mod.img} alt={mod.alt} width={40} height={40} />
                        </a>
                    ))}
                </span>
            </p>

            <div className="contribute">
                <b>Want to contribute to this wiki?</b>
                <p>Make sure to login so you can add infos!</p>
                <p>Made by Wikiversal</p>
            </div>

            <div className="join">
                <div className="joining">
                    <p>Discord:</p>
                    <a href="https://discord.gg/VqrxmqZP" target="_blank" rel="noopener noreferrer">
                        <Image src="/logo/discord.webp" alt="Discord Logo" width={32} height={32} />
                    </a>
                </div>

                <div className="joining">
                    <p>Support the modpacks creator:</p>
                    <a href="https://ko-fi.com/blueversal" target="_blank" rel="noopener noreferrer">
                        <Image src="/logo/kofi.webp" alt="Ko-fi Logo" width={32} height={32} />
                    </a>
                </div>
            </div>
        </footer>
    );
}