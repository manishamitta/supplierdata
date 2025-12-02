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
            Label : 'supplierANId',
            Value : supplierANId,
        },
        {
            $Type : 'UI.DataField',
            Label : 'materialCode',
            Value : materialCode,
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
            $Type : 'UI.DataFieldForAction',
            Action : 'MyService.EntityContainer/getSuppliers',
            Label : 'getSuppliers',
        },
    ],
);

