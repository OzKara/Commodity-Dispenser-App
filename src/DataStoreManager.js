import React from 'react';
import { useDataQuery, useDataMutation } from '@dhis2/app-runtime'

/**
transactionItem = {
  "commodityId": "id",
  commodityName: "name"
  "amount": 10
  "dispensedBy": "Dis Penser"
  "dispensedTo": "Dis Pensedto"
  "transactionType": transactionType
}
**/

export function createTransaction(id, name, amount, dispensedBy, dispesedTo, transactionType) {
  const date = new Date()
  const time = date.getTime()
  const transaction = { "commodityId" : id,
                        "commodityName" : name,
                        "amount" :        amount,
                        "dispensedBy" :   dispensedBy,
                        "dispensedTo" :   dispesedTo,
                        "time" :          time,
                        "transactionType" :   transactionType
                      }
  return transaction
}

export function appendTransactionHistory( transactionHistory, id, name, amount,
                                          dispensedBy, dispesedTo, transactionType ) {
  const date = new Date()
  const time = date.getTime()
  const day = date.getDay()

  const transaction = { "commodityId" : id,
                        "commodityName" : name,
                        "amount" :        amount,
                        "dispensedBy" :   dispensedBy,
                        "dispensedTo" :   dispesedTo,
                        "time" :          time,
                        "transactionType" :   transactionType
                      }

  console.log(transactionHistory)
  console.log(transaction)

  try { // If there is already a transaction record for current day
    transactionHistory[day].push(transaction)
  } catch(error) { // In case there is no transaction record for current day
    transactionHistory[day] = [transaction]
  }
  //TODO - is this passed by reference or value?
  return transactionHistory
}

export function getTransactionHistoryQuery(facilityId, date){
  let query = {
    dataStoreData: {
      "resource": "dataStore/" + facilityId + "/" + date
    }
  }
  return query
}

function createTransactionHistoryQuery(facilityId, date) {
  let query = {
    "resource": "dataStore/" + facilityId + "/" + date,
    "type": "create",
    "data":{
      }
    }
}

export function mutateTransactionHistoryQuery(transactionHistory, transaction) {
  let newTransactionHistory = appendTransactionHistory(transactionHistory, transaction)
  let dataStoreMutationQuery = {
    resource: "dataStore/" + transactionNameSpace,
    type: "update",
    data: (newTransactionHistory) => (newTransactionHistory)
  }
  return dataStoreMutationQuery
}
