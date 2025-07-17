import React, { createContext, useContext, useState, useEffect } from "react";
import { BillBook, BillBookSummary } from "@/types/billBook";

interface BillBookContextType {
  currentBillBook: BillBook | null;
  billBooks: BillBookSummary[];
  switchBillBook: (billBookId: string) => void;
  createBillBook: (
    billBook: Omit<BillBook, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateBillBook: (billBookId: string, updates: Partial<BillBook>) => void;
  deleteBillBook: (billBookId: string) => void;
  isLoading: boolean;
}

const BillBookContext = createContext<BillBookContextType | undefined>(
  undefined,
);

export function useBillBook() {
  const context = useContext(BillBookContext);
  if (context === undefined) {
    throw new Error("useBillBook must be used within a BillBookProvider");
  }
  return context;
}

interface BillBookProviderProps {
  children: React.ReactNode;
}

export function BillBookProvider({ children }: BillBookProviderProps) {
  const [currentBillBook, setCurrentBillBook] = useState<BillBook | null>(null);
  const [billBooks, setBillBooks] = useState<BillBookSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize default bill book data
  useEffect(() => {
    const initializeBillBooks = () => {
      const defaultBillBooks: BillBookSummary[] = [
        {
          id: "personal-001",
          name: "Personal Bill",
          isActive: true,
          totalTransactions: 0,
          lastActivity: new Date().toISOString(),
        },
        {
          id: "family-001",
          name: "Family Bill",
          isActive: false,
          totalTransactions: 0,
          lastActivity: new Date().toISOString(),
        },
      ];

      const defaultCurrentBillBook: BillBook = {
        id: "personal-001",
        name: "Personal Bill",
        description: "Personal daily income and expense records",
        currency: "CNY",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: "current-user",
        settings: {
          categories: [
            "Food & Drink",
            "Transportation",
            "Shopping",
            "Entertainment",
            "Healthcare",
            "Education",
            "Housing",
            "Others",
          ],
          budgetLimits: {
            "Food & Drink": 2000,
            Transportation: 500,
            Shopping: 1500,
            Entertainment: 800,
          },
        },
      };

      setBillBooks(defaultBillBooks);
      setCurrentBillBook(defaultCurrentBillBook);
      setIsLoading(false);
    };

    initializeBillBooks();
  }, []);

  const switchBillBook = (billBookId: string) => {
    setIsLoading(true);
    // This will fetch complete bill book data from API in the future
    // For now, simulate switching logic
    const targetBook = billBooks.find((book) => book.id === billBookId);
    if (targetBook) {
      const fullBillBook: BillBook = {
        id: targetBook.id,
        name: targetBook.name,
        description: `Detailed description of ${targetBook.name}`,
        currency: "CNY",
        isActive: targetBook.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: "current-user",
        settings: {
          categories: [
            "Food & Drink",
            "Transportation",
            "Shopping",
            "Entertainment",
            "Healthcare",
            "Education",
            "Housing",
            "Others",
          ],
        },
      };

      setCurrentBillBook(fullBillBook);

      // Update active status in bill book list
      setBillBooks((prev) =>
        prev.map((book) => ({
          ...book,
          isActive: book.id === billBookId,
        })),
      );
    }
    setIsLoading(false);
  };

  const createBillBook = (
    billBookData: Omit<BillBook, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newId = `book-${Date.now()}`;
    const now = new Date().toISOString();

    const newSummary: BillBookSummary = {
      id: newId,
      name: billBookData.name,
      isActive: false,
      totalTransactions: 0,
      lastActivity: now,
    };

    setBillBooks((prev) => [...prev, newSummary]);
    // Future: API call to create bill book can be added here
  };

  const updateBillBook = (billBookId: string, updates: Partial<BillBook>) => {
    if (currentBillBook && currentBillBook.id === billBookId) {
      setCurrentBillBook((prev) =>
        prev
          ? { ...prev, ...updates, updatedAt: new Date().toISOString() }
          : null,
      );
    }

    setBillBooks((prev) =>
      prev.map((book) =>
        book.id === billBookId
          ? {
              ...book,
              name: updates.name || book.name,
              lastActivity: new Date().toISOString(),
            }
          : book,
      ),
    );
  };

  const deleteBillBook = (billBookId: string) => {
    setBillBooks((prev) => prev.filter((book) => book.id !== billBookId));

    if (currentBillBook && currentBillBook.id === billBookId) {
      // If deleting current bill book, switch to first available bill book
      const remainingBooks = billBooks.filter((book) => book.id !== billBookId);
      if (remainingBooks.length > 0) {
        switchBillBook(remainingBooks[0].id);
      } else {
        setCurrentBillBook(null);
      }
    }
  };

  const value: BillBookContextType = {
    currentBillBook,
    billBooks,
    switchBillBook,
    createBillBook,
    updateBillBook,
    deleteBillBook,
    isLoading,
  };

  return (
    <BillBookContext.Provider value={value}>
      {children}
    </BillBookContext.Provider>
  );
}
