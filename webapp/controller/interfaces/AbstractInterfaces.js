sap.ui.define([], function() {
	"use strict";
	return {
		implement: function(oObject) {
			Object.keys(this).forEach(function(sFunctionName) {
				if (sFunctionName === "implement" || sFunctionName === "extend") {
					return;
				}
				if (oObject[sFunctionName] !== undefined) {
					jQuery.sap.log.error("Attention! You will override the function: " + sFunctionName);
				}
				oObject[sFunctionName] = this[sFunctionName];
			}.bind(this));
			return oObject;
		},

		extend: function(oClassData) {
			oClassData.implement = this.implement;
		}
	};
});