import React, { useEffect, useRef, useState } from "react";
import "./App";
import axios from "axios";


const baseURL = "http://localhost:5000";
const App = () => {
  const titleInputRef = useRef(null);
  const bodyInputRef = useRef(null);
  const [isloading, setIsloading] = useState(false);
  const [alert, setAlert] = useState("");

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert("");
      }, 4000);
    }
  }, [alert]);

  useEffect (()=> {
    getAllStories();
  }, [])

  const getAllStories = async () => {
    const resp = await axios.get(`${baseURL}/api/vi/stories`)
    console.log(resp.data);
  }

  const postStory = async (event) => {
    event.preventDefault();

    try {
      setIsloading(true);

      const response = await axios.get(`${baseURL}/api/v1/story`, {
        title : titleInputRef.current.value,
        body : bodyInputRef.current.value
      })
      console.log("response:", response.data);
      setIsloading(false);

      setAlert(response?.data?.message);
      event.target.reset();
      
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h1>Social Stories</h1>
      <form onSubmit={postStory}>
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

      {alert && <div className="alert">(alert)</div> }
    </div>
  );
};

export default App;
