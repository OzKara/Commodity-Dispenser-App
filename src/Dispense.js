import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDataQuery } from '@dhis2/app-runtime'
import { Button } from '@dhis2/ui'


// "Consumption": J2Qf1jtZuj8 


export function Dispense() {
  const lifeSavingCommodeties = "ULowA8V3ucd";
  const organisationUnit = "AlLmKZIIIT4";

  const [selectedOption, setSelectedOption] = useState({"label":""});
  const [selectedQuantity, setSelectedQuantity] = useState({"label":""});

  let dataQuery = {
    CommodetiesNamesId: {
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

  const { loading, error, data } = useDataQuery(dataQuery)

  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <span>Loading...</span>
  }

  if (data) {

    const items = data.CommodetiesNamesId.dataSetElements

    let Commodities = [];
    let Quantity = [];
    
    for(let i=0; i < items.length; i++){
      Commodities.push({"label": items[i].dataElement.displayName.replace("Commodities - ", ""), "value": items[i].dataElement.id})
    }

    //TODO: make length variable to quantity left
    for(let i=0; i < items.length; i++){
      Quantity.push({"label": i.toString(), "value": i})
    }

    console.log(selectedOption)


  return (
    <div>
      <h1>Dispense</h1>
      Commodity: <Select 
      options={Commodities}
      onChange={setSelectedOption}
      /> 
      Quantity: <Select
      options={Quantity}
      onChange={setSelectedQuantity}
      />
      <p>Order {selectedQuantity.label} {selectedOption.label}</p>
      <Button
      name="Primary button"
      //onClick={}            //TODO: use id along with quantity to send data with API
      >
        Order
      </Button>
    </div>
    
    );
  }
}
