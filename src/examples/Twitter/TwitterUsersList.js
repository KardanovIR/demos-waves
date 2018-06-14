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
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/styles/hljs';
import constants from "../../settings/constants";
import { getAvatar } from './Helpers';
import DataTransaction from './DataTransaction';
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";


class TwitterUsersList extends React.Component {
	
	state = {
		loaded: false,
		users: []
	};
	
	
	constructor(props) {
		super(props);
		const accountData = JSON.parse(window.localStorage.getItem('waves.accountData'));
		const address = accountData.address;
		if (!address) {
			window.location.href = '/twitter';
		}
		this.state = {
			loaded: false,
			users: [],
			accountData: accountData
		};
		
		this.getUsersList()
			.then((res) => {
				return res.json();
			})
			.then(this.processTxList)
			.catch(err => {
				console.log(err);
			})
	}
	
	getTransactionsListUrl = () => {
		return `${constants.TESTNET_NODES_BASE_URL}/transactions/address/${constants.CENTRAL_ADDRESS}/limit/10000`
	};
	
	getAddressDataUrl = (address) => {
		return `${constants.TESTNET_NODES_BASE_URL}/addresses/data/${address}`
	};
	
	getUsersList = () => {
		const url = this.getTransactionsListUrl();
		return fetch(url);
	};
	
	processTxList = (txs) => {
		txs = txs[0];
		const usersFiltering = {};
		txs.forEach((tx) => {
			if (tx.type === 4
				&& tx.recipient === constants.CENTRAL_ADDRESS
				&& tx.assetId === constants.TWITTER_COIN_ID
				&& tx.amount === 1
			) {
				usersFiltering[tx.sender] = true;
			}
		});
		const usersList = Object.keys(usersFiltering).map((key) => {
			return { address: key };
		});
		this.getDataForUsers(usersList);
	};
	
	getDataForUsers = (usersList) => {
		const fetchTasks = [];
		usersList.forEach((user) => {
			const url = this.getAddressDataUrl(user.address);
			fetchTasks.push(
				fetch(url)
					.then(res => res.json())
					.then(jsonRes => {
						return {
							address: user.address,
							data: jsonRes
						};
					})
					.catch()
			);
		});
		this.parseUsersData(fetchTasks);
	};
	
	parseDataEntries = (user) => {
		let stateData = {
			displayName: user.address,
			color: '',
			bio: '',
			isActive: false
		};
		
		user.data.forEach(object => {
			switch (object.key) {
				case  'twitter.lastUpdate': {
					stateData.isActive = true;
					break;
				}
				case  'twitter.displayName': {
					stateData.displayName = object.value;
					break;
				}
				case  'twitter.bio': {
					stateData.bio = object.value;
					break;
				}
				case  'twitter.color': {
					stateData.color = object.value;
					break;
				}
			}
		});
		if (stateData.isActive) {
			stateData.avatar = getAvatar(user.data);
		}
		return stateData;
	};
	
	parseUsersData = (fetchTasks) => {
		Promise.all(fetchTasks)
			.then(usersDataJson => {
				let users = [];
				usersDataJson.forEach(user => {
					const parsedUser = this.parseDataEntries(user);
					if (parsedUser.isActive) {
						parsedUser.address = user.address;
						users.push(parsedUser);
					}
				});
				this.setState({ users: users, loaded: true });
			})
			.catch(console.error);
	};
	
	getDataFromAccount = () => {
		return fetch(`${constants.TESTNET_NODES_BASE_URL}/addresses/data/${this.state.accountData.address}`)
	};
	
	render() {
		const { classes } = this.props;
		
		return (
			<Grid>
				<Grid container justify="center" className={classes.root} spacing={16}>
					<Grid item xs={6} sm={6}>
						
						{
							this.state.loaded &&
							this.state.users.map(user => {
								
								return (
									<Card className={classes.card} key={user.address}
									      style={{ backgroundColor: this.state.color, marginBottom: '16px' }}>
										<CardHeader
											avatar={
												<Link to={"/twitter/user/" + user.address}>
													<Avatar aria-label="User"
													        alt="Avatar image"
													        src={user.avatar}
													        style={{ cursor: 'pointer' }}
													        className={classes.avatar}>
													</Avatar>
												</Link>
											}
											action={
												<FollowButton userAddress={user.address} accountData={this.state.accountData}/>
											}
											title={<Link to={`/twitter/user/${user.address}`}>{user.displayName}</Link>}
											subheader="October 16, 2097"
										/>
										<CardContent>
											<Typography component="p">
												{user.bio}
											</Typography>
										</CardContent>
									</Card>
								);
							})}
						{this.state.loaded === false && <CircularProgress size={50}/>}
					</Grid>
					{this.props.developersMode && (
						<Grid item xs={6} sm={6}>
							<Card className={classes.card} elevation={4}>
								<CardContent>
									To get list of users we will parse all transactions on one main address, which was used on very first
									step. To get all transactions we will make request to an address
									<SyntaxHighlighter justify="left" language="javascript" customStyle={{ 'textAlign': 'left' }}
									                   style={docco}>{this.getTransactionsListUrl()}</SyntaxHighlighter>
								</CardContent>
							</Card>
							<Card className={classes.card} elevation={4}>
								<CardContent>
									Along with user data and posts we also save in data transactions subscriptions and favorites.
									Data schemes are shown below:
									<SyntaxHighlighter justify="left" language="javascript" customStyle={{ 'textAlign': 'left' }}
									                   style={docco}>
										{`
{key: 'twitter.post.{TIMESTAMP}-{ID}', type: 'string', value: '...'}
{key: 'twitter.sub.{ADDRESS}', type: 'boolean', value: true}
{key: 'twitter.like.{ADDRESS}@{TIMESTAMP}-{ID}', type: 'boolean', value: true}
										`}
									</SyntaxHighlighter>
								</CardContent>
							</Card>
						</Grid>)}
				</Grid>
			</Grid>
		);
	}
}

TwitterUsersList.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles({}, { withTheme: true })(TwitterUsersList);
