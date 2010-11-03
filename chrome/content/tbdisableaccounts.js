Components.utils.import("resource://tbdisableaccounts/common.js");
Components.utils.import("resource://tbdisableaccounts/accountManager.js");

const tbda_prefs = Application.extensions.get("tbdisableaccounts@iltisworld.de").prefs;
/**
 * TbDisableAccounts namespace.
 */

if ("undefined" == typeof(TbDisableAccounts)) {
    var TbDisableAccounts = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
TbDisableAccounts.Main = {
    tbWindow : null,
    app : null,

    init : function() {
        this.app = Application;

        TbDisableAccounts.AccountManager.load(this.app);
        this.tbWindow = window.openDialog('chrome://tbdisableaccounts/content/', 
            '', 'chrome=yes, modal=yes, dialog=no, resizable=yes');
    },

    log: function (aMsg)
    {
        let msg = "tbdisableaccounts.js: " + (aMsg.join ? aMsg.join("") : aMsg);
        Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).
            logStringMessage(msg);
        dump(msg + "\n");
     }
};