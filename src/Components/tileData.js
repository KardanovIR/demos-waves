import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import LaunchIcon from '@material-ui/icons/Launch';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Link } from 'react-router-dom'


export const mailFolderListItems = (
	<div>
		<Link to="/">
			<ListItem button>
				<ListItemIcon>
					<FingerprintIcon/>
				</ListItemIcon>
				<ListItemText primary="Web Auth API"/>
			</ListItem>
		</Link>
		<Link to="/payment-api">
			<ListItem button>
				<ListItemIcon>
					<AttachMoneyIcon/>
				</ListItemIcon>
				<ListItemText primary="Payment API"/>
			</ListItem>
		</Link>
	</div>
);

export const otherMailFolderListItems = (
	<div>
		<Link to="/data-transactions-leasing">
			<ListItem button>
				<ListItemIcon>
					<LaunchIcon/>
				</ListItemIcon>
				<ListItemText primary="Assets Leasing"/>
			</ListItem>
		</Link>
	</div>
);
