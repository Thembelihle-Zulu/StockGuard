import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { FarmProfile } from "./component/FarmProfile";

function App() {
  const [count, setCount] = useState(0);
  const provinces = [
    "Eastern Cape",
    "Free State",
    "Gauteng",
    "KwaZulu-Natal",
    "Limpopo",
    "Mpumalanga",
    "Northern Cape",
    "North West",
    "Western Cape",
  ];
  const farmTypes = ["Small-scale", "Commercial"];
  return (
    <>
      <div className="App">
        <FarmProfile provinces={provinces} farmTypes={farmTypes} />
      </div>
    </>
  );
}

export default App;
