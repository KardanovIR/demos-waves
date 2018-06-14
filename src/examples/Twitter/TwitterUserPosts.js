import DataTransaction from "./DataTransaction";
import { getAvatar } from "./Helpers";
import constants from '../../settings/constants';

class TwitterUserPosts {
  
  
  constructor(address) {
    this.address = address;
  }
  
  getAddressDataUrl = () => {
    return `${constants.TESTNET_NODES_BASE_URL}/addresses/data/${this.address}`
  };
  
  getAliasUrl = () => {
    return `${constants.TESTNET_NODES_BASE_URL}/alias/by-address/${this.address}`
  };
  
  getData = () => {
    const url = this.getAddressDataUrl();
    return fetch(url);
  };
  
  getReadableDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  };
  
  getImage = (message) => {
    const regExp = /(https?:\/\/.*\.(?:png|jpg|jpeg|webp))/;
    const imagesMatch = message.match(regExp);
    if (imagesMatch !== null && imagesMatch.length > 0) {
      return imagesMatch[0];
    } else {
      return null;
    }
  };
  
  parsePosts = (fields, user) => {
    const posts = [];
    fields.forEach((field) => {
      const keyParts = field.key.split('.');
      // key looks like twitter.post.UNIXTIMESTAMP-id
      if (keyParts[0] === 'twitter'
        && keyParts[1] === 'post') {
        const idParts = keyParts[2].split('-');
        try {
          const messageJson = JSON.parse(field.value);
          posts.push({
            ...messageJson,
            image: this.getImage(messageJson.message),
            timestamp: idParts[0],
            dateTime: this.getReadableDate(idParts[0]),
            id: idParts[1],
            user: user
          });
        } catch (e) {
          // console.log(e);
        }
      }
    });
    return posts;
  };
  
  parseUserDataEntries = (data) => {
    let profileData = {
      displayName: this.address,
      color: '',
      bio: '',
      isActive: false,
      address: this.address
    };
    
    data.forEach(object => {
      switch (object.key) {
        case  'twitter.lastUpdate': {
          profileData.isActive = true;
          break;
        }
        case  'twitter.displayName': {
          profileData.displayName = object.value;
          break;
        }
        case  'twitter.bio': {
          profileData.bio = object.value;
          break;
        }
        case  'twitter.color': {
          profileData.color = object.value;
          break;
        }
      }
    });
    if (profileData.isActive) {
      profileData.avatar = getAvatar(data);
    }
    return profileData;
  };
  
  parseSubs = (data) => {
    const subs = [];
    data.forEach(entry => {
      const keyParts = entry.key.split('.');
      if (keyParts.length === 3 &&
        keyParts[0] === 'twitter' && keyParts[1] === 'sub'
        && entry.value === true) {
        subs.push(keyParts[2]);
      }
    });
    return subs;
  };
  
  parseLiked = (data) => {
    const liked = [];
    data.forEach(entry => {
      const keyParts = entry.key.split('.');
      if (keyParts.length === 3 &&
        keyParts[0] === 'twitter' && keyParts[1] === 'like'
        && entry.value === true) {
        liked.push(keyParts[2]);
      }
    });
    return liked;
  };
  
  getAlias = () => {
    const url = this.getAliasUrl();
    return fetch(url)
      .then(plainData => {
        return plainData.json();
      })
      .then((jsonData) => {
        let alias = this.address;
        if (jsonData.length > 0) {
          alias = jsonData[0].split(':')[2];
        }
        return new Promise((resolve, reject) => {
          resolve(alias);
        });
      });
  };
  
  getAllData = () => {
    return this.getData()
      .then(res => {
        return res.json();
      })
      .then(resJson => {
        return new Promise((resolve, reject) => {
          if (resJson && Array.isArray(resJson)) {
            const user = this.parseUserDataEntries(resJson);
            const posts = this.parsePosts(resJson, user);
            const subs = this.parseSubs(resJson);
            const liked = this.parseLiked(resJson);
            resolve({ user, posts, subs, liked });
          } else {
            reject('ERROR');
          }
        });
      })
  }
  
}


export default TwitterUserPosts;