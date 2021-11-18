import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  Table,
  TableBody,
  TableCell,
  TableCellHead,
  TableFoot,
  TableHead,
  TableRow,
  TableRowHead,
  CircularLoader,
} from "@dhis2/ui";
import { useDataQuery } from "@dhis2/app-runtime";
import classes from "./App.module.css";

function mergeData(data) {
  return data.dataSets.dataValues.map((d) => {
    let match = data.dataValueSets.dataSetElements.find((dataSetElement) => {
      if (dataSetElement.dataElement.id == d.dataElement) {
        return true;
      }
    });
    return {
      id: match.dataElement.id,
      displayName: match.dataElement.displayName.replace("Commodities - ", ""), // only show name of commodity
      value: d.value,
      categoryOptionCombo: d.categoryOptionCombo,
    };
  });
}

export function Stock() {
  const [organisationUnit, setOrganisationUnit] = useState({
    value: "AlLmKZIIIT4",
    label: "AlLmKZIIIT4",
  });
  const [timeframe, setTimeframe] = useState({
    value: "202111",
    label: "November 2021",
  });
  const lifeSavingCommodeties = "ULowA8V3ucd";

  const query = {
    organisationUnits: {
      resource: "dataSets/" + lifeSavingCommodeties,
      params: {
        fields: ["organisationUnits"],
      },
    },

    dataValueSets: {
      resource: "dataSets/" + lifeSavingCommodeties,
      params: {
        fields: ["name", "id", "dataSetElements[dataElement[id, displayName]"],
      },
    },

    dataSets: {
      resource: "dataValueSets",
      params: ({ organisationUnit, timeframe }) => ({
        orgUnit: organisationUnit.value,
        dataSet: lifeSavingCommodeties,
        period: timeframe,
      }),
    },

    dataElementGroups: {
      resource: "dataElementGroups",
      params: {
        fields: ["displayName", "dataElements", "id"],

        // Svac1cNQhRS - all commodities
        filter: ["id:in:[KJKWrWBcJdf,idD1wcvBISQ,rioWDAi1S7z,IyIa0h8CbCZ]"],
      },
    },
  };

  const { loading, error, data, refetch } = useDataQuery(query, {
    variables: {
      organisationUnit: organisationUnit.value,
      timeframe: `${timeframe}`,
    },
  });
  useEffect(() => {
    // TODO: search box to lookup/selecting other organisationUnits?
    refetch({ organisationUnit: organisationUnit, timeframe: timeframe.value });
  }, [timeframe.value, organisationUnit.value]); // Array containing which state changes that should re-reun useEffect()

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span><CircularLoader large/></span>;
  }

  if (data) {
    // rQLFnNXXIL0 = End Balance
    // J2Qf1jtZuj8 = Consumption
    // KPP63zJPkOu = Quantity to be ordered

    const stock = mergeData(data)
      .filter(
        (e) =>
          e.categoryOptionCombo == "rQLFnNXXIL0" ||
          e.categoryOptionCombo == "J2Qf1jtZuj8"
      )
      .sort((a, b) => {
        return b.value - a.value;
      });


    let commodities = [];
    for (let i = 0; i < stock.length; i++) {
      // add Commodity
      if (commodities[stock[i].id] == undefined) {
        commodities[stock[i].id] = {
          id: stock[i].id,
          Commodity: stock[i].displayName,
          endBalance: undefined,
          consumption: undefined,
        };
      }
      // add end balance
      if (stock[i].categoryOptionCombo == "rQLFnNXXIL0") {
        commodities[stock[i].id].endBalance = stock[i].value;
      }
      // add consumption
      if (stock[i].categoryOptionCombo == "J2Qf1jtZuj8") {
        commodities[stock[i].id].consumption = stock[i].value;
      }
    }

    console.log(commodities);

    let commodityGroups = [];
    const groupData = data.dataElementGroups.dataElementGroups;
    for (let i = 0; i < groupData.length; i++) {
      //insert group
      commodityGroups.push({
        categoryName: groupData[i].displayName.replace("Commodities ", ""),
        categoryId: groupData[i].id,
        commodities: [],
      });
      // insert commodities into group

      for (let j = 0; j < groupData[i].dataElements.length; j++) {
        let id = groupData[i].dataElements[j].id;
        if (commodities[id] != undefined) {
          commodityGroups[i].commodities.push({
            displayName: commodities[id].Commodity,
            id: commodities[id].id,
            consumption: commodities[id].consumption,
            endBalance: commodities[id].endBalance,
          });
        } else {
          //console.log(id, "from", groupData[i].displayName, " not in dataset!")
        }
      }
    }

    let dates = [];
    const year = 2021;
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let i = 1; i <= 12; i++) {
      dates.push({
        label: `${months[i - 1]} 2021`,
        value: (202100 + i).toString(),
      });
    }

    let organisationUnitList = [];
    let temp = undefined;
    for (let i = 0; i < data.organisationUnits.organisationUnits.length; i++) {
      temp = data.organisationUnits.organisationUnits[i];
      organisationUnitList.push({ label: temp.id, value: temp.id });
    }

    console.log(commodityGroups);

    return (
      <div className='main-container'>
        <div className='main-header'>
          <div className='header-label'>Stock levels</div>
          <div className='header-ui-container'>
            <Select
              options={organisationUnitList}
              onChange={setOrganisationUnit}
              defaultValue={{ value: "AlLmKZIIIT4", label: "AlLmKZIIIT4" }}
              isSearchable={true}
            />
            <Select
              options={dates}
              onChange={setTimeframe}
              defaultValue={{ value: "202111", label: "November 2021" }}
            />
          </div>
        </div>

        <div className='view-container'>
          <div className='stock-tables-container'>
            {commodityGroups.map((group) => {
              console.log(group.categoryName);
              return (
                <div className={classes.stockTable} key={group.categoryName}>
                  <h3>{group.categoryName}</h3>
                  <Table>
                    <TableHead>
                      <TableRowHead>
                        <TableCellHead></TableCellHead>
                        <TableCellHead>Balance</TableCellHead>
                        <TableCellHead>Consumption</TableCellHead>
                      </TableRowHead>
                    </TableHead>
                    <TableBody>
                      {group.commodities.map((row) => {
                        return (
                          <TableRow key={row.id}>
                            <TableCell>{row.displayName}</TableCell>
                            <TableCell>{row.endBalance}</TableCell>
                            <TableCell>{row.consumption}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
