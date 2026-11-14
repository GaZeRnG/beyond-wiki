"use client";

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { useScroll, useSpring, type MotionValue } from 'motion/react';

const WALL_GRID = [
    ['empty', 'grass', 'grass', 'empty', 'empty', 'empty', 'empty', 'empty', 'grass', 'grass'],
    ['grass', 'dirt',  'dirt',  'grass', 'grass', 'grass', 'grass', 'grass', 'dirt',  'dirt'],
    ['dirt',  'dirt',  'dirt',  'dirt',  'dirt',  'dirt',  'dirt',  'dirt',  'dirt',  'dirt'],
    ['dirt',  'dirt',  'dirt',  'stone', 'stone', 'dirt',  'stone', 'dirt',  'dirt',  'stone'],
    ['stone', 'dirt',  'dirt',  'stone', 'dirt',  'stone', 'iron',  'stone', 'stone', 'stone'],
    ['stone', 'stone', 'deepslate', 'deepslate', 'stone', 'stone', 'iron', 'stone', 'deepslate', 'deepslate'],
    ['stone', 'deepslate', 'deepslate', 'stone', 'deepslate', 'stone', 'stone', 'deepslate', 'deepslate', 'deepslate'],
    ['deepslate', 'deepslate', 'diamond', 'deepslate', 'deepslate', 'deepslate', 'deepslate', 'deepslate', 'redstone', 'deepslate'],
    ['deepslate', 'diamond', 'deepslate', 'deepslate', 'deepslate', 'deepslate', 'deepslate', 'deepslate', 'deepslate', 'deepslate'],
    ['deepslate', 'deepslate', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'deepslate', 'deepslate'],
];

const WALL_WIDTH = WALL_GRID[0].length;
const WALL_HEIGHT = WALL_GRID.length;
const TABLET_MAX_WIDTH = 1024;

const FLOWERS = [
  { type: "poppy", col: 1, row: 0 },       // Left upper grass block
  { type: "azure_bluet", col: 8, row: 0 }, // Right upper grass block
  { type: "azure_bluet", col: 4, row: 1 }, // Center grass dip
  { type: "poppy", col: 6, row: 1 },       // Center-right grass dip
] as const;

function CrossedFlower({
    position,
    material,
}: {
    position: [number, number, number];
    material: THREE.MeshLambertMaterial;
}) {
    return (
        <group position={position}>
            <mesh rotation={[0, Math.PI / 4, 0]} material={material}>
                <planeGeometry args={[0.85, 0.85]} />
            </mesh>
            <mesh rotation={[0, -Math.PI / 4, 0]} material={material}>
                <planeGeometry args={[0.85, 0.85]} />
            </mesh>
        </group>
    );
}


function BlockScene({ scrollProgress}: { scrollProgress: MotionValue<number> }) {
    const { size, camera } = useThree();
    const cameraRef = useRef(camera);

    const textures = useLoader(THREE.TextureLoader, [
        '/blocks/grass_block_top.png',
        '/blocks/grass_block_side.png',
        '/blocks/dirt.png',
        '/blocks/stone.png',
        '/blocks/iron_ore.png',
        '/blocks/deepslate.png',
        '/blocks/deepslate_diamond_ore.png',
        '/blocks/deepslate_redstone_ore.png',
        '/blocks/poppy.png',
        '/blocks/azure_bluet.png',
    ]);

    const { materials, flowerMaterials } = useMemo(() => {
        textures.forEach((t) => {
            t.magFilter = THREE.NearestFilter;
            t.minFilter = THREE.NearestFilter;
            t.colorSpace = THREE.SRGBColorSpace;
        });

        const [grassTop, grassSide, dirt, stone, iron, deepslate, diamond, redstone, poppyTex, azureBluetTex,] = textures;

        const blockMaterials = {
            grass: [
                new THREE.MeshLambertMaterial({ map: grassSide }),
                new THREE.MeshLambertMaterial({ map: grassSide }),
                new THREE.MeshLambertMaterial({ map: grassTop, color: "#77e65b" }),
                new THREE.MeshLambertMaterial({ map: dirt }),
                new THREE.MeshLambertMaterial({ map: grassSide }),
                new THREE.MeshLambertMaterial({ map: grassSide }),
            ],
            dirt: new THREE.MeshLambertMaterial({ map: dirt }),
            stone: new THREE.MeshLambertMaterial({ map: stone }),
            iron: new THREE.MeshLambertMaterial({ map: iron }),
            deepslate: new THREE.MeshLambertMaterial({ map: deepslate }),
            diamond: new THREE.MeshLambertMaterial({ map: diamond }),
            redstone: new THREE.MeshLambertMaterial({ map: redstone }),
        };

        const flowers = {
            poppy: new THREE.MeshLambertMaterial({
                map: poppyTex,
                transparent: true,
                alphaTest: 0.5,
                side: THREE.DoubleSide,
            }),
            azure_bluet: new THREE.MeshLambertMaterial({
                map: azureBluetTex,
                transparent: true,
                alphaTest: 0.5,
                side: THREE.DoubleSide,
            }),
        };

        return {
            materials: blockMaterials,
            flowerMaterials: flowers,
        };
    }, [textures]);

    const smoothProgress = useSpring(scrollProgress, { stiffness: 120, damping: 24 });

    useFrame(() => {
        const p = smoothProgress.get();
        const perspCam = cameraRef.current as THREE.PerspectiveCamera;
        const fovRad = THREE.MathUtils.degToRad(perspCam.fov);
        const aspect = size.width / size.height;

        const fitToHeight = size.width <= TABLET_MAX_WIDTH;
        const distToFrontFace = fitToHeight
            ? WALL_HEIGHT / (2 * Math.tan(fovRad / 2))
            : WALL_WIDTH / (2 * Math.tan(fovRad / 2) * aspect);
        perspCam.position.z = distToFrontFace + 0.5;

        perspCam.rotation.set(0, 0, 0);

        const visibleHeight = 2 * distToFrontFace * Math.tan(fovRad / 2);

        const startCamY = WALL_HEIGHT / 2 + visibleHeight / 2 - 1.0;
        const endCamY = -WALL_HEIGHT / 2 - visibleHeight / 2 + 1.0;

        perspCam.position.y = THREE.MathUtils.lerp(startCamY, endCamY, p);
    })

    return (
        <>
            <ambientLight intensity={0.50} />
            <directionalLight position={[3, 6, 10]} intensity={1.0} />

            <group position={[-4.5, 4.5, 0]}>
                {WALL_GRID.map((row, rowIndex) =>
                    row.map((blockType, colIndex) => {
                        if (blockType === "empty") return null;
                        const mat = materials[blockType as keyof typeof materials];
                        return (
                        <mesh
                            key={`${rowIndex}-${colIndex}`}
                            position={[colIndex, -rowIndex, 0]}
                            material={mat}
                        >
                            <boxGeometry args={[1, 1, 1]} />
                        </mesh>
                        );
                    })
                )}

                {FLOWERS.map((flower, idx) => (
                    <CrossedFlower
                        key={`flower-${idx}`}
                        position={[flower.col, -flower.row + 0.5 + 0.425, 0]}
                        material={flowerMaterials[flower.type]}
                    />
                ))}
            </group>
        </>
    );
}

export default function BWWall() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    });

    return (
        <section ref={containerRef} className="relative h-[400vh] w-full">
            <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
                <Canvas gl={{ alpha: true, antialias: false, toneMapping: THREE.NoToneMapping, outputColorSpace: THREE.SRGBColorSpace, }} camera={{ fov: 40 }}>
                    <BlockScene scrollProgress={scrollYProgress} />
                </Canvas>
            </div>
        </section>
    );
}