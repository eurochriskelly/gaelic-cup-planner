import CategoryIcon from '../../../../../shared/icons/icon-competition.svg?react';
import PitchesIcon from '../../../../../shared/icons/icon-pitches.svg?react';
import TeamIcon from '../../../../../shared/icons/icon-team.svg?react';
import RefIcon from '../../../../../shared/icons/icon-referee.svg?react';

import './FilterWidget.scss';

function FilterWidget({
  onChangeSelect, choices
}) {
  const itemsPerPage = 3;

  // Find default category
  const defaultCategoryIndex = choices.findIndex(choice => choice.default);
  const initialCategory = defaultCategoryIndex !== -1 ? defaultCategoryIndex : 0;

  // Initialize with category selector open by default
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = React.useState(true);
  const [currentCategory, setCurrentCategory] = React.useState(initialCategory);
  
  // Separate pending (temporary) selections from applied (saved) selections
  const [pendingSelections, setPendingSelections] = React.useState(() => {
    const init = {};
    choices.forEach(choice => {
      // Make sure we handle the case where selected could be an array or a single value
      init[choice.category] = choice.allowMultiselect 
        ? (Array.isArray(choice.selected) ? [...choice.selected] : (choice.selected ? [choice.selected] : []))
        : (choice.selected ? [choice.selected] : []);
    });
    return init;
  });
  
  const [appliedSelections, setAppliedSelections] = React.useState(() => {
    const init = {};
    choices.forEach(choice => {
      // Same fix for applied selections
      init[choice.category] = choice.allowMultiselect 
        ? (Array.isArray(choice.selected) ? [...choice.selected] : (choice.selected ? [choice.selected] : []))
        : (choice.selected ? [choice.selected] : []);
    });
    return init;
  });
  
  const [startIndex, setStartIndex] = React.useState(0);

  const currentChoice = choices[currentCategory];
  const totalChoices = currentChoice.choices.length;
  const totalPages = Math.ceil(totalChoices / itemsPerPage);
  const currentPage = Math.floor(startIndex / itemsPerPage) + 1;
  const displayedChoices = currentChoice.choices.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryClick = (index) => {
    setCurrentCategory(index);
    setStartIndex(0);
    setIsCategorySelectorOpen(false);
  };

  const handleChoiceClick = (choice) => {
    const category = currentChoice.category;
    const allowMultiselect = currentChoice.allowMultiselect;
    let newSelections = { ...pendingSelections };

    if (allowMultiselect) {
      const index = newSelections[category].indexOf(choice);
      if (index === -1) {
        newSelections[category] = [...newSelections[category], choice];
      } else {
        newSelections[category] = newSelections[category].filter(c => c !== choice);
      }
    } else {
      newSelections[category] = [choice];
    }

    setPendingSelections(newSelections);
  };

  const handleSaveFilter = () => {
    const category = currentChoice.category;
    const newAppliedSelections = {
      ...appliedSelections,
      [category]: pendingSelections[category]
    };
    
    setAppliedSelections(newAppliedSelections);
    
    // Format selections for onChangeSelect
    const formattedSelections = {};
    Object.keys(newAppliedSelections).forEach(cat => {
      const catChoice = choices.find(c => c.category === cat);
      if (catChoice) {
        // Ensure we properly format multiselect values as arrays and single select as single values
        formattedSelections[cat] = catChoice.allowMultiselect 
          ? [...newAppliedSelections[cat]]  // Return array for multiselect
          : (newAppliedSelections[cat].length > 0 ? newAppliedSelections[cat][0] : null);  // Return first item or null
      }
    });
    
    onChangeSelect(formattedSelections);
    
    // Return to category selection
    setIsCategorySelectorOpen(true);
  };

  const handleCancelFilter = () => {
    // Reset pending selections to applied selections for this category
    setPendingSelections({
      ...pendingSelections,
      [currentChoice.category]: [...appliedSelections[currentChoice.category]]
    });
    
    // Return to category selection
    setIsCategorySelectorOpen(true);
  };

  const handlePrevPage = () => {
    if (startIndex > 0) setStartIndex(Math.max(0, startIndex - itemsPerPage));
  };

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < totalChoices) setStartIndex(startIndex + itemsPerPage);
  };

  // Category selector view
  if (isCategorySelectorOpen) {
    return <>
      <div className="label">Choose schedule filter</div>
      <div className="FilterWidget p-2 rounded-lg flex w-128 justify-center gap-18">
        {choices.map((choice, index) => {
          let IconComponent = null;
          if (choice.icon === 'CompIcon' || choice.icon === 'CategoryIcon') IconComponent = CategoryIcon;
          else if (choice.icon === 'PitchIcon' || choice.icon === 'PitchesIcon') IconComponent = PitchesIcon;
          else if (choice.icon === 'RefIcon' || choice.icon === 'RefIcon') IconComponent = RefIcon;
          else if (choice.icon === 'TeamIcon') IconComponent = TeamIcon;
          
          // Get the applied selections for this category
          const selectedValues = appliedSelections[choice.category] || [];
          const hasSelections = selectedValues.length > 0;
          
          return (
            <div key={choice.category} className="flex flex-col items-center mb-3 mx-2">
              <button
                onClick={() => handleCategoryClick(index)}
                className={`filter-icon rounded hover:bg-green-700 flex items-center justify-center focus:outline-none ${hasSelections ? 'filter-active' : ''}`}
                style={{background:'none', border: 'none'}}
              >
                {IconComponent ? <IconComponent className="w-48 h-40" /> : <span className="text-sm">[Icon: {choice.icon}]</span>}
              </button>
              
              <div className="flex m-4 justify-center mt-1 max-w-72 white-space-nowrap ellipsis">
                {hasSelections ? (
                  selectedValues.map((value, i) => (
                    <div 
                      key={i} 
                      className="bg-green-600 text-white uppercase rounded-full px-2 py-1 text-3xl m-1 white-space-nowrap min-w-24 center"
                      style={{ fontSize: '1.4rem', whiteSpace: 'nowrap' }}
                    >
                      {value}
                    </div>
                  ))
                ) : (
                  <div 
                    className="bg-gray-300 text-gray-600 rounded-full px-2 py-1 text-xs m-1"
                    style={{ fontSize: '1.3rem' }}
                  >
                    ...
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>;
  }

  // Filter values view
  return <>
    <div className="label">Set filter: {currentChoice.category}</div>
    <div className="FilterWidget p-2 rounded-lg flex h-64">
      <div className="filter-icon flex flex-col items-center justify-center cursor-pointer" onClick={() => setIsCategorySelectorOpen(true)}>
        {(() => {
          let IconComponent = null;
          if (currentChoice.icon === 'CompIcon' || currentChoice.icon === 'CategoryIcon') IconComponent = CategoryIcon;
          else if (currentChoice.icon === 'PitchIcon' || currentChoice.icon === 'PitchesIcon') IconComponent = PitchesIcon;
          else if (currentChoice.icon === 'RefIcon' || currentChoice.icon === 'RefIcon') IconComponent = RefIcon;
          else if (currentChoice.icon === 'TeamIcon') IconComponent = TeamIcon;
          return IconComponent ? <IconComponent className="w-64 h-64" /> : <span className="text-sm">[Icon: {currentChoice.icon}]</span>;
        })()}
      </div>
      <div className="flex-1 px-2">
        {totalChoices === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-600 text-2xl text-center">There are no choices for category "{currentChoice.category}" at this time</p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayedChoices.map((choice, index) => {
              const isSelected = pendingSelections[currentChoice.category].includes(choice);
              return (
                <div
                  key={index}
                  onClick={() => handleChoiceClick(choice)}
                  className="flex items-center uppercase text-purple-600 cursor-pointer text-sm"
                >
                  <span className="mr-2 text-5xl">{isSelected ? '●' : '○'}</span>
                  <span className="text-3xl">{choice}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col items-center justify-between mr-6">
          <button
            onClick={handlePrevPage}
            disabled={startIndex === 0}
            className="text-green-600 disabled:text-gray-400 text-3xl"
            style={{background:'none'}}
          >
            ▲
          </button>
          <div className="text-2xl">{currentPage}/{totalPages}</div>
          <button
            onClick={handleNextPage}
            disabled={startIndex + itemsPerPage >= totalChoices}
            className="text-green-600 disabled:text-gray-400 text-3xl"
          >
            ▼
          </button>
        </div>
      )}
      <div className="flex flex-col items-center justify-center ml-2 space-y-2">
        <button
          onClick={handleCancelFilter}
          className="bg-gray-300 w-48 text-gray-800 px-3 py-1 rounded hover:bg-gray-400 text-xs"
          style={{ fontSize: '1.3rem', width: '6rem' }}
        >
          Cancel
        </button>
        {totalChoices > 0 && (
          <button
            onClick={handleSaveFilter}
            className="bg-green-600 w-48 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
            style={{ fontSize: '1.3rem', width: '6rem' }}
          >
            Save
          </button>
        )}
      </div>
    </div>
  </>;
};


export default FilterWidget;
