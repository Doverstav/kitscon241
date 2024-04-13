import { FormEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation } from "@tanstack/react-query";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // const { data, refetch } = useQuery({
  //   queryKey: ["hello-world"],
  //   queryFn: async () => {
  //     const response = await fetch("/api");
  //     return await response.text();
  //   },
  // });

  const { mutate, isPending } = useMutation({
    mutationFn: async (question: string) => {
      const response = await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      return data;
    },
    onSuccess(data) {
      setAnswer(data.response);
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
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
        <form onSubmit={handleSubmit}>
          <label>Your question</label>
          <input
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
          />
          <button type="submit">Refetch</button>
        </form>
        <p>{isPending ? "Loading your answer" : answer}</p>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
