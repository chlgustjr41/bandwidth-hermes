import { Node, Position } from "react-flow-renderer";

interface XYReturn {
  x: number;
  y: number;
}

// this helper function returns the intersection point
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(
  intersectionNode: Node,
  targetNode: Node
): XYReturn | undefined {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  if (!intersectionNode || !targetNode) {
    return undefined;
  }

  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;

  const {
    width: targetNodeWidth,
    height: targetNodeHeight,
    positionAbsolute: targetNodePosition,
  } = targetNode;

  if (
    !intersectionNodeWidth ||
    !intersectionNodeHeight ||
    !intersectionNodePosition ||
    !targetNodeWidth ||
    !targetNodeHeight ||
    !targetNodePosition
  ) {
    return undefined;
  }

  const w2 = intersectionNodeWidth / 2;
  const h2 = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w2;
  const y2 = intersectionNodePosition.y + h2;

  const w1 = targetNodeWidth / 2;
  const h1 = targetNodeHeight / 2;

  const x1 = targetNodePosition.x + w1;
  const y1 = targetNodePosition.y + h1;

  const xx1 = (x1 - x2) / (2 * w2) - (y1 - y2) / (2 * h2);
  const yy1 = (x1 - x2) / (2 * w2) + (y1 - y2) / (2 * h2);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w2 * (xx3 + yy3) + x2;
  const y = h2 * (-xx3 + yy3) + y2;

  return { x: x, y: y };
}

// returns the position (top,right,bottom or right) passed node compared to the intersection point
function getEdgePosition(node: Node, intersectionPoint: any) {
  const n = { ...node.positionAbsolute, ...node };
  if (!n.x || !n.y || !n.width || !n.height) {
    return undefined;
  }
  if (!intersectionPoint || !intersectionPoint.x || !intersectionPoint.y) {
    return undefined;
  }
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
}

// returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  // This block of code should not execute
  if (!sourceIntersectionPoint || !targetIntersectionPoint) {
    return {
      sx: 0,
      sy: 0,
      tx: 0,
      ty: -1,
      sourcePos,
      targetPos,
    };
  }

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}

// For OnewayFloatingEdge calculation
function getOnewayNodeIntersection(
  intersectionNode: Node,
  targetNode: Node
): XYReturn | undefined {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  if (!intersectionNode || !targetNode) {
    return undefined;
  }

  const {
    width: intersectionNodeWidth,
    height: intersectionNodeHeight,
    positionAbsolute: intersectionNodePosition,
  } = intersectionNode;

  const {
    width: targetNodeWidth,
    height: targetNodeHeight,
    positionAbsolute: targetNodePosition,
  } = targetNode;

  if (
    !intersectionNodeWidth ||
    !intersectionNodeHeight ||
    !intersectionNodePosition ||
    !targetNodeWidth ||
    !targetNodeHeight ||
    !targetNodePosition
  ) {
    return undefined;
  }

  const w2 = intersectionNodeWidth / 2;
  const h2 = intersectionNodeHeight / 2;

  const x2 = intersectionNodePosition.x + w2;
  const y2 = intersectionNodePosition.y + h2;

  const w1 = targetNodeWidth / 2;
  // const h1 = targetNodeHeight / 2;

  const x1 = targetNodePosition.x + w1;
  const y1 = targetNodePosition.y;

  const xx1 = (x1 - x2) / (2 * w2) - (y1 - y2) / (2 * h2);
  const yy1 = (x1 - x2) / (2 * w2) + (y1 - y2) / (2 * h2);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w2 * (xx3 + yy3) + x2;
  const y = h2 * (-xx3 + yy3) + y2;

  return { x: x, y: y };
}

export function getOnewayEdgeParams(source: Node, target: Node) {
  const sourceIntersectionPoint = getOnewayNodeIntersection(source, target);
  const targetIntersectionPoint = getOnewayNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  // This block of code should not execute
  if (!sourceIntersectionPoint || !targetIntersectionPoint) {
    return {
      sx: 0,
      sy: 0,
      tx: 0,
      ty: -1,
      sourcePos,
      targetPos,
    };
  }

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
