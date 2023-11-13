import Header from "@/components/header";
import Navbar from "@/components/navbar";


export default function Layout ({ children }: { children: React.ReactNode; }) {
  return (
    <div className="flex">
      <Navbar />
      <div className="w-4/5 bg-gray-100 h-screen">
        <Header />
        {children}
      </div>
    </div>
  );
};
