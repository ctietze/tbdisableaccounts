Components.utils.import("resource://tbdisableaccounts/common.js");
Components.utils.import("resource://tbdisableaccounts/controller/account-controller.js");
Components.utils.import("resource://tbdisableaccounts/view/account-view.js");

const tbda_prefs = Application.extensions.get("tbdisableaccounts@iltisworld.de").prefs;
/**
 * TbDisableAccounts namespace.
 */

if ("undefined" == typeof(TbDisableAccounts)) {
    var TbDisableAccounts = {};
};

/**
 * TbDisableAccounts extension main entry point 
 */
TbDisableAccounts.Main = {
    tbWindow : null,
    app : null,

    init : function() {
        TbDisableAccounts.Account.Controller.load();

    },

    run : function() {
        window.openDialog('chrome://tbdisableaccounts/content/', 
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
