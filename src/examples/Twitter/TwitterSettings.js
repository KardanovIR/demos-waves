import React from 'react';
import { withStyles } from "@material-ui/core/styles/index";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Typography,
  CardContent,
  Grid,
  TextField,
  CircularProgress,
  Avatar,
  CardHeader,
  IconButton,
  CardActions,
  Dialog,
  DialogActions,
} from "@material-ui/core";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';
import Stepper, { Step, StepLabel } from '@material-ui/core/Stepper';
import constants from "../../settings/constants";
import { defaultAvatar, getAvatar, makeId } from './Helpers';
import DataTransaction from './DataTransaction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ColorLens from '@material-ui/icons/ColorLens';
import { TwitterPicker } from 'react-color';
import { Redirect } from "react-router-dom";

const styles = theme => ({
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
  cardHeader: {
    textAlign: 'left'
  }
});

function getSteps() {
  return ['Set your display name', 'Upload an avatar', 'Select profile color'];
}

class TwitterSettings extends React.Component {
  
  state = {
    loaded: false,
    accountData: null,
    displayColorPicker: false,
    activeStep: 0,
    displayName: '',
    avatar: {
      data: '',
    },
    lastUpdate: '',
    color: '',
    bio: '',
    waitingForSettingsUpdate: false
  };
  
  lastSettings = {
    displayName: '',
    lastUpdate: '',
    color: '',
    bio: '',
    avatar: {
      data: '',
    },
  };
  
  constructor(props) {
    super(props);
    const accountData = JSON.parse(window.localStorage.getItem('waves.accountData'));
    const address = accountData.address;
    if (!address) {
      window.location.href = '/twitter';
    }
    this.state = {
      loadingInProgress: false,
      loaded: false,
      accountData: accountData,
      activeStep: 0,
      displayName: '',
      displayColorPicker: false,
      bio: '',
      avatar: {
        data: defaultAvatar,
      },
      waitingForSettingsUpdate: false,
      lastUpdate: '',
      color: '',
      redirectToUsersList: false
    };
    
    this.handleColorChangeComplete.bind(this);
    this.checkLastUpdateApplied.bind(this)
    
    this.getDataFromAccount()
      .then((result) => {
        return result.json();
      })
      .then((jsonResult) => {
        this.setCurrentSettings(jsonResult)
      })
      .catch((err) => {
        console.log(err);
        this.setState({ loaded: true });
      });
    
  }
  
  handleColorPickerClose = () => {
    this.setState({ displayColorPicker: false });
  };
  
  getDataFromAccount = () => {
    return fetch(`${constants.TESTNET_NODES_BASE_URL}/addresses/data/${this.state.accountData.address}`)
  };
  
  setCurrentSettings = (data) => {
    this.setState({ loaded: true });
    data.forEach((object) => {
      switch (object.key) {
        case "twitter.displayName": {
          this.lastSettings.displayName = object.value;
          this.setState({ displayName: object.value });
          break;
        }
        case 'twitter.color': {
          this.lastSettings.color = object.value;
          this.setState({ color: object.value });
          break;
        }
        case 'twitter.bio': {
          this.lastSettings.bio = object.value;
          this.setState({ bio: object.value });
          break;
        }
        case 'twitter.lastUpdate': {
          this.lastSettings.lastUpdate = object.value;
          this.setState({ lastUpdate: object.value });
          break;
        }
      }
    });
    const avatarData = getAvatar(data);
    this.setState({ avatar: { data: avatarData } });
    this.lastSettings.avatar.data = avatarData;
  };
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1,
    });
  };
  
  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1,
    });
  };
  
  handleReset = () => {
    this.setState({
      activeStep: 0,
    });
  };
  
  handleColorChangeComplete = (color) => {
    this.setState({ color: color.hex + '80' });
  };
  
  getDataTxJson = () => {
    const lastUpdate = `${new Date().toISOString()}/${makeId(16)}`;
    this.setState({ lastUpdate: lastUpdate });
    const dtx = {
      sender: this.state.accountData.address,
      senderPublicKey: this.state.accountData.keyPair.publicKey,
      data: [
        {
          key: 'twitter.lastUpdate',
          value: DataTransaction.stringToBase58(lastUpdate),
          type: DataTransaction.DATA_ENTRY_TYPES.STRING
        }],
      feePerKb: 100000,
      timestamp: Date.now()
    };
    
    if (this.state.color !== this.lastSettings.color) {
      dtx.data.push(
        {
          key: 'twitter.color',
          value: this.state.color,
          type: DataTransaction.DATA_ENTRY_TYPES.STRING
        });
    }
    if (this.state.displayName !== this.lastSettings.displayName) {
      dtx.data.push(
        {
          key: 'twitter.displayName',
          value: this.state.displayName,
          type: DataTransaction.DATA_ENTRY_TYPES.STRING
        });
    }
    
    if (this.state.bio !== this.lastSettings.bio) {
      dtx.data.push(
        {
          key: 'twitter.bio',
          value: this.state.bio,
          type: DataTransaction.DATA_ENTRY_TYPES.STRING
        });
    }
    
    if (this.state.avatar.data !== this.lastSettings.avatar.data) {
      for (let index = 0; index < 96; index++) {
        dtx.data.push({
          key: 'twitter.avatar.' + index,
          value: this.state.avatar.data.slice(index * 1024, index * 1024 + 1024),
          type: DataTransaction.DATA_ENTRY_TYPES.STRING
        });
      }
    }
    return dtx;
  };
  
  getDataTxSnippet = () => {
    return `
const dataTx = {
	sender: '${this.state.accountData.address}',
	senderPublicKey: '${this.state.accountData.keyPair.publicKey}',
	data: [
		{
			key: 'twitter.displayName',
			value: '${DataTransaction.stringToBase64(this.state.displayName).toString()}',
			type: '${DataTransaction.DATA_ENTRY_TYPES.STRING}'
		},
		{
			key: 'twitter.avatar.0',
			value: '...',
			type: '${DataTransaction.DATA_ENTRY_TYPES.STRING}'
		},
		{
			key: 'twitter.color',
			value: '${DataTransaction.stringToBase64(this.state.color)}',
			type: '${DataTransaction.DATA_ENTRY_TYPES.STRING}'
		},
		{
			key: 'twitter.bio',
			value: '${DataTransaction.stringToBase64(this.state.bio)}',
			type: '${DataTransaction.DATA_ENTRY_TYPES.STRING}'
		},
		{
			key: 'twitter.lastUpdate',
			value: '${DataTransaction.stringToBase64(this.state.lastUpdate)}',
			type: '${DataTransaction.DATA_ENTRY_TYPES.STRING}'
		}
	],
	feePerKb: 100000,
	timestamp: ${Date.now()}
};`;
  };
  
  checkLastUpdateApplied = () => {
    const _this = this;
    this.setState({ waitingForSettingsUpdate: true });
    
    this.loadingInProgress = setInterval(() => {
      this.getDataFromAccount()
        .then((result) => {
          return result.json();
        })
        .then((jsonResult) => {
          jsonResult.forEach((object) => {
            if (object.key === 'twitter.lastUpdate'
              && DataTransaction.base58ToString(object.value) === _this.state.lastUpdate) {
              _this.setState({ waitingForSettingsUpdate: false, redirectToUsersList: true });
              clearInterval(_this.loadingInProgress);
            }
          });
        });
    }, 5000);
  };
  
  handleStart = () => {
    const dtx = new DataTransaction(this.getDataTxJson(), this.state.accountData.keyPair);
    dtx.broadcast()
      .then((data) => {
        this.lastSettings = {
          color: this.state.color,
          displayName: this.state.displayName,
          lastUpdate: this.state.lastUpdate,
          avatar: { data: this.state.avatar.data },
        }
      })
      .catch(console.log);
    this.setState({ waitingForSettingsUpdate: true });
    this.checkLastUpdateApplied();
  };
  
  getStepContent = (stepIndex) => {
    const { classes } = this.props;
    
    switch (stepIndex) {
      
      case 0:
      default:
        return (
          <div>
            <TextField
              id="name"
              label="Display name"
              className={classes.textField}
              value={this.state.displayName}
              onChange={this.handleChange('displayName')}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
            />
            <TextField
              id="name"
              label="BIO"
              className={classes.textField}
              value={this.state.bio}
              onChange={this.handleChange('bio')}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              multiline
            />
          </div>
        );
      case 1:
        return (
          <Grid container justify="center" spacing={16}>
            <Grid item xs={4} sm={4}>
              <Grid container justify="flex-start" alignItems="flex-start" direction="row">
                <Grid item>
                  <Avatar
                    alt="Avatar image"
                    src={this.state.avatar.data}
                  />
                </Grid>
                <Grid item style={{ marginLeft: 16 }}>
                  <Typography>
                    <strong>{this.state.displayName}</strong>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={8} sm={8}>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="twitter-avatar-image"
                type="file"
                onChange={(event) => {
                  this.changeAvatar(event)
                }}
              />
              <label htmlFor="twitter-avatar-image">
                <Button color="secondary" variant="raised" component="span">
                  Change avatar...
                </Button>
              </label>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Card className={classes.card} style={{ backgroundColor: this.state.color }}>
            <CardHeader
              className={classes.cardHeader}
              avatar={
                <Avatar aria-label="User"
                        alt="Avatar image"
                        src={this.state.avatar.data}
                        className={classes.avatar}>
                </Avatar>
              }
              action={
                <IconButton>
                  <ColorLens onClick={() => {
                    this.previousColor = this.state.color;
                    this.setState({ displayColorPicker: !this.state.displayColorPicker })
                  }}/>
                </IconButton>
              }
              title={this.state.displayName}
              subheader="October 16, 2097"
            />
            <CardContent>
              <Typography component="p">
                Your messages will look like this card. Every message should be less, than 100 kb.
                Unfortunately, there is no yet likes.
              </Typography>
            </CardContent>
            <CardActions className={classes.actions} disableActionSpacing>
              <IconButton aria-label="Add to favorites">
                <FavoriteIcon/>
              </IconButton>
              <IconButton aria-label="Share">
                <ShareIcon/>
              </IconButton>
            </CardActions>
          </Card>
        );
    }
  };
  
  changeAvatar = (e) => {
    const file = e.target.files[0];
    if (file.size / 1024 > 100) {
      alert('Image is too big (should be < 100 kb)');
      return;
    }
    const reader = new FileReader();
    const _this = this;
    reader.onloadend = function (e) {
      _this.setState({
        avatar: {
          data: reader.result
        }
      });
    };
    reader.readAsDataURL(file);
  };
  
  render() {
    const { classes } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    
    return (
      <Grid>
        <Typography>
          Let's set your user account settings and store them in Data Transaction.
        </Typography>
        <Grid container justify="center" className={classes.root} spacing={16}>
          <Grid item xs={6} sm={6}>
            
            {this.state.loaded && (<Card className={classes.card} elevation={4}>
              <CardContent>
                
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map(label => {
                    return (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>
                <div>
                  {this.state.activeStep === steps.length ? (
                    <div>
                      {
                        this.state.waitingForSettingsUpdate === false &&
                        (<div>
                          <Typography className={classes.instructions}>
                            All steps completed - you&quot;re finished. Click the "Start" button below to get started.
                            It will send the Data Transaction to the network.
                          </Typography>
                          
                          <Button onClick={this.handleReset}>Reset</Button>
                          <Button color="primary" onClick={this.handleStart}>Start</Button>
                        </div>)
                      }
                      {
                        this.state.waitingForSettingsUpdate === true &&
                        (<div>
                          <Typography className={classes.instructions}>
                            Alright! We're almost done. Now let's wait some time for settings update.
                            Usually it takes about 20 seconds. We will redirect you to the main page right after
                            updates will be applied.
                          </Typography>
                          <CircularProgress/>
                        </div>)
                      }
                      {
                        this.state.redirectToUsersList && <Redirect to="/twitter/users" push/>
                      }
                    </div>
                  ) : (
                    <div>
                      {this.getStepContent(activeStep)}
                      <div style={{ marginTop: '16px' }}>
                        <Button
                          disabled={activeStep === 0}
                          onClick={this.handleBack}
                          className={classes.backButton}
                        >
                          Back
                        </Button>
                        <Button variant="raised" color="primary" onClick={this.handleNext}>
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>)}
            {this.state.loaded === false && <CircularProgress size={50}/>}
          </Grid>
          {this.props.developersMode &&
          (<Grid item xs={6} sm={6}>
            <Card className={classes.card} elevation={4}>
              <CardContent>
                <SyntaxHighlighter justify="left" language="javascript" customStyle={{ 'textAlign': 'left' }}
                                   style={docco}>{this.getDataTxSnippet()}</SyntaxHighlighter>
              </CardContent>
            </Card>
          </Grid>)}
        </Grid>
        <Dialog
          open={this.state.displayColorPicker}
          onClose={this.handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <TwitterPicker
            triangle="hide"
            style={{ boxShadow: 'none' }} color={this.state.color} onChangeComplete={(color) => {
            this.handleColorChangeComplete(color);
          }}/>
          <DialogActions>
            <Button onClick={() => {
              this.setState({ color: this.previousColor });
              this.handleColorPickerClose();
            }} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleColorPickerClose} color="primary" autoFocus>
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    );
  }
}

TwitterSettings.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TwitterSettings);
