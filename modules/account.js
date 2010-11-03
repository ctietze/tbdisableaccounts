var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://tbdisableaccounts/common.js");

TbDisableAccounts.Account = function(aId, aName, akey) {
  this._id = aId;
  this._name = aName;
  this._key = akey;
};

TbDisableAccounts.Account.prototype = {

  _id : null,
  _name : null,
  _key : null,
  
  get id() {
      return this._id;
    },

  get name() {
    return this._name;
  },

  get key() {
    return this._key;
  }
};