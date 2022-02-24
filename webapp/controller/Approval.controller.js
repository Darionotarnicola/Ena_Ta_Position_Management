sap.ui.define([
    "ena/controller/BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "ena/modules/ModelManager",
    "ena/modules/ApprovalManager",
    "sap/m/Dialog",
    "sap/m/DialogType",
	"sap/m/Button",
	"sap/m/ButtonType",
    "sap/ui/core/ValueState",
    "sap/m/Text"
], function (BaseController, MessageBox, JSONModel, ModelManager, ApprovalManager, Dialog, DialogType, Button, ButtonType, ValueState , Text) {
    "use strict";


    var oApproval = {
        onInit: function () {
            var oComponent = this.getOwnerComponent();
            var oRouter = oComponent.getRouter();
            this._initViewModel();
            oRouter.getRoute("RouteApproval").attachMatched(this._onRouteMatched, this);
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oComponent = this.getOwnerComponent();
            var oComponentModel = oComponent.getModel("ListPositions").getData();
            oViewModel.setProperty("/ListPositionsView", oComponentModel);

            //this._selectRegionFilters();
            //this._selectCEDIFilters();
            this.initMasterListPositions();
            //this._setSelectedSubSection(sSelectedKey);
            this.closeBusyDialogLoadingView();
        },

        initMasterListPositions: function () {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var sIdListPosition = oViewModel.getProperty("/ListPositionsView/id");

            this._selectContract(sIdListPosition);
        },

        onPressListItem: function (oEvent) {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oSelectedItem = oEvent.getParameter("listItem");
            var sIdListItem = oEvent.getParameters().id.split("---")[1]
            var oBindingContext = oSelectedItem.getBindingContext("ListPositions");
            var oPositionSelected = oBindingContext.getObject();
            oViewModel.setProperty("/enableModify", false);
            //	this._clearDataField();

            this._selectContract(oPositionSelected.id, sIdListItem);
        },

        onPressReviewTask: function() {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oCurrentWorkflowId = oViewModel.getProperty("/CurrentId");
            var sWorkflowId = oCurrentWorkflowId.currentId
            ApprovalManager._ifError(sWorkflowId).then(function(oErrorResult){
                this._openErrorDialog(oErrorResult);
            }.bind(this));
            
        },

        

        _openErrorDialog: function(oErrorResult) {
            if (oErrorResult.length !== 0) {
                if (!this.oWarningMessageDialog) {
                    this.oWarningMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Warning",
                        state: ValueState.Warning,
                        content: new Text({ text: oErrorResult[0].message }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oWarningMessageDialog.close();
                                this.oWarningMessageDialog.destroy();
                                this.oWarningMessageDialog = undefined;
                            }.bind(this)
                        })
                    });
                }
                this.oWarningMessageDialog.open();
            } else {
                if (!this.oSuccessMessageDialog) {
                    this.oSuccessMessageDialog = new Dialog({
                        type: DialogType.Message,
                        title: "Success",
                        state: ValueState.Success,
                        content: new Text({ text: "Ok" }),
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "OK",
                            press: function () {
                                this.oSuccessMessageDialog.close();
                                this.oSuccessMessageDialog.destroy();
                                this.oSuccessMessageDialog = undefined;
                            }.bind(this)
                        })
                    });
                }
    
                this.oSuccessMessageDialog.open();
            }
            
        },

        _selectContract: function (sIdListPosition, sIdListItem) {
            var oView = this.getView();
            var oViewModel = oView.getModel("view");
            var oComponent = this.getOwnerComponent();
            var oListPositionsModel = oComponent.getModel("ListPositions")
            var aListPosition = oListPositionsModel.getData();
            var oSelectedList;

            if (sIdListPosition) {
                oSelectedList = aListPosition.find(function (oListPosition) {
                    return oListPosition.id === sIdListPosition;
                });
                if (oSelectedList === undefined) {
                    oSelectedList = aListPosition[0];
                }
            } else {
                if (sIdListPosition === undefined) {
                    oSelectedList = aListPosition[0];
                }
            }
            if (oSelectedList) {

                this._changeListSelection(oSelectedList.id, sIdListItem);
                oViewModel.setProperty("/CurrentId", {currentId: oSelectedList.workflowInstanceId});
                ApprovalManager._SelectedPosition(oSelectedList).then(function(data){
                    var oView = this.getView();
                    var oViewModel = oView.getModel("view");
                    oViewModel.setProperty("/ListPositionsSelected", data);
                }.bind(this));
                // if (!bSkipScroll) {
                // this._scrollToListItem();
                // }
                this._fireMasterListGrowing();
                // this.navToDetailContract(oSelectedListMDSpa.key2, true, true);
            } else {
                oViewModel.setProperty("/noListMDSpa", true);
            }
            this.closeBusyDialogLoadingView();
        },

        _changeListSelection: function (sIdListPosition, sIdListItem) {
            var oComponent = this.getOwnerComponent();
            var oListPositionsModel = oComponent.getModel("ListPositions");
            var aListPositions = oListPositionsModel.getData();
            var oSelectedPosition = aListPositions.find(function (oListPositions) {
                return oListPositions.id === sIdListPosition;
            });
            var oPreviusSelectedIndex = aListPositions.findIndex(function (oListPositions) {
                return oSelectedPosition.selected;
            });
            if (oPreviusSelectedIndex !== -1) {
                aListPositions[oPreviusSelectedIndex].selected = false;
            } else {
                oSelectedPosition.selected = true;
            }
            oSelectedPosition.selected = true;

            oListPositionsModel.refresh();
        },

        _fireMasterListGrowing: function () {
            jQuery.sap.delayedCall(0, this, function () {
                var oView = this.getView();
                var oList = oView.byId("idPositionsMasterList");
                oList._oGrowingDelegate._updateTrigger(false);
            }, []);
        },

        /*_scrollToListItem: function() {
            jQuery.sap.delayedCall(0, this, function() {
                var oView = this.getView();
                var oComponent = this.getOwnerComponent();
                var oProjectModel = oComponent.getModel("MDSpaFilter");
                var aProjects = oProjectModel.getData();
                var oViewModel = oView.getModel("view");
                var sProjectID = oViewModel.getProperty("ListPositionsView");
                var oProject = aProjects.find(function(oProject) {
                    return oProject.TAX_NUMB === sProjectID;
                });
                if (!oProject) {
                    return;
                }
                var oList = oView.byId("idPositionsMasterList");
                var oProjectelected;
                var aItemsList = oList.getItems();
                while (!oProjectelected && aItemsList.length <= aProjects.length) {
                    aItemsList = oList.getItems();
                    oProjectelected = aItemsList.find(function(oProject) {
                        return oProject.getSelected();
                    });
                    if (!oProjectelected) {
                        var iGrowingThreshold = oProject.getGrowingThreshold();
                        var oGrowingDelegate = oProject._oGrowingDelegate;
                        oGrowingDelegate._iLimit = aItemsList.length + iGrowingThreshold;
                        oProject.updateItems("Growing");
                    }
                }
                if (oProjectelected) {
                    var oItemDomRef = oProjectelected.getDomRef();
                    // Get rid of jquery.animate due to bad performance of it
                    if (oItemDomRef) {
                        var oScroller = oList.getParent()._oScroller;
                        // oScroller.scrollTo(0, 0);
                        oScroller.scrollToElement(oItemDomRef, 500);
                    }
                }
            }, []);
        },*/

        onPressApprove: function () {
            this.openBusyDialogLoadingView();
            var startContext = this.getView().getModel("view").getProperty("ListPositionsSelected");
            var workflowStartPayload = { definitionId: "demohr", context: startContext }
            var sUrl = "/ena/bpmworkflowruntime/v1/workflow-instances" + ID; //da capire quale è l'istanza della singola richiesta
            var sContext;
            sContext.approvalStatus = "approvato";
            var aBody = {
                context: sContext,
                status: "COMPLETED"
            };

            $.ajax({
                url: "/ena/bpmworkflowruntime/v1/xsrf-token",
                method: "GET",
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function (result, xhr, data) {
                    var token = data.getResponseHeader("X-CSRF-Token");
                    if (token === null) return;

                    // Start workflow 
                    $.ajax({
                        url: sUrl,
                        type: "PATCH",
                        async: false,
                        contentType: "application/json",
                        headers: {
                            "X-CSRF-Token": token,
                        },
                        data: JSON.stringify(aBody),

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

    return BaseController.extend("ena.controller.Approval", oApproval);

});