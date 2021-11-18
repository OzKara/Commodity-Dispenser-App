import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  CircularLoader,
  DataTable,
  DataTableToolbar,
  DataTableHead,
  DataTableBody,
  DataTableFoot,
  DataTableRow,
  DataTableCell,
  DataTableColumnHeader,
} from "@dhis2/ui";
import classes from "./App.module.css";
import * as Utils from "./Utils";
import "./Styles.css";

const dataQuery = {
  dataStoreData: {
    resource: "dataStore/IN5320-G7/transactions",
  },
};

export function Transactions() {
  const { loading, error, data } = useDataQuery(dataQuery);
  const [{ column, direction }, setSortInstructions] = useState({
    column: "dispensed",
    direction: "default",
  });

  const getSortDirection = (columnName) =>
    columnName === column ? direction : "default";
  const onSortIconClick = ({ name, direction }) => {
    setSortInstructions({
      column: name,
      direction,
    });
  };

  if (error) {
    if (error.type === "network") {
      return <Utils.NetworkError />;
    }
    return <span> ERROR: {error.message} </span>;
  }

  if (loading) {
    return <CircularLoader />;
  }
  if (data) {
    {
      "data", console.log(data);
    }

    let transactions = [];
    Object.keys(data.dataStoreData).map((key) =>
      data.dataStoreData[key].map((rows) =>
        rows.transactionItems.map((item) =>
          transactions.push({
            dataElement: item.dataElement,
            dispensed: item.dispensed,
            displayName: item.displayName,
            newBalance: item.newBalance,
            dispensedBy: rows.dispensedBy,
            dispensedTo: rows.dispensedTo,
            time: rows.time,
            transactionType: rows.transactionType,
          })
        )
      )
    );
    console.log(transactions);
    return (
      <div className="main-container">
        <div className="main-header">
          <div className="header-label">Transaction Log</div>
        </div>
        <div className={classes.transactionsTable}>
          <DataTable className="transaction-table">
            <TableHead>
              <DataTableRow>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("dispensed")}
                  name={"dispensed"}
                >
                  Amount Dispensed
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("dataElement")}
                  name={"dataElement"}
                >
                  Commodity Id
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("displayName")}
                  name={"displayName"}
                >
                  Commodity
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("dispensedBy")}
                  name={"dispensedBy"}
                >
                  Dispensed By
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("dispensedTo")}
                  name={"dispensedTo"}
                >
                  Recipient
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("time")}
                  name={"time"}
                >
                  Time
                </DataTableColumnHeader>
                <DataTableColumnHeader
                  onSortIconClick={onSortIconClick}
                  sortDirection={getSortDirection("transactionType")}
                  name={"transactionType"}
                >
                  Transaction Type
                </DataTableColumnHeader>
              </DataTableRow>
            </TableHead>
            <TableBody loading>
              {transactions
                .sort((a, b) => {
                  const strA = a[column];
                  const strB = b[column];

                  if (
                    (direction === "asc" && strA < strB) ||
                    (direction === "desc" && strA > strB)
                  ) {
                    return -1;
                  }
                  if (
                    (direction === "desc" && strA < strB) ||
                    (direction === "asc" && strA > strB)
                  ) {
                    return 1;
                  }

                  return 0;
                })
                .map((item) => (
                  <DataTableRow key={item.time + item.dataElement}>
                    <DataTableCell>{item.dispensed}</DataTableCell>
                    <DataTableCell>{item.dataElement}</DataTableCell>
                    <DataTableCell>{item.displayName}</DataTableCell>
                    <DataTableCell>{item.dispensedBy}</DataTableCell>
                    <DataTableCell>{item.dispensedTo}</DataTableCell>
                    <DataTableCell>
                      {Utils.convertDate(item.time)}
                    </DataTableCell>
                    <DataTableCell>{item.transactionType}</DataTableCell>
                  </DataTableRow>
                ))}
            </TableBody>
          </DataTable>
        </div>
      </div>
    );
  }
}
