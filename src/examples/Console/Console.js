import React from 'react';
import PropTypes from "prop-types";
import {
    Button,
    Card,
    Typography,
    CardContent,
    Grid,
    withStyles,
    TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from "material-ui";


const WavesAPI = require('waves-api');
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

const styles = theme => ({
    card: {
        minWidth: 275,
        marginBottom: '16px'
    },
    iframe: {
        border: 0,
        width: '100%',
        height: '100%',
        minHeight: window.innerHeight - 200
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    textField: {
        width: '100%'
    },
    paper: {
        padding: 10,
        height: '100%',
    },
    code: {
        'wordBreak': 'break-all'
    },
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    tabRoot: {
        textTransform: 'initial',
        fontWeight: theme.typography.fontWeightRegular,
        marginRight: theme.spacing.unit * 4,
        '&:hover': {
            color: '#40a9ff',
            opacity: 1,
        },
        '&$tabSelected': {
            color: '#1890ff',
            fontWeight: theme.typography.fontWeightMedium,
        },
        '&:focus': {
            color: '#40a9ff',
        },
    },
    tabSelected: {},
    hidden: {
        display: 'none'
    },
    fileInput: {
        display: 'none',
    }
});


class Console extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            importOpen: false
        }
    }
    
    render() {
        const { classes } = this.props;
        
        return (
          <Grid>
              <Grid container justify="center" className={classes.root} spacing={16}>
                  <Grid item xs={12} sm={12}>
                      <Card>
                          <CardContent>
                              <Typography>
                                  Waves demo console uses Waves Node.js library<a href=''>waves-api</a>.
                                  This console can be used as playground. There are
                              </Typography>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardContent>
                              <iframe src='/console/' style={classes.iframe}/>
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>
              <Dialog
                open={this.state.importOpen}
                onClose={this.handleImportClose}
                aria-labelledby="form-dialog-title"
              >
                  <DialogTitle id="form-dialog-title">Import Seed Phrase</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                          You can import your TESTNET seed phrase and use it as account. <br/>
                          WARNING! DO NOT IMPORT MAINNET SEED.
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleImportClose} color="primary">
                          Cancel
                      </Button>
                      <Button onClick={this.handleImport} color="primary">
                      </Button>
                  </DialogActions>
              </Dialog>
          </Grid>
        );
    }
}

Console.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Console);
