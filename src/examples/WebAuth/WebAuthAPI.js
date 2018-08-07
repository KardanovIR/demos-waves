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
  FormControlLabel,
  Table,
  TableHead, TableRow, TableCell, TableBody, Tabs, Tab
} from "material-ui";
import classNames from 'classnames';
import Switch from "material-ui/Switch/Switch";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';


const styles = theme => ({
  card: {
    minWidth: 275,
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
  }
});

const ValueTableCell = withStyles(theme => ({
  body: {
    'wordBreak': 'break-all'
  },
}))(TableCell);

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}


class WebAuthAPI extends React.Component {
  state = {
    open: false,
    anchor: 'left',
    referrer: window.location.origin,
    icon: '/_theme/favicon.ico',
    name: 'Waves Web Auth Demo project',
    data: 'Dummy data \n(JSON, string, numeric)',
    success: window.location.pathname + '/web-auth-success',
    debug: false,
    response: '',
    link: ''
  };
  
  responseFieldNames = {
    d: 'Data',
    s: 'Signature',
    p: 'Public key',
    a: 'Address',
  };
  
  selectedCodeExample = 0;
  
  getAuthLink = () => {
    let linkParts = {
      r: this.state.referrer,
      n: this.state.name,
      i: this.state.icon,
      s: this.state.success,
      d: this.state.data,
      debug: this.state.debug
    };
    let params = Object.keys(linkParts).map((key) => {
      return `${key}=${linkParts[key]}`;
    }).join('&');
    return `https://client.wavesplatform.com#gateway/auth?${params}`;
  };
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  handleSwitchChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  
  
  openAuthWindow = () => {
    window.open(this.getAuthLink(), '_blank', null, false);
  };
  
  receiveSuccess = (message) => {
    if (message.origin !== window.location.origin) return false;
    if (message.data.updateResponseUrl !== true) return false;
    
    this.setState({ response: message.data.url });
  };
  
  getJsonFromUrl = (url) => {
    let linkElement = document.createElement('a');
    linkElement.href = url;
    const query = linkElement.search.substr(1);
    let result = {};
    query.split("&").forEach(function (part) {
      const item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    return result;
  };
  
  getResponseParams = () => {
    const params = this.getJsonFromUrl(this.state.response);
    let result = [];
    Object.keys(params).map((key) => {
      result.push({
        name: this.responseFieldNames[key],
        parameter: key,
        value: params[key],
      })
    });
    return result;
  };
  
  componentWillReceiveProps(newProps) {
    this.setState({ name: newProps.name });
  }
  
  render() {
    const { classes } = this.props;
    window.addEventListener("message", this.receiveSuccess, false);
    
    const codeSnippets = {
      javascript: `
// require waves-api library and URL parser
const WavesAPI = require('waves-api');
const url = require('url');

const Waves = WavesAPI.create(WavesAPI.MAINNET_CONFIG);


// function for string->byteArray conversion
function stringToByteArray(str){
	str = unescape(encodeURIComponent(str));
	let bytes = new Array(str.length);
	for (let i = 0; i < str.length; ++i)
		bytes[i] = str.charCodeAt(i);
	return bytes;
}


// get redirect url and parse it
const redirectedUrl = '${this.state.response.substring(0, 47)}...';
const parsedUrl = url.parse(redirectedUrl, true);
const signedData = parsedUrl.query.d;
const signature = parsedUrl.query.s;
const publicKey = parsedUrl.query.p;

// get values from URL
const dataByteArray = stringToByteArray(signedData)

// check validity of the signature
Waves.crypto.isValidTransactionSignature(dataByteArray, signature, publicKey);
`,
      python: `
import axolotl_curve25519 as curve
import base58
from urllib.parse import urlparse, parse_qs


def str_with_length(string_data):
    string_length_bytes = len(string_data).to_bytes(2, byteorder='big')
    string_bytes = string_data.encode('utf-8')
    return string_length_bytes + string_bytes


def signed_data(host, data):
    prefix = 'WavesWalletAuthentication'
    return str_with_length(prefix) + str_with_length(host) + str_with_length(data)


def verify(public_key, signature, message):
    public_key_bytes = base58.b58decode(public_key)
    signature_bytes = base58.b58decode(signature)
    if curve.verifySignature(public_key_bytes, message, signature_bytes) is 0:
        return True
    return False


redirected_url = 'https://demo.wavesplatform.com/web-auth-success/...'
parsed_url = urlparse(redirected_url)
parsed_query = parse_qs(parsed_url.query)

address = parsed_query['a'][0]
pub_key = parsed_query['p'][0]
signature = parsed_query['s'][0]
data_string = parsed_query['d'][0]
host_string = parsed_url.netloc
message_bytes = signed_data(host_string, data_string)

print('Address =', address)
print('Public key =', pub_key)
print('Signed Data =', message_bytes)
print('Signature =', signature)
print('Verified =', verify(pub_key, signature, message_bytes))`
    };
    
    
    return (
      <Grid>
        <Grid container justify="center" className={classes.root} spacing={16}>
          <Grid item xs={8} sm={8}>
            <Card className={this.props.developersMode ? '' : 'hidden'}>
              <CardContent>
                <Typography>If you want to authorize a user in your service by means of his Waves account, here's the
                  solution.
                  In general, you should redirect the user to the official Waves Client (https://client.wavesplatform.com/
                  —
                  to be
                  changed later) with certain query parameters including some arbitrary data for him to
                  sign.</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container alignItems="center" direction="row" justify="center" spacing={16}>
          <Grid className={this.props.developersMode ? '' : 'hidden'}
                item xs={6} sm={6}>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title} color="textSecondary">
                  1. Construct a proper URL and open it
                </Typography>
                <Grid container justify="center">
                  <form className={classes.container} noValidate autoComplete="off">
                    <TextField
                      id="referrer"
                      label="Referrer (r)"
                      className={classes.textField}
                      value={this.state.referrer}
                      onChange={this.handleChange('referrer')}
                      fullWidth
                      disabled
                      margin="normal"
                    />
                    <TextField
                      id="name"
                      label="Service name (n)"
                      className={classes.textField}
                      value={this.state.name}
                      onChange={this.handleChange('name')}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      id="icon"
                      label="Icon path (i)"
                      value={this.state.icon}
                      className={classes.textField}
                      onChange={this.handleChange('icon')}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      multiline
                      id="data"
                      label="Data (a)"
                      value={this.state.data}
                      className={classes.textField}
                      onChange={this.handleChange('data')}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      id="success"
                      label="Success path (s)"
                      defaultValue={this.state.success}
                      className={classes.textField}
                      fullWidth
                      disabled
                      margin="normal"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.debug}
                          onChange={this.handleSwitchChange('debug')}
                          value="false"
                          color="primary"
                        />
                      }
                      label="Debug mode"
                    />
                  </form>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={6} className={classes.paper}>
            <Card>
              <CardContent>
                <Typography>Web Auth API might be needed in cases when you need to either work with user personal data
                  and be
                  sure
                  that
                  a given blockchain account belongs to that user.</Typography>
              </CardContent>
            </Card>
            <Card className={classNames({ card: true, 'hidden': !this.props.developersMode })} elevation={4}>
              <CardContent>
                <Typography component="p">
                  {this.getAuthLink()}
                </Typography>
              </CardContent>
            </Card>
            <Card className={classes.card} elevation={4}>
              <CardContent>
                <Button size="small" variant="raised" color="primary" onClick={this.openAuthWindow}>Log in with
                  <span
                    dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"90\" height=\"16\" viewBox=\"0 0 130 28\" style=\"display: block;margin-top: -5px;\"><path fill=\"#fff\" d=\"M30.25 6.76l.26.36-6.1 18.93-.43.37h-3.89l-.43-.37-4.39-13.55h-.08l-4.37 13.55-.43.37H6.54l-.43-.37L0 7.12l.26-.36h3.88l.4.36 3.93 13.3h.08l4.38-13.3.4-.35h4l.4.35 4.4 13.46 3.94-13.44.4-.37h3.79zm39.37 0l-.43.35-5.38 14-5.33-14-.48-.33h-3.89l-.23.35 7.65 19 .45.36h3.53l.45-.36 7.73-19-.23-.35h-3.84zm21.44 2.42a10.89 10.89 0 0 1 2.59 7.56v.57l-.36.36h-14.5a5.6 5.6 0 0 0 1.78 3.81 5.54 5.54 0 0 0 3.89 1.56A4.5 4.5 0 0 0 89 20.39l.5-.36h3.58l.28.37a8.42 8.42 0 0 1-3.48 4.89 9.15 9.15 0 0 1-5.34 1.51 9.39 9.39 0 0 1-7.12-2.9 10.19 10.19 0 0 1-2.74-7.29 10.53 10.53 0 0 1 2.65-7.18 8.75 8.75 0 0 1 6.83-3 8.9 8.9 0 0 1 6.9 2.75zm-1.72 5a5.08 5.08 0 0 0-5.17-4 5.31 5.31 0 0 0-5.13 4zM50.92 6.76l.36.36v18.95l-.36.36h-3.28l-.36-.36V24h-.12a6.82 6.82 0 0 1-1.91 1.63c-.19.12-.4.22-.61.32a8.24 8.24 0 0 1-3.61.78 8.48 8.48 0 0 1-6.44-2.93 10.34 10.34 0 0 1-2.7-7.27 10.34 10.34 0 0 1 2.7-7.27A8.48 8.48 0 0 1 41 6.37a8.13 8.13 0 0 1 3.62.79 4.85 4.85 0 0 1 .57.31 6.91 6.91 0 0 1 2 1.69l.06-.08v-2l.36-.36h3.28zm-3.84 7.93a5.89 5.89 0 0 0-1.46-2.83 5.32 5.32 0 0 0-4-1.75 5 5 0 0 0-3.81 1.76 6.59 6.59 0 0 0-1.68 4.71 6.54 6.54 0 0 0 1.68 4.71 4.93 4.93 0 0 0 3.8 1.71 5.26 5.26 0 0 0 4-1.75 5.83 5.83 0 0 0 1.46-2.83zm60 .37s-2.15-.45-3.92-.85-2.43-.84-2.43-2 1.18-2.24 3.7-2.24 3.83 1.11 3.83 2.07l.43.37h3.58l.28-.36c0-2.56-2.22-5.65-8-5.65-6.06 0-8 3.56-8 5.86 0 1.93.7 4.2 5.34 5.28l4 .89c2 .47 2.87 1.14 2.87 2.33s-1.07 2.37-3.87 2.37c-2.6 0-4.18-1.25-4.24-2.73l-.45-.36h-3.63l-.28.37c.34 3.3 2.78 6.39 8.62 6.39 6.61 0 8-4 8-6.15-.06-2.83-1.68-4.65-5.79-5.59z\"></path><path fill=\"#fff\" d=\"M116.45 6.77l6.774-6.774 6.774 6.774-6.774 6.774z\"></path></svg>" }}>
									</span>
                </Button>
                <Typography className={classes.title} color="textSecondary">
                  In this demo link opens in a separate window
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {this.state.response !== '' && (
          <Grid container alignItems="center" direction="row" justify="center" spacing={16}>
            <Grid item xs={6} sm={6} className={classes.paper}>
              <Card className={classes.card} elevation={4}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    Response (Redirect URL)
                  </Typography>
                  <code style={{
                    'wordBreak': 'break-all' +
                    ''
                  }}>{this.state.response}</code>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Parameter</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.getResponseParams().map(n => {
                        return (
                          <TableRow key={n.parameter}>
                            <TableCell>{n.name}</TableCell>
                            <TableCell>{n.parameter}</TableCell>
                            <ValueTableCell>{n.value}</ValueTableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} sm={6} className={{ 'paper': true, 'hidden': !this.props.developersMode }}>
              <Card className={classes.card} elevation={4}>
                <CardContent>
                  <Typography className={classes.title} color="textSecondary">
                    How to check validity?
                  </Typography>
                  <Tabs
                    value={this.selectedCodeExample}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollable
                    scrollButtons="auto"
                  >
                    <Tab label="Javascript" classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                    <Tab label="Python" disabled classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                    <Tab label="Java" disabled classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                    <Tab label="C#" disabled classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                  </Tabs>
                  {this.selectedCodeExample === 0 && <TabContainer>
                    <SyntaxHighlighter justify="left" language="javascript" customStyle={{ 'textAlign': 'left' }}
                                       style={docco}>{codeSnippets.javascript}</SyntaxHighlighter>
                  </TabContainer>}
                  {this.selectedCodeExample === 1 && <TabContainer>
                      <SyntaxHighlighter justify="left" language="python" customStyle={{ 'textAlign': 'left' }}
                                         style={docco}>{codeSnippets.python}</SyntaxHighlighter>
                  </TabContainer>}
                  {this.selectedCodeExample === 2 && <TabContainer>...</TabContainer>}
                  {this.selectedCodeExample === 3 && <TabContainer>...</TabContainer>}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  }
}

WebAuthAPI.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(WebAuthAPI);
