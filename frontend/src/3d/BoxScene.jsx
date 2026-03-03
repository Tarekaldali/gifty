/*
 * BoxScene
 * --------
 * The Three.js canvas wrapper.  This is the ONLY file that imports
 * React Three Fiber's <Canvas>.  Keeping 3D code isolated here makes
 * it easy to maintain and swap out.
 *
 * Features:
 *   - Ambient + directional lighting
 *   - OrbitControls (user can rotate / zoom)
 *   - Soft environment reflections via @react-three/drei
 *
 * Props:
 *   items – cart items array passed down to GiftBox3D
 */

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import GiftBox3D from "./GiftBox3D";

export default function BoxScene({ items = [], boxTheme, cover }) {
  return (
    <div
      style={{
        width: "100%",
        height: 380,
        borderRadius: 16,
        overflow: "hidden",
        background: "linear-gradient(135deg, #fdf6ec 0%, #ece4d8 50%, #e8dcc8 100%)",
      }}
    >
      <Canvas camera={{ position: [3.5, 2.8, 3.5], fov: 38 }} shadows>
        {/* Lighting setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={0.9} castShadow shadow-mapSize={1024} />
        <directionalLight position={[-3, 4, -2]} intensity={0.3} color="#ffeaa7" />
        <pointLight position={[0, 3, 0]} intensity={0.4} color="#dfe6e9" />

        {/* The gift box with items inside */}
        <GiftBox3D items={items} boxTheme={boxTheme} cover={cover} />

        {/* Soft floor shadow */}
        <ContactShadows position={[0, -0.68, 0]} opacity={0.3} scale={5} blur={2.5} far={4} />

        {/* Mouse-drag rotation & zoom */}
        <OrbitControls
          enablePan={false}
          maxDistance={7}
          minDistance={2.5}
          maxPolarAngle={Math.PI / 2.1}
          autoRotate={false}
        />

        {/* Soft environment for nicer reflections */}
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
