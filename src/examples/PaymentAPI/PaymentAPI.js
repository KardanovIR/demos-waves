import React from 'react';
import PropTypes from "prop-types";
import {
	Button,
  withStyles,
	Card,
	Typography,
	CardContent,
	Grid,
	TextField,
	FormControlLabel, Dialog, DialogTitle, DialogActions
} from "material-ui";
import Switch from "material-ui/Switch/Switch";
import DialogContent from "material-ui/Dialog/DialogContent";
import DialogContentText from "material-ui/Dialog/DialogContentText";


const WavesAPI = require('@waves/waves-api');

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
		wordBreak: 'break-all'
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
	hidden: {
		display: 'none'
	}
});


class WebAuthAPI extends React.Component {
	state = {
		assetId: 'WAVES',
		recipient: '3P24yQNpVUS76hY8pVWBByspEayy19YAWWh',
		referrer: window.location.origin + '/payment-success',
		amount: '1.000',
		strict: false,
		response: '',
		openSuccessDialog: false
	};
	
	constructor(props) {
		super(props);
	}
	
	getPaymentLink = () => {
		return `https://client.wavesplatform.com/#send/${this.state.assetId}?recipient=${this.state.recipient}&amount=${this.state.amount}&referrer=${this.state.referrer}${this.state.strict ? '&strict' : ''}`;
	};
	
	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};
	
	handleSwitchChange = name => event => {
		this.setState({ [name]: event.target.checked });
	};
	
	openPayWindow = () => {
		window.open(this.getPaymentLink(), '_blank', null, false);
	};
	
	handleOpenInExplorer = () => {
		const txId = this.getJsonFromUrl(this.state.response).txId;
		const url = `https://wavesexplorer.com/tx/${txId}`;
		window.open(url, '_blank');
	};
	
	receiveSuccess = (message) => {
		if (message.origin !== window.location.origin) return false;
		if (message.data.updateResponseUrl !== true) return false;
		this.setState({ response: message.data.url, openSuccessDialog: true });
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
	
	handleDialogClose = () => {
		this.setState({ openSuccessDialog: false });
	};
	
	render() {
		const { classes } = this.props;
		window.addEventListener("message", this.receiveSuccess, false);
		
		return (
			<Grid>
				<Grid container justify="center" className={classes.root} spacing={16}>
					<Grid item xs={8} sm={8}>
						<Typography>
							This demo project shows how to use Payment API for donations. We offer you to donate <a
							href="https://medium.com/wavesgo-educationfund/wavesgo-education-fund-d9e6149e0f70" target="_blank">WavesGo
							Education Fund.</a>
						</Typography>
						<Typography>
							Payment API allows creating a special link for avoiding users' seed input on 3-party sites.
						</Typography>
					
					</Grid>
				</Grid>
				<Grid container alignItems="center" direction="row" justify="center" spacing={16}>
					<Grid className={this.props.developersMode ? '' : 'hidden'}
					      item xs={6} sm={6}>
						<Card className={classes.card}>
							<CardContent>
								<Typography className={classes.title} color="textSecondary">
									Construct a proper URL and open it
								</Typography>
								<Grid container justify="center">
									<form className={classes.container} noValidate autoComplete="off">
										<TextField
											id="referrer"
											label="Referrer"
											className={classes.textField}
											value={this.state.referrer}
											onChange={this.handleChange('referrer')}
											fullWidth
											disabled
											margin="normal"
										/>
										<TextField
											id="recipient"
											label="Recipient"
											className={classes.textField}
											value={this.state.recipient}
											onChange={this.handleChange('recipient')}
											fullWidth
											disabled
											margin="normal"
										/>
										<TextField
											id="assetId"
											label="Asset ID"
											className={classes.textField}
											value={this.state.assetId}
											onChange={this.handleChange('assetId')}
											fullWidth
											margin="normal"
										/>
										<TextField
											id="amount"
											label="Amount"
											value={this.state.amount}
											className={classes.textField}
											onChange={this.handleChange('amount')}
											fullWidth
											margin="normal"
										/>
										<FormControlLabel
											control={
												<Switch
													checked={this.state.debug}
													onChange={this.handleSwitchChange('strict')}
													value="false"
													color="primary"
												/>
											}
											label="Strict mode (user can't change amount value)"
										/>
									</form>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={6} sm={6} className={classes.paper}>
						<Card className={classes.card} elevation={4}>
							<CardContent>
								<Typography style={{ wordBreak: 'break-all' }} className={classes.code}>
									{this.getPaymentLink()}
								</Typography>
							</CardContent>
						</Card>
						<Card className={classes.card} elevation={4}>
							<CardContent>
								<Button size="small" variant="raised" color="primary" onClick={this.openPayWindow}>Pay with
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
				<Dialog
					fullScreen={false}
					open={this.state.openSuccessDialog}
					onClose={this.handleDialogClose}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle id="responsive-dialog-title">Thank you!</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Congratulations and thank you! We appreciate your contribution to the development of our community
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleOpenInExplorer} color="primary" autoFocus>
							Show in explorer
						</Button>
						<Button onClick={this.handleDialogClose} color="primary">
							Close
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>
		);
	}
}

WebAuthAPI.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(WebAuthAPI);
