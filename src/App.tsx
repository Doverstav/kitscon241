import { FormEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation } from "@tanstack/react-query";

interface TranslateMutateArgs {
  text: string;
  source_lang: string;
  target_lang: string;
}

function App() {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");

  const [toTranslate, setToTranslate] = useState("");
  const [translated, setTranslated] = useState("");

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

  const { mutate: translate, isPending: isPendingTranslate } = useMutation({
    mutationFn: async ({
      text,
      source_lang,
      target_lang,
    }: TranslateMutateArgs) => {
      const response = await fetch("/api/ai/translate", {
        method: "POST",
        body: JSON.stringify({ text, source_lang, target_lang }),
      });

      const data = await response.json();
      setTranslated(data.translated_text);
    },
  });

  const handleImagePromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(question);
  };

  const handleTranslateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    translate({
      text: toTranslate,
      source_lang: "english",
      target_lang: "swedish",
    });
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
      <div className="card">
        <form onSubmit={handleTranslateSubmit}>
          <label>Text to translate</label>
          {/* TODO Add ability to choose source and target lang */}
          <input
            value={toTranslate}
            onChange={(e) => setToTranslate(e.target.value)}
          />
          <button type="submit">Translate</button>
        </form>
        <p>{isPendingTranslate ? "Translating" : translated}</p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
