import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useDataQuery } from '@dhis2/app-runtime'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import classes from "./App.module.css";


function mergeData(data) {

  return data.dataSets.dataValues.map(d => {
    let match = data.dataValueSets.dataSetElements.find(dataSetElement => {
      if (dataSetElement.dataElement.id == d.dataElement) {
        return true
      }
    })
    return {
      id: match.dataElement.id,
      displayName: match.dataElement.displayName.replace("Commodities - ", ""), // only show name of commodity
      value: parseInt(d.value),
      categoryOptionCombo: d.categoryOptionCombo,
      period: d.period
    }
  })
}


export function Graph() {

  const [organisationUnit, setOrganisationUnit] = useState({ value: "AlLmKZIIIT4", label: "AlLmKZIIIT4" });
  const [startDate, setStartDate] = useState({ value: "2021-01-01", label: "January 2021" });
  const [endDate, setEndDate] = useState({ value: "2021-05-01", label: "March 2021" });
  const [selectedCommodity, setSelectedCommodity] = useState({ value: "TCfIC3NDgQK", label: "Zinc" })
  const lifeSavingCommodeties = "ULowA8V3ucd";


  const query = {
    organisationUnits: {
      resource: 'dataSets/' + lifeSavingCommodeties,
      params: {
        fields: [
          'organisationUnits',
        ],
      },
    },

    dataValueSets: {
      resource: 'dataSets/' + lifeSavingCommodeties,
      params: {
        fields: [
          'name',
          'id',
          'dataSetElements[dataElement[id, displayName]',
        ],
      },
    },


    dataSets: {
      resource: 'dataValueSets',
      params: ({ organisationUnit, startDate, endDate }) => ({
        orgUnit: organisationUnit.value,
        dataSet: lifeSavingCommodeties,
        startDate: startDate.value,
        endDate: endDate.value
      })
    },

    dataElementGroups: {
      resource: 'dataElementGroups',
      params: {
        fields: [
          'displayName',
          'dataElements',
          'id'
        ],

        // Svac1cNQhRS - all commodities
        filter: [
          'id:in:[KJKWrWBcJdf,idD1wcvBISQ,rioWDAi1S7z,IyIa0h8CbCZ]',
        ]
      }
    }
  }

  const { loading, error, data, refetch } = useDataQuery(query, {
    variables: {
      organisationUnit: organisationUnit.value,
      startDate: startDate.value,
      endDate: endDate.value
    }
  })
  useEffect(() => {

    // TODO: search box to lookup/selecting other organisationUnits? 
    refetch({ organisationUnit: organisationUnit, startDate: startDate, endDate: endDate })
  }, [startDate.value, endDate.value, organisationUnit.value]); // Array containing which state changes that should re-reun useEffect()


  if (error) {
    return <span>ERROR: {error.message}</span>
  }

  if (loading) {
    return <span>Loading...</span>
  }

  if (data) {

    // rQLFnNXXIL0 = End Balance
    // J2Qf1jtZuj8 = Consumption 
    // KPP63zJPkOu = Quantity to be ordered


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
      dates.push({ "label": `${months[i - 1]} 2021`, "value": `${year}-${i}-${1}` })
    }

    let merged = mergeData(data)
    let result = merged.reduce(function (r, a) {
      r[a.id] = r[a.id] || [];
      r[a.id].push(a);
      return r;
    }, Object.create(null));

    let c = [];
    Object.keys(result).map(key => {
      c.push({
        id: key, displayName: merged.find(e => e.id == key && e.categoryOptionCombo == "rQLFnNXXIL0").displayName, groups: result[key].reduce(function (r, a) {
          r[a.categoryOptionCombo] = r[a.categoryOptionCombo] || [];
          r[a.categoryOptionCombo].push(a);
          return r;
        }, Object.create(null))
      })
    })

    let commodeties = []
    for (let i = 0; i < c.length; i++) {
      commodeties.push({ label: c[i].displayName, value: c[i].id })
    }

    console.log(c)

    let graphData = c.find(e => e.id == selectedCommodity.value).groups["J2Qf1jtZuj8"]
    console.log(graphData)


    //TODO: figure out why the css isnt responsive
    return (
      <div>
        <h1>Life saving commodeties at {organisationUnit.label}</h1>

        commodity: <Select
          options={commodeties}
          name="id"
          label="Select Commodity"
          defaultValue={{ value: "TCfIC3NDgQK", label: "Zinc" }}
          onChange={setSelectedCommodity}
        />
        startDate: <Select
          options={dates}
          onChange={setEndDate}
          defaultValue={{ value: "2021-01-01", label: "January 2021" }}
        />

        endDate: <Select
          options={dates}
          onChange={setEndDate}
          defaultValue={{ value: "2021-05-01", label: "May 2021" }}
        />

        <div style={{
          width: "100%",

        }}>
          <h2>{selectedCommodity.label} stock at {startDate.value} to {endDate.value} </h2>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              width={1000}
              height={500}
              data={graphData}
              margin={{
                top: 50,
                right: 30,
                left: 20,
                bottom: 5
              }}>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis type="number" domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#000000"
                activeDot={{ r: 10 }}
                strokeWidth={4}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}
