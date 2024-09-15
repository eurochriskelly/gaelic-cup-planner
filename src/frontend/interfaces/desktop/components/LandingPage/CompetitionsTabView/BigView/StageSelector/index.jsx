import { useState } from "react";
import { Checkbox } from "primereact/checkbox";

import "./StageSelector.scss";

function StageSelector() {
    const [stages, setStages] = useState([]);
    const onStageChange = (e) => {
        let _stages = [...stages];
        if (e.checked) _stages.push(e.value);
        else _stages.splice(_stages.indexOf(e.value), 1);
        setStages(_stages);
    }
    return (
        <section className="StageSelector">
          <table>
            <tbody className='table-auto'>
              <tr>
                <td>
                  <h3>Preliminary Stages</h3>
                </td>
                <td>
                  <h3>Knockout Stages</h3>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="card flex flex-wrap justify-content-center gap-3">
                    <div className="flex align-items-center">
                        <Checkbox inputId="stage1" name="group" value="group" onChange={onStageChange} checked={stages.includes('Group')} />
                        <label htmlFor="stage1" className="ml-2">Group</label>
                    </div>
                    <div className="flex align-items-center">
                        <Checkbox inputId="stage2" name="playoffs" value="playoffs" onChange={onStageChange} checked={stages.includes('Playoffs')} />
                        <label htmlFor="stage2" className="ml-2">Playoffs</label>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="card flex flex-wrap justify-content-center gap-3">
                    <div className="flex align-items-center">
                        <Checkbox inputId="stage3" name="cup" value="cup" onChange={onStageChange} checked={stages.includes('Cup')} />
                        <label htmlFor="stage3" className="ml-2">Cup</label>
                    </div>
                    <div className="flex align-items-center">
                        <Checkbox inputId="stage4" name="shield" value="shield" onChange={onStageChange} checked={stages.includes('Shield')} />
                        <label htmlFor="stage4" className="ml-2">Shield</label>
                    </div>
                    <div className="flex align-items-center">
                        <Checkbox inputId="stage5" name="plate" value="plate" onChange={onStageChange} checked={stages.includes('Plate')} />
                        <label htmlFor="stage5" className="ml-2">Plate</label>
                    </div>
                    <div className="flex align-items-center">
                        <Checkbox inputId="stage6" name="spoon" value="spoon" onChange={onStageChange} checked={stages.includes('Spoon')} />
                        <label htmlFor="stage6" className="ml-2">Spoon</label>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
    )
}

export default StageSelector;

