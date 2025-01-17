/* eslint-disable */
import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import usrsStateConnector from "views/stateConnectors/usersStateConnector";
import ErrorBoundary from "views/ErrorBoundary/ErrorBoundary";

import UsersTable from "./components/UsersTable";
import UsersToolbar from "./components/UsersToolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const UserList = (props) => {
  const classes = useStyles();

  const users = props.mappeduserState.users;

  useEffect(() => {
    props.fetchUsers();
  }, []);

  return (
      <ErrorBoundary>
        <div className={classes.root}>
          <UsersToolbar />
          <div className={classes.content}>
            <UsersTable users={users} />
          </div>
        </div>
      </ErrorBoundary>
  );
};

UserList.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  userState: PropTypes.object.isRequired,
};

export default usrsStateConnector(UserList);
