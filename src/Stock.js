import React, { useState, useEffect } from 'react';
import { DropdownButton } from '@dhis2/ui'
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
  
  const [searchQuery, setSearchQuery] = useState(); // Default = No search query
  const lifeSavingCommodeties = "ULowA8V3ucd";
  let dataQuery = {
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
      "params": {
        "orgUnit": organisationUnit,
        "dataSet": lifeSavingCommodeties,
        "period": "202110",
      }
    }
  }
  const [apiData, setApiData] = useState(dataQuery);


  useEffect(() => {

    // TODO: search box to lookup/selecting other organisationUnits? 
    dataQuery = {
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
        "params": {
          "orgUnit": organisationUnit,
          "dataSet": lifeSavingCommodeties,
          "period": "202110",
        }
      }
    }

    setApiData(dataQuery);

  }, [searchQuery, organisationUnit]); // Array containing which state changes that should re-reun useEffect()

  console.log(apiData)
  const { loading, error, data } = useDataQuery(apiData)

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
