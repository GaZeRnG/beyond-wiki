"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar page="hub"/>
    </main>
  );
}
