import React from "react";
import classes from "./App.module.css";
import { FlyoutMenu, MenuItem } from "@dhis2/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableFoot,
  TableHead,
  TableRow,
  TableRowHead,
} from '@dhis2/ui'


const organisationUnit = "AlLmKZIIIT4";
const lifeSavingCommodeties = "ULowA8V3ucd";


import { useDataQuery } from '@dhis2/app-runtime'

const dataQuery = {

  dataValueSets: {
    resource: 'dataSets/' + lifeSavingCommodeties,
    params: {
      fields: [
        'name',
        'id',
        'dataSetElements[dataElement[id, displayName]',

      ],
    },
  },

  dataSets: {
    resource: 'dataValueSets',
    "params": {
      "orgUnit": organisationUnit,
      "dataSet": lifeSavingCommodeties,
      "period": "202110",
    }
  }
}

function mergeData(data) {

  return data.dataSets.dataValues.map(d => {
    let match = data.dataValueSets.dataSetElements.find(dataSetElement => {
      if (dataSetElement.dataElement.id == d.dataElement) {
        return true
      }
    })
    return {
      id: match.dataElement.id,
      displayName: match.dataElement.displayName.replace("Commodities - ", ""), // only show name of commodity
      value: d.value,
      categoryOptionCombo: d.categoryOptionCombo
    }
  })
}


export function Dispense() {
  const { loading, error, data } = useDataQuery(dataQuery)

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <span>Loading...</span>
  }

  if (data) {

    console.log(data)

    // rQLFnNXXIL0 = End Balance
    const stock = mergeData(data).filter(e => e.categoryOptionCombo == "rQLFnNXXIL0").sort((a, b) => {
      return b.value - a.value;
    });
    console.log(stock)

    return (
      <div>
        <h1>Life saving commodeties at {organisationUnit}</h1>
        <h2>Stock </h2>
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Commodity</TableCellHead>
              <TableCellHead>Stock</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            {stock.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell>{row.displayName}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              )
            })
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}
