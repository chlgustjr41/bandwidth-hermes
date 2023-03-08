import { useCallback } from "react";
import { EdgeProps, useStore } from "reactflow";

import { getEdgeParams, getOnewayEdgeParams } from "./utils";

import "./edge.css";

export function FloatingEdge(data: EdgeProps) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(data.source), [data.source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(data.target), [data.target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  if (sx === 0 && sy === 0 && tx === 0 && ty === 0) {
    return null;
  }

  const d = `M${sx},${sy} ${tx},${ty}`;

  return (
    <>
      <path
        id={data.id}
        className="react-flow__edge-path"
        d={d}
        markerEnd={data.markerEnd}
        style={data.style}
      />
      <path
        id={data.id + "Selector"}
        className="react-flow__edge-path-selector"
        d={d}
      />
      <text
        dy={-5}
        transform={`rotate(${
          90 + Math.atan2(sx - tx, sy - ty) * (180 / Math.PI)
        } ${(sx + tx) / 2} ${(sy + ty) / 2})`}
        style={{ backgroundColor: "white", border: 5 }}
      >
        <textPath
          href={`#${data.id}`}
          style={{
            fontSize: "16px",
            userSelect: "none",
            msUserSelect: "none",
            WebkitUserSelect: "none",
            zIndex: -5,
          }}
          startOffset="50%"
          textAnchor="middle"
        >
          {data.label}
        </textPath>
      </text>
    </>
  );
}

export function OnewayFloatingEdge(data: EdgeProps) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(data.source), [data.source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(data.target), [data.target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy } = getOnewayEdgeParams(sourceNode, targetNode);
  const tx = targetNode.position.x + Number(targetNode.style?.width) / 2;

  // hard coded value that depends on the VPC's Handle height value
  let handleOffY = 0;
  if (sourceNode.id.includes("Internet")) {
    handleOffY -= 23;
  } else {
    handleOffY += 25;
  }
  const ty = targetNode.position.y + handleOffY;

  if (sx === 0 && sy === 0 && tx === 0 && ty === 0) {
    return null;
  }

  const d = `M${sx},${sy} ${tx},${ty}`;

  return (
    <>
      <path
        id={data.id}
        className="react-flow__edge-path"
        d={d}
        markerEnd={data.markerEnd}
        style={data.style}
      />
      <path
        id={data.id + "Selector"}
        className="react-flow__edge-path-selector"
        d={d}
      />
      <text
        dy={-5}
        transform={`rotate(${
          90 + Math.atan2(sx - tx, sy - ty) * (180 / Math.PI)
        } ${(sx + tx) / 2} ${(sy + ty) / 2})`}
        style={{ backgroundColor: "white", border: 5 }}
      >
        <textPath
          href={`#${data.id}`}
          style={{
            fontSize: "16px",
            userSelect: "none",
            msUserSelect: "none",
            WebkitUserSelect: "none",
            zIndex: -5,
          }}
          startOffset="50%"
          textAnchor="middle"
        >
          {data.label}
        </textPath>
      </text>
    </>
  );
}
