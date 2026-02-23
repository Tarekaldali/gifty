/*
 * GiftBox3D — Premium 3D Gift Box
 *
 * Items: uniform rounded-cube packages in a neat grid layout.
 * Ribbon: realistic fabric-like ribbon with curved bow loops using
 *         CatmullRomCurve3 + TubeGeometry for smooth arcs.
 *
 * Props:
 *   items     – [{ product: { name }, quantity }]
 *   boxTheme  – { color, ribbon, accent }
 *   cover     – { ribbonColor }
 */

import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";

const ITEM_COLORS = [
  "#ff6b6b", "#48dbfb", "#ff9ff3", "#feca57",
  "#54a0ff", "#5f27cd", "#01a3a4", "#f368e0",
  "#ff8a5c", "#25CCF7", "#FD7272", "#58B19F",
];

/* ─── Ribbon material helper ───────────────────── */
function RibbonMat({ color }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.35}
      metalness={0.08}
      clearcoat={0.6}
      clearcoatRoughness={0.25}
      sheen={1}
      sheenColor={new THREE.Color(color).lerp(new THREE.Color("#fff"), 0.3)}
    />
  );
}

/* ─── Curved tube from point array ────────────── */
function CurvedRibbon({ points, radius = 0.025, color }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom",
      0.4
    );
    return new THREE.TubeGeometry(curve, 32, radius, 8, false);
  }, [points, radius]);

  return (
    <mesh geometry={geo} castShadow>
      <RibbonMat color={color} />
    </mesh>
  );
}

/* ─── Single gift item — rounded cube package ─── */
function GiftItem({ name, position, color, size }) {
  return (
    <group position={position}>
      {/* Main cube package */}
      <RoundedBox args={size} radius={0.03} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.08}
          clearcoat={0.7}
          clearcoatRoughness={0.2}
        />
      </RoundedBox>
      {/* Tiny ribbon stripe on package */}
      <RoundedBox
        args={[size[0] + 0.005, 0.025, size[2] + 0.005]}
        radius={0.005}
        smoothness={2}
        position={[0, size[1] / 2 + 0.013, 0]}
      >
        <meshStandardMaterial color="#fff" transparent opacity={0.45} />
      </RoundedBox>
      {/* Label */}
      <Text
        position={[0, size[1] / 2 + 0.06, 0]}
        fontSize={0.055}
        color="#555"
        anchorY="bottom"
        maxWidth={0.55}
      >
        {name?.slice(0, 12) || "Gift"}
      </Text>
    </group>
  );
}

export default function GiftBox3D({
  items = [],
  boxTheme = { color: "#d4a574", ribbon: "#e74c3c", accent: "#c0392b" },
  cover = null,
}) {
  const groupRef = useRef();

  const ribbonColor = cover?.ribbonColor || boxTheme.ribbon;
  const ribbonDark = new THREE.Color(ribbonColor).lerp(new THREE.Color("#000"), 0.25).getStyle();
  const boxColor = boxTheme.color;

  /* ── Compute neat grid positions for items ── */
  const itemPositions = useMemo(() => {
    const n = items.length;
    if (n === 0) return [];

    const cols = Math.min(n, 3);
    const rows = Math.ceil(n / cols);
    const cellW = 0.48;
    const cellD = 0.48;

    return items.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * cellW;
      const z = (row - (rows - 1) / 2) * cellD;
      /* Slight size variation based on index */
      const sizeVariant = 0.28 + (i % 3) * 0.04;
      const h = sizeVariant + (i % 2) * 0.06;
      return {
        pos: [x, -0.52 + h / 2 + 0.02, z],
        size: [sizeVariant, h, sizeVariant],
        color: ITEM_COLORS[i % ITEM_COLORS.length],
      };
    });
  }, [items.length]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
  });

  const W = 2;       // box width
  const H = 1.2;     // box wall height
  const TOP = H / 2; // y of top edge
  const BOT = -0.6;  // y of bottom

  return (
    <group ref={groupRef}>
      {/* ── Box base ────────────────────────── */}
      <RoundedBox args={[W, 0.12, W]} radius={0.03} position={[0, BOT, 0]} receiveShadow>
        <meshPhysicalMaterial color={boxColor} roughness={0.4} metalness={0.1} />
      </RoundedBox>

      {/* ── Box walls (semi-transparent) ───── */}
      {[
        [0, 0, W / 2, 0],
        [0, 0, -W / 2, Math.PI],
        [-W / 2, 0, 0, Math.PI / 2],
        [W / 2, 0, 0, -Math.PI / 2],
      ].map(([x, y, z, ry], i) => (
        <mesh key={`wall${i}`} position={[x, 0, z]} rotation={[0, ry, 0]}>
          <planeGeometry args={[W, H]} />
          <meshPhysicalMaterial color={boxColor} transparent opacity={0.2} roughness={0.3} side={2} />
        </mesh>
      ))}

      {/* ── Wireframe edges ─────────────────── */}
      <mesh>
        <boxGeometry args={[W, H, W]} />
        <meshBasicMaterial color={boxColor} wireframe transparent opacity={0.35} />
      </mesh>

      {/* ══════════════════════════════════════
          RIBBON — flat bands across the top
          ══════════════════════════════════════ */}
      {/* Horizontal ribbon band */}
      <RoundedBox args={[W + 0.06, 0.035, 0.13]} radius={0.01} position={[0, TOP + 0.018, 0]}>
        <RibbonMat color={ribbonColor} />
      </RoundedBox>
      {/* Vertical ribbon band */}
      <RoundedBox args={[0.13, 0.035, W + 0.06]} radius={0.01} position={[0, TOP + 0.018, 0]}>
        <RibbonMat color={ribbonColor} />
      </RoundedBox>

      {/* Ribbon draping down sides — thinner, more fabric-like */}
      {[
        { p: [0, 0, W / 2 + 0.008], a: [0.11, H, 0.012] },
        { p: [0, 0, -(W / 2 + 0.008)], a: [0.11, H, 0.012] },
        { p: [W / 2 + 0.008, 0, 0], a: [0.012, H, 0.11] },
        { p: [-(W / 2 + 0.008), 0, 0], a: [0.012, H, 0.11] },
      ].map(({ p, a }, i) => (
        <RoundedBox key={`rd${i}`} args={a} radius={0.004} position={p}>
          <RibbonMat color={ribbonDark} />
        </RoundedBox>
      ))}

      {/* ══════════════════════════════════════
          BOW — realistic curved loops
          ══════════════════════════════════════ */}
      {/* Center knot — slightly flattened sphere */}
      <mesh position={[0, TOP + 0.09, 0]} castShadow scale={[1, 0.7, 1]}>
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshPhysicalMaterial
          color={ribbonDark}
          roughness={0.25}
          metalness={0.1}
          clearcoat={0.8}
        />
      </mesh>

      {/* Left bow loop */}
      <CurvedRibbon
        color={ribbonColor}
        radius={0.028}
        points={[
          [0, TOP + 0.07, 0],
          [-0.12, TOP + 0.2, 0.02],
          [-0.22, TOP + 0.22, 0],
          [-0.18, TOP + 0.13, -0.02],
          [0, TOP + 0.07, 0],
        ]}
      />
      {/* Right bow loop */}
      <CurvedRibbon
        color={ribbonColor}
        radius={0.028}
        points={[
          [0, TOP + 0.07, 0],
          [0.12, TOP + 0.2, -0.02],
          [0.22, TOP + 0.22, 0],
          [0.18, TOP + 0.13, 0.02],
          [0, TOP + 0.07, 0],
        ]}
      />
      {/* Front bow loop (smaller) */}
      <CurvedRibbon
        color={ribbonColor}
        radius={0.022}
        points={[
          [0, TOP + 0.07, 0],
          [0.02, TOP + 0.17, 0.13],
          [0, TOP + 0.19, 0.18],
          [-0.02, TOP + 0.12, 0.1],
          [0, TOP + 0.07, 0],
        ]}
      />
      {/* Back bow loop (smaller) */}
      <CurvedRibbon
        color={ribbonColor}
        radius={0.022}
        points={[
          [0, TOP + 0.07, 0],
          [-0.02, TOP + 0.17, -0.13],
          [0, TOP + 0.19, -0.18],
          [0.02, TOP + 0.12, -0.1],
          [0, TOP + 0.07, 0],
        ]}
      />

      {/* Ribbon tail — left */}
      <CurvedRibbon
        color={ribbonDark}
        radius={0.018}
        points={[
          [0, TOP + 0.05, 0],
          [-0.1, TOP + 0.0, 0.03],
          [-0.18, TOP - 0.06, 0.01],
        ]}
      />
      {/* Ribbon tail — right */}
      <CurvedRibbon
        color={ribbonDark}
        radius={0.018}
        points={[
          [0, TOP + 0.05, 0],
          [0.1, TOP + 0.0, -0.03],
          [0.18, TOP - 0.06, -0.01],
        ]}
      />

      {/* ── Floor glow ──────────────────────── */}
      <mesh position={[0, BOT - 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial color="#6c5ce7" transparent opacity={0.05} />
      </mesh>

      {/* ── Items (neat grid of cubes) ──────── */}
      <group>
        {itemPositions.map((ip, i) => (
          <GiftItem
            key={items[i]?._id || `item-${i}`}
            name={items[i]?.product?.name}
            position={ip.pos}
            color={ip.color}
            size={ip.size}
          />
        ))}
      </group>

      {/* ── Empty state ─────────────────────── */}
      {items.length === 0 && (
        <Text position={[0, 0, 0]} fontSize={0.14} color="#aaa" anchorY="middle">
          Add items to see them here!
        </Text>
      )}
    </group>
  );
}
