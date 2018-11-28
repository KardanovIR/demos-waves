import React from "react";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  withStyles,
  Typography
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Linkify from 'react-linkify';
import TwitterUserPosts from "./TwitterUserPosts";

const styles = theme => ({
  messageAvatar: {
    borderWidth: '2px',
    borderColor: '#fff',
    borderStyle: 'solid',
    backgroundColor: '#fff',
    borderRadius: '99px',
    width: 25,
    height: 25
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  cardHeader: {
    textAlign: 'left',
    paddingBottom: 0
  },
  cardContent: {
    textAlign: 'left'
  },
  card: {
    boxShadow: 'none',
    border: 'solid 1px #e6ecf0'
  }
});

class RetweetCard extends React.Component {
  
  state = {};
  
  constructor(props) {
    super(props);
    
    this.state = {
      post: { user: {} },
    }
  }
  
  
  componentWillMount = () => {
    if (this.props.messageId !== undefined) {
      const messageIdParts = this.props.messageId.split('@');
      const address = messageIdParts[0];
      const message = messageIdParts[1];
      const userPosts = new TwitterUserPosts(address);
      userPosts
        .getAllData()
        .then(result => {
          let found = false;
          result.posts.forEach(post => {
            if (`${post.timestamp}-${post.id}` === message) {
              this.setState({ post: post });
              found = true;
            }
          });
          if (!found) {
            this.setState({ cantFind: true });
          }
        });
    }
  };
  
  render() {
    let { classes } = this.props;
    if (!classes) classes = {};
    return (
      <div>
        {this.state.cantFind !== true &&
        (<Card key={this.props.messageId} className={classes.card}>
          <CardHeader
            className={classes.cardHeader}
            avatar={
              <Avatar aria-label="User"
                      alt="Avatar image"
                      src={this.state.post.user.avatar}
                      onClick={
                        () => {
                          this.state.history.push("/twitter/user/" + this.state.post.user.address)
                        }
                      }
                      style={{ cursor: 'pointer' }}
                      className={classes.messageAvatar}>
              </Avatar>
            }
            title={<Link to={`/twitter/user/${this.state.post.user.address}`}>{this.state.post.user.displayName}</Link>}
            subheader={this.state.post.dateTime}
          />
          {this.state.post.image
          && <CardMedia
            className={classes.media}
            image={this.state.post.image}
          />}
          <CardContent className={classes.cardContent}>
            <Typography component="p">
              <Linkify properties={{ target: '_blank' }}>{this.state.post.message}</Linkify>
            </Typography>
          </CardContent>
        </Card>)
        }
      </div>
    )
  }
  
}

export default withStyles(styles, { withTheme: true })(RetweetCard);

