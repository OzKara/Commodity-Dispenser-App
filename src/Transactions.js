import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableHead,
  TableRow,
  TableRowHead,
  CircularLoader
} from "@dhis2/ui";
import classes from "./App.module.css";

const dataQuery = {
  dataStoreData: {
    resource: "dataStore/IN5320-G7/test"
  }
}

export function Transactions() {
  const { loading, error, data } = useDataQuery(dataQuery)

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <CircularLoader />
  }
  if (data) {
    //console.log(data);
    //console.log(data.dataStoreData);
     {"data", console.log(data)}
    return (
    <div className={classes.transactionsTable}>
      <Table>
        <TableHead>
          <TableRowHead>
            <TableCellHead>Amount</TableCellHead>
            <TableCellHead>CommodityId</TableCellHead>
            <TableCellHead>CommodityName</TableCellHead>
            <TableCellHead>DispensedBy</TableCellHead>
            <TableCellHead>DispensedTo</TableCellHead>
            <TableCellHead>Time</TableCellHead>
            <TableCellHead>TransactionType</TableCellHead>
          </TableRowHead>    
        </TableHead>
        <TableBody>
          

          {Object.keys(data.dataStoreData).map(key => 
            data.dataStoreData[key].map(row => {

              return(
              <TableRow key={row.time}>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.commodityId}</TableCell>
                    <TableCell>{row.commodityName}</TableCell>
                    <TableCell>{row.dispensedBy}</TableCell>
                    <TableCell>{row.dispensedTo}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>{row.transactionType}</TableCell>
                  </TableRow>
            )})
            /**
            <TableRow>
              <TableCell>{row}</TableCell>
            </TableRow>
          )))}
          **/
          )}
          <TableRow></TableRow>
        </TableBody>
      </Table>
    </div>
    )
  }
}
