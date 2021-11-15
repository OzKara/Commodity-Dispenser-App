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
        label='Stock'
        active={props.activePage == "Stock"}
        onClick={() => props.activePageHandler("Stock")}
      />
      <MenuItem
        label='Orders'
        active={props.activePage == "Orders"}
        onClick={() => props.activePageHandler("Orders")}
      />
      <MenuItem
        label='Transaction History'
        active={props.activePage == "Transactions"}
        onClick={() => props.activePageHandler("Transactions")}
      />
    </Menu>
  );
}
