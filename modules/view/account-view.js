var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Components.utils.import("resource://tbdisableaccounts/common.js");

TbDisableAccounts.Account.View = 
{
    _window   : null,
	
	setWindow : function (window)
	{
		this._window = window;
	},

    close: function () {
        this._window.close();
    },

    getList: function() 
    {
        this.log(">>>getList" +  this._window);
        var doc  = this._window.document;
        var list = doc.getElementById("tbdisableaccounts-accountlist");
        return list;
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

    setItem: function (id, name, value, label, checked)
    {
        var item = new Array();
        item['id']      = id;
        item['name']    = name;
        item['value']   = value;
        item['label']   = label;
        item['checked'] = checked;
        return item;
    },

    setListItem: function(list, item) 
    {
        this.log(">>>setListItem" +  this._window);
        let it   = this._window.document.createElement("listitem");
        it.setAttribute("label", item['label']);
        it.setAttribute("type", "checkbox");
        it.setAttribute("value", item['value']);
        it.setAttribute("checked", item['checked']);
        list.appendChild(it);
    },

    log: function (aMsg)
    {
        let msg = "account-view.js: " + (aMsg.join ? aMsg.join("") : aMsg);
        Cc["@mozilla.org/consoleservice;1"].getService(Ci.nsIConsoleService).
            logStringMessage(msg);
        dump(msg + "\n");
     }

};
