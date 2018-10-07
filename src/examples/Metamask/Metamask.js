import React from 'react';
import PropTypes from "prop-types";
import {
    Button,
    Card,
    withStyles,
    Typography,
    CardContent,
    Grid,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogContent, DialogTitle, DialogContentText, DialogActions
} from "@material-ui/core";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';


const styles = theme => ({
    root: {
        width: '90%',
    },
    backButton: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    code: {
        'wordBreak': 'break-all'
    },
    avatar: {
        top: '-30px',
        borderWidth: '2px',
        borderColor: '#fff',
        borderStyle: 'solid',
        backgroundColor: '#fff',
        borderRadius: '99px',
        width: 60,
        height: 60
    },
    cardHeader: {
        textAlign: 'left',
        paddingTop: '10px',
        paddingLeft: '8px',
        paddingRight: '40px'
    },
    cardHeaderContent: {
        maxWidth: 'calc(100% - 150px)'
    },
    cardHeaderSubheader: {
        fontSize: '11px'
    }
});


class Metamask extends React.Component {
    
    state = {
        address: true,
        addresses: [],
    };
    
    constructor(props) {
        super(props);
        this.state = {
            address: true,
            addresses: [],
            sender: '',
            recipient: '',
            amount: 1,
            fee: 100000,
            asset: 'WAVES'
        };
        if (window.Waves === undefined) {
            window.Waves = {
                API: {
                    Node: {
                        addresses: {
                            get: () => {
                                return new Promise((resolve, reject) => {
                                    resolve(['address1', 'address2']);
                                });
                            }
                        },
                        assets: {
                            transfer: (sender, recipient, amount, fee = 100000, assetId = 'WAVES') => {
                                return new Promise((resolve, reject) => {
                                    resolve('txid1');
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    
    handleSelectChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    
    getAddressesList = () => {
        const _this = this;
        window.Waves.API.Node.addresses.get()
          .then(result => {
              _this.setState({
                  addresses: result
              });
          })
    }
    
    getMetamaskEnabled() {
        return window.Waves !== undefined;
    }
    
    componentDidMount = () => {
        this.getAddressesList()
    };
    
    sendTransaction = () => {
        const transferTx = window.Waves.API.Node.assets.transfer(this.state.sender, this.state.recipient, this.state.amount, this.state.fee, this.state.asset);
        transferTx
          .then(txId => {
              this.setState({
                  txOpen: true,
                  txId: txId
              })
          })
          .catch(err => console.error)
        
    };
    
    handleTxModalClose = () => {
        this.setState({
            txOpen: false
        })
    };
    
    openExplorerWithTx = () => {
        window.open('https://testnet.wavesexplorer.com/tx/' + this.state.txId, '_blank')
    };
    
    render() {
        const { classes } = this.props;
        
        return (
          <Grid>
              <Grid container alignItems="center" direction="row" justify="center" spacing={16}
                    className={this.getMetamaskEnabled() ? '' : 'hidden'}>
                  <Grid item xs={6} sm={6} className={classes.paper}>
                      <Card className={classes.card} elevation={4}>
                          <CardContent>
                              <Typography className={classes.title} color="textSecondary">
                                  1. Addresses list
                              </Typography>
                              <Table className={this.state.addresses.length > 0 ? '' : 'hidden'}>
                                  <TableHead>
                                      <TableRow>
                                          <TableCell>Address</TableCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {this.state.addresses.map((address, index) => {
                                          return (
                                            <TableRow key={index}>
                                                <TableCell>{address}</TableCell>
                                            </TableRow>
                                          );
                                      })}
                                  </TableBody>
                              </Table>
                              <Button size="small" variant="raised" color="primary" onClick={this.getAddressesList}>
                                  Refresh
                              </Button>
                          </CardContent>
                      </Card>
                  </Grid>
                  <Grid item xs={6} sm={6} className={{ 'paper': true }}>
                      <Card className={classes.card} elevation={4}>
                          <CardContent
                            className={this.getMetamaskEnabled() ? '' : 'hidden'}>
                              <Typography className={classes.title} color="textSecondary">
                                  Waves object was injected into the page by Metamask plugin.
                              </Typography>
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left' }}
                                                 style={docco}>
                                  {
                                      `
// Waves is an object in global scope provided by Metamask Ultimate
Waves.API.Node.addresses.get()
    .then(addresses => {
        console.log(addresses)
    })
    .catch(err => console.error);
                                      `
                                  }
                              </SyntaxHighlighter>
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>
              
              <Grid container alignItems="center" direction="row" justify="center" spacing={16}>
                  <Grid item xs={6} sm={6}>
                      <Card className={classes.card}>
                          <CardContent>
                              <Typography className={classes.title} color="textSecondary">
                                  Set transaction parameters and click <b>Sign</b>
                              </Typography>
                              <Grid container justify="center">
                                  <form className={classes.container} noValidate autoComplete="off">
                                      <FormControl className={classes.formControl} style={{ width: '100%' }}>
                                          <InputLabel htmlFor="age-simple">Sender</InputLabel>
                                          <Select
                                            value={this.state.sender}
                                            onChange={this.handleSelectChange}
                                            style={{ width: '100%' }}
                                            inputProps={{
                                                name: 'sender',
                                                id: 'age-simple',
                                            }}
                                          >
                                              {
                                                  this.state.addresses.map(address => {
                                                      return (<MenuItem value={address}>{address}</MenuItem>)
                                                  })
                                              }
                                          </Select>
                                      </FormControl>
                                      
                                      <TextField
                                        id="asset"
                                        label="Asset"
                                        className={classes.textField}
                                        value={this.state.asset}
                                        onChange={this.handleChange('asset')}
                                        fullWidth
                                        margin="normal"
                                      />
                                      <TextField
                                        id="amount"
                                        label="Amount"
                                        defaultValue={this.state.amount}
                                        className={classes.textField}
                                        onChange={this.handleChange('amount')}
                                        fullWidth
                                        margin="normal"
                                      />
                                      <TextField
                                        id="recipient"
                                        label="Recipient"
                                        defaultValue={this.state.recipient}
                                        className={classes.textField}
                                        onChange={this.handleChange('recipient')}
                                        fullWidth
                                        margin="normal"
                                      />
                                      <TextField
                                        id="fee"
                                        label="Fee"
                                        defaultValue={this.state.fee}
                                        className={classes.textField}
                                        onChange={this.handleChange('fee')}
                                        fullWidth
                                        margin="normal"
                                      />
                                  </form>
                              </Grid>
                              <Button size="small" variant="raised" color="primary" onClick={this.sendTransaction}>
                                  Send
                              </Button>
                          </CardContent>
                      </Card>
                  </Grid>
                  <Grid item xs={6} sm={6} className={classes.paper}>
                      <Card>
                          <CardContent>
                              <Typography>This demo shows how to use Metamask Ultimate extension for signing
                                  transactions.</Typography>
                              <Typography className={this.getMetamaskEnabled() ? 'hidden' : ''}>Sorry, but you don't
                                  have enabled Metamask extension with Waves support.</Typography>
                          </CardContent>
                      </Card>
                      <Card className={classes.card} elevation={4}>
                          <CardContent
                            className={this.getMetamaskEnabled() ? '' : 'hidden'}>
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left' }}
                                                 style={docco}>
                                  {
                                      `
// Waves is an object in global scope provided by Metamask Ultimate \n
const transferTx = Waves.API.Node.assets.transfer(sender, recipient, amount, fee, assetId);
transferTx
    .then(txId => console.log)
    .catch(err => console.error)
                                      `
                                  }
                              </SyntaxHighlighter>
                          </CardContent>
                      </Card>
                  </Grid>
              </Grid>
              <Dialog
                open={this.state.txOpen}
                onClose={this.handleTxModalClose}
                aria-labelledby="form-dialog-title"
              >
                  <DialogTitle id="form-dialog-title">Yeah, transaction was signed and sent</DialogTitle>
                  <DialogContent>
                      <DialogContentText>
                          Your transaction was successfully signed and sent to the network. You can see it
                          in the explorer.
                      </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                      <Button onClick={this.handleTxModalClose} color="primary">
                          Cancel
                      </Button>
                      <Button onClick={this.openExplorerWithTx} color="primary">
                          Show in explorer
                      </Button>
                  </DialogActions>
              </Dialog>
          </Grid>
        );
    }
}

Metamask.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Metamask);
