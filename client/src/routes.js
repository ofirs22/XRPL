
import App from "./App.js";
import Game1 from "views/Game1.js";
import Game2 from "views/Game2.js";
import Game3 from "views/Game3.js";
import Game4 from "views/Game4.js";
import Game5 from "views/Game5.js";
import Game6 from "views/Game6.js";
import Game7 from "views/Game7.js";
import Game8 from "views/Game8.js";
import Game9 from "views/Game9.js";
import Game10 from "views/Game10.js";
import Game11 from "views/Game11.js";
import Game12 from "views/Game12.js";
import Game13 from "views/Game13.js";
import Game14 from "views/Game14.js";
import Game15 from "views/Game15.js";
import Game16 from "views/Game16.js";
import Game17 from "views/Game17.js";

import About from "views/About";
import Preparation from "views/Preparation";
import Achievements from "views/Achievements";



var routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <App />,
    layout: "/",
  },
  {
    path: "/about",
    name: "About",
    icon: "ni ni-tv-2 text-primary",
    component: <About />,
    layout: "/",
    showInSidebar: false,  

  },
  {
    path: "/preparation",
    name: "Preparation",
    icon: "ni ni-tv-2 text-primary",
    component: <Preparation />,
    layout: "/",
    showInSidebar: false,  

  },{
    path: "/achievements",
    name: "Achievements",
    icon: "ni ni-tv-2 text-primary",
    component: <Achievements />,
    layout: "/",
    showInSidebar: false,  

  },
  {
    path: "/game1",
    name: "Bytes2",
    component: <Game1 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game2",
    name: "Fallback",
    component: <Game2 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game3",
    name: "Balance Checker",
    component: <Game3 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game4",
    name: "Payable Contract",
    component: <Game4 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game5",
    name: "Timestamp",
    component: <Game5 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game6",
    name: "Gas Checker",
    component: <Game6 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game7",
    name: "Change Password",
    component: <Game7 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game8",
    name: "Overflow",
    component: <Game8 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game9",
    name: "Blockhash",
    component: <Game9 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game10",
    name: "Interfaceid",
    component: <Game10 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game11",
    name: "Encode Data",
    component: <Game11 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game12",
    name: "Hash Collision",
    component: <Game12 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game13",
    name: "Decode Data",
    component: <Game13 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game14",
    name: "Factory",
    component: <Game14 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game15",
    name: "SupportInterface",
    component: <Game15 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game16",
    name: "LimitedTickets",
    component: <Game16 />,
    layout: "/",
    showInSidebar: false,  
  },
  {
    path: "/game17",
    name: "EducatedGuess",
    component: <Game17 />,
    layout: "/",
    showInSidebar: false,  
  }   
];
export default routes;

