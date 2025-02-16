export const disasterTypesView = (disasterType) => {
    const disaterTypesList = {
        'wildfire': 'Wildfire',
        'flood': 'Flood',
        'earthquake': 'Earthquake',
        'hurricane': 'Hurricane',
        'drought': 'Drought',
        'tsunami': 'Tsunami',
        'other': 'Other'
    };

    const disasterTypes = Object.keys(disaterTypesList).map(value => ({
        value,
        label: disaterTypesList[value],
        selected: value === disasterType ? 'selected' : '',
    }));

    return disasterTypes;
}