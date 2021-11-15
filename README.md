# Case 1: Commodities dispensing

[Cases](https://www.uio.no/studier/emner/matnat/ifi/IN5320/h21/project/project-cases.html)

## Requirements/assumptions

- MVP:
  - Dispensing ("Register when a commodity is dispensed")
  - No permissions/roles
  - Order quantities
  - Adding incoming stock
- Internet outages: pen-and-paper fallback; possibility to update when internet is restored
- View stock levels/contact details for other hospitals
- Order tracking ("Ordered 200 condoms on March 14th")
- Shrinkage reconciliation
- Write-offs with reasons (eg, expiration)
- Transaction history
- Set stock target levels
- Historical stock levels (to estimate future consumption/set future targets)

## Presentation 1: Monday, October 25th

[Slides](https://docs.google.com/presentation/d/1zDZwuonY_7xd3hhSQx8vuzcgfKP4MYL8gid-KXhy4Sk/edit?usp=sharing)

# Running the Project for development

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

4. Start yarn

```bash
yarn start
```

- make sure to start proxy to connect to instance

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
const date = new Date()
const period = d.getFullYear() + "" + (d.getMonth() + 1) //getMonth() counts from 0
// peroid = 202111 in november
```

