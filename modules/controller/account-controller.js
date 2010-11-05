var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Components.utils.import("resource://tbdisableaccounts/common.js");
Components.utils.import("resource://tbdisableaccounts/model/account-model.js");
Components.utils.import("resource://tbdisableaccounts/view/account-view.js");

TbDisableAccounts.Account.Controller = 
{
    _accounts : new Array(),
    _accountsAll : new Array(),
    _view   : null,
	
	init: function (window)
	{
       	this._view   = TbDisableAccounts.Account.View;
		this._view.setWindow(window);
        this.load();
		this._buildAccountList();
		
	},

    get accounts() { return this._accounts; },

    load : function() 
    {
        this.log(">>>load");
        this._queryAllAccounts();
        this._queryActiveAccounts();
    },

    _queryAllAccounts : function()
    {
        var prefs = Cc["@mozilla.org/preferences-service;1"]
            .getService(Ci.nsIPrefService);
        var account  = prefs.getBranch("mail.account.");
        var identity = prefs.getBranch("mail.identity.");
        var children = account.getChildList("", {});

        for (var i = 0; i < children.length; i++) {
            var key = children[i].split(".");
            var accKey =  key[0];

             if (this._accountsAll[accKey] == undefined) {
                 try{
                     var id    = account.getCharPref("" + accKey + ".identities");
                     var email = identity.getCharPref("" + id + ".useremail");

                     var tbAccount = new TbDisableAccounts.Account(id, email, accKey);
                     this._accountsAll[accKey] = tbAccount;
                 }
                 catch(err) {
                     //
                 }
            }
        }
    },
 
    _queryActiveAccounts : function() 
    {
        this.log(">>>_queryActiveAccounts");
        var aAccounts = new Array();
        var acctMgr = Cc["@mozilla.org/messenger/account-manager;1"]
            .getService(Ci.nsIMsgAccountManager);  
        var accounts = acctMgr.accounts;
        for (var i = 0; i < accounts.Count(); i++) {
            var account = accounts.QueryElementAt(i, Ci.nsIMsgAccount);
            if (!account.incomingServer)
                continue;
            var name = account.incomingServer.rootFolder.prettiestName;
            var id   = account.defaultIdentity;
            var key  = account.key;
            
            var tbAccount = new TbDisableAccounts.Account(id, name, key);
            this._accounts[key] = tbAccount;
        }
    },

    _buildAccountList: function() 
    {
        this.log(">>>_buildAccountList [" + this._accountsAll + "]");
    	var accList  = this._view.getList();

        for(var key in this._accountsAll) {
            var value   = this._accountsAll[key];
            var id      = null;
            var name    = value.name;
            var checked = false

            // its an active accounts
            if (this._accounts[key] != undefined) {
                key     = this._accounts[key].key;
                id      = this._accounts[key].id;
                name    = this._accounts[key].name;
                checked = true;
            }
            var label = name + ' (' + key + ')';
            var item  =  this._view.setItem(id, name, key, label, checked);
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

    restart: function () {
        let mainWindow = Cc['@mozilla.org/appshell/window-mediator;1']
        .getService(Ci.nsIWindowMediator)
        .getMostRecentWindow("mail:3pane");
        mainWindow.setTimeout(function () { mainWindow.Application.restart(); }, 1000);
        this._view.close();
    },

    log: function (aMsg)
    {
        let msg = "account-controller.js: " + (aMsg.join ? aMsg.join("") : aMsg);
        Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).
            logStringMessage(msg);
        dump(msg + "\n");
     }
};
