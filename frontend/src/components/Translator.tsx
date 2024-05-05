import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

interface TranslateMutateArgs {
  text: string;
  source_lang: string;
  target_lang: string;
}

export const Translator = () => {
  const [toTranslate, setToTranslate] = useState("");
  const [sourceLang, setSourceLang] = useState("english");
  const [targetLang, setTargetLang] = useState("swedish");
  const [translated, setTranslated] = useState("");

  const { mutate: translate, isPending: isPendingTranslate } = useMutation({
    mutationFn: async ({
      text,
      source_lang,
      target_lang,
    }: TranslateMutateArgs) => {
      const response = await fetch(
        "https://kitscon241.doverstav.workers.dev/api/ai/translate",
        {
          method: "POST",
          body: JSON.stringify({ text, source_lang, target_lang }),
        }
      );

      const data = await response.json();
      setTranslated(data.translated_text);
    },
  });

  const handleTranslateSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    translate({
      text: toTranslate,
      source_lang: sourceLang,
      target_lang: targetLang,
    });
  };

  return (
    <div className="card">
      <h2>Translation</h2>
      <form onSubmit={handleTranslateSubmit}>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            gap: "0.5rem",
            justifyContent: "center",
          }}
        >
          <label>From</label>
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
          <label>To</label>
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
        </div>
        <input
          placeholder="Text to translate"
          type="text"
          value={toTranslate}
          onChange={(e) => setToTranslate(e.target.value)}
        />
        <button type="submit">Translate</button>
      </form>
      <p>{isPendingTranslate ? "Translating" : translated}</p>
    </div>
  );
};
