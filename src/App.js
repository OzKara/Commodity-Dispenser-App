import React from "react";
import classes from "./App.module.css";
import { useState } from "react";

import { Stock } from "./Stock";
import { Dispense } from "./Dispense"
import { Orders } from "./Orders";
import { Transactions } from "./Transactions"
import { Navigation } from "./Navigation";

function MyApp() {
  const [activePage, setActivePage] = useState("Dispense");

  function activePageHandler(page) {
    setActivePage(page);
  }

  return (
    <div className={classes.container}>
      <div className={classes.left}>
        <Navigation
          activePage={activePage}
          activePageHandler={activePageHandler}
        />
      </div>
      <div className={classes.right}>
        {activePage === "Stock" && <Stock />}
        {activePage === "Orders" && <Orders />}
        {activePage === "Dispense" && <Dispense />}
        {activePage === "Transactions" && <Transactions />}
      </div>
    </div>
  );
}

export default MyApp;
