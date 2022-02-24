sap.ui.define([
    "ena/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MenuItem",
    "sap/m/Dialog",
    "ena/modules/ModelManager"
], function (BaseController, JSONModel, MessageToast, MenuItem, Dialog, ModelManager) {
    "use strict";


    var oAllPosition = {
        onInit: function () {
            this.openBusyDialogLoadingView();
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            oRouter.getRoute("RouteAllPosition").attachMatched(this.onRouteMatched, this);
            this.closeBusyDialogLoadingView();
        },
        onRouteMatched: function (oEvent) {
            this.openBusyDialogLoadingView();
            var oParameters = oEvent.getParameters();
            var oArguments = oParameters.arguments;
            this.addRouteToRouterHistory(oParameters.name, oArguments);
            this._initViewModel();
            this.closeBusyDialogLoadingView();
        },

        onMenuAction: function (oEvent) {
            var oSelecteditem = oEvent.getSource().getBindingContext("ListProductFilter").getProperty()
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            oViewModel.setProperty("/SelectedItem", oSelecteditem)
            var oItem = oEvent.getParameter("item"),
                sItemPath = "";

            while (oItem instanceof MenuItem) {
                sItemPath = oItem.getText() + " > " + sItemPath;
                oItem = oItem.getParent();
            }

            sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));

            this.onOpenDialog(sItemPath);
        },

        onOpenDialog: function (sItemPath) {
            var oView = this.getView();
            switch (sItemPath) {
                case 'Edit':
                    if (!this._oDialogEmail) {
                        this._oDialogEmail = sap.ui.xmlfragment(oView.getId(),
                            "ena.view.fragment.dialogs.EditPosition",
                            this);
                    }
                  break;
                case 'Mangoes':
                case 'Papayas':
                  console.log('Mangoes and papayas are $2.79 a pound.');
                  // expected output: "Mangoes and papayas are $2.79 a pound."
                  break;
                default:
                  console.log(`Sorry, we are out of ${expr}.`);
              }
            oView.addDependent(this._oDialogEmail);
            this._oDialogEmail.open();
        },

        onPressCloseDialog: function () {
            this._oDialogEmail.close();
        },

        onPressStartWF: function () {
            this.openBusyDialogLoadingView();
            var oComponent = this.getOwnerComponent();
            var oComponentModel = oComponent.getModel("ListPositions");
            var oData = oComponentModel.getData()[2]
            var workflowStartPayload = { definitionId: "demohr", context: oData }
            var appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            $.ajax({
                url: appModulePath + "/bpmworkflowruntime/v1/xsrf-token",
                method: "GET",
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function (result, xhr, data) {
                    var token = data.getResponseHeader("X-CSRF-Token");
                    if (token === null) return;

                    // Start workflow 
                    $.ajax({
                        url: appModulePath + "/bpmworkflowruntime/v1/workflow-instances",
                        type: "POST",
                        data: JSON.stringify(workflowStartPayload),
                        headers: {
                            "X-CSRF-Token": token,
                            "Content-Type": "application/json"
                        },
                        async: false,
                        success: function (data) {
                            this.closeBusyDialogLoadingView();
                            MessageBox.information("The workflow is started");
                        },
                        error: function (data) {
                            this.closeBusyDialogLoadingView();
                            MessageBox.information("failed");
                        }
                    });
                },
                error: function (data) {
                    this.closeBusyDialogLoadingView();
                    MessageBox.information("failed");
                }.bind(this)
            });

        },

        _initViewModel: function () {
            var oView = this.getView();
            var oViewModel = new JSONModel({
            });
            oView.setModel(oViewModel, "view");
        }
    }

    return BaseController.extend("ena.controller.AllPosition", oAllPosition);

});