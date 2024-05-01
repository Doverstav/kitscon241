import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

interface Note {
  note: string;
  id: string;
}

export const Notes = () => {
  const queryClient = useQueryClient();

  const [note, setNote] = useState("");

  const { data: notes } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch(
        "https://kitscon241.doverstav.workers.dev/api/notes"
      );
      return (await response.json()) as Note[];
    },
  });

  const { mutate: createNote } = useMutation({
    mutationFn: async (note: string) => {
      await fetch("https://kitscon241.doverstav.workers.dev/api/notes", {
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
      await fetch(`https://kitscon241.doverstav.workers.dev/api/notes/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleNoteSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createNote(note);
  };

  return (
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
  );
};
