import DataTransaction from './DataTransaction';
import constants from "../../settings/constants";

const defaultAvatar = 'data:image/png;base64,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';

const getAvatar = (data) => {
  let avatarParts = [];
  for (let i = 0; i < 100; i++) {
    avatarParts.push('');
  }
  data.forEach((object) => {
    const keyParts = object.key.split('.');
    if (keyParts.length > 2 && keyParts[0] === 'twitter' && keyParts[1] === 'avatar') {
      avatarParts[parseInt(keyParts[2])] = object.value;
    }
  });
  let avatarData = avatarParts.join('');
  if (avatarData === '') {
    avatarData = defaultAvatar;
  }
  return avatarData;
};

const makeId = (length) => {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
};

const subscribeToUser = (accountData, userAddress) => {
  const messageKey = 'twitter.sub.' + userAddress;
  const dataTx = {
    sender: accountData.address,
    senderPublicKey: accountData.keyPair.publicKey,
    data: [
      {
        key: messageKey,
        value: false,
        type: DataTransaction.DATA_ENTRY_TYPES.BOOLEAN
      }],
    feePerKb: 100000,
    timestamp: Date.now()
  };
  const dtx = new DataTransaction(dataTx, accountData.keyPair);
  dtx.broadcast();
};

const unsubscribeFromUser = (accountData, userAddress) => {
  const messageKey = 'twitter.sub.' + userAddress;
  const dataTx = {
    sender: accountData.address,
    senderPublicKey: accountData.keyPair.publicKey,
    data: [
      {
        key: messageKey,
        value: true,
        type: DataTransaction.DATA_ENTRY_TYPES.BOOLEAN
      }],
    feePerKb: 100000,
    timestamp: Date.now()
  };
  const dtx = new DataTransaction(dataTx, accountData.keyPair);
  dtx.broadcast();
};

const isSubscribed = (currentUserAddress, address) => {
  const url = `${constants.TESTNET_NODES_BASE_URL}/addresses/data/${currentUserAddress}/twitter.sub.${address}`;
  return fetch(url);
};


const likeMessage = (id, accountData) => {
  const dataTx = {
    sender: accountData.address,
    senderPublicKey: accountData.keyPair.publicKey,
    data: [
      {
        key: id,
        value: false,
        type: DataTransaction.DATA_ENTRY_TYPES.BOOLEAN
      }],
    feePerKb: 100000,
    timestamp: Date.now()
  };
  const dtx = new DataTransaction(dataTx, accountData.keyPair);
  dtx.broadcast();
};

const unlikeMessage = (id, accountData) => {
  const dataTx = {
    sender: accountData.address,
    senderPublicKey: accountData.keyPair.publicKey,
    data: [
      {
        key: id,
        value: true,
        type: DataTransaction.DATA_ENTRY_TYPES.BOOLEAN
      }],
    feePerKb: 100000,
    timestamp: Date.now()
  };
  const dtx = new DataTransaction(dataTx, accountData.keyPair);
  dtx.broadcast();
};

const isLiked = (id, accountData) => {
  const url = `${constants.TESTNET_NODES_BASE_URL}/addresses/data/${accountData.address}/${id}`;
  return fetch(url);
};

const getMessageKey = () => {
  return 'twitter.post.' + (new Date()).getTime() + '-' + makeId(3);
};

const sendTweet = (messageKey, message, accountData, ref) => {
  const value = { message: message };
  if (ref) {
    value.ref = ref;
  }
  const dataTx = {
    sender: accountData.address,
    senderPublicKey: accountData.keyPair.publicKey,
    data: [
      {
        key: messageKey,
        value: JSON.stringify(value),
        type: DataTransaction.DATA_ENTRY_TYPES.STRING
      }],
    feePerKb: 100000,
    timestamp: Date.now()
  };
  const dtx = new DataTransaction(dataTx, accountData.keyPair);
  return dtx.broadcast()
  
};

const tweetsCompare = (a, b) => {
  if (a.timestamp < b.timestamp)
    return 1;
  if (a.timestamp > b.timestamp)
    return -1;
  return 0;
};

export {
  isLiked,
  unlikeMessage,
  likeMessage,
  getAvatar,
  defaultAvatar,
  getMessageKey,
  tweetsCompare,
  sendTweet,
  makeId,
  isSubscribed,
  subscribeToUser,
  unsubscribeFromUser
};