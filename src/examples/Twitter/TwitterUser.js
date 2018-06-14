import React from 'react';
import PropTypes from "prop-types";
import {
	Card,
	Typography,
	CardContent,
	Grid,
	CircularProgress,
	Avatar,
  withStyles,
	CardHeader,
} from "material-ui";
import TwitterUserPosts from './TwitterUserPosts';
import FollowButton from "./FollowButton";
import { tweetsCompare } from "./Helpers";

import MessageCard from "./MessageCard";
import RightInfoCard from "./RightInfoCard";


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


class TwitterUser extends React.Component {
	
	state = {
		loaded: true,
		user: {},
		posts: [],
		alias: ''
	};
	
	constructor(props) {
		super(props);
		const accountData = JSON.parse(window.localStorage.getItem('waves.accountData'));
		const address = accountData.address;
		if (!address) {
			window.location.href = '/twitter';
		}
		this.state = {
			loaded: true,
			accountData: accountData,
			address: address,
			user: {},
			posts: [],
			alias: '',
			userAddress: this.props.match.params.address,
			isSubscribed: false
		};
	}
	
	getFullColor() {
		if (this.state.user.color) {
			return this.state.user.color.substr(0, 7);
		} else {
			return '#0053fd';
		}
	}
	
	componentWillMount() {
		const userPosts = new TwitterUserPosts(this.props.match.params.address);
		
		userPosts
			.getAllData()
			.then(result => {
				console.log(result);
				this.setState({
					loaded: true,
					user: { ...result.user },
					posts: result.posts
				});
			});
		
		userPosts
			.getAlias()
			.then(alias => {
				console.log(alias);
				this.setState({
					alias: alias
				});
			});
		
	}
	
	render() {
		const { classes } = this.props;
		
		return (
			<Grid>
				<Grid container className={classes.root} spacing={16}>
					{
						this.state.loaded &&
						(
							<Grid item xs={4} sm={4}>
								<Card className='profile-card-wrapper'>
									<CardHeader
										className={classes.cardHeader}
										classes={{
											content: classes.cardHeaderContent,
											subheader: classes.cardHeaderSubheader
										}}
										avatar={
											<Avatar aria-label="User"
											        alt="Avatar image"
											        src={this.state.user.avatar}
											        className={classes.avatar}>
											</Avatar>
										}
										action={
											<FollowButton userAddress={this.state.address} accountData={this.state.accountData}/>
										}
										title={this.state.user.displayName}
										subheader={this.state.alias}
									/>
									<CardContent>
										<Typography component="p">
											{this.state.user.bio}
										</Typography>
									</CardContent>
									<style>
										{`.profile-card-wrapper:before{background-color: ${this.getFullColor()}}`}
									</style>
								</Card>
							</Grid>
						)}
					{this.state.loaded && this.state.posts.length === 0
					&& (
						<Grid item xs={6} sm={6}>
							<Card className={classes.card}
							      style={{ backgroundColor: this.state.color, marginBottom: '16px' }}>
								<CardContent>
									Whoops. There are no posts from {this.state.user.displayName} yet.
								</CardContent>
							</Card>
						</Grid>
					)}
					
					{this.state.loaded && this.state.posts.length > 0 && (
						<Grid item xs={6} sm={6}>
							<Grid container direction="column">
								{this.state.posts.sort(tweetsCompare).map(post => {
									return <MessageCard post={post} key={post.id}/>
								})}
							</Grid>
						</Grid>
					)}
					{this.state.loaded && (
						<Grid item xs={2} sm={2}>
							<RightInfoCard/>
						</Grid>
					)}
					{this.state.loaded === false && <CircularProgress size={50}/>}
				</Grid>
			</Grid>
		);
	}
}

TwitterUser.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TwitterUser);
