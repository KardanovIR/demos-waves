import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SuperVisorIcon from '@material-ui/icons/SupervisorAccount';
import ViewAgendaIcon from '@material-ui/icons/ViewAgenda';
import WebAssetIcon from '@material-ui/icons/WebAsset';
import { Link } from 'react-router-dom'


export const mailFolderListItems = (
	<div>
		<Link to="/" className="no-underline">
			<ListItem button>
				<ListItemIcon>
					<FingerprintIcon/>
				</ListItemIcon>
				<ListItemText primary="Web Auth API"/>
			</ListItem>
		</Link>
		<Link to="/payment-api" className="no-underline">
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
		<Link to="/twitter" className="no-underline">
			<ListItem button>
				<ListItemIcon>
					<AccountCircleIcon/>
				</ListItemIcon>
				<ListItemText primary="Twitter Setup"/>
			</ListItem>
		</Link>
		<Link to="/twitter/users" className="no-underline">
			<ListItem button>
				<ListItemIcon>
					<SuperVisorIcon/>
				</ListItemIcon>
				<ListItemText primary="Twitter Users"/>
			</ListItem>
		</Link>
		<Link to="/twitter/my/feed" className="no-underline">
			<ListItem button>
				<ListItemIcon>
					<ViewAgendaIcon/>
				</ListItemIcon>
				<ListItemText primary="Twitter My Feed"/>
			</ListItem>
		</Link>
	</div>
);

export const toolsItems = (
	<div>
		<Link to="/example/console" className="no-underline">
			<ListItem button>
				<ListItemIcon>
					<WebAssetIcon/>
				</ListItemIcon>
				<ListItemText primary="Console"/>
			</ListItem>
		</Link>
		<Link to="/example/contract-builder" className="no-underline">
			<ListItem button>
				<ListItemIcon>
					<WebAssetIcon/>
				</ListItemIcon>
				<ListItemText primary="Contracts builder"/>
			</ListItem>
		</Link>
		
	</div>
);
