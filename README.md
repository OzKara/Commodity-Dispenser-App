# Case 1: Commodity dispensing

[Cases](https://www.uio.no/studier/emner/matnat/ifi/IN5320/h21/project/project-cases.html)

## App description

We designed and developed an app to digitise process of dispensing commodities in healthcare facilities.

### Dispense

The core functionality of our app is available in the **Dispense** view. This view displays commodities as cards and shows the stock level of each commodity. Different colours draw attention to commodities that are almost out of stock.

Users can enter text to filter which commodities are displayed. They can also select different categories.

To dispense a commodity, it has to be added to the basket first. Users can adjust the basket quantity with buttons or by entering a number. The indicated stock level reflects the number of units in the basket.

The basket provides an opportunity to review which, and how many, commodities are being dispensed. The dispensation is only finalised when the user has entered a recipient and clicked the "Dispense" button.

### Inventory

The **Inventory** view provides an overview of the stock levels of all commodities and makes it easy to modify the balances of a large number of commodities at once.

This feature allows users to adjust balances after taking stock, write off spoiled or expired units, and add incoming supplies.

In case of network outages, we expect users to revert to the paper-based process. When connectivity is restored, they can adjust commodity balances in this view.

Modified balances are highlighted. The new balances are only committed to the database after the user has selected a reason for the adjustments (eg, shrinkage or expiration) and clicked "Save".

### Transactions

All transactions (both dispensations and manual adjustments) are stored in the DHIS2 datastore. Users can review them in the **Transactions** view. The transaction log can be sorted by different values.

### Consumption

The **Consumption** view is a visual tool to review consumption data for a selected time period and predict future consumption of commodities.

The graph allows warehouse managers to detect consumption trends for different commodities and adjust future orders based on predicted demand.

### Other facilities

If a commodity runs out in the user's facility, it is possible to acquire it from other facilities in the district. The **Other facilities** feature displays stock levels from warehouses of other healthcare facilites.

After verifying that a commodity is available, the warehouse manager has to coordinate the exchange by phone or text messaging. When the requested commodities arrive, they can be added in the Inventory view.

## Challenges and constraints

### Storing data in DHIS2

There was some confusion about the available datasets and the associated time periods: No dataset was available for November 2021. That is why our app is hardcoded to use the latest available dataset, which is October 2021 (202110).

Attempting to store data for future months is not supported by DHIS2, as long as the corresponding datasets have not been created. Executing the following query in the [Data Query Playground](https://verify.dhis2.org/in5320/api/apps/query-playground/index.html) verifies this behaviour:

```json
{
  "dataSet": "ULowA8V3ucd",
  "resource": "dataValueSets",
  "type": "create",
  "data": {
    "orgUnit": "AlLmKZIIIT4",
    "period": 202111,
    "dataValues": [
      {
        "dataElement": "Boy3QwztgeZ",
        "categoryOptionCombo": "rQLFnNXXIL0",
        "value": 1
      }
    ]
  }
}
```

Otherwise, we would have extracted the current month and stored data in the appropriate datasets:

```js
const date = new Date();
const period = d.getFullYear() + "" + (d.getMonth() + 1);
// getMonth() counts from 0
// period = 202111 in november
```

### Using the `dataStore` endpoint

The `dataStore` endpoint would be unsuitable for recording transactions in a real-world scenario. In our implementation, use only a single keyspace for storing the transaction log.

To append a single transaction, our app has to fetch the entire transaction log, append the new transaction and replace the log in the data store. While this approach is good enough to demonstrate the functionality of our app, it is not a sensible and future-proof way to record transactions. We explored some ways to optimise the transaction log, such as splitting the log into pages, but ended up deprioritising them because the data store wouldn't be used in a real-world implementation anyway.

###

# Running the project for development

1. Clone repo with:

```bash
git clone https://github.uio.no/maximise/IN5320-project.git
```

2. Make sure DHIS2 CLI is installed globally with

```bash
yarn global add @dhis2/cli
```

3. Install dependencies with yarn

```bash
yarn install
```

4. Start yarn (make sure `dhis-portal` is running as well)

```bash
yarn start
```

## Connecting to the DHIS2 instance

use this instance for project work

```bash
https://verify.dhis2.org/in5320/
```

credentials:

```
username: admin
password: district
```

### CORS (Cross-origin resource sharing)

start proxy with:

```
npx dhis-portal --target=https://verify.dhis2.org/in5320/
```

http://localhost:9999 now redicrects to the instance.
login using:

```
Server: http://localhost:9999
username: admin
password: district
```

### Display data

```json
[
  {
    "categoryName": "Reproductive health",
    "categoryId": "AbCXyZ",
    "commodities": [
      {
        "displayName": "Oxycotin",
        "id": "dsfdfsfdsf",
        "consumption": 123,
        "endBalance": 45
      },
      {
        "displayName": "Resuscitation Equipment",
        "id": "dsfweljsg",
        "consumption": 123,
        "endBalance": 45
      }
    ]
  }
]
```

### Datastore

- Key naming convention: <facilityId>-<YYYYMM>

```json
[
  {
    "commodityId": "adsfdsafdsa",
    "commodityName": "Condoms",
    "amount": -10,
    "dispensedBy": "karl gustav",
    "dispensedTo": "ola",
    "time": 11111111111111,
    "transactionType": "dispense"
  }
]
```

### Discussion

- Regarding period used

The app is hardcoded to only use the dataset from october 2021 (202110).
This is because we were not able to change values in the database for current or future months.

This is part of the response from the http post that is sent when using mutate
in the resource 'dataValueSets', dataset 'ULowA8V3ucd' (life saving commodities) for the period 202111
"conflicts": [
{
"object": "202111",
"value": "Period: 202111 is after latest open future period: 202110 for data element: BXgDHhPdFVU"
}
],
"dataSetComplete": "false"
}

After consulting with one of the group leaders, Alex, we concluded that this was the best solution. Preferably we would let the period be the current month of the current year, for instance by using the js `Date()` function

```js
const date = new Date();
const period = d.getFullYear() + "" + (d.getMonth() + 1); //getMonth() counts from 0
// peroid = 202111 in november
```
