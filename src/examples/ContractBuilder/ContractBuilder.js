import React from 'react';
import PropTypes from "prop-types";
import {
    Typography,
    Grid, Divider,
    withStyles, Button,
    IconButton,
    FormControl, InputLabel, MenuItem, Select,
    Drawer, AppBar, Tabs, Tab, TextField,
} from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import ShowContract from '@material-ui/icons/ListAltOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';


const styles = theme => ({
    card: {
        minWidth: 275,
        marginBottom: '16px'
    },
    iframe: {
        border: 0,
        width: '100%',
        height: '100%',
        minHeight: 550
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

function TabContainer({ children, dir }) {
    return (
      <div component="div" dir={dir} style={{ padding: 8 * 3, paddingBottom: 80 }}>
          {children}
      </div>
    );
}


class ContractBuilder extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            key: 'demoKey',
            importOpen: false,
            propertiesOpen: true,
            selectedTab: 0,
            pride: {
                key: "",
                variables: [],
                conditions: []
            },
            selectedItemShape: null,
            selectedItemData: {
                name: ''
            },
            selectedConnectorRules: []
        }
    }
    
    handleTabChange = (event, value) => {
        this.setState({ selectedTab: value });
    };
    
    handleTabChangeIndex = index => {
        this.setState({ selectedTab: index });
    };
    
    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };
    
    handleRuleTypeChange = (index) => event => {
        const pride = this.state.pride;
        pride.conditions[index].type = event.target.value;
        console.log(pride.conditions);
        this.setState({
            pride: pride,
        });
    }
    
    handleVariableNameChange = (index) => event => {
        const pride = this.state.pride;
        pride.variables[index].key = event.target.value;
        this.setState({
            pride: pride,
        });
    };
    
    handleRuleNameChange = (index) => event => {
        const pride = this.state.pride;
        pride.conditions[index].name = event.target.value;
        this.setState({
            pride: pride,
        });
    };
    
    handleSelectedItemNameChange = () => event => {
        const _data = this.state.selectedItemData;
        _data.name = event.target.value;
        const iframe = document.getElementById('graph-frame');
        iframe.contentWindow.receiveMessage({
            action: 'changeSelectedItemName',
            value: event.target.value
        });
        this.setState({
            selectedItemData: _data,
        });
    };
    
    removeSelected = () => event => {
        const iframe = document.getElementById('graph-frame');
        iframe.contentWindow.receiveMessage({
            action: 'removeSelected'
        });
        this.setState({
            selectedItemShape: null,
            selectedItemData: null,
        });
    };
    
    handleVariableValueChange = (index) => event => {
        const pride = this.state.pride;
        pride.variables[index].value = event.target.value
        this.setState({
            pride: pride,
        });
    };
    
    addVariable = event => {
        const pride = this.state.pride;
        pride.variables.push({
            key: `key${pride.variables.length}`,
            value: ''
        });
        this.setState({
            pride: pride
        });
    };
    
    addRule = event => {
        const pride = this.state.pride;
        pride.conditions.push({
            name: `rule-${pride.conditions.length}`,
            type: 'One signature',
            value: null
        });
        this.setState({
            pride: pride
        });
    };
    
    removeVariable = index => event => {
        const pride = this.state.pride;
        pride.variables.splice(index, 1);
        this.setState({
            pride: pride
        });
    };
    
    removeRule = index => event => {
        const pride = this.state.pride;
        pride.conditions.splice(index, 1);
        this.setState({
            pride: pride
        });
    };
    
    receiveMessage = (data) => {
        if (data && data.origin === 'mx' && data.object) {
            
            let connectorRules = [];
            if (data.object.shape === 'connector') {
                connectorRules = data.object.name.split(' && ');
            }
            
            this.setState({
                selectedItemShape: data.object.shape,
                selectedItemData: data.object,
                selectedConnectorRules: connectorRules
            });
        }
    };
    
    handleSelectedTransitionChange = index => event => {
        const connectorRules = this.state.selectedConnectorRules;
        connectorRules[index] = event.target.value;
        this.setState({
            selectedConnectorRules: connectorRules
        }, () => {
            this.setTransitionName();
        });
    };
    
    removeConnectorRule = (index) => {
        return () => {
            const connectorRules = this.state.selectedConnectorRules;
            connectorRules.splice(index, 1);
            this.setState({
                selectedConnectorRules: connectorRules
            }, () => {
                this.setTransitionName();
            });
        };
    };
    
    addConnectorRule = () => {
        const connectorRules = this.state.selectedConnectorRules;
        connectorRules.push('');
        console.log(connectorRules);
        
        this.setState({
            selectedConnectorRules: connectorRules.slice(0)
        }, () => {
            this.setTransitionName();
        });
    };
    
    setTransitionName = () => {
        const iframe = document.getElementById('graph-frame');
        iframe.contentWindow.receiveMessage({
            action: 'changeSelectedItemName',
            value: this.state.selectedConnectorRules.join(' && ')
        });
    };
    
    renderConnectorRules = () => {
        return (
          <div>
              {
                  this.state.selectedConnectorRules.map((value, index) => {
                      console.log('Rendering rules', value, index, this.state.selectedConnectorRules);
                      return (<div key={index}>
                            <FormControl style={{
                                width: '80%'
                            }}>
                                <Select
                                  value={value}
                                  onChange={this.handleSelectedTransitionChange(index)}
                                >
                                    {
                                        this.state.pride.conditions.map(cond => {
                                            return <MenuItem value={cond.name}>{cond.name}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <IconButton
                              aria-label="Delete"
                              onClick={this.removeConnectorRule(index)}>
                                <DeleteIcon/>
                            </IconButton>
                        </div>
                      )
                  })
              }
              <Button color="primary" size="small" onClick={this.addConnectorRule}
                      variant="contained"
                      style={{
                          marginTop: 24,
                          marginBottom: 12,
                          marginLeft: 'auto',
                          marginRight: 12
                      }}>
                  <AddIcon/>
                  Add condition
              </Button>
              <Button color="secondary" size="small" onClick={this.removeSelected}
                      variant="contained"
                      style={{
                          marginTop: 24,
                          marginBottom: 12,
                          marginLeft: 'auto'
                      }}>
                  <DeleteIcon/>
                  Delete transition
              </Button>
          </div>
        )
    };
    
    showContract = () => {
        const ideWindow = window.open('https://ide.wavesplatform.com', '_blank');
        ideWindow.postMessage({
            command: 'CREATE_NEW_CONTRACT',
            label: `${this.state.key}-contract`,
            code: 'true'
        }, '*');
    };
    
    render() {
        
        window.receiveMessage = this.receiveMessage;
        
        
        const { classes } = this.props;
        
        return (
          <Grid style={{ height: '95%' }}>
              <Grid container justify="center" className={classes.root} spacing={16} style={{ height: '95%' }}>
                  <Grid item xs={8} sm={8} style={{
                      height: '100%'
                  }}>
                      <iframe
                        id='graph-frame'
                        src={`${window.location.protocol}//${window.location.hostname}/contractBuilder/index.html`}
                        className={classes.iframe}/>
                  </Grid>
                  <Grid item xs={4} sm={4}>
                  </Grid>
              </Grid>
              
              <Drawer
                variant="permanent"
                anchor="right"
                open={this.state.propertiesOpen}
                classes={{
                    paper: classes.drawerPaper,
                }}
                style={{
                    position: 'relative',
                    width: '35%',
                    zIndex: 99,
                    textAlign: 'left',
                    minWidth: 350,
                    paddingTop: 60
                }}
                PaperProps={{
                    style: {
                        width: '35%',
                        zIndex: 99,
                        textAlign: 'left',
                        minWidth: 350,
                        paddingTop: 60
                    }
                }}
              >
                  <AppBar position="static" color="default">
                      <Tabs
                        value={this.state.selectedTab}
                        onChange={this.handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        fullWidth
                      >
                          <Tab label="Main"/>
                          <Tab label="Variables"/>
                          <Tab label="Rules"/>
                      </Tabs>
                  </AppBar>
                  <SwipeableViews
                    axis={'x'}
                    index={this.state.selectedTab}
                    onChangeIndex={this.handleTabChangeIndex}
                  >
                      <TabContainer>
                          <Button disabled={true} style={{ marginRight: 10 }} variant="outlined" color="secondary"
                                  size="small"
                                  className={classes.button}>
                              <CloudUploadIcon style={{ marginRight: 10 }}/>
                              Upload model...
                          </Button>
                          <Button variant="contained" size="small" color="primary" className={classes.button}>
                              <SaveIcon style={{ marginRight: 10 }}/>
                              Download model
                          </Button>
                          <Divider style={{ marginTop: 16, marginBottom: 16 }}/>
                          <Button style={{ marginRight: 10 }} variant="contained" color="secondary" size="small"
                                  className={classes.button} onClick={this.showContract}>
                              <ShowContract style={{ marginRight: 10 }}/>
                              Open contract
                          </Button>
                          <Button disabled={true} size="small" color="primary" className={classes.button}>
                              <SendIcon style={{ marginRight: 10 }}/>
                              Deploy contract
                          </Button>
                          <Divider style={{ marginTop: 16 }}/>
                          
                          <TextField
                            id="key"
                            helperText="State key name"
                            className={classes.textField}
                            value={this.state.key}
                            onChange={this.handleChange('pride.key')}
                            margin="normal"
                            variant="outlined"
                          />
                          <Divider style={{ marginTop: 16, marginBottom: 16 }}/>
                          {this.state.selectedItemShape &&
                          <Typography>{this.state.selectedItemShape === 'rectangle' ? 'State' : 'Transition'}: {this.state.selectedItemData.name}</Typography>}
                          {
                              this.state.selectedItemShape === 'rectangle' && (
                                <div>
                                    <TextField
                                      id="key"
                                      className={classes.textField}
                                      value={this.state.selectedItemData.name}
                                      onChange={this.handleSelectedItemNameChange()}
                                      margin="normal"
                                      variant="outlined"
                                    />
                                    <Button color="secondary" size="small" onClick={this.removeSelected()}
                                            variant="contained" className={classes.button}
                                            style={{
                                                marginTop: 24,
                                                marginBottom: 12,
                                                marginLeft: 'auto'
                                            }}>
                                        Delete
                                        <DeleteIcon className={classes.rightIcon}/>
                                    </Button>
                                </div>
                              )
                              
                          }
                          {
                              this.state.selectedItemShape === 'connector' && this.renderConnectorRules()
                          }
                      </TabContainer>
                      <TabContainer>
                          {
                              this.state.pride.variables.map((variable, index) => {
                                  return (
                                    <div
                                      key={`var${index}`}
                                      style={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                      }}>
                                        <TextField
                                          helperText="Name"
                                          value={variable.key}
                                          onChange={this.handleVariableNameChange(index)}
                                          margin="normal"
                                          style={{
                                              maxWidth: '35%'
                                          }}
                                        />
                                        <TextField
                                          helperText="Value"
                                          style={{ marginLeft: 16 }}
                                          value={variable.value}
                                          onChange={this.handleVariableValueChange(index)}
                                          margin="normal"
                                        />
                                        <IconButton
                                          style={{
                                              marginTop: 24
                                          }}
                                          className={classes.button} aria-label="Delete"
                                          onClick={this.removeVariable(index)}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </div>
                                  );
                              })
                          }
                          <Button variant="contained" size="small" color="primary" onClick={this.addVariable}
                                  className={classes.button}>
                              <AddIcon style={{ marginRight: 10 }}/>
                              Add variable
                          </Button>
                      </TabContainer>
                      <TabContainer style={{
                          paddingBottom: 60
                      }}>
                          
                          {
                              this.state.pride.conditions.map((condition, index) => {
                                  console.log(condition);
                                  const ruleId = `rule-${index}`;
                                  return (
                                    <div key={ruleId}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', }}>
                                            <TextField
                                              helperText="Name"
                                              value={condition.name}
                                              onChange={this.handleRuleNameChange(index)}
                                              margin="normal"
                                              style={{
                                                  maxWidth: '47%'
                                              }}
                                            />
                                            <FormControl
                                              style={{
                                                  width: '50%',
                                                  marginTop: 16,
                                                  marginLeft: 10
                                              }}>
                                                <Select
                                                  fullWidth={true}
                                                  value={condition.type}
                                                  onChange={this.handleRuleTypeChange(index)}
                                                  inputProps={{
                                                      name: 'age',
                                                      id: ruleId,
                                                  }}
                                                >
                                                    <MenuItem value="One signature">One signature</MenuItem>
                                                    <MenuItem value="Multiple signatures">Multiple signatures</MenuItem>
                                                    <MenuItem value="Oracle data">Oracle data</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {
                                                condition.type === 'One signature' && (
                                                  <FormControl
                                                    style={{
                                                        width: '100%',
                                                        marginTop: 16,
                                                        marginLeft: 10
                                                    }}>
                                                      <TextField
                                                        id={ruleId}
                                                        style={{ margin: 8 }}
                                                        placeholder="Public key"
                                                        helperText="Value"
                                                        fullWidth
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                      />
                                                  </FormControl>
                                                )
                                            }
                                            {
                                                condition.type === 'Multiple signatures' && (
                                                  [0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                                                      return <TextField
                                                        key={ruleId + `_${index}`}
                                                        id={ruleId + `_${index}`}
                                                        style={{ margin: 8 }}
                                                        placeholder={`Public key ${index + 1}`}
                                                        helperText={`Public key ${index + 1}`}
                                                        fullWidth
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                      />
                                                  })
                                                )
                                            }
                                            {
                                                condition.type === 'Oracle data' && (
                                                  <div>
                                                      <TextField
                                                        id={ruleId + `-address`}
                                                        style={{ margin: 8 }}
                                                        placeholder="Address"
                                                        helperText="Address"
                                                        fullWidth
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                      />
                                                      <TextField
                                                        id={ruleId + `-key`}
                                                        style={{ margin: 8 }}
                                                        placeholder="Key"
                                                        helperText="Key"
                                                        fullWidth
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                      />
                                                      <TextField
                                                        id={ruleId + `-value`}
                                                        style={{ margin: 8 }}
                                                        placeholder="Value"
                                                        helperText="Value"
                                                        fullWidth
                                                        margin="normal"
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                      />
                                                  </div>
                                                )
                                            }
                                            <Button color="secondary" size="small" onClick={this.removeRule(index)}
                                                    variant="contained" className={classes.button}
                                                    style={{
                                                        marginTop: 24,
                                                        marginBottom: 12,
                                                        marginLeft: 'auto'
                                                    }}>
                                                Delete {condition.name}
                                                <DeleteIcon className={classes.rightIcon}/>
                                            </Button>
                                        </div>
                                        <Divider/>
                                    </div>
                                  );
                              })
                          }
                          <div style={{ marginTop: 10 }}>
                              <Button variant="contained" size="small" color="primary" onClick={this.addRule}
                                      className={classes.button}>
                                  <AddIcon style={{ marginRight: 10 }}/>
                                  Add rule
                              </Button>
                          </div>
                      </TabContainer>
                  </SwipeableViews>
              
              </Drawer>
          </Grid>
        );
    }
}

ContractBuilder.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ContractBuilder);
