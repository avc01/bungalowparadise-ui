import "./App.css";
import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="min-h-screen flex-1/2 bg-grey-100">
      <Button variant="default">Click Me</Button>
      <Button variant="outline" className="ml-4">
        Outline Button
      </Button>
    </div>
  );
}

export default App;
