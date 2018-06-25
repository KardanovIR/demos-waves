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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    IconButton,
    Divider,
    Drawer,
    ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails,
} from "material-ui";
import { Link } from "react-router-dom";
import CloseIcon from '@material-ui/icons/Close'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MarkdownRenderer from 'react-markdown-renderer';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';

const styles = theme => ({
    card: {
        minWidth: 275,
        marginBottom: '16px'
    },
    iframe: {
        border: 0,
        width: '100%',
        height: '100%',
        minHeight: window.innerHeight - 350
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
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});


class Console extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            importOpen: false,
            examplesOpen: false
        }
    }
    
    handleDrawerOpen = () => {
        this.setState({ examplesOpen: true });
    };
    
    handleDrawerClose = () => {
        this.setState({ examplesOpen: false });
    };
    
    
    render() {
        const { classes } = this.props;
        
        return (
          <Grid>
              <Grid container justify="center" className={classes.root} spacing={16}>
                  <Grid item xs={12} sm={12}>
                      <Card>
                          <CardContent>
                              <Typography>
                                  Waves demo console uses Waves Node.js library <a
                                href='https://github.com/wavesplatform/waves-api' target='_blank'>waves-api</a>.
                                  This console can be used as playground.
                                  Console gives access to Waves instance and TX_EXAMPLES.
                              </Typography>
                              <Grid justify="flex-end">
                                  <Link to="https://github.com/wavesplatform/waves-api" className="no-underline"
                                        target="_blank">
                                      <Button variant="contained" color="primary" className={classes.button}>
                                          Documentation
                                      </Button>
                                  </Link>
                                  <Button variant="contained" color="primary" onClick={this.handleDrawerOpen}
                                          className={classes.button}>
                                      FAQ
                                  </Button>
                                  <Link to="/console/" className="no-underline" target="_blank">
                                      <Button variant="contained" color="primary" className={classes.button}>
                                          Open in new window
                                      </Button>
                                  </Link>
                              </Grid>
                          </CardContent>
                      </Card>
                      <iframe src='/console/' className={classes.iframe}/>
                  </Grid>
              </Grid>
              <Drawer
                variant="persistent"
                anchor="right"
                open={this.state.examplesOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                style={{
                    width: '50%',
                    zIndex: 99,
                    paddingTop: 65,
                    textAlign: 'left'
                }}
                PaperProps={{
                    style: {
                        width: '50%',
                        zIndex: 99,
                        marginTop: 65,
                        textAlign: 'left'
                    }
                }}
              >
                  <div className={classes.drawerHeader}>
                      <IconButton onClick={this.handleDrawerClose}>
                          <CloseIcon/>
                      </IconButton>
                  </div>
                  <Divider/>
                  <ExpansionPanel direction="column" justify="flex-start">
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>1. Introduction</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid>
                              This demo shows how to write, compile and deploy Smart Contract using this console.
                              The console is built with Waves JavaScript library inside. The library supports all types
                              of
                              transactions.
                              <Grid item><strong>Note: The console works with TESTNET. Not
                                  MAINNET.</strong></Grid>
                              <Grid item>
                                  In this use case we assume, that there are 3 stakeholders - Inal, Lena and their
                                  pet <a target="_blank"
                                         href="https://i.ebayimg.com/images/g/e3YAAOSwWxNYtHZO/s-l1600.jpg">Elephant</a>.
                                  Elephant has some money and Inal with Lena want to control his spending. They decided
                                  to create 2-of-3 multisignature account.
                              </Grid>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>2. How to generate seed, keypair and
                              address?</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails direction="column" justify="flex-start">
                          <Grid item style={{ maxWidth: '100%' }} direction="column" justify="flex-start">
                              Waves object is available in global scope.
                              To generate random seed, keypair and address and save it in a variable, Elephant uses:
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left' }}
                                                 style={docco}>{"const elephantAccount = Waves.Seed.create();"}</SyntaxHighlighter>
                              Keypair and address from existing seed can be generated as shown below:
                              
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left', 'overflowX': 'scroll' }}
                                                 style={docco}>{"const inalAccount = Waves.Seed.fromExistingPhrase('learn empty exotic " +
                              "film turtle address loud menu try crater defy boil mutual " +
                              "used dentist');"}</SyntaxHighlighter>
                          
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>3. How to write a smart contract?</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid direction="column" justify="flex-start">
                              <Grid item style={{ maxWidth: '100%' }} direction="column" justify="flex-start">
                                  You can use <a href="http://ide.wavesplatform.com"
                                                 target="_blank">http://ide.wavesplatform.com</a> to write a smart
                                  contract.
                                  IDE supports syntax highlighting, code completion and many other features. In the
                                  official
                                  documentation you can find <a
                                href="https://docs.wavesplatform.com/technical-details/waves-contracts-language-description.html"
                                target="_blank">details</a> about smart
                                  contracts language.
                              </Grid>
                              <Grid item style={{ maxWidth: '100%' }}>
                                  In this case, Smart Contract should check 2 proofs and return <strong>TRUE</strong>,
                                  if
                                  Elephant and Inal oo Lena signed the transaction.
                              </Grid>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>4. How to compile a smart contract?</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid item style={{ maxWidth: '100%' }}>
                              In the <a href="http://ide.wavesplatform.com"
                                        target="_blank">IDE</a> you can find compiled (base64) version of smart
                              contract. But, if you want to inject into smart contract variable values, you can compile
                              code in the console:
                              
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left', 'overflowX': 'scroll' }}
                                                 style={docco}>{
                                  "\n    // To check the validity of tx we need public keys of Inal and Lena" +
                                  "\n    const lenaPubKey = '5XpeKMDVe1AMhuxUdB8dAg1Q26A9XFicvVQohxdcohSb';" +
                                  "\n    const inalPubKey = 'EUxurMktqev3KzBPGD5hhMb6GtyGU2u7sTjaz9DoL73Y';" +
                                  "\n    const scriptBody = `" +
                                  "\n    let lenaPubKey     = base58'\${lenaPubKey}'" +
                                  "\n    let inalPubKey     = base58'\${inalPubKey}'" +
                                  "\n    let elephantPubKey = base58'\${elephantAccount.keyPair.publicKey}' \n\n" +
                                  "\n    match tx {" +
                                  "\n      case tx:DataTransaction =>" +
                                  "\n        if(sigVerify(tx.bodyBytes, tx.proofs[0], elephantPubKey)) then true else false" +
                                  "\n      case _ =>" +
                                  "\n        let elephantSigned   = if(sigVerify(tx.bodyBytes, tx.proofs[0], elephantPubKey)) then 1 else 0" +
                                  "\n        let inalSigned       = if(sigVerify(tx.bodyBytes, tx.proofs[1], inalPubKey))     then 1 else 0" +
                                  "\n        let lenaSigned       = if(sigVerify(tx.bodyBytes, tx.proofs[1], lenaPubKey))     then 1 else 0" +
                                  "\n        elephantSigned == 1 && ((inalSigned + lenaSigned) > 0)" +
                                  "\n    }`;" +
                                  "\nconst compiledScript = await Waves.API.Node.utils.script.compile(scriptBody);"
                              }</SyntaxHighlighter>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>5. How to deploy smart contract?</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid item style={{ maxWidth: '100%' }}>
                              To deploy a smart contract we have to send <a target="_blank"
                                                                            href="https://docs.wavesplatform.com/technical-details/waves-contracts-language-description/examples/multi-signature-account.html">SetScriptTransaction</a>.
                              Waves JavaScript library supports it. Code for <strong>Elephant</strong> to deploy Smart
                              Contract for his account shown below:
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left', 'overflowX': 'scroll' }}
                                                 style={docco}>{
                                  "// create instance of TransactionWrapper and add signature" +
                                  "\nconst setScriptObj = Object.assign(Helpers.TX_EXAMPLES.SET_SCRIPT, {" +
                                  "\n  script: compiledScript," +
                                  "\n  sender: elephantAccount.address," +
                                  "\n  senderPublicKey: elephantAccount.keyPair.publicKey" +
                                  "\n});" +
                                  "\nconst setScriptTx = await Waves.tools.createTransaction(Waves.constants.SET_SCRIPT_TX_NAME, setScriptObj);" +
                                  "\nsetScriptTx.addProof(elephantAccount.keyPair.privateKey);" +
                                  "\n\n" +
                                  "// send SetScriptTransaction to the network" +
                                  "\n//to send tx we need TESTNET WAVES on Elephants' account" +
                                  "\n//you can get them in faucet: https://testnet.wavesexplorer.com/faucet" +
                                  "\nconst txJSON = await setScriptTx.getJSON();" +
                                  "\nconst setScriptResult = await Waves.API.Node.transactions.rawBroadcast(txJSON);"
                              }</SyntaxHighlighter>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>6. How to sign transactions and send to
                              network?</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid item style={{ maxWidth: '100%' }}>
                              When Smact Contract is attached to an account, all transactions should have at least 2
                              signatures.
                              For instance, if Elephant wants to make transfer transaction to an address, he has to
                              generate transaction JSON,
                              sign it and send to Inal or Lena. Let's create transaction and get plain JSON.
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left', 'overflowX': 'scroll' }}
                                                 style={docco}>{
                                  "// create transfer transaction" +
                                  "\nconst transferTxObj = Object.assign(Helpers.TX_EXAMPLES.TRANSFER, {" +
                                  "\n  recipient: '3MqKCgNS94xuWXszEYy3PpDWuJkFeg62dAu'," +
                                  "\n  amount: 10000000," +
                                  "\n  sender: elephantAccount.address," +
                                  "\n  senderPublicKey: elephantAccount.keyPair.publicKey" +
                                  "\n});" +
                                  "\nconst transferTx = await Waves.tools.createTransaction(Waves.constants.TRANSFER_TX_NAME, transferTxObj);" +
                                  "\ntransferTx.addProof(elephantAccount.keyPair.privateKey);" +
                                  "\n\n" +
                                  "\nconst transferTxJSON = await transferTx.getJSON();" +
                                  "\nconsole.log(transferTxJSON);"
                              }</SyntaxHighlighter>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>7. How to share transaction?</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid item style={{ maxWidth: '100%' }}>
                              When script is deployed, every transaction from Elephant should be signed by Elephant
                              and Lena or Inal. Elephant has to send somehow transaction JSON to other stakeholders.
                              He can use messenger, or Data Transactions like shown below.
                              <SyntaxHighlighter justify="left" language="javascript"
                                                 customStyle={{ 'textAlign': 'left', 'overflowX': 'scroll' }}
                                                 style={docco}>{
                                  "// create instance of TransactionWrapper" +
                                  "\nconst data = [{" +
                                  "\n    key: 'payment-2018-06-25-cake'," +
                                  "\n    value: JSON.stringify(transferTxJSON)," +
                                  "\n    type: 'string'" +
                                  "\n  }];" +
                                  "\nconst dataTxObj = Object.assign(Helpers.TX_EXAMPLES.DATA, {" +
                                  "\n  data: data," +
                                  "\n  fee: Waves.tools.getMinimumDataTxFee(data)," +
                                  "\n  sender: elephantAccount.address," +
                                  "\n  senderPublicKey: elephantAccount.keyPair.publicKey" +
                                  "\n});" +
                                  "\nconst dataTx = await Waves.tools.createTransaction(Waves.constants.DATA_TX_NAME, dataTxObj);" +
                                  "\ndataTx.addProof(elephantAccount.keyPair.privateKey);" +
                                  "\n\n" +
                                  "//send Data Transction to the network" +
                                  "\nconst dataTxJSON = await dataTx.getJSON();" +
                                  "\nconst dataTxResult = await Waves.API.Node.transactions.rawBroadcast(dataTxJSON);"
                              }</SyntaxHighlighter>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                          <Typography className={classes.heading}>Tips and tricks</Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                          <Grid direction="column">
                              
                              <Grid item style={{ maxWidth: '100%' }}>
                                  1. All code inside the console runs in your browser, so you can JavaScript as usual.
                              </Grid>
                              <Grid item style={{ maxWidth: '100%' }}>
                                  2. Type variable name and hit <strong>Enter</strong> to see the value.
                              </Grid>
                              <Grid item style={{ maxWidth: '100%' }}>
                                  3. Use the buttons on the right side of each command. They can help to copy as JSON,
                                  get
                                  permalink, etc.
                              </Grid>
                              <Grid item style={{ maxWidth: '100%' }}>
                                  4. You can switch theme of console between dark and light using :theme dark|light
                                  commands.
                              </Grid>
                              <Grid item style={{ maxWidth: '100%' }}>
                                  5. You can load external scripts, type :help for details.
                              </Grid>
                          </Grid>
                      </ExpansionPanelDetails>
                  </ExpansionPanel>
              </Drawer>
          </Grid>
        );
    }
}

Console.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Console);
