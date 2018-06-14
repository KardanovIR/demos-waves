import React from "react";
import { IconButton } from "material-ui";
import { isLiked, unlikeMessage, likeMessage } from "./Helpers";
import FavoriteIcon from '@material-ui/icons/Favorite';

class LikeButton extends React.Component {
	
	state = {
		isLiked: false
	};
	
	toggleLike = (event) => {
		if (this.state.isLiked) {
			likeMessage(this.props.id, this.props.accountData);
		} else {
			unlikeMessage(this.props.id, this.props.accountData);
		}
		this.setState({ isLiked: !this.state.isLiked });
		event.preventDefault();
		return false;
	};
	
	
	componentWillMount() {
		isLiked(this.props.id, this.props.accountData)
			.then((res) => {
				return res.json()
			})
			.then((jsonRes) => {
				this.setState({ isLiked: jsonRes.value });
			})
		;
	}
	
	render() {
		return (
			<IconButton onClick={this.toggleLike} color={this.state.isLiked ? "primary" : "default"}
			            aria-label="Add to favorites">
				<FavoriteIcon/>
			</IconButton>
		)
	}
	
}


export default LikeButton;