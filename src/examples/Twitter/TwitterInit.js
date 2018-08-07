import React from 'react';
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Typography,
  CardContent,
  Grid,
  withStyles,
  TextField,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
} from "material-ui";
import { copyToClipboard } from '../../Components/CopyToClipboard';
import constants from '../../settings/constants';
import { Link } from "react-router-dom";
import MarkdownRenderer from 'react-markdown-renderer';


const WavesAPI = require('@waves/waves-api');
const Waves = WavesAPI.create(WavesAPI.TESTNET_CONFIG);

const styles = theme => ({
  card: {
    minWidth: 275,
    marginBottom: '16px'
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


class TwitterInit extends React.Component {
  
  constructor(props) {
    super(props);
    this.setSeedPhrase(null, true);
  }
  
  setSeedPhrase(seed, init) {
    let storageAccountData;
    let newAccount;
    let accountData;
    if (seed) {
      newAccount = true;
      accountData = Waves.Seed.fromExistingPhrase(seed);
    } else {
      storageAccountData = window.localStorage.getItem('waves.accountData');
      newAccount = !storageAccountData;
      accountData = storageAccountData ? JSON.parse(storageAccountData) : Waves.Seed.create();
    }
    window.localStorage.setItem('waves.accountData', JSON.stringify(accountData));
    window.localStorage.setItem('waves.seed', accountData.phrase);
    if (newAccount) {
      this.getTwitterCoin(accountData);
    }
    const stateData = {
      accountData: accountData,
      seed: accountData.phrase,
      coinSentBack: !newAccount,
      settingsActiveStep: 0,
      settingsCompleted: new Set(),
      settingsSkipped: new Set(),
      importOpen: false,
      importSeed: null
    };
    if (init) {
      this.state = stateData;
    } else {
      this.setState(stateData);
    }
    
  }
  
  importSeedPhrase = () => {
    this.setState({ importOpen: true });
  };
  
  handleImportClose = () => {
    this.setState({ importOpen: false });
  };
  
  handleImport = () => {
    this.setSeedPhrase(this.state.importSeed);
    this.handleImportClose();
  };
  
  
  getTwitterCoin(accountData) {
    //`${window.location.protocol}//${window.location.host}/api/v1/twitter/faucet/
    fetch(`${window.location.protocol}//${window.location.hostname}/api/v1/twitter/faucet/${accountData.address}`, {
      method: 'POST'
    })
      .then(() => {
        console.log('Tokens sent successfully');
        this.sendTwitterCoinBack();
      })
      .catch((err) => {
        console.log(err.toString());
      });
  }
  
  sendTwitterCoinBack() {
    const twitterCoinTransferData = {
      recipient: constants.CENTRAL_ADDRESS,
      assetId: constants.TWITTER_COIN_ID,
      
      // The real amount is the given number divided by 10^(precision of the token)
      amount: 1,
      
      // The same rules for these two fields
      feeAssetId: 'WAVES',
      fee: 100000,
      attachment: null,
      timestamp: Date.now()
    };
    console.log(this.state.accountData);
    Waves.API.Node.v1.assets.transfer(twitterCoinTransferData, this.state.accountData.keyPair)
      .then((res) => {
        this.setState({
          coinSentBack: true
        });
        console.log('Successful:', res);
      })
      .catch((error) => {
        const _this = this;
        console.log('Error:', error);
        setTimeout(_this.sendTwitterCoinBack.bind(_this), 1000);
      });
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  static copySeedToClipboard() {
    copyToClipboard(window.localStorage.getItem('waves.seed'));
  }
  
  static copyAddressToClipboard() {
    copyToClipboard(JSON.parse(window.localStorage.getItem('waves.accountData')).address);
  }
  
  render() {
    const { classes } = this.props;
    
    return (
      <Grid>
        <Grid container justify="center" className={classes.root} spacing={16}>
          <Grid item xs={8} sm={8}>
            <Card>
              <CardContent>
                <Typography>
                  This demo project shows how to create twitter-telegram-like decentralized social platform
                  using <strong>Data
                  transactions</strong>.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        
        <Grid container alignItems="center" direction="row" justify="center" spacint={16}>
          <Grid className={this.props.developersMode ? '' : 'hidden'}
                item xs={6} sm={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography>
                  <MarkdownRenderer markdown={
                    `
We'll use waves TESTNET. For demo purposes we will generate seed and use special issued TwitterCoins.
Every owner of TwitterCoin can send them to central address \`${constants.CENTRAL_ADDRESS}\` and post his tweets as DataTransaction with keys like \`twitter.post.1\`,
\`twitter.post.2, ..., twitter.post.N\`.
Messages are stored as serialized JSON objects
like: \`{"{timestamp: 'YYYY-MM-DD HH:MM:SS', body: '...''}"}\`
Every post will have link like: \`${window.location.host}/twitter/userName/twitter.post.N\`
										`
                  }/>
                </Typography>
              </CardContent>
            </Card>
            <Card className={classes.card}>
              <CardContent>
                <Typography>
                  <MarkdownRenderer markdown={
                    `
Along with posts we also store in the blockchain the main information about a user as follows:
\`\`\`
"twitter.displayName": "Name"
"twitter.avatar.0": "..."
"twitter.avatar.1": "..."
"twitter.avatar.N": "..."
"twitter.color": "#00000000"
\`\`\`
										`
                  }/>
                  In this demo we automatically will send TwitterCoin to users' address and send it back
                  to the central address.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} className={classes.paper}>
            <Card className={classes.card} elevation={4}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary">
                  1. We generated seed phrase for you as an example.
                </Typography>
                <Grid container className={classes.root} spacing={16} justify="center" alignItems="center"
                      direction="row">
                  <Grid item xs={9}>
                    <TextField
                      multiline
                      id="seed"
                      label="Seed"
                      disabled={true}
                      value={this.state.seed}
                      className={classes.textField}
                      onChange={this.handleChange('data')}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="raised" color="primary" onClick={TwitterInit.copySeedToClipboard}
                            className={classes.button}>
                      Copy
                    </Button>
                    <Button variant="raised" onClick={this.importSeedPhrase}
                            className={classes.button}>
                      Import
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            
            <Card className={classes.card} elevation={4}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary">
                  2. Before we start.
                </Typography>
                <Typography>
                  Data transactions are NOT free and we highly recommend you to get more TESTNET WAVES using <a
                  href="https://testnet.wavesexplorer.com/faucet"
                  target="_blank"> faucet</a>. Your address is shown below:
                </Typography>
                <Grid container className={classes.root} spacing={16} justify="center" alignItems="center"
                      direction="row">
                  <Grid item xs={9}>
                    <TextField
                      multiline
                      id="address"
                      label="Your testnet address"
                      disabled={true}
                      value={this.state.accountData.address}
                      className={classes.textField}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button variant="raised" color="primary" onClick={TwitterInit.copyAddressToClipboard}
                            className={classes.button}>
                      Copy
                    </Button>
                  </Grid>
                </Grid>
                {this.state.coinSentBack === false && (
                  <div>
                    <br/>
                    <Typography>Now we will send 1 TESTNET WAVES and 10 TwitterCoins to your
                      address {this.state.accountData.address}...</Typography>
                    <CircularProgress/>
                  </div>)}
                {this.state.coinSentBack === true && (
                  <div>
                    <br/>
                    <Typography>Everything is ready. Now you can set up your account.</Typography>
                    <Link to="/twitter/settings" className='no-underline'>
                      <Button variant="raised" color="primary"
                              className={classes.button} style={{ marginTop: '16px' }}>
                        Set up account
                      </Button>
                    </Link>
                  </div>)}
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
            <TextField
              autoFocus
              margin="dense"
              id="importSeed"
              label="Seed Phrase"
              type="text"
              onChange={this.handleChange('importSeed')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleImportClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleImport} color="primary">
              Import
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

TwitterInit.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TwitterInit);
