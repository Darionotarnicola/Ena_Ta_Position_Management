sap.ui.define([
	"sap/m/BusyDialog"
], function (BusyDialog) {
	var CustomBusyDialog = BusyDialog.extend("ena._Custom.controls.BusyDialog", {
		metadata: {
			events: {
				afterOpen: {}
			}
		}
	});

	CustomBusyDialog.prototype.init = function () {
		BusyDialog.prototype.init.apply(this, arguments);
		this._oDialog.attachAfterOpen({}, function () {
			this.fireAfterOpen();
		}, this);
	};

	return CustomBusyDialog;
});