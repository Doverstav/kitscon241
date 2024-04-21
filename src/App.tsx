import { FormEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface TranslateMutateArgs {
  text: string;
  source_lang: string;
  target_lang: string;
}

interface Note {
  note: string;
  id: string;
}

/* 
TODO
- [ ] Tabs for different the different workers
- [X] API endpoint that uses some more cloudflare services
- [ ] Clean up code, extract components, hooks etc
- [ ] Add some styling
- [ ] Standalone worker demo, as a REST api? (i.e. not part of pages)
  - [ ] Migrate from pages to a standalone worker?
- [ ] Deploy somewhere so people can test it themselves
*/

function App() {
  const queryClient = useQueryClient();

  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");

  const [toTranslate, setToTranslate] = useState("");
  const [sourceLang, setSourceLang] = useState("english");
  const [targetLang, setTargetLang] = useState("swedish");
  const [translated, setTranslated] = useState("");

  const [note, setNote] = useState("");

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

  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch("/api/notes");
      return (await response.json()) as Note[];
    },
  });

  const { mutate: createNote } = useMutation({
    mutationFn: async (note: string) => {
      await fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify({ note }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setNote("");
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
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

  const handleNoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNote(note);
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
        <h2>Image generation</h2>
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
        <h2>Translation</h2>
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
      <div className="card">
        <h2>Notes</h2>
        <form onSubmit={handleNoteSubmit}>
          <label>
            Add note
            <input value={note} onChange={(e) => setNote(e.target.value)} />
            <button type="submit">Create note</button>
          </label>
        </form>
        <ul>
          {notes?.map((note) => (
            <li key={note.id}>
              {note.note}{" "}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => deleteNote(note.id)}
              >
                &times;
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
