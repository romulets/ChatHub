import React from 'react';
import { Link } from 'react-router-dom'
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ReportIcon from '@material-ui/icons/Report';

export const mailFolderListItems = (
  <div>
    <Link to="/projects">
      <ListItem button>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Projetos" />
      </ListItem>
    </Link>
  </div>
);

export const otherMailFolderListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <ReportIcon />
      </ListItemIcon>
      <ListItemText primary="Atualizar Dados" />
    </ListItem>
  </div>
);