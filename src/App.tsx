// App.tsx
import Layouts from "@/components/layouts/Layouts";
import DashBoard from "@/components/features/dashboard/DashBoard";
import { BillBookProvider } from "@/contexts/BillBookContext";

function App(): JSX.Element {
  return (
    <BillBookProvider>
      <Layouts>
        <DashBoard />
      </Layouts>
    </BillBookProvider>
  );
}

export default App;
