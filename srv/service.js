// const SELECT = require('@sap/cds/lib/ql/SELECT');
const axios = require('axios');
async function getAribaOAuthToken() {
    const clientno = '53b151ca-96da-4fc6-ae47-dca385b05d3e';
    const secretno = 'CjWN1n0xjFtC49PXRfy6qBNFXjjMl632';

    // Create the Basic Auth string
    const authno = Buffer.from(clientno + ':' + secretno, 'utf-8').toString('base64');

    try {
        // Make the request to get the OAuth token
        const response = await axios.post('https://api.au.cloud.ariba.com/v2/oauth/token?grant_type=openapi_2lo', null, {
            headers: {
                'Authorization': 'Basic ' + authno,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        // Return the access token from the response
        return response.data.access_token;
    } catch (error) {
        console.error('Error while fetching token:', error);
        throw error;
    }
}
async function getDocIdDetails(internalId, token) {
    try {
        // Construct the URL with the given internalId (eventId)
        const url = `https://openapi.au.cloud.ariba.com/api/sourcing-event/v2/prod/events/${internalId}?user=puser1&passwordAdapter=PasswordAdapter1&realm=PEOLSOLUTIONSDSAPP-T&apikey=RuU300xzEClMIpw8UBalRGERG9LQZcHG&$expand=items`;

        // Make the GET request to get the event details
        const response = await axios.request(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
            },
        });

        // Return the response data (or process it as needed)
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for event ${internalId}:`, error);
        throw error;
    }
}
async function getInvitedSuppliers(internalId, itemId, token) {
    try {
        const url = `https://openapi.au.cloud.ariba.com/api/sourcing-event/v2/prod/events/${internalId}/items/${itemId}/supplierInvitations?user=puser1&passwordAdapter=PasswordAdapter1&realm=PEOLSOLUTIONSDSAPP-T&apikey=RuU300xzEClMIpw8UBalRGERG9LQZcHG`;

        const response = await axios.request(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for item suppliers ${internalId}:`, error);
        throw error;
    }
}
module.exports = async function () {
    let { suppliers, supplierProfile } = this.entities;

    this.on('supplierUpdate', async function (req) {
        debugger;
        const fromDate = req.data.fromDate;  // Format: "yyyy-MM-dd"
        const toDate = req.data.toDate;      // Format: "yyyy-MM-dd"

        // Convert dates to timestamps (milliseconds since epoch)
        const fromDateTimestamp = new Date(fromDate).getTime();
        const toDateObj = new Date(toDate);
        toDateObj.setHours(23, 59, 59, 999); // Set to end of day
        const toDateTimestamp = toDateObj.getTime();

        // Result will be in format like: 1727740800000
        console.log("From Date Timestamp:", fromDateTimestamp);
        console.log("To Date Timestamp:", toDateTimestamp);
        // let { suppliers } = this.entities;
        var token;
        var internalId;
        var eventDate;
        var itemId;
        var itemsWithPrice;
        let dataItems = [];
        try {
            token = await getAribaOAuthToken(); // Calling the function to fetch the token
            console.log('Successfully retrieved OAuth token:', token);
        } catch (error) {
            console.error('Failed to retrieve OAuth token:', error);
        }
        var apicall = await axios.request(`https://openapi.au.cloud.ariba.com/api/sourcing-event/v2/prod/events/identifiers?$filter=(createDateFrom gt ${fromDateTimestamp} and createDateTo lt ${toDateTimestamp})&user=puser1&passwordAdapter=PasswordAdapter1&realm=PEOLSOLUTIONSDSAPP-T&apikey=RuU300xzEClMIpw8UBalRGERG9LQZcHG`,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'

                }
            });
        console.log("apicall", apicall);
        if (apicall.data.payload && Array.isArray(apicall.data.payload) && apicall.data.payload.length > 0) {
            // Loop through the records and extract the internal id
            for (let i = 0; i < apicall.data.payload.length; i++) {
                var record = apicall.data.payload[i];
                internalId = record['internalId'];
                eventDate = record['createDate'];
                const existing = await SELECT('suppliers').where({
                    eventId: internalId
                });

                if (!existing || existing.length === 0) {
                    token = await getAribaOAuthToken();
                    try {
                        const docidDetails = await getDocIdDetails(internalId, token);
                        console.log('Fetched document details:', docidDetails);
                        // Check both event type and status
                        if (docidDetails.eventTypeName == 'RFP' &&
                            (docidDetails.status === 'Completed' || docidDetails.status === 'Pending Selection' || docidDetails.status === 'Open')) {
                            itemsWithPrice = docidDetails.items.filter(item =>
                                item.terms && item.terms.some(term => term.title === "Price")
                            );
                            for (let j = 0; j < itemsWithPrice.length; j++) {
                                const item = itemsWithPrice[j];
                                const materialCodeTerm = item.terms.find(term => term.title === "Material Code");
                                const materialCodeValue = materialCodeTerm?.value?.simpleValue || null;
                                if (!materialCodeValue) {
                                    console.log(`Skipping item ${item.itemId} - Material Code is null or empty`);
                                    continue; // Skip to next item
                                }
                                itemId = item.itemId;
                                token = await getAribaOAuthToken();
                                const supplierDetails = await getInvitedSuppliers(internalId, itemId, token);
                                console.log('Fetched supplier details:', supplierDetails);
                                // Extract supplier information
                                var supplierInfo = [];
                                if (supplierDetails.payload && Array.isArray(supplierDetails.payload)) {
                                    // supplierDetails.payload.forEach(supplier => {
                                    //     supplierInfo.push({
                                    //         orgANId: supplier.mainContact?.orgANId,
                                    //         orgName: supplier.mainContact?.orgName,
                                    //         emailAddress: supplier.mainContact?.emailAddress,
                                    //         invitationId: supplier.invitationId,

                                    //     });
                                    // });
                                    for (const supplier of supplierDetails.payload) {
                                        const orgANId = supplier.mainContact?.orgANId;
                                        const orgName = supplier.mainContact?.orgName;
                                        const emailAddress = supplier.mainContact?.emailAddress;
                                        const invitationId = supplier.invitationId;

                                        await INSERT.into('suppliers').entries({
                                            materialCode: materialCodeValue,
                                            supplierANId: orgANId,
                                            eventId: internalId,
                                            itemId: item.itemId,
                                            orgName: orgName,
                                            title: item.title,
                                            email: emailAddress,
                                            invitationId: invitationId,
                                            eventDate: eventDate
                                        });
                                        console.log(`Inserted supplier: ${orgANId} for material code: ${materialCodeValue}`);
                                        const existingProfile = await SELECT('supplierProfile').where({ anid: orgANId });

                                        // If not found, insert new supplier profile
                                        if (!existingProfile || existingProfile.length === 0) {
                                            await INSERT.into('supplierProfile').entries({
                                                anid: orgANId,
                                                orgName: orgName,
                                                json: JSON.stringify(supplier)  // store full supplier object as JSON string
                                            });
                                            console.log(`Inserted new supplier profile for ANID: ${orgANId}`);
                                        } else {
                                            console.log(`Supplier profile already exists for ANID: ${orgANId}`);
                                        }
                                    }
                                }
                            }

                        }
                    } catch (error) {
                        console.error('Error fetching document details:', error);
                    }
                }

            };
        } else {
            console.log('No records found or payload is not an array.');
        }
    }),
        this.on('getSuppliers', async function (req) {
            debugger;
            console.log("req of materialcodes", req.data)
            let materialCodes = req.data.materialCodeList;
            console.log("materialCodes1",materialCodes);
            // if (materialCodes.length === 1 && typeof materialCodes[0] === "string") {
            //     try {
            //         materialCodes = JSON.parse(materialCodes[0]);
            //         console.log("materialCodesafterparse",materialCodes);
            //     } catch (e) {
            //         return "Invalid JSON array";
            //     }
            // }
            // materialCodes = materialCodes[0];
            // console.log("Material codes:", materialCodes);

            const globalSupplierCount = {};
            const globalSupplierDetails = {};
            const supplierMaterialsMap = {};
            // for (let i = 0; i < materialCodes.length; i++) {
            //     const materialCode = materialCodes[i];
            //     let data = await SELECT(suppliers).where({ materialCode: materialCode })
            //     console.log("data", data);
            //     const supplierCount = {};
            //     const supplierDetails = {};

            //     data.forEach(item => {
            //         const anId = item.supplierANId;
            //         supplierCount[anId] = (supplierCount[anId] || 0) + 1;
            //         // Store the first occurrence as representative details
            //         if (!supplierDetails[anId]) {
            //             supplierDetails[anId] = item;
            //         }
            //     });

            //     // Create array of suppliers with count >= 2 including count
            //     const frequentSuppliers = Object.keys(supplierCount)
            //         .filter(anId => supplierCount[anId] >= 2)
            //         .map(anId => ({
            //             ...supplierDetails[anId],
            //             occurrenceCount: supplierCount[anId]
            //         }));

            //     console.log("Frequent Suppliers with counts:", frequentSuppliers);

            //     const suppliersToStore = frequentSuppliers;
            //     console.log("suppliersToStore", suppliersToStore)
            // }
            for (let i = 0; i < materialCodes.length; i++) {
                const materialCode = materialCodes[i];

                const data = await SELECT('suppliers').where({ materialCode });
                console.log(`Data for ${materialCode}:`, data);

                // Count supplier occurrences per material and merge into global count
                data.forEach(item => {
                    const anId = item.supplierANId;
                    globalSupplierCount[anId] = (globalSupplierCount[anId] || 0) + 1;

                    // Save representative supplier details (if not already stored)
                    if (!globalSupplierDetails[anId]) {
                        globalSupplierDetails[anId] = item;
                    }
                    // Track materials this supplier appeared in
                    if (!supplierMaterialsMap[anId]) {
                        supplierMaterialsMap[anId] = new Set();
                    }
                    supplierMaterialsMap[anId].add(materialCode);
                });
            }

            // 👇 After loop, find frequent suppliers across all materials
            const combinedFrequentSuppliers = Object.keys(globalSupplierCount)
                .filter(anId => globalSupplierCount[anId] >= 2) // adjust threshold as needed
                .map(anId => ({
                    ...globalSupplierDetails[anId],
                    occurrenceCount: globalSupplierCount[anId],
                    materialCodes: Array.from(supplierMaterialsMap[anId])
                }));

            console.log("Combined Frequent Suppliers with materials:", combinedFrequentSuppliers);

            // Step 3: Get all supplier JSON profiles in one array
            const supplierJsonArray = [];

            for (const supplier of combinedFrequentSuppliers) {
                const orgANId = supplier.supplierANId;
                const profileRecords = await SELECT('supplierProfile').where({ anid: orgANId });

                if (profileRecords && profileRecords.length > 0) {
                    for (const record of profileRecords) {
                        if (record.json) {
                            try {
                                const profileJson = JSON.parse(record.json); // parse each data string
                                supplierJsonArray.push(profileJson); // add to final array
                            } catch (err) {
                                console.error(`Error parsing supplier profile for ${orgANId}:`, err);
                            }
                        }
                    }
                } else {
                    console.warn(`No supplier profile found for ANID: ${orgANId}`);
                }
            }

            console.log("supplierJsonArray:", supplierJsonArray);


            return JSON.stringify(supplierJsonArray);


        });
}