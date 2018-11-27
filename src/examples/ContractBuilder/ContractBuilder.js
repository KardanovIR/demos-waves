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
import PrideGenerator from './PrideGenerator.js'
import PrideParser from './PrideParser.js'
import Menu from "@material-ui/core/Menu/Menu";


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

const ONE_SIGNATURE = 'One signature';
const MULTI_SIGNATURE = 'Multiple signatures';
const ORACLE_DATA = 'Oracle data';

function TabContainer({children, dir}) {
    return (
        <div component="div" dir={dir} style={{padding: 8 * 3, paddingBottom: 80}}>
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
                key: "demoKey",
                variables: [],
                conditions: [],
                raw: null
            },
            selectedItemShape: null,
            selectedItemData: {
                name: ''
            },
            selectedConnectorRules: []
        }
    }

    handleTabChange = (event, value) => {
        this.setState({selectedTab: value});
    };

    handleTabChangeIndex = index => {
        this.setState({selectedTab: index});
    };

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleRuleTypeChange = (index) => event => {
        const pride = this.state.pride;
        pride.conditions[index].type = event.target.value;
        switch (event.target.value) {
            case ONE_SIGNATURE: {
                pride.conditions[index].value = '';
                break;
            }
            case MULTI_SIGNATURE: {
                pride.conditions[index].values = ['', '', '', '', '', '', '', ''];
                break;
            }
            case ORACLE_DATA: {
                pride.conditions[index].data = {
                    key: '',
                    value: '',
                    comparison: ''
                };
                break;
            }
        }
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
        pride.variables[index].value = event.target.value;
        this.setState({
            pride: pride,
        });
    };

    handleOneSignatureValueChange = (index) => event => {
        const pride = this.state.pride;
        pride.conditions[index].value = event.target.value;
        this.setState({
            pride: pride,
        });
    };

    handleMultiSignatureValueChange = (index, pkIndex) => event => {
        const pride = this.state.pride;
        console.log(index, pkIndex, pride);
        pride.conditions[index].values[pkIndex] = event.target.value;
        this.setState({
            pride: pride,
        });
    };

    handleOracleChange = (index, field) => event => {
        const pride = this.state.pride;
        pride.conditions[index].data[field] = event.target.value;
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
            type: ONE_SIGNATURE,
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

    openRulesTab = () => {
        this.handleTabChange(null, 1);
        this.handleTabChangeIndex(1);
    };

    getJsonModel = (cb) => {
        const iframe = document.getElementById('graph-frame');

        const pride = this.state.pride;
        const raw = JSON.parse(iframe.contentWindow.getModelJson());
        pride.raw = raw;
        this.setState({
            pride: pride
        }, function () {
            if (cb) cb();
        });
        return raw;
    };

    getPlainContract = () => {
        const modelJson = this.getJsonModel();
        const prideGenerator = new PrideGenerator(modelJson, {
            ...this.state.pride
        });
        const prideJson = prideGenerator.getJson();
        const prideParser = new PrideParser({
            content: prideJson,
            debug: true
        });
        return prideParser.generateContract()
    };

    downloadModel = () => {
        const contract = this.getPlainContract();
        this.getJsonModel(() => {
            const blob = new Blob([JSON.stringify({
                model: this.state.pride,
                contract: contract
            })], {type: "application/json;charset=utf-8"});
            window.saveAs(blob, `contract-${this.state.pride.key}.json`);
        })
    };

    renderConnectorRules = () => {
        return (
            <div>
                {
                    this.state.pride.conditions.length > 0 && this.state.selectedConnectorRules.map((value, index) => {
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
                {
                    this.state.pride.conditions.length === 0 && (
                        <React.Fragment>
                            <Typography>
                                <Button color="primary" onClick={this.openRulesTab}>Create rules</Button> to add as
                                transition
                                condition</Typography>
                        </React.Fragment>
                    )
                }
                {
                    this.state.pride.conditions.length > 0 && (
                        <React.Fragment>
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
                        </React.Fragment>
                    )
                }
                <Button color="secondary" size="small" onClick={this.removeSelected()}
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

    sendCreateContractCommand = (ideWindow) => {
        ideWindow.postMessage({
            command: 'CREATE_NEW_CONTRACT',
            label: `${this.state.key}-contract`,
            code: this.getPlainContract()
        }, '*');
    };

    saveModel = () => {

    };

    showContractInIDE = () => {
        const ideWindow = window.open('https://ide.wavesplatform.com', '_blank');
        const intervalRef = window.setInterval(() => {
            this.sendCreateContractCommand(ideWindow);
        }, 500);
        window.addEventListener('message', (message) => {
            if (message && message.data && message.data.command === 'CREATE_NEW_CONTRACT' && message.data.status === 'OK') {
                window.clearInterval(intervalRef);
            }
        });
    };

    openLocalMenu = (event) => {
        this.setState({
            localMenuOpen: true,
            localMenuAnchorEl: event.currentTarget
        });
    };

    closeLocalMenu = () => {
        this.setState({
            localMenuOpen: false,
        });
    };

    saveModelInLocalStorage = (event) => {
        this.closeLocalMenu(event);
        this.getJsonModel(() => {
            window.localStorage.setItem('prideModel', {
                pride: this.state.pride
            });
        });
    };

    handleKeyChange = (name) => (event) => {
        const pride = this.state.pride;
        pride.key = event.target.value;
        this.setState({
            pride: pride
        });
    };


    restoreModelFromLocalStorage = (event) => {
        this.closeLocalMenu(event);
    };

    render() {

        window.receiveMessage = this.receiveMessage;
        window.setModelJson = this.setModelJson;


        const {classes} = this.props;

        return (
            <Grid style={{height: '95%'}}>
                <Grid container justify="center" className={classes.root} spacing={16} style={{height: '95%'}}>
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
                            <Tab label="Rules"/>
                            <Tab label="Variables"/>
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        axis={'x'}
                        index={this.state.selectedTab}
                        onChangeIndex={this.handleTabChangeIndex}
                    >
                        <TabContainer>
                            <Button disabled={true} style={{marginRight: 10}} variant="outlined" color="secondary"
                                    size="small"
                                    className={classes.button}>
                                <CloudUploadIcon style={{marginRight: 10}}/>
                                Upload model...
                            </Button>
                            <Button variant="contained" size="small" color="primary" className={classes.button}
                                    onClick={this.downloadModel}>
                                <SaveIcon style={{marginRight: 10}}/>
                                Download model
                            </Button>
                            <Divider style={{marginTop: 16, marginBottom: 16}}/>
                            <Button style={{marginRight: 10}} variant="contained" color="secondary" size="small"
                                    className={classes.button} onClick={this.showContractInIDE}>
                                <ShowContract style={{marginRight: 10}}/>
                                Open contract
                            </Button>
                            <Button disabled={true} size="small" color="primary" className={classes.button}>
                                <SendIcon style={{marginRight: 10}}/>
                                Deploy contract
                            </Button>
                            <React.Fragment>
                                <Button
                                    aria-owns={this.state.localMenuOpen ? 'render-props-menu' : null}
                                    aria-haspopup="true"
                                    onClick={this.openLocalMenu}
                                >
                                    Local
                                </Button>
                                <Menu id="render-props-menu" anchorEl={this.state.localMenuAnchorEl}
                                      open={this.state.localMenuOpen} onClose={this.closeLocalMenu}>
                                    <MenuItem onClick={this.saveModelInLocalStorage}>Save</MenuItem>
                                    <MenuItem onClick={this.restoreModelFromLocalStorage}>Restore</MenuItem>
                                </Menu>
                            </React.Fragment>
                            <Divider style={{marginTop: 16}}/>

                            <TextField
                                id="key"
                                helperText="State key name"
                                className={classes.textField}
                                value={this.state.pride.key}
                                onChange={this.handleKeyChange('key')}
                                margin="normal"
                                variant="outlined"
                            />
                            <Divider style={{marginTop: 16, marginBottom: 16}}/>
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
                                            Delete state
                                        </Button>
                                    </div>
                                )

                            }
                            {
                                this.state.selectedItemShape === 'connector' && this.renderConnectorRules()
                            }
                        </TabContainer>
                        <TabContainer style={{
                            paddingBottom: 60
                        }}>

                            {
                                this.state.pride.conditions.map((condition, index) => {
                                    const ruleId = `rule-${index}`;
                                    return (
                                        <div key={ruleId}>
                                            <div style={{display: 'flex', flexWrap: 'wrap',}}>
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
                                                        <MenuItem value={ONE_SIGNATURE}>{ONE_SIGNATURE}</MenuItem>
                                                        <MenuItem value={MULTI_SIGNATURE}>{MULTI_SIGNATURE}</MenuItem>
                                                        <MenuItem value={ORACLE_DATA}>{ORACLE_DATA}</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {
                                                    condition.type === ONE_SIGNATURE && (
                                                        <FormControl
                                                            style={{
                                                                width: '100%',
                                                                marginTop: 16,
                                                                marginLeft: 10
                                                            }}>
                                                            <TextField
                                                                id={ruleId}
                                                                style={{margin: 8}}
                                                                placeholder="Public key"
                                                                helperText="Public key"
                                                                fullWidth
                                                                value={condition.value}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                onChange={this.handleOneSignatureValueChange(index)}
                                                            />
                                                        </FormControl>
                                                    )
                                                }
                                                {
                                                    condition.type === MULTI_SIGNATURE && (
                                                        condition.values.map((value, pkIndex) => {

                                                            return <TextField
                                                                key={ruleId + `_${pkIndex}`}
                                                                id={ruleId + `_${pkIndex}`}
                                                                style={{margin: 8}}
                                                                placeholder={`Public key ${pkIndex + 1}`}
                                                                helperText={`Public key ${pkIndex + 1}`}
                                                                fullWidth
                                                                value={value}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                onChange={this.handleMultiSignatureValueChange(index, pkIndex)}
                                                            />
                                                        })
                                                    )
                                                }
                                                {
                                                    condition.type === ORACLE_DATA && (
                                                        <div>
                                                            <TextField
                                                                id={ruleId + `-address`}
                                                                style={{margin: 8}}
                                                                placeholder="Address"
                                                                helperText="Address"
                                                                fullWidth
                                                                value={condition.data.address}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                onChange={this.handleOracleChange(index, 'address')}
                                                            />
                                                            <TextField
                                                                id={ruleId + `-key`}
                                                                style={{margin: 8}}
                                                                placeholder="Key"
                                                                helperText="Key"
                                                                fullWidth
                                                                margin="normal"
                                                                value={condition.data.key}
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                onChange={this.handleOracleChange(index, 'key')}
                                                            />
                                                            <TextField
                                                                id={ruleId + `-value`}
                                                                style={{margin: 8}}
                                                                placeholder="Value"
                                                                helperText="Value"
                                                                fullWidth
                                                                value={condition.value}
                                                                margin="normal"
                                                                InputLabelProps={{
                                                                    shrink: true,
                                                                }}
                                                                onChange={this.handleOracleChange(index, 'value')}
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
                            <div style={{marginTop: 10}}>
                                <Button variant="contained" size="small" color="primary" onClick={this.addRule}
                                        className={classes.button}>
                                    <AddIcon style={{marginRight: 10}}/>
                                    Add rule
                                </Button>
                            </div>
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
                                                style={{marginLeft: 16}}
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
                                <AddIcon style={{marginRight: 10}}/>
                                Add variable
                            </Button>
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

export default withStyles(styles, {withTheme: true})(ContractBuilder);
