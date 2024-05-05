import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

export const ImageGenerator = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");

  const { mutate: generateImage, isPending } = useMutation({
    mutationFn: async (imagePrompt: string) => {
      const response = await fetch(
        "https://kitscon241.doverstav.workers.dev/api/ai/image",
        {
          method: "POST",
          body: JSON.stringify({ imagePrompt }),
        }
      );

      const blob = await response.blob();
      const img = URL.createObjectURL(blob);

      setImage(img);
    },
  });

  const handleImagePromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    generateImage(question);
  };

  return (
    <div className="card">
      <h2>Image generation</h2>
      <form onSubmit={handleImagePromptSubmit}>
        <input
          placeholder="Image prompt"
          type="text"
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <button type="submit">Generate</button>
      </form>
      {isPending && <p>Loading...</p>}
      <img style={{ maxWidth: "min(100%, 500px)" }} src={image} />
    </div>
  );
};
