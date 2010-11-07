var EXPORTED_SYMBOLS = ["Iprods_Array_Utils"];

const Cc = Components.classes;
const Ci = Components.interfaces;
/**
 * Iprods Array namespace.
 */
if ("undefined" == typeof(Iprods_Array_Utils)) {
    var Iprods_Array_Utils = {};

};

Iprods_Array_Utils= 
{
    valueExists: function (array, value)
    {
        var result = false;
        if (typeof(array) != undefined && array.length > 0) {
            for (i = 0; i < array.length; i++) {
                if (array[i] == value) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    },

    sortAssocArrayByKeys: function (array, arrayKeys)
    {
        var result  = new Array();

        for (var i=0; i<arrayKeys.length; i++) {
            var key = arrayKeys[i];
            if (array[key] != undefined) {
                result[key] = array[key];
                delete array[key];
            }
        }

        for(var key in array) {
            result[key] = array[key];
        }

        return result;
    }
}