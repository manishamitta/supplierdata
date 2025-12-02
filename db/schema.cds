namespace db;

using {managed} from '@sap/cds/common';

entity suppliers : managed {
    key id           : UUID;
        materialCode : String;
        supplierANId : String;
        eventId      : String;
        itemId       : String;
        orgName      : String;
        title        : String;
        email        : String;
        invitationId : String;
        eventDate    : String;
}

entity supplierProfile : managed {
    key anid    : String;
        orgName : String;
        json    : LargeString;

}
