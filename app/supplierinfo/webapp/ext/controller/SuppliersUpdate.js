sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/VBox",
    "sap/m/Label",
    "sap/m/DatePicker",
    "sap/m/Button",
    "sap/m/FlexItemData"
], function(MessageToast, Dialog, VBox, Label, DatePicker, Button, FlexItemData) {
    'use strict';

    return {
        SuppliersUpdate: async function(oContext, aSelectedContexts) {
            MessageToast.show("Opening date selection dialog.");
            
            // Create Date Pickers
            var oFromDatePicker = new DatePicker({
                valueFormat: "yyyy-MM-dd",
                displayFormat: "medium",
                placeholder: "Select From Date",
                width: "100%",
                layoutData: new FlexItemData({ growFactor: 1 })
            });

            var oToDatePicker = new DatePicker({
                valueFormat: "yyyy-MM-dd",
                displayFormat: "medium",
                placeholder: "Select To Date",
                width: "100%",
                layoutData: new FlexItemData({ growFactor: 1 })
            });

            // Create Dialog
            var oDialog = new Dialog({
                title: "Update Suppliers",
                content: new VBox({
                    items: [
                        new Label({
                            text: "From Date",
                            design: "Bold",
                            layoutData: new FlexItemData({ growFactor: 1 })
                        }),
                        oFromDatePicker,
                        new Label({
                            text: "To Date",
                            design: "Bold",
                            layoutData: new FlexItemData({ growFactor: 1 })
                        }),
                        oToDatePicker
                    ]
                }),
                buttons: [
                    new Button({
                        text: "Cancel",
                        press: function() {
                            oDialog.close();
                        }
                    }),
                    new Button({
                        text: "Update Suppliers",
                        type: "Emphasized",
                        press: async function() {
                            var sFromDate = oFromDatePicker.getValue();
                            var sToDate = oToDatePicker.getValue();

                            // Validate dates
                            if (!sFromDate || !sToDate) {
                                MessageToast.show("Please select both From Date and To Date");
                                return;
                            }

                            // if (new Date(sFromDate) > new Date(sToDate)) {
                            //     MessageToast.show("From Date cannot be after To Date");
                            //     return;
                            // }

                            try {
                                // Close dialog first
                                oDialog.close();
                                
                                MessageToast.show("Updating suppliers...");
                                
                                // Call backend function
                                let oModel = sap.ui.core.Element.getElementById("supplierinfo::suppliersList--fe::table::suppliers::LineItem").getModel();
                                let oFunc = oModel.bindContext(`/supplierUpdate(...)`);
                                
                                // Set parameters
                                oFunc.setParameter("fromDate", sFromDate);
                                oFunc.setParameter("toDate", sToDate);
                                
                                await oFunc.execute();
                                
                                // MessageToast.show("Suppliers updated successfully!");
                                
                            } catch (error) {
                                console.error("Error updating suppliers:", error);
                                MessageToast.show("Error updating suppliers: " + error.message);
                            }
                        }
                    })
                ]
            });

            // Open the dialog
            oDialog.open();
        }
    };
});