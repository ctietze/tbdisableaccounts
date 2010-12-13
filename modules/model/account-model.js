var EXPORTED_SYMBOLS = [];

Components.utils.import("resource://tbdisableaccounts/common.js");

TbDisableAccounts.Account = function(key, name, isActive, isHidden) 
{
    this._key = key;
    this._name = name;
    this._isActive = isActive;
    this._isHidden = isHidden;
};

TbDisableAccounts.Account.prototype = 
{
    _key : null,
    _name : null,
    _isActive : null,
    _isHidden : null,

    get key() 
    {
        return this._key;
    },

    get name() 
    {
        return this._name;
    },

    get active() 
    {
        return this._isActive;
    },

    get hidden() 
    {
        return this._isHidden;
    },

    toString: function()
    {
        return "TbDisableAccounts.Account [key: " + this._key 
            + ", name: " + this._name + ", status: " + this._isActive 
            + ", _isHidden: " + this._isHidden + "]";
    }
};