import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableFoot,
  TableHead,
  TableRow,
  TableRowHead,
} from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
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
      value: d.value,
      categoryOptionCombo: d.categoryOptionCombo
    }
  })
}


export function Graph() {

  const [organisationUnit, setOrganisationUnit] = useState({ value: "AlLmKZIIIT4", label: "AlLmKZIIIT4" });
  const [startDate, setStartDate] = useState("2021-01-01");
  const [endDate, setEndDate] = useState("2021-05-01");
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
      params: ({ organisationUnit, startDate, endDate}) => ({
        orgUnit: organisationUnit.value,
        dataSet: lifeSavingCommodeties,
        startDate: startDate,
        endDate: endDate
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
      startDate: startDate,
      endDate: endDate
    }
  })
  useEffect(() => {

    // TODO: search box to lookup/selecting other organisationUnits? 
    refetch({ organisationUnit: organisationUnit, startDate: startDate, endDate: endDate})
  }, [startDate, endDate, organisationUnit.value]); // Array containing which state changes that should re-reun useEffect()


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

    console.log(data.dataSets.dataValues.filter(e => e.period == '202101'))


    return (
      <div>
        <h1>Life saving commodeties at {organisationUnit.label}</h1>
        <h2>Stock at {startDate} to {endDate} </h2>
        startDate: <Select
          options={dates}
          defaultValue={{ value: "2021-01-01", label: "January 2021" }}
        />
         endDate: <Select
          options={dates}
          defaultValue={{ value: "2021-03-01", label: "March 2021" }}
        />
      </div>
    );
  }
}
