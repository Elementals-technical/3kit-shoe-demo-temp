import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color } from "three";
import { initialColors } from "../constants";

export function Shoe(props) {
  const { configuration } = props;
  const ref = useRef();
  const { nodes } = useGLTF(
    "https://www.threekit.com/hubfs/SolutionEngineering/RunningShoe_Flat_Smaller.glb"
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.set(
      Math.cos(t / 4) / 30 + -0.05,
      0.75 + Math.sin(t / 5) / 8,
      0.2 + Math.sin(t / 4) / 8
    );
    ref.current.position.y = (0.5 + Math.cos(t / 2)) / 7;
  });

  const customMaterials = Object.entries(nodes).reduce(
    (output, [key, node]) => {
      if (node.material !== undefined) {
        output[key] = node.material.clone();
        if (configuration !== undefined && configuration[key] !== undefined) {
        let color = configuration[key].replace( '#', '' );
        if( color.length == 3 ) {
          // expand to a 6 digit hex value
          color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
        }
          output[key].color = new Color(Number.parseInt(color, 16));
      }
        else
          output[key].color = new Color(
            Number.parseInt(initialColors[key], 16)
          );
      }
      return output;
    },
    {}
  );

  return (
    <group ref={ref} scale={[50, 50, 50]}>
      {Object.entries(customMaterials).map(([key, material]) => {
        return (
          <mesh
            {...props}
            key={key}
            castShadow
            receiveShadow
            material={material}
            geometry={nodes[key].geometry}
          ></mesh>
        );
      })}
    </group>
  );
}

useGLTF.preload(
  "https://www.threekit.com/hubfs/SolutionEngineering/RunningShoe_Flat_Smaller.glb"
);

export default Shoe