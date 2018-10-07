import React, { Component } from 'react';
import './App.css';
import PersistentDrawer from "./Components/RootContainer";
import theme from './settings/theme';
import { MuiThemeProvider } from "@material-ui/core";


const classesList = {
	root: "App",
	
};

class App extends Component {
	render() {
		return (
			<div className={classesList.root}>
				<MuiThemeProvider theme={theme}>
					<PersistentDrawer/>
				</MuiThemeProvider>
			</div>
		);
	}
}

export default App;
