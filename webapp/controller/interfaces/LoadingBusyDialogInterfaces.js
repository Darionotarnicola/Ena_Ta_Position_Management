sap.ui.define([
	"ena/controller/interfaces/AbstractInterfaces",
	"ena/_Custom/controls/BusyDialog"
], function (AbstractInterfaces, CustomBusyDialog) {
	"use strict";

	var LoadingBusyDialogInterface = {
		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/* =========================================================== */
		/* private functions                                           */
		/* =========================================================== */

		/* =========================================================== */
		/* public functions                                            */
		/* =========================================================== */
		openBusyDialogLoadingView: function (fnOpen, sText) {
			//var oResourceBundle = this.getResourceBundle();
			var oBusyDialog = sap.ui.getCore().byId("idLoadingViewBusyDialog");

			if (!oBusyDialog._oDialog.isOpen()) {
				if (typeof fnOpen === "function") {
					oBusyDialog.attachEventOnce("afterOpen", {}, fnOpen, this);
				}
				//oBusyDialog.setText(sText || oResourceBundle.getText("App.DefaultTextBusyDialog"));
				oBusyDialog.open();
			} else {
				//due to asynchrnous natur of opening the busy dialog it can happen that
				//it is still open while this function is called.
				//In this case we just call the 
				if (typeof fnOpen === "function") {
					fnOpen.bind(this)();
				}
			}
		},

		closeBusyDialogLoadingView: function () {
			var oBusyDialog = sap.ui.getCore().byId("idLoadingViewBusyDialog");
			if (oBusyDialog._oDialog.isOpen())
				jQuery.sap.delayedCall(0, oBusyDialog, oBusyDialog.close, []);
		},
		
		resetBusyDialog: function () {
			var oBusyDialog = sap.ui.getCore().byId("idLoadingViewBusyDialog");
			var bBusyDialogCanBeClosed = oBusyDialog && oBusyDialog._oDialog && oBusyDialog._oDialog.isOpen();
			if (bBusyDialogCanBeClosed){
				oBusyDialog.close();
			}
		},

		openBusyDialogLoadingViewBootstrap: function (sText) {
			var oCustomBusyDialog = sap.ui.getCore().byId("idLoadingViewBusyDialog");
			if (!oCustomBusyDialog) {
				oCustomBusyDialog = new CustomBusyDialog("idLoadingViewBusyDialog", {
					showCancelButton: false,
					busyIndicatorDelay: 0,
					customIcon: jQuery.sap.getModulePath("ena") + "/Images/logoEnel.png",
					customIconWidth: "6rem",
					customIconHeight: "6rem"
				});
				//oCustomBusyDialog.addStyleClass("enl-sapMBusyIndicator");
			}
			oCustomBusyDialog.open();
		}
	};
	
	AbstractInterfaces.extend(LoadingBusyDialogInterface);

	return LoadingBusyDialogInterface;
});