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
import {
  createTransaction,
  getTransactionHistoryQuery,
  appendTransactionHistory
 } from './DataStoreManager'

// "Consumption": J2Qf1jtZuj8

// information needed to update (single data value):
// dataElement (de)
// period (pe)
// organisation unit (ou)
// categoryOptionCombo (co)
// value

export function Dispense() {
  const lifeSavingCommodeties = "ULowA8V3ucd";
  const organisationUnit = "AlLmKZIIIT4";
  const transactionNameSpace = "IN5320-G7/AlLmKZIIIT4-202111"
  //TODO query current user (/api/me.json?fields=name)
  const currentUser = "John Traore"
  let transactionData = {}


  let dataQuery = {
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
      "resource": "dataStore/" + transactionNameSpace
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


  const dataStoreQuery = {
    resource: "dataStore/" + transactionNameSpace,
    type: "update",
    data: (data) => (data)
  }

  const [commodityMutation] = useDataMutation(dataMutationQuery)
  const [dataStoreMutation] = useDataMutation(dataStoreQuery)


  function onSubmit(formInput) {
    // Update database
    console.log(formInput.dataElement)
    console.log(formInput.dataElement.displayName)
    console.log(formInput.dataElement.id)
    commodityMutation({
       value: formInput.value,
       dataElement: formInput.dataElement,
       period: formInput.period,
       orgUnit: organisationUnit,
     })

     // Log transaction
     const newTransactionData = appendTransactionHistory(
       transactionData,
       formInput.dataElement,             // Commodity id
       "NA",                              // Commodity display name
       formInput.value,                   // Amount to dispense
       currentUser,                       // Dispensed by
       formInput.recipient,               // Dispensed to
       "dispense"                         // Transaction type
     )
     dataStoreMutation(newTransactionData)
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
    transactionData = data.dataStoreData

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
