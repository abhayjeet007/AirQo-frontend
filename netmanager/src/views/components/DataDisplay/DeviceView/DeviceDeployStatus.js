import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CancelIcon from "@material-ui/icons/Cancel";
import ErrorIcon from "@material-ui/icons/Error";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import green from "@material-ui/core/colors/green";
import red from "@material-ui/core/colors/red";
import grey from "@material-ui/core/colors/grey";
import { makeStyles } from "@material-ui/styles";
import Hidden from "@material-ui/core/Hidden";
import { isEmpty, omit } from "underscore";
import {
  deployDeviceApi,
  getDeviceRecentFeedByChannelIdApi,
  recallDeviceApi,
} from "../../../apis/deviceRegistry";
import { updateMainAlert } from "redux/MainAlert/operations";
import { useSitesArrayData } from "redux/SiteRegistry/selectors";
import { loadSitesData } from "redux/SiteRegistry/operations";
import { getElapsedDurationMapper, getFirstNDurations } from "utils/dateTime";
import { updateDevice } from "redux/DeviceRegistry/operations";
import ConfirmDialog from "views/containers/ConfirmDialog";
import LabelledSelect from "../../CustomSelects/LabelledSelect";
import { formatDate } from "utils/dateTime";
import { capitalize } from "utils/string";

const useStyles = makeStyles((theme) => ({
  root: {
    color: green[500],
  },
  error: {
    color: red[500],
  },
  grey: {
    color: grey[200],
  },
}));

const emptyTestStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "93%",
};

const senorListStyle = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-around",
  width: "100%",
};

const coordinatesActivateStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  fontSize: ".8rem",
};

const spanStyle = {
  width: "30%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: "0 20px",
};

const defaultSensorRange = { range: { min: Infinity, max: Infinity } };

const sensorFeedNameMapper = {
  pm2_5: { label: "PM 2.5", range: { min: 1, max: 1000 } },
  pm10: { label: "PM 10", range: { min: 1, max: 1000 } },
  s2_pm2_5: { label: "Sensor-2 PM 2.5", range: { min: 1, max: 1000 } },
  s2_pm10: { label: "Sensor-2 PM 10", range: { min: 1, max: 1000 } },
  latitude: {
    label: "Latitude",
    range: { min: -90, max: 90 },
    badValues: [0, 1000],
  },
  longitude: {
    label: "Longitude",
    range: { min: -180, max: 80 },
    badValues: [0, 1000],
  },
  battery: { label: "Battery", range: { min: 2.7, max: 5 } },
  altitude: {
    label: "Altitude",
    range: { min: 0, max: Infinity },
    badValues: [0],
  },
  speed: { label: "Speed", range: { min: 0, max: Infinity }, badValues: [0] },
  satellites: {
    label: "Satellites",
    range: { min: 0, max: 50 },
    badValues: [0],
  },
  hdop: { label: "Hdop", range: { min: 0, max: Infinity }, badValues: [0] },
  internalTemperature: {
    label: "Internal Temperature",
    range: { min: 0, max: 100 },
  },
  externalTemperature: {
    label: "External Temperature",
    range: { min: 0, max: 100 },
  },
  internalHumidity: { label: "Internal Humidity", range: { min: 0, max: 100 } },
  ExternalHumidity: { label: "External Humidity", range: { min: 0, max: 100 } },
  ExternalPressure: { label: "External Pressure", range: { min: 0, max: 100 } },
};

const isValidSensorValue = (sensorValue, sensorValidator) => {
  if (
    sensorValidator.badValues &&
    sensorValidator.badValues.includes(parseFloat(sensorValue))
  ) {
    return false;
  }
  return (
    sensorValidator.range.min <= sensorValue &&
    sensorValue <= sensorValidator.range.max
  );
};

const EmptyDeviceTest = ({ loading, onClick }) => {
  return (
    <div style={emptyTestStyles}>
      <span>
        No devices test results, please click
        <Button
          color="primary"
          disabled={loading}
          onClick={onClick}
          style={{ textTransform: "lowercase" }}
        >
          run
        </Button>{" "}
        to initiate the test
      </span>
    </div>
  );
};

EmptyDeviceTest.propTypes = {
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const RecallDevice = ({ deviceData, handleRecall, open, toggleOpen }) => {
  return (
    <ConfirmDialog
      open={open}
      close={toggleOpen}
      message={`Are you sure you want to recall device ${deviceData.name}?`}
      title={"Recall device"}
      confirm={handleRecall}
      confirmBtnMsg={"Recall"}
    />
  );
};

RecallDevice.propTypes = {
  deviceData: PropTypes.object.isRequired,
  handleRecall: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  toggleOpen: PropTypes.func.isRequired,
};

const DeviceRecentFeedView = ({ recentFeed, runReport }) => {
  const classes = useStyles();
  const feedKeys = Object.keys(
    omit(recentFeed, "isCache", "created_at", "errors")
  );
  const [
    elapsedDurationSeconds,
    elapsedDurationMapper,
  ] = getElapsedDurationMapper(recentFeed.created_at);
  const elapseLimit = 5 * 3600; // 5 hours

  return (
    <div style={{ height: "94%" }}>
      <h4>Sensors</h4>
      {runReport.successfulTestRun && (
        <div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginBottom: "30px",
            }}
          >
            <span>
              Device last pushed data{" "}
              <span
                className={
                  elapsedDurationSeconds > elapseLimit
                    ? classes.error
                    : classes.root
                }
              >
                {getFirstNDurations(elapsedDurationMapper, 2)}
              </span>{" "}
              ago.
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              margin: "10px 30px",
              color: elapsedDurationSeconds > elapseLimit ? "grey" : "inherit",
            }}
          >
            {feedKeys.map((key, index) => (
              <div style={senorListStyle} key={index}>
                {isValidSensorValue(
                  recentFeed[key],
                  sensorFeedNameMapper[key] || defaultSensorRange
                ) ? (
                  <span style={spanStyle}>
                    <CheckBoxIcon
                      className={
                        elapsedDurationSeconds > elapseLimit
                          ? classes.grey
                          : classes.root
                      }
                    />
                  </span>
                ) : (
                  <Tooltip arrow title={"Value outside the valid range"}>
                    <span style={{ width: "30%" }}>
                      <CancelIcon className={classes.error} />
                    </span>
                  </Tooltip>
                )}
                <span style={spanStyle}>
                  {(sensorFeedNameMapper[key] &&
                    sensorFeedNameMapper[key].label) ||
                    key}{" "}
                </span>
                <Tooltip arrow title={recentFeed[key]}>
                  <span style={spanStyle}>{recentFeed[key]}</span>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      )}
      {!runReport.successfulTestRun && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            margin: "10px 30px",
            height: "70%",
            color: "red",
          }}
        >
          <ErrorIcon className={classes.error} /> Device test has failed, please
          cross check the functionality of device
        </div>
      )}
    </div>
  );
};

DeviceRecentFeedView.propTypes = {
  recentFeed: PropTypes.object.isRequired,
  runReport: PropTypes.object.isRequired,
};

export default function DeviceDeployStatus({ deviceData }) {
  const dispatch = useDispatch();
  const sites = useSitesArrayData();
  const [height, setHeight] = useState(
    (deviceData.height && String(deviceData.height)) || ""
  );
  const [power, setPower] = useState(capitalize(deviceData.powerType || ""));
  const [installationType, setInstallationType] = useState(
    deviceData.mountType || ""
  );
  const [deploymentDate, setDeploymentDate] = useState(new Date());
  const [primaryChecked, setPrimaryChecked] = useState(
    deviceData.isPrimaryInLocation
  );
  const [collocationChecked, setCollocationChecked] = useState(
    deviceData.isUsedForCollocation
  );
  const [recentFeed, setRecentFeed] = useState({});
  const [runReport, setRunReport] = useState({
    ranTest: false,
    successfulTestRun: false,
    error: false,
  });
  const [deviceTestLoading, setDeviceTestLoading] = useState(false);
  const [manualCoordinate, setManualCoordinate] = useState(false);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [site, setSite] = useState({
    value: (deviceData.site && deviceData.site._id) || "",
    label:
      (deviceData.site &&
        (deviceData.site.name ||
          deviceData.site.description ||
          deviceData.site.generated_name)) ||
      "",
  });
  const [deployLoading, setDeployLoading] = useState(false);
  const [recallOpen, setRecallOpen] = useState(false);
  const [errors, setErrors] = useState({
    height: "",
    power: "",
    installationType: "",
    longitude: "",
    latitude: "",
  });

  useEffect(() => {
    if (recentFeed.longitude && recentFeed.latitude) {
      setLongitude(recentFeed.longitude);
      setLatitude(recentFeed.latitude);
    }
  }, [recentFeed]);

  useEffect(() => {
    if (isEmpty(sites)) dispatch(loadSitesData());
  }, []);

  const handleHeightChange = (enteredHeight) => {
    let re = /\s*|\d+(\.d+)?/;
    if (re.test(enteredHeight.target.value)) {
      setHeight(enteredHeight.target.value);
      setErrors({
        ...errors,
        height: enteredHeight.target.value.length > 0 ? "" : errors.height,
      });
    }
  };

  const createSiteOptions = () => {
    const options = [];
    sites.map((site) =>
      options.push({
        value: site._id,
        label: site.name || site.description || site.generated_name,
      })
    );
    return options;
  };

  const runDeviceTest = async () => {
    setDeviceTestLoading(true);
    await getDeviceRecentFeedByChannelIdApi(deviceData.device_number)
      .then((responseData) => {
        setRecentFeed(responseData);
        setRunReport({ ranTest: true, successfulTestRun: true, error: false });
      })
      .catch((err) => {
        setRunReport({ ranTest: true, successfulTestRun: false, error: true });
      });
    setDeviceTestLoading(false);
  };

  const checkErrors = () => {
    const state = {
      height,
      installationType,
      power,
      longitude,
      latitude,
      site,
    };
    let newErrors = {};

    Object.keys(state).map((key) => {
      if (isEmpty(state[key])) {
        newErrors[key] = "This field is required";
      }
      if (key === "site") {
        if (!state[key].value && !state[key].label)
          newErrors[key] = "This field is required";
      }
    });
    ["longitude", "latitude"].map((key) => {
      if (
        !isValidSensorValue(
          state[key],
          sensorFeedNameMapper[key] || defaultSensorRange
        )
      ) {
        newErrors[key] = `Invalid ${key} value`;
      }
    });
    if (!isEmpty(newErrors)) {
      setErrors({ ...errors, ...newErrors });
      return true;
    }
    return false;
  };

  const handleDeploySubmit = async () => {
    if (checkErrors()) {
      return;
    }
    const deployData = {
      mountType: installationType,
      height: height,
      powerType: power,
      date: deploymentDate.toISOString(),
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      isPrimaryInLocation: primaryChecked,
      isUsedForCollocation: collocationChecked,
      site_id: site.value,
    };

    setDeployLoading(true);
    await deployDeviceApi(deviceData.name, deployData)
      .then((responseData) => {
        dispatch(
          updateMainAlert({
            message: responseData.message,
            show: true,
            severity: "success",
          })
        );
        dispatch(updateDevice(deviceData.name, responseData.updatedDevice));
      })
      .catch((err) => {
        dispatch(
          updateMainAlert({
            message: err.response.data.message,
            show: true,
            severity: "error",
          })
        );
      });
    setDeployLoading(false);
  };

  const handleRecallSubmit = async () => {
    setRecallOpen(!recallOpen);

    await recallDeviceApi(deviceData.name)
      .then((responseData) => {
        dispatch(
          updateMainAlert({
            message: responseData.message,
            show: true,
            severity: "success",
          })
        );
        dispatch(updateDevice(deviceData.name, responseData.updatedDevice));
      })
      .catch((err) => {
        dispatch(
          updateMainAlert({
            message:
              err.response && err.response.data && err.response.data.message,
            show: true,
            severity: "error",
          })
        );
      });
  };

  const weightedBool = (primary, secondary) => {
    if (primary) {
      return primary;
    }
    return secondary;
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "10px 0",
        }}
      >
        <Tooltip
          arrow
          title={"Device is not yet deployed"}
          disableTouchListener={deviceData.isActive}
          disableHoverListener={deviceData.isActive}
          disableFocusListener={deviceData.isActive}
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              disabled={!deviceData.isActive}
              onClick={() => setRecallOpen(!recallOpen)}
            >
              {" "}
              Recall Device
            </Button>
          </span>
        </Tooltip>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "flex-end",
          margin: "0 auto",
          padding: "10px 20px",
          maxWidth: "1500px",
          fontSize: "1.2rem",
        }}
      >
        <span
          style={{
            fontSize: "0.7rem",
            marginRight: "10px",
            background: "#ffffff",
            border: "1px solid #ffffff",
            borderRadius: "5px",
            padding: "0 5px",
          }}
        >
          Deploy status
        </span>{" "}
        {deviceData.isActive ? (
          <span style={{ color: "green" }}>Deployed</span>
        ) : (
          <span style={{ color: "red" }}>Not Deployed</span>
        )}
      </div>

      <RecallDevice
        deviceData={deviceData}
        open={recallOpen}
        toggleOpen={() => setRecallOpen(!recallOpen)}
        handleRecall={handleRecallSubmit}
      />

      <Paper
        style={{
          margin: "0 auto",
          minHeight: "400px",
          padding: "20px 20px",
          maxWidth: "1500px",
        }}
      >
        <Grid container spacing={1}>
          <Grid items xs={12} sm={6}>
            <div style={{ marginBottom: "15px" }}>
              <LabelledSelect
                label="Site"
                options={createSiteOptions()}
                value={site}
                onChange={(newValue, actionMeta) => {
                  setSite(newValue);
                }}
              />
              {errors.site && (
                <div
                  style={{
                    color: "red",
                    textAlign: "left",
                    fontSize: "0.7rem",
                  }}
                >
                  {errors.site}
                </div>
              )}
            </div>

            <TextField
              id="standard-basic"
              label="Height"
              value={height}
              onChange={handleHeightChange}
              style={{ marginBottom: "15px" }}
              fullWidth
              required
              error={!!errors.height}
              helperText={errors.height}
              variant="outlined"
              InputProps={{
                native: true,
                style: { width: "100%", height: "100%" },
              }}
            />

            <TextField
              id="powerType"
              select
              fullWidth
              required
              label="Power type"
              style={{ marginBottom: "15px" }}
              value={power}
              error={!!errors.power}
              helperText={errors.power}
              onChange={(event) => {
                setPower(event.target.value);
                setErrors({
                  ...errors,
                  power: event.target.value.length > 0 ? "" : errors.power,
                });
              }}
              SelectProps={{
                native: true,
                style: { width: "100%", height: "50px" },
              }}
              variant="outlined"
            >
              <option value="" />
              <option value="Mains">Mains</option>
              <option value="Solar">Solar</option>
              <option value="Battery">Battery</option>
            </TextField>

            <TextField
              id="standard-basic"
              label="Mount Type"
              required
              variant="outlined"
              style={{ marginBottom: "15px" }}
              value={installationType}
              error={!!errors.installationType}
              helperText={errors.installationType}
              onChange={(event) => {
                setInstallationType(event.target.value);
                setErrors({
                  ...errors,
                  installationType:
                    event.target.value.length > 0
                      ? ""
                      : errors.installationType,
                });
              }}
              fullWidth
            />

            <TextField
              id="date)fDeployment"
              label="Date of Deployment"
              type="date"
              defaultValue={formatDate(new Date())}
              required
              variant="outlined"
              style={{ marginBottom: "15px" }}
              onChange={(event) => {
                setDeploymentDate(new Date(event.target.value));
              }}
              fullWidth
            />

            <TextField
              id="standard-basic"
              label="Longitude"
              style={{ marginBottom: "15px" }}
              disabled={!manualCoordinate}
              variant="outlined"
              value={longitude}
              onChange={(event) => {
                setLongitude(event.target.value);
                setErrors({
                  ...errors,
                  longitude:
                    event.target.value.length > 0 ? "" : errors.longitude,
                });
              }}
              fullWidth
              error={!!errors.longitude}
              helperText={errors.longitude}
              required
            />

            <TextField
              id="standard-basic"
              label="Latitude"
              disabled={!manualCoordinate}
              style={{ marginBottom: "15px" }}
              value={latitude}
              variant="outlined"
              onChange={(event) => {
                setLatitude(event.target.value);
                setErrors({
                  ...errors,
                  latitude:
                    event.target.value.length > 0 ? "" : errors.latitude,
                });
              }}
              fullWidth
              error={!!errors.latitude}
              helperText={errors.latitude}
              required
            />
            <span
              style={coordinatesActivateStyles}
              onClick={(event) => setManualCoordinate(!manualCoordinate)}
            >
              Manually fill in coordinates
              <Checkbox
                checked={manualCoordinate}
                name="primaryDevice"
                color="primary"
              />
            </span>

            <div style={{ margin: "30px 0 20px 0" }}>
              <Grid container item xs={12} spacing={3}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={primaryChecked}
                      onChange={(event) => setPrimaryChecked(!primaryChecked)}
                      name="primaryDevice"
                      color="primary"
                    />
                  }
                  label="I wish to make this my primary device in this location"
                  style={{ margin: "10px 0 0 5px", width: "100%" }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={collocationChecked}
                      onChange={(event) =>
                        setCollocationChecked(!collocationChecked)
                      }
                      name="collocation"
                      color="primary"
                    />
                  }
                  label="This deployment is a formal collocation"
                  style={{ marginLeft: "5px" }}
                />
              </Grid>{" "}
            </div>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Hidden smUp>
              <Grid
                container
                alignItems="center"
                alignContent="center"
                justify="center"
              >
                <Button
                  color="primary"
                  disabled={deviceTestLoading}
                  onClick={runDeviceTest}
                  style={{ marginLeft: "10px 10px" }}
                >
                  Run device test
                </Button>
              </Grid>
            </Hidden>
            <Hidden xsDown>
              <Grid
                container
                alignItems="flex-end"
                alignContent="flex-end"
                justify="flex-end"
              >
                <Button
                  color="primary"
                  disabled={deviceTestLoading}
                  onClick={runDeviceTest}
                  style={{ marginLeft: "10px 10px" }}
                >
                  Run device test
                </Button>
              </Grid>
              {isEmpty(recentFeed) && !runReport.ranTest && (
                <EmptyDeviceTest
                  loading={deviceTestLoading}
                  onClick={runDeviceTest}
                />
              )}
            </Hidden>
            {!isEmpty(recentFeed) && runReport.ranTest && (
              <DeviceRecentFeedView
                recentFeed={recentFeed}
                runReport={runReport}
              />
            )}
            {runReport.error && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "red",
                }}
              >
                Could not fetch device feeds
              </div>
            )}
          </Grid>

          <Grid
            container
            alignItems="flex-end"
            alignContent="flex-end"
            justify="flex-end"
            xs={12}
          >
            <Button variant="contained">Cancel</Button>
            <Tooltip
              arrow
              title={
                deviceData.isActive
                  ? "Device already deployed"
                  : "Run device test to activate"
              }
              placement="top"
              disableFocusListener={
                runReport.successfulTestRun && !deviceData.isActive
              }
              disableHoverListener={
                runReport.successfulTestRun && !deviceData.isActive
              }
              disableTouchListener={
                runReport.successfulTestRun && !deviceData.isActive
              }
            >
              <span>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={weightedBool(
                    deployLoading,
                    deviceData.isActive || !runReport.successfulTestRun
                  )}
                  onClick={handleDeploySubmit}
                  style={{ marginLeft: "10px" }}
                >
                  Deploy
                </Button>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

DeviceDeployStatus.propTypes = {
  deviceData: PropTypes.object.isRequired,
};
