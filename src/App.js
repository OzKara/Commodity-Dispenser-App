import React from "react";
import { useState } from "react";

import { Stock } from "./Stock";
import { Dispense } from "./Dispense";
import { Orders } from "./Orders";
import { Transactions } from "./Transactions";
import { Navigation } from "./Navigation";
import { Graph } from "./Graph";
import "./Styles.css";

const MyApp = () => {
  const [activePage, setActivePage] = useState("Dispense");

  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className='app-container'>
      <div className='app-left'>
        <div className='org-unit main-header'>
          <div className='header-label'>Mbaoma CHP</div>
        </div>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className='app-right'>
        {activePage === "Stock overview" && <Stock />}
        {activePage === "Orders" && <Orders />}
        {activePage === "Dispense" && <Dispense />}
        {activePage === "Transactions" && <Transactions />}
        {activePage === "Graph" && <Graph />}
      </div>
    </div>
  );
};

export default MyApp;
