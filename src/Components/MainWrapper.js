import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { mailFolderListItems, otherMailFolderListItems } from './tileData';
import { Typography } from "material-ui";

const styles = (theme) => ({
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3,
		minWidth: 0, // So the Typography noWrap works
	},
	toolbar: theme.mixins.toolbar,
});

function MainWrapper(props) {
	const { classes } = props;
	
	return (
		<main className={classes.content}>
			<div className={classes.toolbar}/>
			<Typography noWrap>{'You think water moves fast? You should see ice.'}</Typography>
		</main>
	);
}

MainWrapper.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainWrapper);
