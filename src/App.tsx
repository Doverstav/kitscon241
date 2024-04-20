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

/* 
TODO
- Tabs for different the different workers
- API endpoint that uses some more cloudflare services
- Clean up code, extract components, hooks etc
- Add some styling
*/

function App() {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");

  const [toTranslate, setToTranslate] = useState("");
  const [sourceLang, setSourceLang] = useState("english");
  const [targetLang, setTargetLang] = useState("swedish");
  const [translated, setTranslated] = useState("");

  const { mutate: generateImage, isPending } = useMutation({
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
    generateImage(question);
  };

  const handleTranslateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    translate({
      text: toTranslate,
      source_lang: sourceLang,
      target_lang: targetLang,
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
        <img style={{ maxWidth: "500px", maxHeight: "500px" }} src={image} />
      </div>
      <div className="card">
        <form onSubmit={handleTranslateSubmit}>
          <label>
            From
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              <option value="english">English</option>
              <option value="swedish">Swedish</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </label>
          <label>
            From
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="english">English</option>
              <option value="swedish">Swedish</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </label>
          <label>
            Text to translate
            <input
              value={toTranslate}
              onChange={(e) => setToTranslate(e.target.value)}
            />
          </label>
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
