import React from 'react';
import { withStyles } from "material-ui/styles/index";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Typography,
  CardContent,
  Grid,
  CircularProgress,
  Avatar,
  CardHeader, TextField, LinearProgress, Tabs, Tab,
} from "material-ui";
import TwitterUserPosts from './TwitterUserPosts';
import { sendTweet, getMessageKey, tweetsCompare } from "./Helpers";
import constants from "../../settings/constants";
import MessageCard from "./MessageCard";
import RightInfoCard from "./RightInfoCard";


const styles = theme => ({
  root: {
    width: '90%',
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  code: {
    'wordBreak': 'break-all'
  },
  sendButton: {
    float: 'right',
    marginBottom: '5px'
  },
  avatar: {
    top: '-30px',
    borderWidth: '2px',
    borderColor: '#fff',
    borderStyle: 'solid',
    backgroundColor: '#fff',
    borderRadius: '99px',
    width: 60,
    height: 60
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
  
  cardHeader: {
    textAlign: 'left',
    paddingTop: '10px'
  },
  cardHeaderContent: {
    maxWidth: 'calc(100% - 150px)'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  }
  
});

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}


class TwitterFeed extends React.Component {
  
  state = {
    loaded: true,
    user: {},
    posts: [],
    alias: '',
    newMessage: ''
  };
  
  
  constructor(props) {
    super(props);
    const accountData = JSON.parse(window.localStorage.getItem('waves.accountData'));
    if (!accountData) {
      window.location.href = '/twitter';
    }
    const address = accountData.address;
    if (!address) {
      window.location.href = '/twitter';
    }
    this.address = address;
    this.state = {
      accountData: accountData,
      address: address,
      messages: [],
      loaded: true,
      user: {},
      posts: [],
      likedPosts: [],
      alias: '',
      selectedFeed: 0,
      newMessage: '',
      sendLoading: false
    };
  }
  
  getFullColor() {
    if (this.state.user.color) {
      return this.state.user.color.substr(0, 7);
    } else {
      return '#0053fd';
    }
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };
  
  handleTabChange = (event, value) => {
    this.setState({
      selectedFeed: value
    });
  };
  
  
  getSubsPosts = (subs) => {
    subs.forEach(address => {
      if (address === this.address) return;
      const userPosts = new TwitterUserPosts(address);
      userPosts
        .getAllData()
        .then(result => {
          const allPosts = this.state.posts;
          allPosts.push(...result.posts);
          allPosts.sort(tweetsCompare);
          this.setState({
            posts: allPosts
          })
        });
      
    });
  };
  
  getLikedPosts = (liked) => {
    liked.forEach(tweetId => {
      const messageIdParts = tweetId.split('@');
      const address = messageIdParts[0];
      const message = messageIdParts[1];
      if (address === 'undefined') return;
      const userPosts = new TwitterUserPosts(address);
      userPosts
        .getAllData()
        .then(result => {
          const likedPosts = this.state.likedPosts;
          result.posts.forEach(post => {
            if (`${post.timestamp}-${post.id}` === message) {
              likedPosts.push(post);
            }
          });
          likedPosts.sort(tweetsCompare);
          this.setState({ likedPosts: likedPosts });
        });
    });
  };
  
  componentWillMount() {
    this.refresh();
  }
  
  getDataFromAccount = () => {
    return fetch(`${constants.TESTNET_NODES_BASE_URL}/addresses/data/${this.state.accountData.address}`)
  };
  
  refresh = () => {
    const userPosts = new TwitterUserPosts(this.address);
    userPosts
      .getAllData()
      .then(result => {
        this.setState({
          posts: result.posts,
          user: result.user,
          subs: result.subs,
          liked: result.liked
        });
        this.getSubsPosts(result.subs);
        this.getLikedPosts(result.liked);
      });
    
    userPosts
      .getAlias()
      .then(alias => {
        console.log(alias);
        this.setState({
          alias: alias
        });
      });
  };
  
  sendMessage = (message) => {
    this.setState({ sendLoading: true });
    const _this = this;
    const messageKey = getMessageKey();
    sendTweet(messageKey, message, this.state.accountData)
      .then(() => {
        this.loadingInProgress = setInterval(() => {
          _this.getDataFromAccount()
            .then((result) => {
              return result.json();
            })
            .then((jsonResult) => {
              jsonResult.forEach((object) => {
                if (object.key === messageKey) {
                  _this.setState({ sendLoading: false, newMessage: '' });
                  clearInterval(_this.loadingInProgress);
                  _this.refresh();
                }
              });
            });
        }, 2000);
      })
      .catch((err) => {
        _this.setState({ sendLoading: false });
      })
  };
  
  handleSend = () => {
    if (this.state.sendLoading) return;
    this.sendMessage(this.state.newMessage);
  };
  
  render() {
    const { classes } = this.props;
    return (
      <Grid>
        <Grid container className={classes.root} spacing={16}>
          {
            this.state.loaded &&
            (
              <Grid item xs={4} sm={4}>
                <Card className='profile-card-wrapper'>
                  <CardHeader
                    className={classes.cardHeader}
                    classes={{
                      content: classes.cardHeaderContent
                    }}
                    avatar={
                      <Avatar aria-label="User"
                              alt="Avatar image"
                              src={this.state.user.avatar}
                              className={classes.avatar}>
                      </Avatar>
                    }
                    title={this.state.user.displayName}
                    subheader={this.state.alias}
                  />
                  <CardContent>
                    <Typography component="p">
                      {this.state.user.bio}
                    </Typography>
                  </CardContent>
                  <style>
                    {`.profile-card-wrapper:before{background-color: ${this.getFullColor()}}`}
                  </style>
                </Card>
              </Grid>
            )}
          {this.state.loaded && (
            <Grid item xs={6} sm={6}>
              <Grid container direction="column">
                <Grid item>
                  <Card className={classes.card}
                        style={{ marginBottom: '16px' }}>
                    {this.state.sendLoading && <LinearProgress/>}
                    <CardContent>
                      <TextField
                        id="new-message"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={this.state.newMessage}
                        onChange={this.handleChange('newMessage')}
                        placeholder="What's happening?"
                        helperText={this.state.newMessage.length + '/800'}
                        fullWidth
                        disabled={this.state.sendLoading}
                        multiline
                        margin="normal"
                      />
                      <Button disabled={this.state.sendLoading} className={classes.sendButton} align='right'
                              size="small" color="primary"
                              onClick={this.handleSend}>
                        Send
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Tabs
                  value={this.state.selectedFeed}
                  onChange={this.handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                  centered={true}
                >
                  <Tab label="MY FEED"
                       classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                  <Tab label="FAVORITES"
                       classes={{ root: classes.tabRoot, selected: classes.tabSelected }}/>
                </Tabs>
                {this.state.selectedFeed === 0
                && <TabContainer>
                  {this.state.posts.map(post => {
                    return (
                      <Grid item xs={12} sm={12} key={post.id}>
                        <MessageCard post={post} refresh={this.refresh}/>
                      </Grid>
                    );
                  })}
                </TabContainer>}
                {this.state.selectedFeed === 1
                && <TabContainer>
                  {this.state.likedPosts.map(post => {
                    return (
                      <Grid item xs={12} sm={12} key={post.id}>
                        <MessageCard post={post} refresh={this.refresh}/>
                      </Grid>
                    );
                  })}
                </TabContainer>}
              
              </Grid>
            </Grid>
          )}
          {this.state.loaded && (
            <Grid item xs={2} sm={2}>
              <RightInfoCard/>
            </Grid>
          )}
          
          {this.state.loaded === false && <CircularProgress size={50}/>}
        </Grid>
      </Grid>
    );
  }
}

TwitterFeed.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(TwitterFeed);
