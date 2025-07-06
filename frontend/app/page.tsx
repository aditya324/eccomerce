import AllService from "@/components/AllServices";
import CategoriesSection from "../components/CategoriesSection"
import HomeScreen from "../components/HomeScreen"
import DevelopMent from "@/components/Development";
import Marketing from "@/components/Marketing";
import Sales from "@/components/Sales";

import OutOfHome from "@/components/OutOfHome";

export default function Home() {
  return (
    <div className="bg-[radial-gradient(circle,_rgba(242,177,4,0.14)_0%,_rgba(242,177,4,0)_100%)]">
      <CategoriesSection />
      <HomeScreen />
      <AllService />
      <DevelopMent />
      <Marketing />
      <Sales />
      <OutOfHome />
    </div>
  );
}
