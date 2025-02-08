import FileUpload from "@/components/pages/common/FileUpload";
import CurrentMonth from "@/components/pages/home/CurrentMonth";

interface Transaction {
  id: string;
  amount: number;
  category: string;
  subCategory: string;
  date: string;
  time: string;
  tags: string[];
}

interface TransactionProps {
  transaction: Transaction;
}

interface HomeProps {
  transactions: Transaction[];
}

function Transaction({ transaction }: TransactionProps) {
  return (
    <li>
      <span>{transaction.amount}</span>
      <span>{transaction.category}</span>
      <span>{transaction.subCategory}</span>
      <span>{transaction.date}</span>
      <span>{transaction.time}</span>
      <span>{transaction.tags.join(", ")}</span>
    </li>
  );
}

export default function Home({ transactions }: HomeProps) {
  return (
    <div>
      <h2>X payment:</h2>
      <FileUpload />
      <CurrentMonth />
      {/* <ul>
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} key={transaction.id} />
        ))}
      </ul> */}
    </div>
  );
}
