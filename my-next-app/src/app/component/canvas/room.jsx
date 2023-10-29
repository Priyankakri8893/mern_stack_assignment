"use client"

import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import "../../canvas/canvas.css";

import rough from "roughjs/bundled/rough.esm";
const generator = rough.generator();


import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Room({ userNo, socket, setUsers, setUserNo }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#3B3B3B");
  const [size, setSize] = useState("3");
  const canvasRef = useRef(null);
  const timeout = useRef(null);
  const [cursor, setCursor] = useState("default");

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    socket.on("message", (data) => {
      toast.info(data.message);
    });
  }, []);

  useEffect(() => {
    socket.on("users", (data) => {
      setUsers(data);
      setUserNo(data.length);
    });
  }, []);

  useLayoutEffect(() => {
    const canvasImage = canvasRef.current.toDataURL();
    socket.emit("drawing", canvasImage);
  }, [isDrawing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Load from localStorage
    const canvasimg = localStorage.getItem("canvasimg");
    if (canvasimg) {
      var image = new Image();
      const ctx = canvas.getContext("2d");
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
        setIsDrawing(false);
      };
      image.src = canvasimg;
    }
  }, [color, size]);

  const startPosition = ({ nativeEvent }) => {
    
    nativeEvent.preventDefault(); // Prevent the default touch action for better touch behavior.
    const isStylusOrTouch = nativeEvent.pointerType === "pen" || nativeEvent.pointerType === "mouse";
  console.log(nativeEvent.pointerType)
  console.log("Event Object:", nativeEvent);
  console.log(nativeEvent.clientX)
    if(isStylusOrTouch){
      setIsDrawing(true);
      draw(nativeEvent);
    }

    // Clear the history beyond the current state when drawing
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, canvasRef.current.toDataURL()]);
    setHistoryIndex(newHistory.length);
  };

  const finishedPosition = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    canvas.getContext("2d").beginPath();
  };


  const draw = ({ nativeEvent }) => {
    nativeEvent.preventDefault(); // Prevent the default canvas behavior
    if (!isDrawing) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    // Handle both mouse and stylus/touch input
    const clientX = nativeEvent.clientX || (nativeEvent.touches && nativeEvent.touches[0].clientX);
    const clientY = nativeEvent.clientY || (nativeEvent.touches && nativeEvent.touches[0].clientY);

    if (clientX && clientY) {
      ctx.lineTo(clientX - canvas.getBoundingClientRect().left, clientY - canvas.getBoundingClientRect().top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(clientX - canvas.getBoundingClientRect().left, clientY - canvas.getBoundingClientRect().top);
    }

    if (timeout.current !== undefined) clearTimeout(timeout.current);
    timeout.current = setTimeout(function () {
      var base64ImageData = canvas.toDataURL("image/png");
      localStorage.setItem("canvasimg", base64ImageData);
    }, 400);
    
};

  const clearCanvas = () => {
    localStorage.removeItem("canvasimg");
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Update history
    setHistory([]);
    setHistoryIndex(-1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    // Handle undo and redo actions by drawing from history
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i <= historyIndex; i++) {
      const image = new Image();
      image.src = history[i];
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
    }
  }, [historyIndex, history]);

  const getPen = () => {
    setCursor("default");
    setSize("3");
    setColor("#3B3B3B");
  };

  const eraseCanvas = () => {
    setCursor("grab");
    setSize("20");
    setColor("#FFFFFF");
    // Additional erase functionality if needed
    if (!isDrawing) {
      return;
    }
  };

  return (
    <>
        <div>
          <h1 className="text-3xl pt-4 pb-3 text-center">
            React Drawing App - users online: {userNo}
          </h1>
        </div>

      <div className="canvas-btn">
        <button onClick={getPen} className="btn-width">
          Pencil
        </button>
        <div className="btn-width">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>
        <div>
          <select
            className="btn-width"
            value={size}
            onChange={(e) => setSize(e.target.value)}
          >
            <option> 1 </option>
            <option> 3 </option>
            <option> 5 </option>
            <option> 10 </option>
            <option> 15 </option>
            <option> 20 </option>
            <option> 25 </option>
            <option> 30 </option>
          </select>
        </div>
        <button onClick={clearCanvas} className="btn-width">
          Clear
        </button>
        <button onClick={undo} className="btn-width">
          Undo
        </button>
        <button onClick={redo} className="btn-width">
          Redo
        </button>
        <div>
          <button onClick={eraseCanvas} className="btn-width">
            Erase
          </button>
        </div>
      </div>
      <div>
      <canvas
        style={{ cursor: cursor, 
          border: "1px solid #000", // Add the border style here
        }}
        onPointerDown={startPosition}
        onPointerUp={finishedPosition}
        onPointerMove={draw}
        onTouchStart={startPosition}
        onTouchMove={draw}
        onTouchEnd={finishedPosition}
        ref={canvasRef}
        socket={socket}
        width="1430" height="700"
      />
      </div>
    </>
  );
}
