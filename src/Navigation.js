import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label='Dispense'
        active={props.activePage == "Dispense"}
        onClick={() => props.activePageHandler("Dispense")}
      />
      <MenuItem
        label='Inventory'
        active={props.activePage === "Inventory"}
        onClick={() => props.activePageHandler("Inventory")}
      />
      <MenuItem
        label='Transactions'
        active={props.activePage == "Transactions"}
        onClick={() => props.activePageHandler("Transactions")}
      />
      <MenuItem
        label='Graph'
        active={props.activePage == "Graph"}
        onClick={() => props.activePageHandler("Graph")}
      />
      <MenuItem
        label='Other facilities'
        active={props.activePage == "Stock"}
        onClick={() => props.activePageHandler("Stock")}
      />
    </Menu>
  );
}
