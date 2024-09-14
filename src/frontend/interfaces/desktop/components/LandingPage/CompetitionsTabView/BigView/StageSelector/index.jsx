import { useState } from "react";
import { Checkbox } from "primereact/checkbox";

function StageSelector() {
    const [stages, setStages] = useState([]);

    const onStageChange = (e) => {
        let _stages = [...stages];
        if (e.checked)
            _stages.push(e.value);
        else
            _stages.splice(_stages.indexOf(e.value), 1);
        setstages(_stages);
    }

    return (
        <div className="card flex flex-wrap justify-content-center gap-3">
            <div className="flex align-items-center">
                <Checkbox inputId="stage1" name="pizza" value="Group" onChange={onStageChange} checked={stages.includes('Group')} />
                <label htmlFor="stage1" className="ml-2">Group</label>
            </div>
            <div className="flex align-items-center">
                <Checkbox inputId="stage2" name="pizza" value="Mushroom" onChange={onStageChange} checked={stages.includes('Playoffs')} />
                <label htmlFor="stage2" className="ml-2">Playoffs</label>
            </div>
            <div className="flex align-items-center">
                <Checkbox inputId="stage3" name="pizza" value="Pepper" onChange={onStageChange} checked={stages.includes('Pepper')} />
                <label htmlFor="stage3" className="ml-2">Pepper</label>
            </div>
            <div className="flex align-items-center">
                <Checkbox inputId="stage4" name="pizza" value="Onion" onChange={onStageChange} checked={stages.includes('Onion')} />
                <label htmlFor="stage4" className="ml-2">Onion</label>
            </div>
        </div>
    )
}

export default StageSelector;
