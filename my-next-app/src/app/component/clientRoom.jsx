"use client"

import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ClientRoom = ({ userNo, socket, setUsers, setUserNo }) => {
  const imgRef = useRef(null);
  
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

  return (
    <div className="container mx-auto">
      <h1 className="text-5xl pt-4 pb-3 text-center">
        React Drawing App - Users Online: {userNo}
      </h1>
      <div className="mt-5">
        <div className="border border-dark overflow-hidden h-96 mx-auto mt-3" style={{ height: "500px" }}>
          <img className="w-full h-full" ref={imgRef} src="" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default ClientRoom;
