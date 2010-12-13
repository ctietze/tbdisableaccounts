var EXPORTED_SYMBOLS = [];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://tbdisableaccounts/common.js");
Cu.import("resource://tbdisableaccounts/lib/iprods/log/log-utils.js");


TbDisableAccounts.Account.View = 
{
    _filename :  'account-view.js',
    _dataFormat: 'application/x-moz-node',
    _window   :  null,
    _tbdaBundle   :  null,

    setWindow : function (window)
    {
        this._window = window;
    },

    close: function () {
        this._window.close();
    },

    getList: function() 
    {
        this._log(">>>getList" +  this._window);
        var list = this._window.document.getElementById("tbda-accountlist");
        return list;
    },

    getCheckedItems: function(itemList) 
    {
        var items = "";
        if (typeof(itemList) != undefined) {
            var childs     = itemList.childNodes;
            var arrChecked = new Array();
            for (var i = 0; i < childs.length; i++) {
                var type = childs[i].getAttribute('type');
                if (childs[i].checked || type == "hidden") {
                    var value = childs[i].getAttribute('value');
                    arrChecked.push(value);
                }
            }
            items = arrChecked.join(",");
        }
        this._log("<<getCheckedItems [items: " + items + "]");
        return items;
    },

    _getSortStatus : function() 
    {
        this._log(">>>getSortStatus");
        var result = false;
        var cb = this._window.document.getElementById("tbda-sorting");
        if (cb.checked) {
            result = true;
        }
        return result;
    },

    setItem: function (id, name, value, label, checked, hidden)
    {
        var item = new Array();
        item['id']      = id;
        item['name']    = name;
        item['value']   = value;
        item['label']   = label;
        item['checked'] = checked;
        item['hidden']  =  hidden;
        return item;
    },

    setListItem: function(list, item) 
    {
        this._log(">>>setListItem [list:" + list + ", item:" +  item['id'] 
            + " " +  item['value'] +"]");
        let it   = this._window.document.createElement("listitem");
        it.setAttribute("id", item['id']);
        it.setAttribute("label", item['label']);
        it.setAttribute("value", item['value']);
        it.setAttribute("checked", item['checked']);
        it.setAttribute("type", "checkbox");
        if (item['hidden'] == true) {
            it.setAttribute("type", "hidden");
            it.setAttribute("style","display: none;");
        }
        list.appendChild(it);
    },

    setError: function (msgKey)
    {
        this._log(">>>setError [msgKey: " +  msgKey + "]");
        if (this._tbdaBundle == null) {
            this._tbdaBundle = this._window.document.getElementById("tbda-msg");
        }

        var desc = this._window.document.getElementById("tbda-error-msg");
        if (desc != undefined && (msgKey != "" && msgKey.length > 0)) {
            var msg = this._tbdaBundle.getString(msgKey);
            desc.setAttribute("value", msg);
            this._window.sizeToContent();
        }
    },

    toogleDragSupport: function ()
    {
        var status = this._getSortStatus();
        var list   = this.getList();
        
        if (typeof(list) != undefined) {
            var childs  = list.childNodes;
            for (var i = 0; i < childs.length; i++) {
                if (status) {
                    childs[i].setAttribute("disabled", true);
                    childs[i].setAttribute("draggable", true);
                    childs[i].setAttribute("ondragover", 
                        "TbDisableAccounts.Account.View.doDragOver(event)");
                    childs[i].setAttribute("ondragstart", 
                        "TbDisableAccounts.Account.View.onDragStart(event)");
                    childs[i].setAttribute("ondrop", 
                        "TbDisableAccounts.Account.View.doDrop(event)");
                }
                else {
                    childs[i].setAttribute("disabled", "");
                    childs[i].setAttribute("draggable", "");
                    childs[i].setAttribute("ondragover", "");
                    childs[i].setAttribute("ondragstart", "");
                    childs[i].setAttribute("ondrop", "");
                }
            }
        }
    },

    onDragStart: function (event)
    {
        this._log(">>onDragStart [event: " + event + "]");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.mozSetDataAt(this._dataFormat, event.target, 0);
        return true;
    },

    doDragOver: function (event)
    {
        event.preventDefault();
    },

    doDrop:  function (event)
    {
        var isNode = event.dataTransfer.types.contains(this._dataFormat);
        if(isNode){
            var nodeData = event.dataTransfer.mozGetDataAt(this._dataFormat, 0);
            event.target.parentNode.insertBefore(nodeData, event.target);
        }
        event.preventDefault();
    },

    _log: function (msg)
    {
        Iprods_Log_Utils.log(this._filename, msg);
    }
};