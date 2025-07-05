import AllService from "@/components/AllServices";
import CategoriesSection from "../components/CategoriesSection"
import HomeScreen from "../components/HomeScreen"
import DevelopMent from "@/components/Development";
import Marketing from "@/components/Marketing";
import Sales from "@/components/Sales";

import OutOfHome from "@/components/OutOfHome";

export default function Home() {
  return (
   <div>
     <CategoriesSection/>
     <HomeScreen/>
     <AllService/>
     <DevelopMent/>
     <Marketing/>
     <Sales/>
     <OutOfHome/>





    </div>
  );
}
