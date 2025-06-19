import "./App.css";
import Navbar from "./Components/Layout/Navbar";
import StakeUI from "./Components/Layout/StakeUI";

function App() {
  return (
    <div className="min-h-screen text-white bg-black">
      <Navbar />
      <StakeUI />
    </div>
  );
}

export default App;
