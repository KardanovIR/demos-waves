import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";


class RightInfoCard extends React.Component {
	
	state = {};
	
	render() {
		return (
			<Card
			      style={{ backgroundColor: this.state.color, marginBottom: '16px' }}>
				<CardContent>
					<Typography component="p">
						© 2018 Waves
					</Typography>
					<Typography component="p">
						<Link to='/twitter'>About</Link>&nbsp;
						<Link to='https://docs.wavesplatform.com'>Docs</Link>&nbsp;
						<Link to='https://forum.wavesplatform.com'>Forum</Link>
					</Typography>
				</CardContent>
			</Card>
		)
	}
	
}


export default RightInfoCard;