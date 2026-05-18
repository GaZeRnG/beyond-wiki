import Image from 'next/image';

export default function Home() {
    return (
        <main>
            {/* Warning */}
            <section className="warning">
                <h2>This wiki is currently under development and will have LIMITED or NO INFO at all.</h2>
                <h3>The only feature that works is the links below and beyond depth.</h3>
            </section>

            {/* Logo */}
            <section className="logo">
                <Image src="/logo/Beyond_Wiki_logo_crop.webp" alt="Beyond Wiki Logo" loading="eager" width={300} height={150} />
            </section>

            {/* Main */}
            <section className="main">
                <section className="left-main">
                    <b>Upcoming Feature:</b>
                    <hr className="mx-auto w-[90%] my-4" />
                    tbh dont know what to add here. Suggest it in Discord
                </section>

                <section className="center-main">
                    <p className="welcome">Welcome to <b>Beyond Wiki</b></p>
                    <p>A wiki for all of Beyond Packs.</p>
                    <p>Select a pack below to get started.</p>

                    <hr className="mx-auto w-[90%] my-4" />

                    <h1 className="m-0 text-lg font-bold">Modpacks</h1>
                    <div className="wiki-links">
                        <div className="wiki-links-images">
                            <a href="/" className="mod" data-index="0"><Image src="/Logo/Beyond_Ocean_logo_crop.webp" alt="Beyond Ocean Logo" width={150} height={75} /></a>
                            <a href="/" className="mod" data-index="1"><Image src="/Logo/Beyond_Ascension_logo_crop.webp" alt="Beyond Ascension Logo" width={150} height={75} /></a>
                            <a href="/beyond-depth/" className="mod active" data-index="2"><Image src="/Logo/Beyond_Depth_logo_crop.webp" alt="Beyond Depth Logo" width={150} height={75} /></a>
                            <a href="/" className="mod" data-index="3"><Image src="/Logo/Beyond_Cosmo_logo_crop.webp" alt="Beyond Cosmo Logo" width={150} height={75} /></a>
                            <a href="/" className="mod" data-index="4"><Image src="/Logo/Beyond_Zombie_logo_crop.webp" alt="Beyond Zombie Logo" width={150} height={75} /></a>
                            <a href="/" className="mod" data-index="5"><Image src="/Logo/Beyond_Nightfall_logo_crop.webp" alt="Beyond Nightfall Logo" width={150} height={75} /></a>
                        </div>
                        <div className="wiki-links-buttons">
                            <button id="prev"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-left-icon lucide-arrow-big-left"><path d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"/></svg></button>
                            <button id="next"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-big-right-icon lucide-arrow-big-right"><path d="M11 9a1 1 0 0 0 1-1V5.061a1 1 0 0 1 1.811-.75l6.836 6.836a1.207 1.207 0 0 1 0 1.707l-6.836 6.835a1 1 0 0 1-1.811-.75V16a1 1 0 0 0-1-1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z"/></svg></button>
                        </div>
                    </div>
                </section>

                <section className="right-main">
                    <b>Upcoming Feature:</b>
                    <hr className="mx-auto w-[90%] my-4" />
                    Top Contributors???
                </section>
            </section>
        </main>
    );
}