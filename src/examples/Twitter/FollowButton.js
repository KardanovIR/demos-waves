import React from "react";
import { Button } from "@material-ui/core";
import { subscribeToUser, unsubscribeFromUser, isSubscribed } from "./Helpers";


class FollowButton extends React.Component {
	
	state = {
		isSubscribed: false
	};
	
	toggleSubscription = (event) => {
		if (this.state.isSubscribed) {
			subscribeToUser(this.props.accountData, this.props.userAddress);
		} else {
			unsubscribeFromUser(this.props.accountData, this.props.userAddress);
		}
		this.setState({ isSubscribed: !this.state.isSubscribed });
		event.preventDefault();
		return false;
	};
	
	
	componentWillMount() {
		isSubscribed(this.props.accountData.address, this.props.userAddress)
			.then((res) => {
				return res.json()
			})
			.then((jsonRes) => {
				this.setState({ isSubscribed: jsonRes.value });
			})
		;
	}
	
	render() {
		return (
			<Button color="primary" className={this.props.class} onClick={this.toggleSubscription}
			        style={{ position: 'sticky', right: '10px' }}>
				{this.state.isSubscribed ? 'Unfollow' : 'Follow'}
			</Button>
		
		)
	}
	
}


export default FollowButton;