import React from "react";
import { FlyoutMenu, MenuItem } from "@dhis2/ui";


const organisationUnit = "AlLmKZIIIT4";
const lifeSavingCommodeties = "ULowA8V3ucd";


import { useDataQuery } from '@dhis2/app-runtime'

const dataQuery = {
  dataSets: {
    resource: 'dataSets/' + lifeSavingCommodeties,
    params: {
      fields: [
        'name',
        'id',
        'dataSetElements[dataElement[id, displayName]',
      ],
    },
  },
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
    let names = data.dataSets["dataSetElements"];

    return (
      <div>
        <h1>Life saving commodeties at {organisationUnit}</h1>
        <FlyoutMenu>
          {
            names.map(row => {
              return (
                <MenuItem key={row["dataElement"].id} label={row["dataElement"].displayName} />
              )
            })
          }
        </FlyoutMenu>
      </div>
    );
  }
}
