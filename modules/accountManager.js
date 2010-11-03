var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Components.utils.import("resource://tbdisableaccounts/common.js");
Components.utils.import("resource://tbdisableaccounts/account.js");

/**
 * A very simple counter.
 */
TbDisableAccounts.AccountManager = 
{
    /* Current accounts count.  */
    _accounts : new Array(),
    _accountsAll : new Array(),
    _app : null,
    _window   : null,
    /**
     * Returns the current message count.
     * @return the current message count.
    */
    get accounts() { return this._accounts; },

    /**
     * load exisiting accounts
     */

    load : function(app) 
    {
        this.app = app;

        this.log(">>>load [" + this._accounts.length + "]");
        if (this._accounts.length == 0) {
            this._queryAllAccounts();
            this._queryActiveAccounts();
        }
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

    buildAccountList: function(actWindow) 
    {
        this.log(">>>_buildAccountList [" + actWindow + "]");
        this._window = actWindow;
        var accList  = this.getList();

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
            var item  = this._setItem(id, name, key, label, checked);
            this._setListItem(this._window, accList, item);
        }
    },

    _setItem: function (id, name, value, label, checked)
    {
        var item = new Array();
        item['id']      = id;
        item['name']    = name;
        item['value']   = value;
        item['label']   = label;
        item['checked'] = checked;
        return item;
    },

    _setListItem: function(window, list, item) 
    {
        let it   = window.document.createElement("listitem");
        it.setAttribute("label", item['label']);
        it.setAttribute("type", "checkbox");
        it.setAttribute("value", item['value']);
        it.setAttribute("checked", item['checked']);
        list.appendChild(it);
    },

    saveAccounts: function(actWindow) 
    {
        this._window = actWindow;
        var accList  = this.getList();
        var accounts = this.getCheckedItems(accList);
        
        try{
            var prefs = Cc["@mozilla.org/preferences-service;1"]
                .getService(Ci.nsIPrefService);
            prefs.getBranch("mail.accountmanager.").setCharPref("accounts", accounts);
            
            this.restart(this._window);
        }
        catch(err) {
            // TODO set Error message
        }
    },

    restart: function (window) {
        let mainWindow = Cc['@mozilla.org/appshell/window-mediator;1']
        .getService(Ci.nsIWindowMediator)
        .getMostRecentWindow("mail:3pane");
        mainWindow.setTimeout(function () { mainWindow.Application.restart(); }, 1000);
        window.close();
    },

    getList: function() 
    {
        var doc  = this._window.document;
        var list = doc.getElementById("tbdisableaccounts-accountlist");
        return  list;
    },

    getCheckedItems: function(itemList) 
    {
        var items = "";
        if (typeof(itemList) != undefined) {
            var childs     = itemList.childNodes;
            var arrChecked = new Array();
            for (var i = 0; i < childs.length; i++) {
                if (childs[i].checked) {
                    arrChecked.push(childs[i].value);
                }
            }
                        
            items = arrChecked.join(",");
        }
        this.log("<<getCheckedItems [items: " + items + "]");
        return items;
    },

    log: function (aMsg)
    {
        let msg = "AccountManager.js: " + (aMsg.join ? aMsg.join("") : aMsg);
        Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).
            logStringMessage(msg);
        dump(msg + "\n");
     }
};