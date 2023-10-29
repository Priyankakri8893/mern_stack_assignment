
import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();
const Canvas = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  // const [text, setText] = useState("");
  // const [textImage, setTextImage] = useState("")
  // const [textPosition, setTextPosition] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const context = canvas.getContext("2d");

    context.strokeWidth = 5;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = color;
    context.lineWidth = 5;
    ctx.current = context;
  }, []);

  useEffect(() => {
    ctx.current.strokeStyle = color;
  }, [color]);

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: tool === "pencil" ? color : "white", // Set color to white for eraser
          element: tool,
        },
      ]);
    }
    // else if (tool === "text") {
    //   // Handle text placement
    //   setTextPosition({ x: offsetX, y: offsetY });
    // } 
    else if(tool === "eraser"){
      // console.log("eraser")
    }else {
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }

    setIsDrawing(true);
  };

  useLayoutEffect(() => {
    const roughCanvas = rough.canvas(canvasRef.current);
    if (elements.length > 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    elements.forEach((ele, i) => {
      console.log(elements)
      if (ele.element === "rect") {
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "line") {
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      }
       else if (ele.element === "pencil") {
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("drawing", canvasImage);
  }, [elements]);

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              width: offsetX - ele.offsetX,
              height: offsetY - ele.offsetY,
              stroke: ele.stroke,
              element: ele.element,
            }
            : ele
        )
      );
    } else if (tool === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              width: offsetX,
              height: offsetY,
              stroke: ele.stroke,
              element: ele.element,
            }
            : ele
        )
      );
    } else if (tool === "pencil" || tool === "eraser") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
              offsetX: ele.offsetX,
              offsetY: ele.offsetY,
              path: [...ele.path, [offsetX, offsetY]],
              stroke: tool === "pencil" ? color : "white", // Set color to white for eraser
              element: ele.element,
            }
            : ele
        )
      );
    }
  };

  const handleMouseUp = () => {
    // if (tool === "text" && text) {
    //   setElements((prevElements) => [
    //     ...prevElements,
    //     {
    //       text,
    //       offsetX: textPosition.x,
    //       offsetY: textPosition.y,
    //       color,
    //       font: "30px Arial",
    //     },
    //   ]);
    //   console.log(text)
    //   setTextImage(text)
    //   setText(""); // Clear the text input
    // }
    setIsDrawing(false);
  };

  return (
    <>
      <div>
        <canvas ref={canvasRef}
          onPointerDown={handleMouseDown}
          onPointerMove={handleMouseMove}
          onPointerUp={handleMouseUp}
          style={{ backgroundColor: 'white' }}
        />
        {/* {tool === "text" && (
          <textarea
            type="text"
            style={{
              position: "absolute",
              top: textPosition?.y + "px",
              left: textPosition?.x + "px",
            }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleMouseUp}
            autoFocus
          />
        )} */}
      </div>
    </>
  );
};

export default Canvas;
