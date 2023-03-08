import { ConnectionLineComponentProps } from "reactflow";

function ConnectionLine(data: ConnectionLineComponentProps) {
  return (
    <g>
      <path
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        className="animated"
        d={`M${data.fromX},${data.fromY} ${data.toX},${data.toY}`}
      />
      <circle
        cx={data.toX}
        cy={data.toY}
        fill="#fff"
        r={3}
        stroke="#222"
        strokeWidth={1.5}
      />
    </g>
  );
}

export default ConnectionLine;
