import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#0056FF',
			contrastText: '#fff',
		},
		secondary: {
			main: '#f1edff'
		},
	},
});

export default theme;