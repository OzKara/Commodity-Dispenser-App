import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { useState } from "react";
import { NetworkError } from "./Utils"
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

const dataQuery = {
  dataStoreData: {
    resource: "dataStore/IN5320-G7/test"
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
    if(error.type === "network"){
      return <NetworkError />
    }
    return <span> ERROR: {error.message} </span>
  }

  if (loading) {
    return <CircularLoader />
  }
  if (data) {
    {"data", console.log(data)}
    return (
    <div className={classes.transactionsTable}>
      <DataTable>
        <TableHead>
          <DataTableRow>
            <DataTableColumnHeader>Amount</DataTableColumnHeader>
            <DataTableColumnHeader>CommodityId</DataTableColumnHeader>
            <DataTableColumnHeader>CommodityName</DataTableColumnHeader>
            <DataTableColumnHeader>DispensedBy</DataTableColumnHeader>
            <DataTableColumnHeader>DispensedTo</DataTableColumnHeader>
            <DataTableColumnHeader>Time</DataTableColumnHeader>
            <DataTableColumnHeader>TransactionType</DataTableColumnHeader>
          </DataTableRow>
        </TableHead>
        <TableBody loading>
          {Object.keys(data.dataStoreData).map((key) =>
            data.dataStoreData[key].map((rows) => {
              return(
                <DataTableRow key={rows.time}>
                      <DataTableCell>{rows.amount}</DataTableCell>
                      <DataTableCell>{rows.commodityId}</DataTableCell>
                      <DataTableCell>{rows.commodityName}</DataTableCell>
                      <DataTableCell>{rows.dispensedBy}</DataTableCell>
                      <DataTableCell>{rows.dispensedTo}</DataTableCell>
                      <DataTableCell>{rows.time}</DataTableCell>
                      <DataTableCell>{rows.transactionType}</DataTableCell>
                </DataTableRow>
            )})
          )}
        </TableBody>
      </DataTable>
    </div>
    )
  }
}
