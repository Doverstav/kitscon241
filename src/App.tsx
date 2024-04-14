import { FormEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation } from "@tanstack/react-query";

function App() {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: async (imagePrompt: string) => {
      const response = await fetch("/api/ai/image", {
        method: "POST",
        body: JSON.stringify({ imagePrompt }),
      });

      const blob = await response.blob();
      const img = URL.createObjectURL(blob);

      setImage(img);
    },
  });

  const handleImagePromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(question);
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + Cloudflare Pages</h1>
      <div className="card">
        <form onSubmit={handleImagePromptSubmit}>
          <label>Image prompt</label>
          <input
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
          />
          <button type="submit">Refetch</button>
        </form>
        {isPending && <p>Loading...</p>}
        <img src={image} />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
