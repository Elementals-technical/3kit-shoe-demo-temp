import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { forwardRef } from "react";

const CanvasComponent = forwardRef((props: any, ref: any) => {
  const { children } = props;
  return (
    <Canvas
      // @ts-ignore
      eventSource={document.getElementById("root")}
      eventPrefix="client"
      camera={{ position: [0, 0, 4], fov: 40 }}
      ref={ref}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.2} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, -5]}
        castShadow
      />
      <Environment files="potsdamer_platz_1k.hdr" background blur={1} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.05}
        enableZoom={false}
        makeDefault
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
      <ContactShadows
        resolution={512}
        position={[0, -0.8, 0]}
        opacity={1}
        scale={10}
        blur={2}
        far={0.8}
      />
      {children}
    </Canvas>
  );
});

export default CanvasComponent;
