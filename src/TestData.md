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

- Data generated serverside:

{
  "0": {
    "amount": -10,
    "commodityId": "adsfdsafdsa",
    "commodityName": "Condoms",
    "dispensedBy": "karl gustav",
    "dispensedTo": "ola",
    "time": 11111111111111,
    "transactionType": "dispense"
  },
  "1": {
    "amount": "33",
    "dispensedBy": "John Traore",
    "dispensedTo": "John Doe",
    "time": 1636819714462,
    "transactionType": "dispense"
  }
}





- Old test data
```json
{
  "202110": [
    {
      "amount": 2,
      "commodity": "condoms",
      "dispensedby": "ola",
      "dispensedto": "bandola",
      "time": "202110"
    },
    {
      "amount": 2,
      "commodity": "bandages",
      "dispensedby": "jakob",
      "time": "1230"
    }
  ],
  "202111": [
    {
      "amount": 3,
      "commodity": "female condoms",
      "dispensedby": "karl gustav",
      "time": "202110"
    },
    {
      "amount": 5,
      "commodity": "b",
      "dispensedby": "a",
      "time": "202111"
    },
    {
      "amount": 123,
      "commodity": "test",
      "dispensedby": "test123",
      "time": "test"
    },
    {
      "amount": 123,
      "commodity": "test",
      "dispensedby": "test6969",
      "time": "test"
    }
  ]
}
```
