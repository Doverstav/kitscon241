import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ImageGenerator } from "./components/ImageGenerator";
import { Chat } from "./components/Chat";
import { Translator } from "./components/Translator";
import { Notes } from "./components/Notes";

/* 
TODO
- [ ] Tabs for different the different workers
- [X] API endpoint that uses some more cloudflare services
- [ ] Clean up code, extract components, hooks etc
- [ ] Add some styling
- [ ] Standalone worker demo, as a REST api?
- [X] Migrate from pages to a standalone worker
- [ ] Deploy somewhere so people can test it themselves
*/

function App() {
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
      <ImageGenerator />
      <Chat />
      <Translator />
      <Notes />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
