var EXPORTED_SYMBOLS = [];
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Components.utils.import("resource://tbdisableaccounts/common.js");
Components.utils.import("resource://tbdisableaccounts/lib/iprods/log/log-utils.js");
Components.utils.import("resource://tbdisableaccounts/lib/iprods/array/array-utils.js");
Components.utils.import("resource://tbdisableaccounts/model/account-model.js");
Components.utils.import("resource://tbdisableaccounts/view/account-view.js");

TbDisableAccounts.Account.Controller = 
{
    _filename : "account-controller.js",
    _accountsActive : new Array(),
    _accounts : new Array(),
    _view   : null,

    init: function (window)
   {
        Iprods_Log_Utils.log(this._filename, ">>init");
        this._view   = TbDisableAccounts.Account.View;
        this._view.setWindow(window);
        this.load();
       this._buildAccountList()
    },

    get accounts() { return this._accounts; },

    load : function() 
    {
        Iprods_Log_Utils.log(this._filename, ">>load");
        this._accounts = this._queryAccounts();
    },

    _queryAccounts : function()
    {
        Iprods_Log_Utils.log(this._filename, ">>>_queryAccounts ");
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
            Iprods_Log_Utils.log(this._filename, "_queryAccounts failed [err: " 
                + err + "]" + "[prefs: " + prefs + ", account: " + "identity: " 
                + identity + ", sActive: " + sActive +"]");
        }

        for (var i = 0; i < accProperties.length; i++) {
            var arrKey = accProperties[i].split(".");
            var accKey =  arrKey[0];

             if (accounts[accKey] == undefined) {
                 var id     = "";
                 var email  = "";
                 var status = "";
                 try {
                     id = account.getCharPref("" + accKey + ".identities");
                 }
                 catch(err) {
                     Iprods_Log_Utils.log(this._filename, 
                         "account.getCharPref failed. Skipping. [" 
                         + accKey + ".identities] [err: " + err + "]");
                 }

                 if (id != "") {
                     email = identity.getCharPref("" + id + ".useremail");
                     status = (Iprods_Array_Utils.valueExists(arrActive, accKey)) ? true : false;
                     var tbAccount = new TbDisableAccounts.Account(accKey, email, status);
                     accounts[accKey] = tbAccount;
                 }
            }
        }

        accounts = Iprods_Array_Utils.sortAssocArrayByKeys(accounts, arrActive);

        Iprods_Log_Utils.log(this._filename, "<<<_queryAccounts [accounts: " + accounts + "]");
        return accounts;
    },

    _queryActiveAccounts : function() 
    {
        Iprods_Log_Utils.log(this._filename, ">>>_queryActiveAccounts");
        var activeAccounts = new Array();
        var accounts = new Array();
        try {
            var acctMgr = Cc["@mozilla.org/messenger/account-manager;1"]
                .getService(Ci.nsIMsgAccountManager);
            accounts = acctMgr.accounts;

            if (accounts.Count() > 0) {
                for (var i = 0; i < accounts.Count(); i++) {
                    var account = accounts.QueryElementAt(i, Ci.nsIMsgAccount);
                    if (!account.incomingServer)
                        continue;
                    var key  = account.key;
                    var name = account.incomingServer.rootFolder.prettiestName;
                    var tbAccount = new TbDisableAccounts.Account(key, name, true);
                    activeAccounts[key] = tbAccount;
                }
            }
        }
        catch (err) {
            // service error
        }
        
        return activeAccounts;
    },

    _buildAccountList: function() 
    {
        Iprods_Log_Utils.log(this._filename, ">>>_buildAccountList [" + this._accounts + "]");
    	var accList  = this._view.getList();

        for(var key in this._accounts) {
            var name   = this._accounts[key].name;
            var status = this._accounts[key].status;
            var label  = name + ' (' + key + ')';
            var item   =  this._view.setItem(name, key, label, status);
            this._view.setListItem(accList, item);
        }
    },

    saveAccounts: function() 
    {
        //this._window = actWindow;
        var accList  = this._view.getList();
        var accounts = this._view.getCheckedItems(accList);
        
        try{
            var prefs = Cc["@mozilla.org/preferences-service;1"]
                .getService(Ci.nsIPrefService);
            prefs.getBranch("mail.accountmanager.").setCharPref("accounts", accounts);
            
            this.restart();
        }
        catch(err) {
            // TODO set Error message
        }
    },

    restart: function ()
    {
        let mainWindow = Cc['@mozilla.org/appshell/window-mediator;1']
        .getService(Ci.nsIWindowMediator)
        .getMostRecentWindow("mail:3pane");
        mainWindow.setTimeout(function () { mainWindow.Application.restart(); }, 1000);
        this._view.close();
    }
};