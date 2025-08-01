import { Link } from "react-router";
import Gallery from "./Gallery.jsx";
import { Counter } from "./Counter.jsx";
import ScientistList from "./ScientistList.jsx";
import "./App.css";

function App() {
  return (
    <>
      <ul>
        <li>
          <Link to="/thinking-in-react">Thinking in react</Link>
        </li>
      </ul>
      <ScientistList />
    </>
  );
}

export default App;
