import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
} from "@material-ui/core";
import Select from "react-select";
import PropTypes from "prop-types";
import clsx from "clsx";
import DateFnsUtils from "@date-io/date-fns";
import TextField from "@material-ui/core/TextField";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import axios from "axios";
import { DOWNLOAD_DATA } from "config/urls/analytics";
import { getMonitoringSitesLocationsApi } from "../../apis/location";
import { isEmpty } from "underscore";
import { formatDate } from "utils/dateTime";
import { useDashboardSitesData } from "redux/Dashboard/selectors";
import { loadSites } from "redux/Dashboard/operations";
import { downloadDataApi } from "views/apis/analytics";
import { roundToStartOfDay, roundToEndOfDay } from "utils/dateTime";

const {
  Parser,
  transforms: { unwind },
} = require("json2csv");

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const createSiteOptions = (sites) => {
  const options = [];
  sites.map((site) =>
    options.push({
      value: site._id,
      label: site.name || site.description || site.generated_name,
    })
  );
  return options;
};

const getValues = (options) => {
  const values = [];
  options.map((option) => values.push(option.value));
  return values;
};

const Download = (props) => {
  const { className, staticContext, ...rest } = props;
  const classes = useStyles();

  const dispatch = useDispatch();
  const sites = useDashboardSitesData();
  const [siteOptions, setSiteOptions] = useState([]);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedSites, setSelectedSites] = useState([]);
  const [pollutants, setPollutants] = useState([]);
  const [frequency, setFrequency] = useState();
  const [fileType, setFileType] = useState(null);

  const frequencyOptions = [
    { value: "hourly", label: "Hourly" },
    { value: "daily", label: "Daily" },
    { value: "monthly", label: "Monthly" },
  ];

  const pollutantOptions = [
    { value: "pm2_5", label: "PM 2.5" },
    { value: "pm10", label: "PM 10" },
    { value: "no2", label: "NO2" },
  ];

  const typeOptions = [
    { value: "json", label: "JSON" },
    { value: "csv", label: "CSV" },
  ];

  useEffect(() => {
    if (isEmpty(sites)) dispatch(loadSites());
  }, []);

  useEffect(() => {
    setSiteOptions(createSiteOptions(sites));
  }, [sites]);

  const disableDownloadBtn = () => {
    return !(
      startDate &&
      endDate &&
      !isEmpty(selectedSites) &&
      !isEmpty(pollutants) &&
      fileType &&
      fileType.value &&
      frequency &&
      frequency.value
    );
  };

  let handleSubmit = (e) => {
    e.preventDefault();

    let data = {
      sites: getValues(selectedSites),
      startDate: roundToStartOfDay(new Date(startDate).toISOString()),
      endDate: roundToEndOfDay(new Date(endDate).toISOString()),
      frequency: frequency.value,
      pollutants: getValues(pollutants),
      fileType: fileType.value,
    };
    console.log("data", data);

    downloadDataApi(fileType.value, data)
      .then((response) => response.data)
      .then((resData) => {
        if (fileType.value === "json") {
          let filename = `airquality-${frequency.value}-data.json`;
          let contentType = "application/json;charset=utf-8;";

          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            var blob = new Blob(
              [decodeURIComponent(encodeURI(JSON.stringify(resData)))],
              { type: contentType }
            );
            navigator.msSaveOrOpenBlob(blob, filename);
          } else {
            var a = document.createElement("a");
            a.download = filename;
            a.href =
              "data:" +
              contentType +
              "," +
              encodeURIComponent(JSON.stringify(resData));
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        } else {
          // const json2csvParser = new Parser();
          // const csv = json2csvParser.parse(resData);
          // console.log(csv);
          // let filename = `airquality-${frequency.value}-data.csv`;
          // var link = document.createElement("a");
          // link.setAttribute(
          //   "href",
          //   "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURIComponent(csv)
          // );
          // link.setAttribute("download", filename);
          // link.style.visibility = "hidden";
          // document.body.appendChild(link);
          // link.click();
          // document.body.removeChild(link);
        }
      })
      .catch((err) => console.log(err && err.response && err.response.data));
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card
            {...rest}
            className={clsx(classes.root, className)}
            style={{ overflow: "visible" }}
          >
            <CardHeader
              subheader="Customize the data you want to download."
              title="Data Download"
            />

            <Divider />
            <form onSubmit={handleSubmit}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      label="Start Date"
                      className="reactSelect"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      onChange={(event) => setStartDate(event.target.value)}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <TextField
                      label="End Date"
                      className="reactSelect"
                      fullWidth
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Select
                      fullWidth
                      className="reactSelect"
                      name="location"
                      placeholder="Location(s)"
                      value={selectedSites}
                      options={siteOptions}
                      onChange={(options) => setSelectedSites(options)}
                      isMulti
                      variant="outlined"
                      margin="dense"
                      required
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Select
                      fullWidth
                      label="Frequency"
                      className=""
                      name="chart-frequency"
                      placeholder="Frequency"
                      value={frequency}
                      options={frequencyOptions}
                      onChange={(options) => setFrequency(options)}
                      variant="outlined"
                      margin="dense"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Select
                      fullWidth
                      label="Pollutant"
                      className="reactSelect"
                      name="pollutant"
                      placeholder="Pollutant(s)"
                      value={pollutants}
                      options={pollutantOptions}
                      onChange={(options) => setPollutants(options)}
                      isMulti
                      variant="outlined"
                      margin="dense"
                      required
                    />
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <Select
                      fullWidth
                      label="File Type"
                      className="reactSelect"
                      name="file-type"
                      placeholder="File Type"
                      value={fileType}
                      options={typeOptions}
                      onChange={(options) => setFileType(options)}
                      variant="outlined"
                      margin="dense"
                      required
                    />
                  </Grid>
                </Grid>
              </CardContent>

              <Divider />
              <CardActions>
                <Button
                  color="primary"
                  variant="outlined"
                  type="submit"
                  disabled={disableDownloadBtn()}
                >
                  {" "}
                  Download Data
                </Button>
              </CardActions>
            </form>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

Download.propTypes = {
  className: PropTypes.string,
};

export default Download;
