import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  PieChart,
  Plus,
  Receipt,
  Settings,
  TrendingUp,
  Upload,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useBillBook } from "@/contexts/BillBookContext";

// Main feature menu
const mainFeatures = [
  {
    title: "Dashboard",
    url: "#",
    icon: BarChart3,
  },
  {
    title: "Transactions",
    url: "#",
    icon: CreditCard,
  },
  {
    title: "Bill Import",
    url: "#",
    icon: Upload,
  },
  {
    title: "Reports",
    url: "#",
    icon: PieChart,
  },
];

// Data analytics menu
const analyticsItems = [
  {
    title: "Monthly Trends",
    url: "#",
    icon: TrendingUp,
  },
  {
    title: "Category Stats",
    url: "#",
    icon: PieChart,
  },
  {
    title: "Expense Reports",
    url: "#",
    icon: FileText,
  },
];

// System settings menu
const systemItems = [
  {
    title: "Bill Settings",
    url: "#",
    icon: BookOpen,
  },
  {
    title: "System Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { billBooks, currentBillBook, switchBillBook } = useBillBook();

  const handleBillBookSwitch = (billBookId: string) => {
    switchBillBook(billBookId);
  };

  const handleCreateNewBillBook = () => {
    // This will open the create bill book dialog in the future
    console.log("Create new bill book");
  };

  return (
    <Sidebar>
      <SidebarContent>
        {/* Bill Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Bill Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {billBooks.map((billBook) => (
                <SidebarMenuItem key={billBook.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={billBook.isActive}
                    onClick={() => handleBillBookSwitch(billBook.id)}
                  >
                    <button className="w-full flex items-center gap-2">
                      <Receipt />
                      <span>{billBook.name}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={handleCreateNewBillBook}>
                  <button className="w-full flex items-center gap-2">
                    <Plus />
                    <span>Create New Bill</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Main Features */}
        <SidebarGroup>
          <SidebarGroupLabel>Main Features</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainFeatures.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Data Analytics */}
        <SidebarGroup>
          <SidebarGroupLabel>Data Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Settings */}
        <SidebarGroup>
          <SidebarGroupLabel>System Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Current Account Info */}
        {currentBillBook && (
          <SidebarGroup>
            <SidebarGroupLabel>Current Bill</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2 py-1 text-sm text-muted-foreground">
                <div className="font-medium">{currentBillBook.name}</div>
                <div className="text-xs">{currentBillBook.currency}</div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
