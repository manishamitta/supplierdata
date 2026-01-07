using MyService as service from '../../srv/service';
annotate service.suppliers with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'materialCode',
                Value : materialCode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'supplierANId',
                Value : supplierANId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'eventId',
                Value : eventId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'itemId',
                Value : itemId,
            },
            {
                $Type : 'UI.DataField',
                Label : 'orgName',
                Value : orgName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'title',
                Value : title,
            },
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'invitationId',
                Value : invitationId,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'Supplier ANID',
            Value : supplierANId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'MaterialCode',
            Value : materialCode,
        },
        {
            $Type : 'UI.DataField',
            Label : 'Organization Name',
            Value : orgName,
        },
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'MyService.EntityContainer/getSuppliers',
            Label : 'getSuppliers',
            @UI.Hidden,
        },
        {
            $Type : 'UI.DataField',
            Value : email,
            Label : 'Email',
        },
        {
            $Type : 'UI.DataField',
            Value : eventId,
            Label : 'EventId',
        },
        {
            $Type : 'UI.DataField',
            Value : title,
            Label : 'Title',
        },
        {
            $Type : 'UI.DataField',
            Value : itemId,
            Label : 'ItemId',
        },
    ],
);

