import Layouts from "./layouts/Layouts";
import Home from "@/components/pages/home/Home";

const transactions = [
  {
    id: "T20240208001",
    amount: -128.5,
    category: "Food",
    subCategory: "Lunch",
    date: "2024-02-08",
    time: "12:30",
    tags: ["Business Meal", "Reimbursable"],
  },
  {
    id: "T20240208002",
    amount: -45.0,
    category: "Transportation",
    subCategory: "Taxi",
    date: "2024-02-08",
    time: "18:45",
    tags: ["Overtime", "Reimbursable"],
  },
  {
    id: "T20240207001",
    amount: -299.0,
    category: "Shopping",
    subCategory: "Clothing",
    date: "2024-02-07",
    time: "14:20",
    tags: ["Clothes"],
  },
  {
    id: "T20240207002",
    amount: 5000.0,
    category: "Income",
    subCategory: "Salary",
    date: "2024-02-07",
    time: "09:00",
    tags: ["Monthly Pay"],
  },
  {
    id: "T20240206001",
    amount: -66.0,
    category: "Entertainment",
    subCategory: "Movie",
    date: "2024-02-06",
    time: "19:30",
    tags: ["Weekend"],
  },
  {
    id: "T20240206002",
    amount: -158.0,
    category: "Food",
    subCategory: "Dinner",
    date: "2024-02-06",
    time: "21:00",
    tags: ["Gathering"],
  },
];

function App(): JSX.Element {
  return (
    <Layouts>
      <Home transactions={transactions} />
    </Layouts>
  );
}

export default App;
