"use client"

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "@/app/component/canvas";
import 'react-toastify/dist/ReactToastify.css';

const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");

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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    setElements([]);
  };

  const undo = () => {
    setHistory((prevHistory) => [
      ...prevHistory,
      elements[elements.length - 1],
    ]);
    setElements((prevElements) =>
      prevElements.filter((ele, index) => index !== elements.length - 1)
    );
  };

  const redo = () => {
    setElements((prevElements) => [
      ...prevElements,
      history[history.length - 1],
    ]);
    setHistory((prevHistory) =>
      prevHistory.filter((ele, index) => index !== history.length - 1)
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <h1 className="text-3xl pt-4 pb-3 text-center">
          React Drawing App - users online: {userNo}
        </h1>
      </div>

      <div className="flex">
        <div className="col-md-2">
          <div className="color-picker flex items-center justify-center">
            Color Picker: &nbsp;
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="flex flex-row justify-center space-x-3">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tools"
                id="pencil"
                value="pencil"
                checked={tool === "pencil"}
                onChange={(e) => setTool(e.target.value)}
                readOnly={true}
              />
              <label className="form-check-label" htmlFor="pencil">
                Pencil
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tools"
                id="line"
                value="line"
                checked={tool === "line"}
                onChange={(e) => setTool(e.target.value)}
                readOnly={true}
              />
              <label className="form-check-label" htmlFor="line">
                Line
              </label>
            </div>

            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="tools"
                id="rect"
                value="rect"
                checked={tool === "rect"}
                onChange={(e) => setTool(e.target.value)}
                readOnly={true}
              />
              <label className="form-check-label" htmlFor="rect">
                Rectangle
              </label>
            </div>
          </div>
        </div>

        <div className="col-md-2">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full"
            disabled={elements.length === 0}
            onClick={() => undo()}
          >
            Undo
          </button>
          &nbsp;&nbsp;
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full"
            disabled={history.length < 1}
            onClick={() => redo()}
          >
            Redo
          </button>
        </div>

        <div className="col-md-1">
          <div className="color-picker flex items-center justify-center">
            <input
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full"
              value="Clear Canvas"
              onClick={clearCanvas}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <Canvas
          canvasRef={canvasRef}
          ctx={ctx}
          color={color}
          setElements={setElements}
          elements={elements}
          tool={tool}
          socket={socket}   
        />
      </div>
    </div>
  );
};

export default Room;
