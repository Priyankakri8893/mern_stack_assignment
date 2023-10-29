"use client"
import React, { useRef, useState, useEffect } from "react";

function Whiteboard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000");
  const [size, setSize] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    ctx.lineCap = "round";
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
  }, [color, size]);

  const startDrawing = (e) => {
    e.preventDefault(); // Prevent the default touch action for better touch behavior.
    setIsDrawing(true);
    draw(e); // Start drawing immediately when the pointer is down.
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Handle both mouse and stylus/touch input
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    if (clientX && clientY) {
      ctx.lineTo(clientX - canvas.getBoundingClientRect().left, clientY - canvas.getBoundingClientRect().top);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    canvas.getContext("2d").beginPath();
  };

  return (
    <div>
      <div>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <input
          type="range"
          min="1"
          max="10"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>
      <canvas
        ref={canvasRef}
        style={{
          border: "1px solid #000",
          cursor: "crosshair",
        }}
        onPointerDown={startDrawing}
        onPointerMove={draw}
        onPointerUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
    </div>
  );
}

export default Whiteboard;

