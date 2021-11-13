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

function createTransaction(id, name, amount, dispendedBy, dispesedTo, transactionType) {
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

function appendTransactionHistory(transactionHistory, transaction ) {
  //TODO - is this passed by reference or value?
  transactionHistory.push(transaction)
  return transactionHistory
}

function getTransactionHistoryQuery(facilityId, date){
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

function mutateDataStoreQuery(transactionHistory, transaction) {
  let newTransactionHistory = appendTransactionHistory(transactionHistory, transaction)
  let dataStoreMutationQuery = {
    resource: "dataStore/" + transactionNameSpace,
    type: "update",
    data: newTransactionHistory
  }
  return dataStoreMutationQuery
}
