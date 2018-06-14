import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Drawer, withStyles, AppBar} from 'material-ui';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import { BrowserRouter as Router, Link } from 'react-router-dom'
import WebAuthAPI from "../examples/WebAuth/WebAuthAPI";
import { Route } from "react-router";
import WebAuthAPISuccess from "../examples/WebAuth/WebAuthAPISuccess";
import { FormControlLabel, Snackbar, Switch } from "material-ui";
import PaymentAPI from "../examples/PaymentAPI/PaymentAPI";
import PaymentAPISuccess from "../examples/PaymentAPI/PaymentAPISuccess";
import TwitterInit from "../examples/Twitter/TwitterInit";
import TwitterSettings from "../examples/Twitter/TwitterSettings";
import TwitterUsersList from "../examples/Twitter/TwitterUsersList";
import TwitterUser from "../examples/Twitter/TwitterUser";
import TwitterFeed from "../examples/Twitter/TwitterFeed";

const drawerWidth = 250;

const styles = theme => ({
	root: {
		flexGrow: 1,
	},
	appFrame: {
		zIndex: 1,
		// overflow: 'scroll',
		// position: 'relative',
		display: 'flex',
		width: '100%',
	},
	appBar: {
		position: 'absolute',
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	'appBarShift-left': {
		marginLeft: drawerWidth,
	},
	'appBarShift-right': {
		marginRight: drawerWidth,
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 20,
	},
	hide: {
		display: 'none',
	},
	drawerPaper: {
		position: 'relative',
		width: drawerWidth,
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	'content-left': {
		marginLeft: -drawerWidth,
	},
	'content-right': {
		marginRight: -drawerWidth,
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	'contentShift-left': {
		marginLeft: 0,
	},
	'contentShift-right': {
		marginRight: 0,
	},
	'developersModeLabel': {
		color: '#fff',
		alignContent: 'flex-end',
		textTransform: 'uppercase'
	},
	flex: {
		flex: 1,
	},
	
});

class RootContainer extends React.Component {
	state = {
		open: false,
		anchor: 'left',
		developersMode: true
	};
	
	
	constructor(props) {
		super(props);
		this.showSnackbar = this.showSnackbar.bind(this);
	}
	
	handleDrawerOpen = () => {
		this.setState({ open: true });
	};
	
	handleDrawerClose = () => {
		this.setState({ open: false });
	};
	
	handleChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	
	
	showSnackbar(text) {
		this.setState({ snackbarText: text });
	}
	
	handleSnackbarClose() {
		this.setState({ snackbarOpen: false });
	};
	
	
	render() {
		const { classes, theme } = this.props;
		const { anchor, open } = this.state;
		
		const drawer = (
			<Drawer
				variant="persistent"
				anchor={anchor}
				open={open}
				classes={{
					paper: classes.drawerPaper,
				}}
			>
				<div className={classes.drawerHeader}>
					<Link to="/">
						<span
							dangerouslySetInnerHTML={{ __html: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"130\" height=\"28\" viewBox=\"0 0 130 28\" style=\"display: block;\"><path fill=\"#000\" d=\"M30.25 6.76l.26.36-6.1 18.93-.43.37h-3.89l-.43-.37-4.39-13.55h-.08l-4.37 13.55-.43.37H6.54l-.43-.37L0 7.12l.26-.36h3.88l.4.36 3.93 13.3h.08l4.38-13.3.4-.35h4l.4.35 4.4 13.46 3.94-13.44.4-.37h3.79zm39.37 0l-.43.35-5.38 14-5.33-14-.48-.33h-3.89l-.23.35 7.65 19 .45.36h3.53l.45-.36 7.73-19-.23-.35h-3.84zm21.44 2.42a10.89 10.89 0 0 1 2.59 7.56v.57l-.36.36h-14.5a5.6 5.6 0 0 0 1.78 3.81 5.54 5.54 0 0 0 3.89 1.56A4.5 4.5 0 0 0 89 20.39l.5-.36h3.58l.28.37a8.42 8.42 0 0 1-3.48 4.89 9.15 9.15 0 0 1-5.34 1.51 9.39 9.39 0 0 1-7.12-2.9 10.19 10.19 0 0 1-2.74-7.29 10.53 10.53 0 0 1 2.65-7.18 8.75 8.75 0 0 1 6.83-3 8.9 8.9 0 0 1 6.9 2.75zm-1.72 5a5.08 5.08 0 0 0-5.17-4 5.31 5.31 0 0 0-5.13 4zM50.92 6.76l.36.36v18.95l-.36.36h-3.28l-.36-.36V24h-.12a6.82 6.82 0 0 1-1.91 1.63c-.19.12-.4.22-.61.32a8.24 8.24 0 0 1-3.61.78 8.48 8.48 0 0 1-6.44-2.93 10.34 10.34 0 0 1-2.7-7.27 10.34 10.34 0 0 1 2.7-7.27A8.48 8.48 0 0 1 41 6.37a8.13 8.13 0 0 1 3.62.79 4.85 4.85 0 0 1 .57.31 6.91 6.91 0 0 1 2 1.69l.06-.08v-2l.36-.36h3.28zm-3.84 7.93a5.89 5.89 0 0 0-1.46-2.83 5.32 5.32 0 0 0-4-1.75 5 5 0 0 0-3.81 1.76 6.59 6.59 0 0 0-1.68 4.71 6.54 6.54 0 0 0 1.68 4.71 4.93 4.93 0 0 0 3.8 1.71 5.26 5.26 0 0 0 4-1.75 5.83 5.83 0 0 0 1.46-2.83zm60 .37s-2.15-.45-3.92-.85-2.43-.84-2.43-2 1.18-2.24 3.7-2.24 3.83 1.11 3.83 2.07l.43.37h3.58l.28-.36c0-2.56-2.22-5.65-8-5.65-6.06 0-8 3.56-8 5.86 0 1.93.7 4.2 5.34 5.28l4 .89c2 .47 2.87 1.14 2.87 2.33s-1.07 2.37-3.87 2.37c-2.6 0-4.18-1.25-4.24-2.73l-.45-.36h-3.63l-.28.37c.34 3.3 2.78 6.39 8.62 6.39 6.61 0 8-4 8-6.15-.06-2.83-1.68-4.65-5.79-5.59z\"></path><path fill=\"#0056ff\" d=\"M116.45 6.77l6.774-6.774 6.774 6.774-6.774 6.774z\"></path></svg>" }}>
					</span>
					</Link>
					<IconButton onClick={this.handleDrawerClose}>
						{theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
					</IconButton>
				</div>
				<Divider/>
				<List>{mailFolderListItems}</List>
				<Divider/>
				<List>{otherMailFolderListItems}</List>
			</Drawer>
		);
		
		
		return (
			<Router>
				<div className={classes.root}>
					<div className={classes.appFrame}>
						<AppBar
							style={{ backgroundColor: theme.palette.primary }}
							className={classNames(classes.appBar, {
								[classes.appBarShift]: open,
								[classes[`appBarShift-${anchor}`]]: open,
								flexGrow: 1,
								flex: 1
							})}
						>
							<Toolbar disableGutters={!open}>
								<IconButton
									color="inherit"
									aria-label="open drawer"
									onClick={this.handleDrawerOpen}
									className={classNames(classes.menuButton, open && classes.hide)}
								>
									<MenuIcon/>
								</IconButton>
								<Typography variant="title" color="inherit" noWrap className={classes.flex}>
									Waves demos
								</Typography>
								<FormControlLabel value="Developers mode" classes={{ label: classes.developersModeLabel }} control={
									<Switch
										checked={this.state.developersMode}
										onChange={this.handleChange('developersMode')}
										value="true"
										color="secondary"
									/>
								} label="Developers mode"/>
							
							</Toolbar>
						</AppBar>
						{drawer}
						<main
							className={classNames(classes.content, classes[`content-${anchor}`], {
								[classes.contentShift]: open,
								[classes[`contentShift-${anchor}`]]: open,
							})}
						>
							<div className={classes.drawerHeader}/>
							
							{/*Web Auth API*/}
							<Route exact path='/' render={(props) => (
								<WebAuthAPI {...props} developersMode={this.state.developersMode}/>
							)}/>
							<Route path="/web-auth-success" component={WebAuthAPISuccess}/>
							
							{/*<Route path="/data-transactions-leasing" component={DataTransactionsLeasing} developersMode={this.state.developersMode}/>*/}
							
							{/*Payment API */}
							<Route exact path='/payment-api' render={(props) => (
								<PaymentAPI {...props} developersMode={this.state.developersMode}/>
							)}/>
							<Route exact path='/payment-success' render={(props) => (
								<PaymentAPISuccess {...props} developersMode={this.state.developersMode}/>
							)}/>
							
							
							<Route exact path='/twitter' render={(props) => (
								<TwitterInit {...props} developersMode={this.state.developersMode} showSnackbar={this.showSnackbar}/>
							)}/>
							
							<Route exact path='/twitter/settings' render={(props) => (
								<TwitterSettings {...props} developersMode={this.state.developersMode} showSnackbar={this.showSnackbar}/>
							)}/>
							
							<Route exact path='/twitter/users' render={(props) => (
								<TwitterUsersList {...props} developersMode={this.state.developersMode} showSnackbar={this.showSnackbar}/>
							)}/>
							
							<Route exact path='/twitter/user/:address' render={(props) => (
								<TwitterUser {...props} developersMode={this.state.developersMode} showSnackbar={this.showSnackbar}/>
							)}/>
							
							<Route exact path='/twitter/my/feed' render={(props) => (
								<TwitterFeed {...props} developersMode={this.state.developersMode} showSnackbar={this.showSnackbar}/>
							)}/>
							
							
							{/*<Route path="/voting" component={VotingInit} developersMode={this.state.developersMode}/>*/}
							{/*<Route path="/voting/create" component={VotingCreate} developersMode={this.state.developersMode}/>*/}
							{/*<Route path="/voting/vote" component={VotingVote} developersMode={this.state.developersMode}/>*/}
							{/*<Route path="/voting/results" component={VotingResults} developersMode={this.state.developersMode}/>*/}
						</main>
						<Snackbar
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left'
							}}
							open={this.state.snackbarOpen}
							onClose={this.handleSnackbarClose}
							message={<span id="message-id">{this.state.snackbarText}</span>}
							SnackbarContentProps={{
								'aria-describedby': 'message-id',
							}}
						/>
					</div>
				</div>
			</Router>
		);
	}
}

RootContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(RootContainer);
