using db from '../db/schema';

service MyService {
    entity suppliers as projection on db.suppliers;
    entity supplierProfile as projection on db.supplierProfile;
    function supplierUpdate(fromDate: String, toDate: String) returns String;
    action getSuppliers(materialCodeList : array of String) returns String;
}
