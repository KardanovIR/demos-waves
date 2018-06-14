import React from 'react';
import PropTypes from "prop-types";
import {
  CircularProgress, Grid, Typography,
  withStyles
} from "material-ui";


class WebAuthAPISuccess extends React.Component {
  state = { open: false };
  
  
  render() {
    const { classes } = this.props;
    if (window.opener) {
      window.opener.postMessage({ url: window.location.href, updateResponseUrl: true }, window.location.origin);
    }
    window.close();
    return (
      <Grid>
        <Grid container justify="center" className={classes.root} spacing={16}>
          <Grid item xs={8} sm={8}>
            <CircularProgress color="secondary"/>
            <Typography>
              Loading data ...
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

WebAuthAPISuccess.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles({}, { withTheme: true })(WebAuthAPISuccess);
