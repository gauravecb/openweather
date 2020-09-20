sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		getTime: function(sValue) {
			if (!sValue) {
				return "";
			}

		/*	var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "dd/MM/yyyy"
			});*/
			var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({
				pattern: "KK:mm:ss a"
			});
			var TZOffsetMs = new Date(0).getTimezoneOffset()*60*1000;
			var oDate = new Date(sValue + TZOffsetMs);
		
			var timeStr = timeFormat.format(oDate); 
		
			return timeStr;

		},
		
		tempRoundOff : function(sValue){
				if (!sValue) {
				return "";
			}
			
			return Math.round(sValue) + "°C";
		}
	};

});