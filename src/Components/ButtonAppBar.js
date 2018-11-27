import React from "react";
import PropTypes from 'prop-types';

import { AppBar, Button, withStyles, IconButton, Toolbar, Typography } from "material-ui";
import MenuIcon from '@material-ui/icons/Menu';


const styles = theme => ({
	root: {
		flexGrow: 1,
	}
	,
	flex: {
		flex: 1,
	}
	,
	menuButton: {
		marginLeft: -12,
		marginRight:
			20,
	}
	,
	input: {
		display: 'none',
	}
	,
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	}
	,
});


function ButtonAppBar(props) {
	const { classes } = props;
	return (
			<AppBar position="absolute">
				<Toolbar>
					<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
						<MenuIcon/>
					</IconButton>
					<Typography variant="title" color="inherit" className={classes.flex}>
						Waves demos
					</Typography>
				</Toolbar>
			</AppBar>
	);
}

ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);