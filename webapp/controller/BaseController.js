sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"ena/modules/ModelManager",
    "ena/controller/interfaces/LoadingBusyDialogInterfaces"
], function(Controller, History, UIComponent, MessageBox, ModelManager, LoadingBusyDialogInterfaces) {
	"use strict";

	var oBaseController = {
		//formatter: formatter,

		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		getRouter: function() {
			return UIComponent.getRouterFor(this);
		},

		onNavButtonPressBack: function() {
			var oComponent = this.getOwnerComponent();
			var oNavigationModel = oComponent.getModel("Navigation");
			var aHistory = oNavigationModel.getProperty("/RouterHistory");

			if (aHistory.length < 2) {
				oNavigationModel.setProperty("/CurrentRoute", "RouteApp");
				this.navTo("RouteHome");
			} else {
				aHistory.pop();
				oNavigationModel.setProperty("/RouteStepBack", true);
				var oLastRoute = aHistory[aHistory.length - 1];
				oNavigationModel.setProperty("/CurrentRoute", oLastRoute.routename);
				this.navTo(oLastRoute.routename, oLastRoute.parameters);
			}
		},

		/*onPressLogOut: function() {
			var oResourceBundle = this.getResourceBundle();
			var sActionYes = oResourceBundle.getText("MDSpa.MessageBox.Action.Yes");
			var sActionNo = oResourceBundle.getText("MDSpa.MessageBox.Action.No");
			MessageBox.show(oResourceBundle.getText("MDSpa.MessageBox.Content"), {
				title: oResourceBundle.getText("MDSpa.MessageBox.Title"),
				icon: MessageBox.Icon.WARNING,
				styleClass: "enl-text-align-center",
				actions: [sActionNo, sActionYes],
				onClose: function(oAction) {
					if (oAction === sActionYes) {
						this.openBusyDialogLoadingView();
						sap.ushell.Container.logout();
					} else {
						this.closeBusyDialogLoadingView();
					}
				}.bind(this)
			});

		},*/

		addRouteToRouterHistory: function(sRouteName, oParameters) {
			var oComponent = this.getOwnerComponent();
			var oNavigationModel = oComponent.getModel("Navigation");
			var aHistory = oNavigationModel.getProperty("/RouterHistory");
			var bRouteStepBack = oNavigationModel.getProperty("/RouteStepBack");

			if (bRouteStepBack) {
				oNavigationModel.setProperty("/RouteStepBack", false);
				return;
			}

			if (aHistory.length === 0) {
				var aExceptRoutes = [];
				if (aExceptRoutes.indexOf(sRouteName) !== -1) {
					this.cleanHistoryEntries();
					oNavigationModel.setProperty("/CurrentRoute", "RouteApp");
					this.navTo("RouteApp");
					return;
				}
			} else {
				var oLastRoute = aHistory[aHistory.length - 1];
				if (oLastRoute && oLastRoute.routename === sRouteName) {
					aHistory.pop();
				}
			}
			oNavigationModel.setProperty("/CurrentRoute", sRouteName);
			aHistory.push({
				routename: sRouteName,
				parameters: oParameters
			});
		},

		cleanHistoryEntries: function(aRoutes) {
			if (aRoutes === undefined) {
				aRoutes = [];
			}
			var oComponent = this.getOwnerComponent();
			var oNavigationModel = oComponent.getModel("Navigation");
			var aHistory = oNavigationModel.getProperty("/RouterHistory");
			if (aRoutes.length === 0) {
				oNavigationModel.setProperty("/RouterHistory", []);
			} else {
				aHistory.reverse();
				aRoutes.forEach(function(sRoute) {
					var iRouteIndex = aHistory.findIndex(function(oHistory) {
						return oHistory.routename === sRoute;
					});
					if (iRouteIndex !== -1) {
						aHistory.splice(iRouteIndex, 1);
					}
				});
				aHistory.reverse();
			}

		},

		getCurrentRoute: function(iEnd) {
			if (iEnd === undefined) {
				iEnd = 1;
			}
			var oComponent = this.getOwnerComponent();
			var oNavigationModel = oComponent.getModel("Navigation");
			var aHistory = oNavigationModel.getProperty("/RouterHistory");
			var oCurrentRoute;
			if (aHistory.length > 0) {
				oCurrentRoute = aHistory[aHistory.length - iEnd];
			}
			return oCurrentRoute;
		},

		navTo: function(sRouteName, mOptions) {
			try {
				var oComponent = this.getOwnerComponent();
				var oRouter = oComponent.getRouter();
				oRouter.navTo(sRouteName, mOptions);
			} catch (sError) {
				jQuery.sap.log.error("navTo: navTo " + sRouteName + " failed - " + sError);
			}
		},

		changeValueState: function(oEvent) {
			var oSource = oEvent.getSource();
			oSource.setValueState("None");
		}

		// functions that assign to a event of ui controls
		/* =========================================================== */
		/* events                                                      */
		/* =========================================================== */

		// onPressHomeButton: function () {
		// 	this.cleanHistoryEntries();
		// 	var oComponent = this.getOwnerComponent();
		// 	var oNavigationModel = oComponent.getModel("Navigation");
		// 	oNavigationModel.setProperty("/CurrentRoute", "Main");
		// 	this.navTo("Main");
		// }

	};

	LoadingBusyDialogInterfaces.implement(oBaseController);

	return Controller.extend("sap.ui.demo.nav.controller.BaseController", oBaseController);
});