import React from "react";

export function SVGLine({ startX, startY, endX, endY }) {
  return (
    <svg width="300" height="200">
      <path
        stroke="#999"
        strokeWidth={1}
        strokeDasharray={1.5}
        fill="none"
        //0, 200 C 150, 0, 150, 200, 300, 0
        d={`M ${startX}, ${startY} C ${endX / 2}, ${startX}, ${endX / 2}, ${
          endX * 0.6
        }, ${endX}, ${endY}`}
      />
    </svg>
  );
}
