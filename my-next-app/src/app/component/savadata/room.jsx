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
  const ctx = useRef(null);
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
    ctx.current = canvas.getContext("2d");

    // Resizing
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    // Load from localStorage
    const canvasimg = localStorage.getItem("canvasimg");
    if (canvasimg) {
      var image = new Image();
      ctx.current = canvas.getContext("2d");
      image.onload = function () {
        ctx.current.drawImage(image, 0, 0);
        setIsDrawing(false);
      };
      image.src = canvasimg;
    }
  }, [ctx]);

  const startPosition = ({ nativeEvent }) => {
    // Check if the event is triggered by a stylus or touch input
  const isStylusOrTouch = nativeEvent.pointerType === "pen" || nativeEvent.pointerType === "touch";

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
    // ctx.current.beginPath();
  };

  const end = () => {
    setIsDrawing(false);
    // ctx.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    ctx.current = canvas.getContext("2d");
    ctx.current.lineWidth = size;
    ctx.current.lineCap = "round";
    ctx.current.strokeStyle = color;

    ctx.current.lineTo(nativeEvent.clientX, nativeEvent.clientY);
    ctx.current.stroke();
    ctx.current.beginPath();
    ctx.current.moveTo(nativeEvent.clientX, nativeEvent.clientY);

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
      const image = new Image();
      image.src = history[historyIndex - 1];
      image.onload = function () {
        ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.current.drawImage(image, 0, 0);
      };
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const image = new Image();
      image.src = history[historyIndex + 1];
      image.onload = function () {
        ctx.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.current.drawImage(image, 0, 0);
      };
    }
  };

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
      <canvas
        style={{ cursor: cursor }}
        onPointerDown={startPosition}
        onPointerUp={finishedPosition}
        onPointerMove={draw}
        onPointerOut={end}
        ref={canvasRef}
        socket={socket}
      />
    </>
  );
}
