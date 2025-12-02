sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"supplierinfo/test/integration/pages/suppliersList",
	"supplierinfo/test/integration/pages/suppliersObjectPage"
], function (JourneyRunner, suppliersList, suppliersObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('supplierinfo') + '/test/flp.html#app-preview',
        pages: {
			onThesuppliersList: suppliersList,
			onThesuppliersObjectPage: suppliersObjectPage
        },
        async: true
    });

    return runner;
});

