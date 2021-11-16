/**
Helper function for the Datastore / transaction history
**/


export function appendTransactionHistory( transactionHistory, id, name, amount,
                                          dispensedBy, dispesedTo, transactionType ) {
  const date = new Date()
  const time = date.getTime()
  const day = date.getDate() // Day of month

  const transaction = { "commodityId" : id,
                        "commodityName" : name,
                        "amount" :        amount,
                        "dispensedBy" :   dispensedBy,
                        "dispensedTo" :   dispesedTo,
                        "time" :          time,
                        "transactionType" :   transactionType
                      }

    transactionHistory[day] = transactionHistory[day] ?
    [...transactionHistory[day], transaction] :
    [transaction]

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

// TODO:
// Check if key for month exists, else create new key
export function createTransactionHistoryQuery(facilityId, date) {
  return {
    resource: "dataStore/" + facilityId + "/" + date,
    type: "create",
    data: {}
    }
}

export function mutateTransactionHistoryQuery(namespace, key) {
  return ({
    resource: "dataStore/" + namespace + "/" + key,
    type: "update",
    data: (data) => (data)
  })
}
