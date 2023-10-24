"use client"

import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const JoinCreateRoom = ({ uuid, setUser, setRoomJoined }) => {
  const [roomId, setRoomId] = useState(uuid());
  const [name, setName] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!name) return toast.dark("Please enter your name!");

    setUser({
      roomId,
      userId: uuid(),
      userName: name,
      host: true,
      presenter: true,
    });
    setRoomJoined(true);
  };
  const handleJoinSubmit = (e) => {
    e.preventDefault();
    if (!joinName) return toast.dark("Please enter your name!");

    setUser({
      roomId: joinRoomId,
      userId: uuid(),
      userName: joinName,
      host: false,
      presenter: false,
    });
    setRoomJoined(true);
  };

  return (
    <div className="container">

      <div className="row">
        <div className="col-md-12">
          <h1 className="text-center my-5 text-4xl">
            Welcome To Realtime Whiteboard Sharing App
          </h1>
        </div>
      </div>

      <div className="flex mt-24">
        
        <div className="w-[550px] h-[400px] border-2 border-stone-950 mx-auto bg-sky-700">
          <h1 className="text-center text-blue-400 mb-5 text-4xl mt-10">Create Room</h1>
          <form onSubmit={handleCreateSubmit}>
            <div className="mt-10 mx-10">
              <input
                type="text"
                placeholder="Name"
                className="form-control min-w-[90%]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group my-2 items-center mt-10 mx-10">
              <input
                type="text"
                className="form-control min-w-[90%]"
                value={roomId}
                readOnly={true}
                style={{
                  boxShadow: "none",
                }}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary border-0 btn-sm"
                  type="button"
                  onClick={() => setRoomId(uuid())}
                >
                  Generate
                </button>
                <span className="mr-2"></span>
                <CopyToClipboard
                  text={roomId}
                  onCopy={() => toast.success("Room Id Copied To Clipboard!" , {
                    position: toast.POSITION.TOP_RIGHT
                })}
                >
                  <button
                    className="btn btn-outline-dark border-0 btn-sm"
                    type="button"
                  >
                    Copy
                  </button>
                </CopyToClipboard>
              </div>
            </div>
            <div className="form-group mt-10 mx-10 text-2xl">
              <button type="submit" className="form-control btn btn-dark min-w-[90%]">
                Create Room
              </button>
            </div>
          </form>
        </div>

        <div className="w-[550px] h-[400px] border-2 border-stone-950 mx-auto bg-sky-700">
          <h1 className="text-center text-blue-400 mb-5 text-4xl mt-10">Join Room</h1>
          <form onSubmit={handleJoinSubmit}>
            <div className="mt-10 mx-10">
              <input
                type="text"
                placeholder="Name"
                className="form-control min-w-[90%]"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
              />
            </div>
            <div className="mt-10 mx-10">
              <input
                type="text"
                className="form-control min-w-[90%]"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                placeholder="Room Id"
                style={{
                  boxShadow: "none",
                }}
              />
            </div>
            <div className="form-group mt-10 mx-10 text-2xl">
              <button type="submit" className="form-control btn btn-dark min-w-[90%]">
                Join Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateRoom;

