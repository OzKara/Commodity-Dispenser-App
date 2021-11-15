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
