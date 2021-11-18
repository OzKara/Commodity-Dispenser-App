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
  DataTableColumnHeader
} from "@dhis2/ui";
import classes from "./App.module.css";
import * as Utils from "./Utils";
import "./Styles.css";


const dataQuery = {
  dataStoreData: {
    resource: "dataStore/IN5320-G7/transactions"
  }
}

export function Transactions() {
  const { loading, error, data } = useDataQuery(dataQuery)
/**
  const [{ column, value }, setFilter] = useState({
    column: null,
    value: '',
})
const onFilterIconClick = ({ name, show }) => {
    setFilter({
        column: show ? name : null,
        value: '',
    })
}
const onFilterInputChange = ({ value }) => {
    setFilter({
        column: column,
        value,
    })
}
**/

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <CircularLoader />
  }
  if (data) {
    {"data", console.log(data)}
    return (
    <div className="main-container">
      <div className="main-header">
        <div className="header-label">
          Transaction Log
        </div>
      </div>
      <div className={classes.transactionsTable}>
        <DataTable>
          <TableHead>
            <DataTableRow>
              <DataTableColumnHeader>Amount Dispensed</DataTableColumnHeader>
              <DataTableColumnHeader>Commodity Id</DataTableColumnHeader>
              <DataTableColumnHeader>Commodity</DataTableColumnHeader>
              <DataTableColumnHeader>Dispensed By</DataTableColumnHeader>
              <DataTableColumnHeader>Recipient</DataTableColumnHeader>
              <DataTableColumnHeader>Time</DataTableColumnHeader>
              <DataTableColumnHeader>Transaction Type</DataTableColumnHeader>
            </DataTableRow>
          </TableHead>
          <TableBody loading>
            {Object.keys(data.dataStoreData).map((key) =>
              data.dataStoreData[key].map((rows) =>
                rows.transactionItems.map((item) => (
                    <DataTableRow key={rows.time + item.dataElement}>
                          <DataTableCell>{item.dispensed}</DataTableCell>
                          <DataTableCell>{item.dataElement}</DataTableCell>
                          <DataTableCell>{item.displayName}</DataTableCell>
                          <DataTableCell>{rows.dispensedBy}</DataTableCell>
                          <DataTableCell>{rows.dispensedTo}</DataTableCell>
                          <DataTableCell>{Utils.convertDate(rows.time)}</DataTableCell>
                          <DataTableCell>{rows.transactionType}</DataTableCell>
                    </DataTableRow>
            ))))}
          </TableBody>
        </DataTable>
      </div>
    </div>
    )
  }
}
