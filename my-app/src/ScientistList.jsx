import { people } from "./data";
import Scientistitem from "./Scientistitem";

export default function ScientistList() {
  return (
    <div>
      <h1>Scientists</h1>
      {people.map((scientist) => (
        <Scientistitem scientist={scientist} key={scientist.id} />
      ))}
    </div>
  );
}
