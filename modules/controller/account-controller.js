var EXPORTED_SYMBOLS = [];
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://tbdisableaccounts/common.js");
Cu.import("resource://tbdisableaccounts/lib/iprods/log/log-utils.js");
Cu.import("resource://tbdisableaccounts/lib/iprods/array/array-utils.js");
Cu.import("resource://tbdisableaccounts/model/account-model.js");
Cu.import("resource://tbdisableaccounts/view/account-view.js");

TbDisableAccounts.Account.Controller = 
{
    _filename : "account-controller.js",
    _accountsActive : new Array(),
    _accounts : new Array(),
    _view   : null,
    _prefs: null,

    init: function (window)
    {
        this._log(">>init");
        this._view  = TbDisableAccounts.Account.View;
        this._view.setWindow(window);
        this.load();
        this._buildAccountList();
    },

    get accounts() { return this._accounts; },

    load : function() 
    {
        this._log(">>load");
        this._accounts = this._queryAccounts();
    },

    _queryAccounts : function()
    {
        this._log(">>>_queryAccounts ");
        var accounts = new Array();
        var accProperties = new Array();
        var arrActive = new Array();

        try {
            var prefs = Cc["@mozilla.org/preferences-service;1"]
                .getService(Ci.nsIPrefService);
            var account   = prefs.getBranch("mail.account.");
            var identity  = prefs.getBranch("mail.identity.");
            var sActive   = prefs.getBranch("mail.accountmanager.")
                .getCharPref("accounts");
            arrActive = sActive.split(",");
            accProperties = account.getChildList("", {});
        }
        catch (err) {
            this._log("_queryAccounts failed [err: " 
                + err + "]" + "[prefs: " + prefs + ", account: " + "identity: " 
                + identity + ", sActive: " + sActive +"]");
        }

        for (var i = 0; i < accProperties.length; i++) {
            var arrKey = accProperties[i].split(".");
            var accKey = arrKey[0];

             if (accounts[accKey] == undefined) {
                 var id       = "";
                 var email    = "";
                 var isActive = false;
                 var isHidden = false;
                 try {
                     identities = "" + accKey + ".identities";
                     id = account.getCharPref(identities);
                 }
                 catch(err) {
                     this._log("getCharPref failed [" + identities + "]. Skip.");
                 }

                 if (id != "") {
                     email  = identity.getCharPref("" + id + ".useremail");
                     if (Iprods_Array_Utils.valueExists(arrActive, accKey)) {
                         isActive = true;
                     }
                 }
                 else {
                     isHidden = true;
                     isActive = true;
                 }
                 var tbAccount = new TbDisableAccounts.Account(accKey,  email, 
                     isActive, isHidden);
                 accounts[accKey] = tbAccount;
             }
        }
        accounts = Iprods_Array_Utils.sortAssocArrayByKeys(accounts, arrActive);
        this._log("<<<_queryAccounts [accounts: " + accounts + "]");
        return accounts;
    },

    _buildAccountList: function() 
    {
        this._log(">>>_buildAccountList [" + this._accounts + "]");
        var accList  = this._view.getList();

        for(var key in this._accounts) {
            var id     = "tbda-" + key;
            var name   = this._accounts[key].name;
            var label  = name;
            var active = this._accounts[key].active;
            var hidden = this._accounts[key].hidden;
            var item   =  this._view.setItem(id, name, key, label, active, hidden);
            this._view.setListItem(accList, item);
        }
    },

    toggleSorting: function()
    {
        this._view.toogleDragSupport();
    },

    saveAccounts: function() 
    {
        this._log(">>>saveAccounts");
        var accList  = this._view.getList();
        var accounts = this._view.getCheckedItems(accList);
        if (accounts.length > 0) {
            try{
                this._log("saveAccounts [" + accounts + "]");
                var prefs = Cc["@mozilla.org/preferences-service;1"]
                    .getService(Ci.nsIPrefService);
                prefs.getBranch("mail.accountmanager.")
                    .setCharPref("accounts", accounts);
                this.restart();
            }
            catch(err) {
                this._log("saveAccounts err: " + err);
                this._view.setError("no-accounts");
            }
        }
        else {
            this._log("saveAccounts failed >at-least-one-accounts<");
            this._view.setError("at-least-one-accounts");
        }
    },

    restart: function ()
    {
        let mainWindow = Cc['@mozilla.org/appshell/window-mediator;1']
            .getService(Ci.nsIWindowMediator)
            .getMostRecentWindow("mail:3pane");
        mainWindow.setTimeout(function () { mainWindow.Application.restart(); }, 1000);
        this._view.close();
    },

    _log: function (msg)
    {
        Iprods_Log_Utils.log(this._filename, msg);
    }
};