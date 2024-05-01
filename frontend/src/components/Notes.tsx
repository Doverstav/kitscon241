import { useMutation, useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";

interface Note {
  note: string;
  id: string;
}

export const Notes = () => {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const response = await fetch(
        "https://kitscon241.doverstav.workers.dev/api/notes"
      );
      const parsedNotes = (await response.json()) as Note[];

      setNotes(parsedNotes);
    },
  });

  const { mutate: createNote } = useMutation({
    mutationFn: async (note: string) => {
      const response = await fetch(
        "https://kitscon241.doverstav.workers.dev/api/notes",
        {
          method: "POST",
          body: JSON.stringify({ note }),
        }
      );

      return (await response.json()) as Note;
    },
    onSuccess: (data) => {
      setNotes((notes) => [...notes, data]);
      setNote("");
    },
  });

  const { mutate: deleteNote } = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(
        `https://kitscon241.doverstav.workers.dev/api/notes/${id}`,
        {
          method: "DELETE",
        }
      );

      return (await response.json()) as { id: string };
    },
    onSuccess: (data) => {
      setNotes((notes) => notes.filter((note) => note.id !== data.id));
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
