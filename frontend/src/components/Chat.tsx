import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

export const Chat = () => {
  const [chatId] = useState(crypto.randomUUID());
  const [prompt, setPrompt] = useState("");
  const [chat, setChat] = useState<string[]>([]);

  const { mutate: generateChat, isPending: isPendingChat } = useMutation({
    mutationFn: async ({ prompt, id }: { prompt: string; id: string }) => {
      const response = await fetch(
        "https://kitscon241.doverstav.workers.dev/api/ai/chat",
        {
          method: "POST",
          body: JSON.stringify({ prompt, id }),
        }
      );

      const data = await response.json();

      setChat((chat) => [...chat, data.response]);
    },
  });

  const handleChatPromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setChat((chat) => [...chat, prompt]);
    generateChat({ prompt, id: chatId });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }} className="card">
      <h2>Chat</h2>
      <form onSubmit={handleChatPromptSubmit}>
        <label>Prompt</label>
        <input onChange={(e) => setPrompt(e.target.value)} value={prompt} />
        <button type="submit">Chat</button>
      </form>
      <div
        style={{
          maxHeight: "500px",
          maxWidth: "500px",
          overflowY: "auto",
          textAlign: "left",
          alignSelf: "center",
        }}
      >
        {chat.map((response, index) => (
          <p
            style={{
              overflowAnchor: "none",
              fontWeight: `${index % 2 === 0 ? "bolder" : "initial"}`,
            }}
            key={index}
          >
            {response}
          </p>
        ))}
        {isPendingChat && <p>Loading...</p>}
        <div style={{ overflowAnchor: "auto", height: "1px" }}></div>
      </div>
    </div>
  );
};
