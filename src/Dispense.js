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
import * as DSM from './DataStoreManager'
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

function findCommodity(value, commodities) {

  for (const [k, v] of Object.entries(commodities)) {
    if (v.id == value) {
      return v.endBalance
    }
  }

  for (let i = 0; i < commodities.length; i++) {
    if (commodities[i].id == value) {
      return commodities[i]
    }
  }
}


export function Dispense() {
  const lifeSavingCommodeties = "ULowA8V3ucd";
  const organisationUnit = "AlLmKZIIIT4";

  const transactionNameSpace = "IN5320-G7/AlLmKZIIIT4-202111"
  const namespace = "IN5320-G7"
  const key = "AlLmKZIIIT4-202111"

  // might wanna use useState for this
  let currentUser = ""
  let Commodities = [];
  let transactionData = {}
  
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
          'dataSetElements[dataElement[id, displayName]]',
        ],
      },
    },
    dataStoreData: {
      resource: "dataStore/" + transactionNameSpace
    },
    me: {
      resource: "me",
      params : {
      fields: ["name"]
    // ids and value
    dataSets: {
      resource: 'dataValueSets',
      params: ({ timeframe }) => ({
        orgUnit: organisationUnit,
        dataSet: lifeSavingCommodeties,
        period: timeframe,
      })
    },

    // groups 
    dataElementGroups: {
      resource: 'dataElementGroups',
      params: {
        fields: [
          'displayName',
          'dataElements',
          'id'
        ],
        filter: [
          'id:in:[Svac1cNQhRS,KJKWrWBcJdf,idD1wcvBISQ,rioWDAi1S7z,IyIa0h8CbCZ]',
        ]
      }
    }
  }

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

  const dataStoreQuery = DSM.mutateTransactionHistoryQuery(namespace, key)

  const [commodityMutation] = useDataMutation(dataMutationQuery)
  const [dataStoreMutation] = useDataMutation(dataStoreQuery)


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


  function onSubmit(formInput) {
    // Update database
    commodityMutation({
       value: formInput.value,
       dataElement: formInput.dataElement,
       period: formInput.period,
       orgUnit: organisationUnit,
     })

     // Log transaction
     const newTransactionData = DSM.appendTransactionHistory(
       transactionData,
       formInput.dataElement,                                             // Commodity id
       Commodities.filter(o => o.value==formInput.dataElement)[0].label,  // Commodity display name
       formInput.value,                                                   // Amount to dispense
       currentUser,                                                       // Dispensed by
       formInput.recipient,                                               // Dispensed to
       "dispense"                                                         // Transaction type
     )
     dataStoreMutation(newTransactionData)
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
    transactionData = data.dataStoreData
    currentUser = data.me.name


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

    // merge end blance together with consuption for commodities
    let commodities = []
    for (let i = 0; i < stock.length; i++) {
      // add Commodity 
      if (commodities[stock[i].id] == undefined) {
        commodities[stock[i].id] = { "id": stock[i].id, "Commodity": stock[i].displayName, "endBalance": undefined, "consumption": undefined }
      }
      // add end balance 
      if (stock[i].categoryOptionCombo == "rQLFnNXXIL0") {
        commodities[stock[i].id].endBalance = stock[i].value
      }
      // add consumption
      if (stock[i].categoryOptionCombo == "J2Qf1jtZuj8") {
        commodities[stock[i].id].consumption = stock[i].value
      }
    }

    let commodityGroups = []
    const groupData = data.dataElementGroups.dataElementGroups;
    for (let i = 0; i < groupData.length; i++) {
      //insert group 
      commodityGroups.push({
        "categoryName": groupData[i].displayName,
        "categoryId": groupData[i].id,
        "commodities": []
      });
      // insert commodities into group

      for (let j = 0; j < groupData[i].dataElements.length; j++) {
        let id = groupData[i].dataElements[j].id
        if (commodities[id] != undefined) {
          commodityGroups[i].commodities.push({
            "displayName": commodities[id].Commodity,
            "id": commodities[id].id,
            "consumption": commodities[id].consumption,
            "endBalance": commodities[id].endBalance
          })
        } else {
          console.log(id, "from", groupData[i].displayName, " not in dataset!")
        }
      }
    }

    console.log(commodityGroups)

    return (
      <div>
        <h1>Dispense</h1>
        <h2>Test1234</h2>
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
                <ReactFinalForm.Field
                  component={InputFieldFF}
                  name="recipient"
                  label="Recipient"
                  initialValue=""
                />
                <ReactFinalForm.Field
                  name="value"
                  label="Quantity"
                  component={InputFieldFF}
                  initialValue="1"
                  validate={composeValidators(hasValue, number)}
                />
                <div>
                  <ReactFinalForm.Field
                    name="value"
                    label="Quantity"
                    component={InputFieldFF}
                    initialValue="1"
                    validate={composeValidators(hasValue, number)}
                  />

                  stock : {findCommodity(selectedCommodity, commodities)}

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
