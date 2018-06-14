import React from 'react';
import PropTypes from "prop-types";
import {
	Typography,
  withStyles,
	Grid,
} from "material-ui";

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
		'wordBreak': 'break-all'
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
	}
});

class VotingInit extends React.Component {
	
	
	constructor(props) {
		super(props);
	}
	
	
	render() {
		const { classes } = this.props;
		
		return (
			<Grid>
				<Grid container justify="center" className={classes.root} spacing={16}>
					<Grid item xs={8} sm={8}>
						<Typography>
							Voting is one of classical problems, which can get better with blockchain and underlying technologies.
						</Typography>
						<Typography>
							Blockchain makes voting process more transparent and reliable. At the same time, there are a lot of hard problems with blockchain scalability in terms of votings and polls.
						</Typography>
						<Typography>
							This example shows use case of <strong>Data transactions</strong> for a voting mechanics.
							Only holders of <strong>Waves Community Token</strong> can take part in
						</Typography>
						<Typography>
							Main idea is
						</Typography>
					
					</Grid>
				</Grid>
			</Grid>
		);
	}
}

VotingInit.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};

export default withStyles({}, { withTheme: true })(VotingInit);
