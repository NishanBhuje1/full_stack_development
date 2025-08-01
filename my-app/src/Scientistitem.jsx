import { useState } from "react";

export default function Scientists({ scientist }) {
  let [visitCount, setVisitCount] = useState(0);
  let [backgroundColor, setBackgroundColor] = useState("#eeeeee");

  function sayHello() {
    alert(`Hello, ${scientist.name}`);
    setVisitCount(visitCount + 1);
  }

  function changeBackgroundColor() {
    setBackgroundColor("#ffcccc");
  }
  function resetBackgroundColor() {
    setBackgroundColor("#eeeeee");
  }
  return (
    <div
      onClick={sayHello}
      onMouseEnter={changeBackgroundColor}
      onMouseLeave={resetBackgroundColor}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor,
        gap: "100px",
      }}
    >
      <img
        width={100}
        height={100}
        style={{ borderRadius: "50%" }}
        src={`https://i.imgur.com/${scientist.imageId}.jpg`}
        alt={scientist.name}
      />
      <div style={{ textAlign: "left", color: "black" }}>
        <h2>{scientist.name}</h2>
        <p>
          Profession:<strong>{scientist.profession}</strong>{" "}
        </p>
        <p>{scientist.accomplishment}</p>
        <p>Visit Count: {visitCount}</p>
      </div>
    </div>
  );
}
