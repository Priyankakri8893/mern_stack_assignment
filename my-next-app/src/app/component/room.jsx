"use client"

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Canvas from "@/app/component/canvas";
import 'react-toastify/dist/ReactToastify.css';
import fullScreen from "../svg/fullscreen.svg"
import normalScreen from "../svg/normalscreen.svg"
import Image from "next/image";
import pencil from "../svg/pencil.svg"
import rectangle from "../svg/rectangle.svg"
import eraser from "../svg/eraser.svg"
import line from "../svg/line.svg"
import TextBox from "./TextBox"; // Import the TextBox component


const Room = ({ userNo, socket, setUsers, setUserNo }) => {
  const canvasRef = useRef(null);
  const ctx = useRef(null);
  const [color, setColor] = useState("#000000");
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([]);
  const [tool, setTool] = useState("pencil");
  const [isFullScreen, setFullScreen] = useState(false); // Track fullscreen state

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

  const text = () => {
    console.log("hii")
    setTool("text")
  }

  
  const toggleFullScreen = () => {
    if (isFullScreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setFullScreen(false);
    } else {
      const canvas = document.getElementById("screen");
      if (canvas) {
        if (canvas.requestFullscreen) {
          canvas.requestFullscreen();
        } else if (canvas.mozRequestFullScreen) {
          canvas.mozRequestFullScreen();
        } else if (canvas.webkitRequestFullscreen) {
          canvas.webkitRequestFullscreen();
        } else if (canvas.msRequestFullscreen) {
          canvas.msRequestFullscreen();
        }
        setFullScreen(true);
      }
    }
  };

  return (
    <div className="overflow-hidden">
      
        <div>
          <h1 className="text-3xl pt-4 pb-3 text-center">
            React Drawing App - users online: {userNo}
          </h1>
        </div>

        <div id="screen" className="bg-yellow-400">
      
        <div className="flex items-center justify-center space-x-7">
          <div>
            <div>
              Color Picker: &nbsp;
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex flex-row justify-center space-x-3">
              <div>
              {/* <button name="tools" id="pencil" onClick={() => setTool("pencil")}>
               <Image src={pencil}/>
               ✏✒
                </button> */}

                 <input
                  type="radio"
                  name="tools"
                  id="pencil"
                  value="pencil"
                  checked={tool === "pencil"}
                  onChange={(e) => setTool(e.target.value)}
                  readOnly={true}
                />
                <label htmlFor="pencil">
                pencil
                </label>
              </div>

              {/* <div>
              <button
              type="text"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full"
              onClick={() => text()}
            >
              text
            </button>
              </div> */}

              <div>
              {/* <button name="tools" id="line" onClick={() => setTool("line")}>
               <Image src={line}/>
                </button> */}
                <input
                  type="radio"
                  name="tools"
                  id="line"
                  value="line"
                  checked={tool === "line"}
                  onChange={(e) => setTool(e.target.value)}
                  readOnly={true}
                />
                <label htmlFor="line">
                  Line
                </label>
              </div>

              <div>
              {/* <button name="tools" id="rect" onClick={() => setTool("rect")}>
               <Image src={rectangle}/>
                </button> */}

                <input
                  type="radio"
                  name="tools"
                  id="rect"
                  value="rect"
                  checked={tool === "rect"}
                  onChange={(e) => setTool(e.target.value)}
                  readOnly={true}
                />
                <label htmlFor="rect">
                rectangle
                </label>
              </div>

              <div>
              {/* <button name="eraser" id="eraser" onClick={() => setTool("eraser")}>
               <Image src={eraser}/>
                </button> */}

                <input
                  type="radio"
                  name="tools"
                  id="eraser"
                  value="eraser"
                  checked={tool === "eraser"}
                  onChange={(e) => setTool(e.target.value)}
                  readOnly={true}
                />
                <label htmlFor="eraser">
                eraser
                </label>
              </div>

            </div>
          </div>

          <div>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full"
              disabled={elements.length === 0}
              onClick={() => undo()}
            >
              Undo
            </button>
            &nbsp;&nbsp;
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full"
              disabled={history.length < 1}
              onClick={() => redo()}
            >
              Redo
            </button>
          </div>

          <div>
            <div>
              <input
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded-full"
                value="Clear Canvas"
                onClick={clearCanvas}
              />
            </div>
          </div>
        </div>
      

       <div className="border border-black mx-4 mt-6 p-4 h-[80vh]" id="fullscreen">
        <button onClick={toggleFullScreen}><Image src={isFullScreen ? normalScreen : fullScreen} /></button>
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
    </div>
  );
};

export default Room;
