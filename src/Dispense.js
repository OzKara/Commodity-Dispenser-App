import React, { useState, useEffect } from 'react';
import { useDataQuery } from '@dhis2/app-runtime'
import {
  ReactFinalForm,
  InputFieldFF,
  Button,
  SingleSelectFieldFF,
  hasValue,
  number,
  composeValidators,
} from '@dhis2/ui'
import { useDataMutation } from '@dhis2/app-runtime'
import { OnChange } from 'react-final-form-listeners'


// "Consumption": J2Qf1jtZuj8 

// information needed to update (single data value): 
// dataElement (de) 
// period (pe)
// organisation unit (ou)
// categoryOptionCombo (co)
// value 


function mergeData(data) {

  return data.dataSets.dataValues.map(d => {
    let match = data.CommodetiesNamesId.dataSetElements.find(dataSetElement => {
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
};

function findCommodity(value, commodeties){

  for (const [k, v] of Object.entries(commodeties)) {
    if(v.id == value){
      return v.endBalance
    }
  }

  for(let i = 0; i < commodeties.length; i++){
    if(commodeties[i].id == value){
      return commodeties[i]
    }
  }
}


export function Dispense() {
  const lifeSavingCommodeties = "ULowA8V3ucd";
  const organisationUnit = "AlLmKZIIIT4";
  const [timeframe, setTimeframe] = useState({ value: "202111", label: "November 2021" })
  const [selectedCommodity, setSelectedCommodity] = useState("BXgDHhPdFVU")
  const [stock, setStock] = useState("")


  const query = {

    // names and id 
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

    // ids and value
    dataSets: {
      resource: 'dataValueSets',
      params: ({ timeframe }) => ({
        orgUnit: organisationUnit,
        dataSet: lifeSavingCommodeties,
        period: timeframe,
      })
    }
  }

  // TODO: figure out why data is not updating 
  const dataMutationQuery = {
    dataSet: "ULowA8V3ucd",
    resource: 'dataValueSets',
    type: 'create',
    data: ({ value, dataElement, period, orgUnit }) => ({
      orgUnit: `${orgUnit}`,
      period: `${period}`,
      dataValues: [
        {
          dataElement: `${dataElement}`,
          categoryOptionCombo: "rQLFnNXXIL0",
          value: `${value}`,
        },
      ],
    }),
  }

  const [mutate] = useDataMutation(dataMutationQuery)

  function onSubmit(formInput) {
    console.log(formInput)
    mutate({
      value: formInput.value,
      dataElement: formInput.dataElement,
      period: formInput.period,
      orgUnit: organisationUnit,
    })
  }

  const { loading, error, data, refetch } = useDataQuery(query, {
    variables: {
      timeframe: `${timeframe.value}`,
    }
  })

  useEffect(() => {
    refetch({ timeframe: timeframe.value })
  }, []);


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

    for (let i = 0; i < items.length; i++) {
      Commodities.push({ "label": items[i].dataElement.displayName.replace("Commodities - ", ""), "value": items[i].dataElement.id })
    }

    //TODO: make length variable to quantity left
    for (let i = 0; i < items.length; i++) {
      Quantity.push({ "label": i.toString(), "value": i })
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


    const stock = mergeData(data).filter(e => e.categoryOptionCombo == "rQLFnNXXIL0" || e.categoryOptionCombo == "J2Qf1jtZuj8").sort((a, b) => {
      return b.value - a.value;
    });

    // merge end blance together with consuption for Commodeties 
    let commodeties = []
    for (let i = 0; i < stock.length; i++) {
      // add Commodity 
      if (commodeties[stock[i].displayName] == undefined) {
        commodeties[stock[i].displayName] = { "id": stock[i].id, "Commodity": stock[i].displayName, "endBalance": undefined, "consumption": undefined }
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

    return (
      <div>
        <h1>Dispense</h1>
        <div>
          <ReactFinalForm.Form onSubmit={onSubmit}>
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit} autoComplete="on">
                <ReactFinalForm.Field
                  component={SingleSelectFieldFF}
                  name="dataElement"
                  label="Select Commodity"
                  initialValue="BXgDHhPdFVU"
                  options={Commodities}
                />
                <ReactFinalForm.Field
                  component={SingleSelectFieldFF}
                  name="period"
                  label="Period"
                  initialValue="202111"
                  options={dates}
                />

                <div>

                  <ReactFinalForm.Field
                    name="value"
                    label="Quantity"
                    component={InputFieldFF}
                    initialValue="1"
                    validate={composeValidators(hasValue, number)}
                  />

                  stock : {findCommodity(selectedCommodity,commodeties)}

                </div>

                <OnChange name="dataElement">
                  {(value, previous) => {
                    setSelectedCommodity(value)
                  }}
                </OnChange>

                <Button type="submit" primary>
                  Submit
                </Button>
              </form>
            )}
          </ReactFinalForm.Form>
        </div>
      </div>
    );
  }
}
