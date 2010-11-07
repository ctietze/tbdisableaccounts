var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Components.utils.import("resource://tbdisableaccounts/common.js");
Components.utils.import("resource://tbdisableaccounts/lib/iprods/log/log-utils.js");

TbDisableAccounts.Account.View = 
{
    _filename : "account-view.js",
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
        Iprods_Log_Utils.log(this._filename, ">>>getList" +  this._window);
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
        Iprods_Log_Utils.log(this._filename, "<<getCheckedItems [items: " + items + "]");
        return items;
    },

    setItem: function (name, value, label, checked)
    {
        var item = new Array();
        item['name']    = name;
        item['value']   = value;
        item['label']   = label;
        item['checked'] = checked;
        return item;
    },

    setListItem: function(list, item) 
    {
        let it   = this._window.document.createElement("listitem");
        it.setAttribute("label", item['label']);
        it.setAttribute("type", "checkbox");
        it.setAttribute("value", item['value']);
        it.setAttribute("checked", item['checked']);
        list.appendChild(it);
    }
};
