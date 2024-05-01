import "./App.css";
import { ImageGenerator } from "./components/ImageGenerator";
import { Chat } from "./components/Chat";
import { Translator } from "./components/Translator";
import { Notes } from "./components/Notes";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import "react-tabs/style/react-tabs.css";

/* 
TODO
- [X] Tabs for different the different workers
- [X] API endpoint that uses some more cloudflare services
- [X] Clean up code, extract components, hooks etc
- [ ] Add some styling
- [ ] Standalone worker demo, as a REST api?
- [X] Migrate from pages to a standalone worker
- [ ] Deploy somewhere so people can test it themselves
*/

function App() {
  return (
    <>
      <h1>Kitscon 24.1</h1>
      <p>
        A small demo site using Cloudflare workers as a backend, demonstrating
        simple CR_D with KV as storage and trying out Workers AI.
      </p>
      <Tabs forceRenderTabPanel>
        <TabList>
          <Tab>Image Generator</Tab>
          <Tab>Chat</Tab>
          <Tab>Translator</Tab>
          <Tab>Notes</Tab>
        </TabList>

        <TabPanel>
          <ImageGenerator />
        </TabPanel>
        <TabPanel>
          <Chat />
        </TabPanel>
        <TabPanel>
          <Translator />
        </TabPanel>
        <TabPanel>
          <Notes />
        </TabPanel>
      </Tabs>
    </>
  );
}

export default App;
