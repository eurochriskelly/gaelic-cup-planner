import { Button } from 'primereact/button';
import chroma from 'chroma-js';
const lighten = (color, amount) => chroma(color).brighten(amount).hex();

const col1 = '#c3c3c3';
const col2 = '#a9a9a9';

const pattern1 = `linear-gradient(45deg, ${col1} 25%, transparent 25%, transparent 50%, ${col1} 50%, ${col1} 75%, transparent 75%, transparent),
            linear-gradient(45deg, ${col2} 25%, transparent 25%, transparent 50%, ${col2} 50%, ${col2} 75%, transparent 75%, transparent)`;
const pattern2 = `radial-gradient(circle, ${col1} 1px, transparent 1px),
            radial-gradient(circle, ${col2} 1px, transparent 1px)`;

function TeamSelect({
    rowData,
    field,
    optionsList,
    participants,
    openDialog
}) {
    const currentValue = rowData[field];
    const currentFriendly = parseCode(currentValue).friendly;
    const isCalcField = currentValue?.startsWith('~');
    const bgColor = participants[currentValue]?.light || null;
    const bgPattern = !bgColor ? {
        backgroundImage: isCalcField ? pattern2 : pattern1,
        backgroundSize: isCalcField ? '7px 7px' : '30px 30px'
    } : {};
    const style = field.startsWith('umpire')
        ? {
            color: participants[currentValue]?.vdark || 'black',
            backgroundColor: bgColor || lighten(col1, 0.5),
        }
        : {
            border: '1px solid #ccc',
            backgroundColor: bgColor || lighten(col2, 0.1),
        }
    return (
        <div className="editable-cell" style={{
            ...bgPattern,
            ...style,
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '0.7rem',
            width: '90%',
            borderRadius: '5px',
        }}>
            <span>{currentFriendly?.toUpperCase() || <i>&nbsp;</i>}</span>
            <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"gg
                onClick={() => openDialog(rowData, field, optionsList)}
            />
        </div>
    );
}

export default TeamSelect;

export function parseCode(
    code
) {
    const result = {
        friendly: code,
    };

    if (code?.startsWith('~group')) {
        const [groupPart, placePart] = code.split('/p:');
        const groupNumber = parseInt(groupPart.split(':')[1], 10);
        const placeNumber = parseInt(placePart, 10);

        result.type = 'group';
        result.group = groupNumber;
        result.place = placeNumber;
        result.friendly = `${placeNumber}${placeNumber === 1 ? 'st' : placeNumber === 2 ? 'nd' : placeNumber === 3 ? 'rd' : 'th'} in group ${groupNumber}`;
    } else if (code?.startsWith('~match')) {
        const [matchPart, placePart] = code.split('/p:');
        const matchNumber = parseInt(matchPart.split(':')[1], 10);
        const placeNumber = parseInt(placePart, 10);

        result.type = 'match';
        result.match = matchNumber;
        result.place = placeNumber;
        result.friendly = `${placeNumber === 1 ? 'winner' : 'loser'} of #${matchNumber}`;
    }
    return result;
}
