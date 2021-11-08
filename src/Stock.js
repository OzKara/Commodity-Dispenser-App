import React, { useState, useEffect } from 'react';
import Select from 'react-select';
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
import { useDataQuery } from '@dhis2/app-runtime'


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


export function Stock() {

  const [organisationUnit, setOrganisationUnit] = useState("AlLmKZIIIT4");
  const [timeframe, setTimeframe] = useState({ value: "202111", label: "November 2021" })
  const lifeSavingCommodeties = "ULowA8V3ucd";


  const query = {
    organisationUnits: {
      resource: 'dataSets/' + lifeSavingCommodeties,
      params: {
        fields: [
          'organisationUnits',
        ],
      },
    },

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
      params: ({ organisationUnit, timeframe }) => ({
        orgUnit: organisationUnit,
        dataSet: lifeSavingCommodeties,
        period: timeframe,
      })
    }
  }

  const { loading, error, data, refetch } = useDataQuery(query, {
    variables: {
      organisationUnit: organisationUnit,
      timeframe: `${timeframe}`
    }
  })
  useEffect(() => {

    // TODO: search box to lookup/selecting other organisationUnits? 
    refetch({ organisationUnit: organisationUnit, timeframe: timeframe.value })
  }, [timeframe.value]); // Array containing which state changes that should re-reun useEffect()

  console.log(query)
  console.log(timeframe)


  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <span>Loading...</span>
  }

  if (data) {

    // rQLFnNXXIL0 = End Balance
    // J2Qf1jtZuj8 = Consumption 
    // KPP63zJPkOu = Quantity to be ordered

    const stock = mergeData(data).filter(e => e.categoryOptionCombo == "rQLFnNXXIL0" || e.categoryOptionCombo == "J2Qf1jtZuj8").sort((a, b) => {
      return b.value - a.value;
    });

    // merge end blance together with consuption for Commodeties 
    let commodeties = []
    for (let i = 0; i < stock.length; i++) {
      // add Commodity 
      if (commodeties[stock[i].displayName] == undefined) {
        commodeties[stock[i].displayName] = { "Commodity": stock[i].displayName, "endBalance": undefined, "consumption": undefined }
      }
      // add end balance 
      if (stock[i].categoryOptionCombo == "rQLFnNXXIL0") {
        commodeties[stock[i].displayName].endBalance = stock[i].value
      }
      // add consumption
      if (stock[i].categoryOptionCombo == "J2Qf1jtZuj8") {
        commodeties[stock[i].displayName].consumption = stock[i].value
      }
    }

    let dates = [];
    const year = 2021;
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    for (let i = 1; i <= 12; i++) {
      dates.push({ "label": `${months[i - 1]} 2021`, "value": (202100 + i).toString() })
    }

    return (
      <div>
        <h1>Life saving commodeties at {organisationUnit}</h1>
        <h2>Stock at {timeframe.label}</h2>
        timeframe: <Select
          options={dates}
          onChange={setTimeframe}
        />
        <Table>
          <TableHead>
            <TableRowHead>
              <TableCellHead>Commodity</TableCellHead>
              <TableCellHead>End Balance</TableCellHead>
              <TableCellHead>Consumption</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>
            {
              Object.keys(commodeties).map(id => {
                return (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{commodeties[id].endBalance}</TableCell>
                    <TableCell>{commodeties[id].consumption}</TableCell>
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
