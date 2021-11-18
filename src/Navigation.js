import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Dispense"
        active={props.activePage == "Dispense"}
        onClick={() => props.activePageHandler("Dispense")}
      />
      <MenuItem
        label="Other facilities"
        active={props.activePage == "Stock"}
        onClick={() => props.activePageHandler("Stock")}
      />
      <MenuItem 
        label="Inventory"
        active={props.activePage === "Inventory"}
        onClick={() => props.activePageHandler("Inventory")}
      />
      <MenuItem
        label="Orders"
        active={props.activePage == "Orders"}
        onClick={() => props.activePageHandler("Orders")}
      />
      <MenuItem
        label="Transactions"
        active={props.activePage == "Transactions"}
        onClick={() => props.activePageHandler("Transactions")}
      />

      <MenuItem
        label='Graph'
        active={props.activePage == "Graph"}
        onClick={() => props.activePageHandler("Graph")}
      />
    </Menu>
  );
}
