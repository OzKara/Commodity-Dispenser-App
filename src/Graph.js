import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDataQuery } from "@dhis2/app-runtime";
import moment from "moment";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from "recharts";
import regression from "regression";
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
      value: parseInt(d.value),
      categoryOptionCombo: d.categoryOptionCombo,
      period: d.period,
    };
  });
}

export function Graph() {
  const [organisationUnit, setOrganisationUnit] = useState({
    value: "AlLmKZIIIT4",
    label: "AlLmKZIIIT4",
  });
  const [startDate, setStartDate] = useState({
    value: "2021-01-01",
    label: "January 2021",
  });
  const [endDate, setEndDate] = useState({
    value: "2021-11-01",
    label: "December 2021",
  });
  const [selectedCommodity, setSelectedCommodity] = useState({
    value: "TCfIC3NDgQK",
    label: "Zinc",
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
      params: ({ organisationUnit, startDate, endDate }) => ({
        orgUnit: organisationUnit.value,
        dataSet: lifeSavingCommodeties,
        startDate: startDate.value,
        endDate: endDate.value,
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
      startDate: startDate.value,
      endDate: endDate.value,
    },
  });
  useEffect(() => {
    // TODO: search box to lookup/selecting other organisationUnits?
    refetch({
      organisationUnit: organisationUnit,
      startDate: startDate,
      endDate: endDate,
    });
  }, [startDate.value, endDate.value, organisationUnit.value]); // Array containing which state changes that should re-reun useEffect()

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <span>Loading...</span>;
  }

  if (data) {
    console.log(data);

    // rQLFnNXXIL0 = End Balance
    // J2Qf1jtZuj8 = Consumption
    // KPP63zJPkOu = Quantity to be ordered

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
    for (let k = 2020; k <= 2021; k++) {
      for (let i = 1; i <= 12; i++) {
        dates.push({ label: `${months[i - 1]} ${k}`, value: `${k}-${i}-${1}` });
      }
    }

    const dateFormatter = (date) => {
      return moment(date).format("DD/MM/YY");
    };

    let merged = mergeData(data);
    let result = merged.reduce(function (r, a) {
      r[a.id] = r[a.id] || [];
      r[a.id].push(a);
      return r;
    }, Object.create(null));

    let c = [];
    Object.keys(result).map((key) => {
      c.push({
        id: key,
        displayName: merged.find(
          (e) => e.id == key && e.categoryOptionCombo == "rQLFnNXXIL0"
        ).displayName,
        groups: result[key].reduce(function (r, a) {
          r[a.categoryOptionCombo] = r[a.categoryOptionCombo] || [];
          r[a.categoryOptionCombo].push(a);
          return r;
        }, Object.create(null)),
      });
    });

    let commodeties = [];
    for (let i = 0; i < c.length; i++) {
      commodeties.push({ label: c[i].displayName, value: c[i].id });
    }

    let graphData = c.find((e) => e.id == selectedCommodity.value).groups[
      "J2Qf1jtZuj8"
    ];

    let regressionData = [];

    for (let i = 0; i < graphData.length; i++) {
      regressionData.push([i, graphData[i].value]);
    }

    const reg = regression.linear(regressionData, { order: 2, precision: 10 });

    console.log(reg.equation[0], reg.equation[1]);
    console.log(reg.string);

    let d = startDate.value.split("-").map(function (item) {
      return parseInt(item, 10);
    });

    // d[2] day
    // d[1] month
    // d[0] year
    console.log(d);
    let predicted = [];
    for (let i = 0; i < graphData.length + graphData.length * 0.5; i++) {
      // if end of month, next year
      if (d[1] > 12) {
        d[0]++;
        d[1] = 1;
      } else {
        d[1]++;
      }
      if (d[1] > 10) {
        predicted.push({
          period: `${d[0]}0${d[1] - 1}`,
          date: new Date(d[0], d[1] - 1),
          predicted: reg.predict(i)[1],
        });
      } else {
        predicted.push({
          period: `${d[0]}0${d[1]}`,
          date: new Date(d[0], d[1] - 1),
          predicted: reg.predict(i)[1],
        });
      }
    }

    let combine = [];
    for (let i = 0; i < predicted.length; i++) {
      if (i < graphData.length) {
        combine.push({
          period: predicted[i].period,
          value: graphData[i].value,
          predicted: predicted[i].predicted,
          date: predicted[i].date,
        });
      } else {
        combine.push({
          period: predicted[i].period,
          value: undefined,
          predicted: predicted[i].predicted,
          date: predicted[i].date,
        });
      }
    }
    console.log(combine);

    return (
      <div className="main-container">
        <div className="header-label">
          Life saving commodeties at {organisationUnit.label}
        </div>

        <div className="header-ui-container">
          <div className="header-label">Commodity:</div>
          <Select
            options={commodeties}
            name="id"
            label="Select Commodity"
            defaultValue={selectedCommodity}
            onChange={setSelectedCommodity}
          />
          <div className="header-label">from:</div>
          <Select
            options={dates}
            onChange={setStartDate}
            defaultValue={startDate}
          />

          <div className="header-label">to:</div>
          <Select
            options={dates}
            onChange={setEndDate}
            defaultValue={endDate}
          />
        </div>

        <div className="graph-container">
          <div className="graph-description">
            <div className="header-label">
              {" "}
              {selectedCommodity.label} stock at {startDate.value} to{" "}
              {endDate.value}
            </div>
            <div className="header-label">
              fit to {reg.string} at r2 of {reg.r2}
            </div>
          </div>
          <div>
            <ResponsiveContainer width="95%" height={500}>
              <LineChart
                width={1000}
                height={500}
                data={combine}
                margin={{
                  top: 50,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <XAxis
                  dataKey="date"
                  tickFormatter={dateFormatter}
                  dx={15}
                  dy={20}
                >
                  <Label value="Date" position="Bottom" />
                </XAxis>
                <YAxis
                  type="number"
                  domain={[
                    Math.round(
                      Math.min.apply(
                        Math,
                        combine
                          .filter((e) => e.value != undefined)
                          .map(function (o) {
                            return o.value;
                          })
                      ) * 0.5
                    ),
                    Math.round(
                      Math.max.apply(
                        Math,
                        combine
                          .filter((e) => e.value != undefined)
                          .map(function (o) {
                            return o.value;
                          })
                      ) * 1.1
                    ),
                  ]}
                >
                  <Label value="Consuption" angle={-90} dx={-30} />
                </YAxis>
                <Tooltip labelFormatter={dateFormatter} />
                <Legend verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#000000"
                  activeDot={{ r: 10 }}
                  strokeWidth={4}
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#FF0000"
                  activeDot={{ r: 1 }}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }
}
