import { useState, useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button"; // Import Button for icons
import "./StageSelector.scss";

function StageSelector({
  preliminaryStages,
  knockoutStages,
  setKnockoutStages,
  setPreliminaryStages
}) {
  // State to manage edit modes
  const [isEditingPreliminary, setIsEditingPreliminary] = useState(false);
  const [isEditingKnockout, setIsEditingKnockout] = useState(false);

  // Handlers for preliminary stages
  const handlePreliminaryChange = (e) => {
      const updatedStages = e.checked
          ? [...preliminaryStages, e.value]
          : preliminaryStages.filter(stage => stage !== e.value);
      setPreliminaryStages(updatedStages);
  };

  // Handlers for knockout stages
  const handleKnockoutChange = (e) => {
      const updatedStages = e.checked
          ? [...knockoutStages, e.value]
          : knockoutStages.filter(stage => stage !== e.value);
      setKnockoutStages(updatedStages);
  };

  // Toggle edit mode for preliminary stages
  const toggleEditPreliminary = () => {
      setIsEditingPreliminary(!isEditingPreliminary);
  };

  // Toggle edit mode for knockout stages
  const toggleEditKnockout = () => {
      setIsEditingKnockout(!isEditingKnockout);
  };

  return (
    <section className="StageSelector">
      <table className="w-full">
        <thead>
            <tr>
                {/* Preliminary Stages Header */}
                <th>
                    <div className="header-container">
                        <h3>Preliminary Stages</h3>
                        <Button 
                            icon={isEditingPreliminary ? "pi pi-save" : "pi pi-pencil"} 
                            className="p-button-text edit-button" 
                            onClick={toggleEditPreliminary} 
                            aria-label={isEditingPreliminary ? "Save" : "Edit"} 
                        />
                    </div>
                </th>
                {/* Knockout Stages Header */}
                <th>
                    <div className="header-container">
                        <h3>Knockout Stages</h3>
                        <Button 
                            icon={isEditingKnockout ? "pi pi-save" : "pi pi-pencil"} 
                            className="p-button-text edit-button" 
                            onClick={toggleEditKnockout} 
                            aria-label={isEditingKnockout ? "Save" : "Edit"} 
                        />
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                {/* Preliminary Stages Content */}
                <td>
                    {isEditingPreliminary ? (
                        <div className="card flex flex-wrap justify-content-center gap-3">
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId="prelim-group" 
                                    name="preliminary" 
                                    value="Group" 
                                    onChange={handlePreliminaryChange} 
                                    checked={preliminaryStages.includes('Group')} 
                                />
                                <label htmlFor="prelim-group" className="ml-2">Group</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId="prelim-playoffs" 
                                    name="preliminary" 
                                    value="Playoffs" 
                                    onChange={handlePreliminaryChange} 
                                    checked={preliminaryStages.includes('Playoffs')} 
                                />
                                <label htmlFor="prelim-playoffs" className="ml-2">Playoffs</label>
                            </div>
                            {/* Add more preliminary stages here if needed */}
                        </div>
                    ) : (
                        <div className="selected-stages">
                            {preliminaryStages.length > 0 ? (
                                preliminaryStages.map(stage => (
                                    <span key={stage} className="stage-item">{stage}</span>
                                ))
                            ) : (
                                <span className="no-selection">No stages selected</span>
                            )}
                        </div>
                    )}
                </td>
                {/* Knockout Stages Content */}
                <td>
                    {isEditingKnockout ? (
                        <div className="card flex flex-wrap justify-content-center gap-3">
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId="knockout-cup" 
                                    name="knockout" 
                                    value="Cup" 
                                    onChange={handleKnockoutChange} 
                                    checked={knockoutStages.includes('Cup')} 
                                />
                                <label htmlFor="knockout-cup" className="ml-2">Cup</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId="knockout-shield" 
                                    name="knockout" 
                                    value="Shield" 
                                    onChange={handleKnockoutChange} 
                                    checked={knockoutStages.includes('Shield')} 
                                />
                                <label htmlFor="knockout-shield" className="ml-2">Shield</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId="knockout-plate" 
                                    name="knockout" 
                                    value="Plate" 
                                    onChange={handleKnockoutChange} 
                                    checked={knockoutStages.includes('Plate')} 
                                />
                                <label htmlFor="knockout-plate" className="ml-2">Plate</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox 
                                    inputId="knockout-spoon" 
                                    name="knockout" 
                                    value="Spoon" 
                                    onChange={handleKnockoutChange} 
                                    checked={knockoutStages.includes('Spoon')} 
                                />
                                <label htmlFor="knockout-spoon" className="ml-2">Spoon</label>
                            </div>
                            {/* Add more knockout stages here if needed */}
                        </div>
                    ) : (
                        <div className="selected-stages">
                            {knockoutStages.length > 0 ? (
                                knockoutStages.map(stage => (
                                    <span key={stage} className="stage-item">{stage}</span>
                                ))
                            ) : (
                                <span className="no-selection">No stages selected</span>
                            )}
                        </div>
                    )}
                </td>
            </tr>
        </tbody>
      </table>
    </section>
  );
}

export default StageSelector;
