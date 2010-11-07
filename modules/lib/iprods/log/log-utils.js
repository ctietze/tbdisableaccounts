var EXPORTED_SYMBOLS = ["Iprods_Log_Utils"];

const Cc = Components.classes;
const Ci = Components.interfaces;
/**
 * Iprods Log namespace.
 */
if ("undefined" == typeof(Iprods_Log_Utils)) {
    var Iprods_Log_Utils = {};
    
};

Iprods_Log_Utils= 
{
    log: function (filename, aMsg)
    {
        let msg = filename + ": " + (aMsg.join ? aMsg.join("") : aMsg);
        Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).
            logStringMessage(msg);
        dump(msg + "\n");
     }
}