"use client"

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import fullScreen from "../svg/fullscreen.svg"
import normalScreen from "../svg/normalscreen.svg"
import Image from "next/image";

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);
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
  
  useEffect(() => {
    socket.on("canvasImage", (data) => {
      imgRef.current.src = data;
    });
  }, []);

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
    <div className="container mx-auto">
      <h1 className="text-5xl pt-4 pb-3 text-center">
        React Drawing App - Users Online: {userNo}
      </h1>
      <div>
        <div className="border border-black overflow-hidden mt-3 bg-red-400" id="screen">
        <button onClick={toggleFullScreen}>
        <Image src={isFullScreen ? normalScreen : fullScreen} />
        </button>
          <img className="w-full h-[650px]" ref={imgRef} src="" alt="image" style={{ backgroundColor: 'red' }} />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
