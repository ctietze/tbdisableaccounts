var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://tbdisableaccounts/common.js");

TbDisableAccounts.Account = function(akey, aName, aStatus) 
{
    this._key = akey;
    this._name = aName;
    this._status = aStatus;
};

TbDisableAccounts.Account.prototype = 
{
    _key : null,
    _name : null,
    _status : null,

    get key() 
    {
        return this._key;
    },

    get name() 
    {
        return this._name;
    },

    get status() 
    {
        return this._status;
    },
    
    toString: function()
    {
        return "TbDisableAccounts.Account [key: " + this._key + ", name: " 
            + this._key + ", status: " + this._status + "]";
    }
};