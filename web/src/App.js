import React, { useEffect, useRef, useState } from "react";
import "./App";

const App = () => {
  const titleInputRef = useRef(null);
  const bodyInputRef = useRef(null);
  const [isloading, setIsloading] = useState(false);
  const [alert, setAlert] = useState("")
  
  useEffect (()=> {
    setTimeout(()=> {set}, 4000)
  }, [alert])
const getWeather = async (event) => {
  event.preventDefault();
  
  try {
    setIsloading(true)

    const response = await axios.get
  } catch (e) {
    console.error(e);
  }
}
  
  return (
    <div>
      <h1>Social Stories</h1>
      <form onSubmit={getWeather}>
        <label htmlFor="titleInput">Title</label>
        <input
          type="text"
          id="titleInput"
          maxLength={20}
          minLength={3}
          required
          ref={titleInputRef}
        />
        <br />
        <label htmlFor="BodyInput">Body</label>
        <textarea
          type="text"
          id="bodyInput"
          maxLength={999}
          minLength={10}
          required
          ref={bodyInputRef}
        ></textarea>
        <br />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default App;
