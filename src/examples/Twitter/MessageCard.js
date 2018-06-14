import React from "react";
import {
	Avatar, Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
  withStyles,
	Dialog, DialogActions, DialogContent, DialogTitle,
	IconButton, LinearProgress, Slide, TextField,
	Typography
} from "material-ui";
import { Link } from "react-router-dom";
import Linkify from 'react-linkify';
import ShareIcon from '@material-ui/icons/Share';
import constants from "../../settings/constants";
import LikeButton from '../Twitter/LikeButton';
import { getMessageKey, sendTweet } from "./Helpers";
import RetweetCard from "./RetweetCard";

const styles = theme => ({
	messageAvatar: {
		borderWidth: '2px',
		borderColor: '#fff',
		borderStyle: 'solid',
		backgroundColor: '#fff',
		borderRadius: '99px',
		width: 25,
		height: 25
	},
	media: {
		height: 0,
		paddingTop: '56.25%', // 16:9
	},
	cardHeader: {
		textAlign: 'left',
	},
	cardContent: {
		textAlign: 'left'
	}
});

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class MessageCard extends React.Component {
	
	state = {
		retweetOpen: false
	};
	
	constructor(props) {
		super(props);
		const accountData = JSON.parse(window.localStorage.getItem('waves.accountData'));
		
		this.state = {
			retweetOpen: false,
			post: this.props.post,
			retweet: false,
			newMessage: '',
			accountData: accountData
		}
	}
	
	handleClickOpen = () => {
		this.setState({ retweetOpen: true });
	};
	
	handleClose = () => {
		this.setState({ retweetOpen: false });
	};
	
	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};
	
	getDataFromAccount = () => {
		return fetch(`${constants.TESTNET_NODES_BASE_URL}/addresses/data/${this.state.accountData.address}`)
	};
	
	
	handleRetweet = (ref) => {
		if (this.state.sendLoading) return;
		const message = this.state.newMessage;
		
		this.setState({ sendLoading: true });
		const _this = this;
		const messageKey = getMessageKey();
		sendTweet(messageKey, message, this.state.accountData, ref)
			.then(() => {
				this.loadingInProgress = setInterval(() => {
					_this.getDataFromAccount()
						.then((result) => {
							return result.json();
						})
						.then((jsonResult) => {
							jsonResult.forEach((object) => {
								if (object.key === messageKey) {
									_this.setState({
										sendLoading: false,
										newMessage: '',
										retweetOpen: false
									});
									this.props.refresh();
									clearInterval(_this.loadingInProgress);
								}
							});
						});
				}, 2000);
			})
			.catch((err) => {
				_this.setState({ sendLoading: false });
			});
	};
	
	render() {
		let { classes } = this.props;
		if (!classes) classes = {};
		const ref = `${this.props.post.user.address}@${this.props.post.timestamp}-${this.props.post.id}`;
		const messageId = `twitter.like.${ref}`;
		return (
			<div>
				<Card key={this.state.post.address}>
					<CardHeader
						className={classes.cardHeader}
						avatar={
							<Avatar aria-label="User"
							        alt="Avatar image"
							        src={this.state.post.user.avatar}
							        onClick={
								        () => {
									        this.state.history.push("/twitter/user/" + this.state.post.user.address)
								        }
							        }
							        style={{ cursor: 'pointer' }}
							        className={classes.messageAvatar}>
							</Avatar>
						}
						action={this.state.retweet !== true && (<CardActions className={classes.actions} disableActionSpacing>
							<LikeButton id={messageId} accountData={this.state.accountData}/>
							<IconButton aria-label="Share" onClick={this.handleClickOpen}>
								<ShareIcon/>
							</IconButton>
						</CardActions>)}
						title={<Link to={`/twitter/user/${this.state.post.user.address}`}>{this.state.post.user.displayName}</Link>}
						subheader={this.state.post.dateTime}
					/>
					{this.state.post.image
					&& <CardMedia
						className={classes.media}
						image={this.state.post.image}
					/>}
					<CardContent className={classes.cardContent}>
						<Typography component="p">
							<Linkify properties={{ target: '_blank' }}>{this.state.post.message}</Linkify>
						</Typography>
						{this.state.post.ref && (<RetweetCard messageId={this.state.post.ref}/>)}
					</CardContent>
				</Card>
				{this.state.retweet !== true &&
				(<Dialog
					open={this.state.retweetOpen}
					maxWidth={'sm'}
					fullWidth={true}
					TransitionComponent={Transition}
					keepMounted
					onClose={this.handleClose}
				>
					<DialogTitle>
						{"Retweet message from " + this.state.post.user.displayName}
					</DialogTitle>
					<DialogContent>
						{this.state.sendLoading && <LinearProgress/>}
						<TextField
							id="new-message"
							InputLabelProps={{
								shrink: true,
							}}
							value={this.state.newMessage}
							onChange={this.handleChange('newMessage')}
							placeholder="Your comment"
							helperText={this.state.newMessage.length + '/800'}
							fullWidth
							disabled={this.state.sendLoading}
							multiline
							margin="normal"
						/>
						<Card key={this.state.post.address}>
							<CardHeader
								avatar={
									<Avatar aria-label="User"
									        alt="Avatar image"
									        src={this.state.post.user.avatar}
									        onClick={
										        () => {
											        this.state.history.push("/twitter/user/" + this.state.post.address)
										        }
									        }
									        style={{ cursor: 'pointer' }}
									        className={classes.messageAvatar}>
									</Avatar>
								}
								title={<Link
									to={`/twitter/user/${this.state.post.user.address}`}>{this.state.post.user.displayName}</Link>}
								subheader={this.state.post.dateTime}
							/>
							{this.state.post.image
							&& <CardMedia
								className={classes.media}
								image={this.state.post.image}
								title=""
							/>}
							<CardContent className={classes.cardContent}>
								<Typography component="p">
									<Linkify properties={{ target: '_blank' }}>{this.state.post.message}</Linkify>
								</Typography>
							</CardContent>
						</Card>
					</DialogContent>
					<DialogActions>
						<Button onClick={this.handleClose} color="primary">
							Cancel
						</Button>
						<Button disabled={this.state.sendLoading} onClick={() => {
							this.handleRetweet(ref);
						}} color="primary">
							Retweet
						</Button>
					</DialogActions>
				</Dialog>)}
			</div>
		)
	}
	
}

export default withStyles(styles, { withTheme: true })(MessageCard);

