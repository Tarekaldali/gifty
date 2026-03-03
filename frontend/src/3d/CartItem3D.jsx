/*
 * CartItem3D
 * ----------
 * A small colored cube that represents one cart item inside the 3D gift box.
 * Items are arranged in a grid layout so they sit neatly inside the box.
 *
 * Props:
 *   name  – product name (displayed as a floating label)
 *   index – position index in the cart array
 *   total – total number of items in the cart
 */

import { Text } from "@react-three/drei";

// A palette of gift-like colors
const COLORS = [
  "#ff6b6b", "#48dbfb", "#ff9ff3", "#feca57",
  "#54a0ff", "#5f27cd", "#01a3a4", "#f368e0",
];

export default function CartItem3D({ name, index, total }) {
  // Calculate grid position so items sit in rows/columns inside the box
  const cols = Math.ceil(Math.sqrt(total));
  const row  = Math.floor(index / cols);
  const col  = index % cols;

  const spacing = 0.55;
  const offsetX = (col - (cols - 1) / 2) * spacing;
  const offsetZ = (row - (Math.ceil(total / cols) - 1) / 2) * spacing;

  const color = COLORS[index % COLORS.length];

  return (
    <group position={[offsetX, -0.1, offsetZ]}>
      {/* The small cube representing the item */}
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Floating product name label */}
      <Text
        position={[0, 0.35, 0]}
        fontSize={0.1}
        color="#555"
        anchorY="bottom"
        maxWidth={0.8}
      >
        {name?.slice(0, 10) || "Gift"}
      </Text>
    </group>
  );
}
