import React, { useState } from "react";

const TextBox = ({ addText, canvasRef, ctx, color }) => {
  const [text, setText] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleAddText = () => {
    const canvas = canvasRef.current;
    ctx.current.fillStyle = color;
    ctx.current.font = "20px Arial"; // Define the font style
    ctx.current.fillText(text, position.x, position.y);

    addText({
      text,
      position,
      color,
      font: "20px Arial", // You can customize the font here
    });

    setText(""); // Clear the input field
  };

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Enter text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div>
        <button onClick={handleAddText}>Add Text</button>
      </div>
      <div>
        <label>
          X:{" "}
          <input
            type="number"
            value={position.x}
            onChange={(e) =>
              setPosition({ ...position, x: parseInt(e.target.value) })
            }
          />
        </label>
        <label>
          Y:{" "}
          <input
            type="number"
            value={position.y}
            onChange={(e) =>
              setPosition({ ...position, y: parseInt(e.target.value) })
            }
          />
        </label>
      </div>
    </div>
  );
};

export default TextBox;
