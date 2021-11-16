const COMMODITIES_DATASET_ID = "ULowA8V3ucd";
const ORGANISATION_UNIT = "AlLmKZIIIT4";
export const DATASTORE_NAMESPACE = "IN5320-G7";
export const DATASTORE_KEY = "AlLmKZIIIT4-202111";
const TIMEFRAME = "202110";

export const COC_END_BALANCE = "rQLFnNXXIL0";
export const COC_CONSUMPTION = "J2Qf1jtZuj8";
const COC_ORDER_QUANTITY = "KPP63zJPkOu";

export const commoditiesQuery = {
  commodityNames: {
    resource: "dataSets/" + COMMODITIES_DATASET_ID,
    params: {
      fields: ["name", "id", "dataSetElements[dataElement[id, displayName]]"],
    },
  },
  dataStoreData: {
    resource: "dataStore/" + DATASTORE_NAMESPACE + "/" + DATASTORE_KEY,
  },
  me: {
    resource: "me",
    params: {
      fields: ["name"],
    },
  },
  commodityBalances: {
    resource: "dataValueSets",
    params: {
      orgUnit: ORGANISATION_UNIT,
      dataSet: COMMODITIES_DATASET_ID,
      period: TIMEFRAME,
    },
  },
  commodityCategories: {
    resource: "dataElementGroups",
    params: {
      fields: ["displayName", "dataElements", "id"],
      filter: [
        "id:in:[Svac1cNQhRS,KJKWrWBcJdf,idD1wcvBISQ,rioWDAi1S7z,IyIa0h8CbCZ]",
      ],
    },
  },
};

export const createStateFromData = (data) => {
  const commodities = [];

  data.commodityNames.dataSetElements.forEach((e) => {
    e = e.dataElement;

    commodities.push({
      // Assume that all displayNames start with "Commodities - ".
      displayName: e.displayName.replace("Commodities - ", ""),
      id: e.id,
      inBasket: 0,
      // Don't assign categories for now; use default category instead.
      category: "Commodities",
    });
  });

  data.commodityBalances.dataValues.forEach((v) => {
    const i = commodities.findIndex((c) => c.id === v.dataElement);
    if (v.categoryOptionCombo === COC_CONSUMPTION) {
      commodities[i].consumption = parseInt(v.value);
    }
    if (v.categoryOptionCombo === COC_END_BALANCE) {
      commodities[i].endBalance = parseInt(v.value);
    }
  });

  commodities.sort((a, b) => {
    if (a.displayName < b.displayName) {
      return -1;
    }
    if (a.displayName > b.displayName) {
      return 1;
    }
    return 0;
  });

  return commodities;
};

export const dispenseMutationQuery = {
  dataSet: COMMODITIES_DATASET_ID,
  resource: "dataValueSets",
  type: "create",
  data: ({ dispensedCommodities }) => ({
    orgUnit: ORGANISATION_UNIT,
    period: TIMEFRAME,
    dataValues: [...dispensedCommodities],
  }),
};

// Appends new transaction to existing transaction log
export const appendTransactionLog = ({
  transactionLog,
  dispensedBy,
  dispensedTo,
  transactionItems,
  date,
  transactionType,
}) => {
  const time = date.getTime();
  const day = date.getDate();
  console.log(transactionItems);
  const transaction = {
    dispensedBy: dispensedBy,
    dispensedTo: dispensedTo,
    time: time,
    transactionType: transactionType,
    transactionItems: transactionItems,
  };

  transactionLog[day] = transactionLog[day]
    ? [...transactionLog[day], transaction]
    : [transaction];

  return transactionLog;
};

// Returns a function that takes a transaction log and returns the query
export const mutateTransactionLogQuery = (namespace, key) => {
  return {
    resource: "dataStore/" + namespace + "/" + key,
    type: "update",
    data: (data) => data,
  };
};
