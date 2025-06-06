import './FilterWidget.scss';

function FilterWidget({
  onChangeSelect, choices
}) {
  const itemsPerPage = 3;

  // Find default category
  const defaultCategoryIndex = choices.findIndex(choice => choice.default);
  const initialCategory = defaultCategoryIndex !== -1 ? defaultCategoryIndex : 0;

  const [currentCategory, setCurrentCategory] = React.useState(initialCategory);
  const [selections, setSelections] = React.useState(() => {
    const init = {};
    choices.forEach(choice => init[choice.category] = []);
    return init;
  });
  const [isCategorySelectorOpen, setIsCategorySelectorOpen] = React.useState(false);
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
    let newSelections = { ...selections };

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

    setSelections(newSelections);

    // Format selections for onChangeSelect
    const formattedSelections = {};
    Object.keys(newSelections).forEach(cat => {
      const catChoice = choices.find(c => c.category === cat);
      formattedSelections[cat] = catChoice.allowMultiselect ? newSelections[cat] : (newSelections[cat][0] || null);
    });
    onChangeSelect(formattedSelections);
  };

  const handlePrevPage = () => {
    if (startIndex > 0) setStartIndex(Math.max(0, startIndex - itemsPerPage));
  };

  const handleNextPage = () => {
    if (startIndex + itemsPerPage < totalChoices) setStartIndex(startIndex + itemsPerPage);
  };

  if (isCategorySelectorOpen) {
    return <>
      <div className="label">Apply schedule filter</div>
      <div className="FilterWidget p-2 rounded-lg flex space-x-4 w-128">
        {choices.map((choice, index) => (
          <button
            key={choice.category}
            onClick={() => handleCategoryClick(index)}
            className="filter-icon flex-1 text-white p-2 rounded hover:bg-green-700 flex flex-col items-center"
          >
            <span className="text-sm">[Icon: {choice.icon}]</span>
            <span className="text-xs uppercase">{choice.category}</span>
          </button>
        ))}
      </div>
    </>;
  }

  return <>
    <div className="label">Apply schedule filter</div>
    <div className="FilterWidget p-2 rounded-lg flex h-48">
      <div>
        <div
          className="filter-icon text-white w-24 h-24 flex items-center justify-center rounded cursor-pointer"
          onClick={() => setIsCategorySelectorOpen(true)}
        >
          <span className="text-xs">[Icon: {currentChoice.icon}]</span>
        </div>
        <div className="text-center text-xl uppercase mt-2">
          {currentChoice.category}
        </div>
      </div>
      <div className="flex-1 px-2">
        <div className="space-y-1">
          {displayedChoices.map((choice, index) => {
            const isSelected = selections[currentChoice.category].includes(choice);
            return (
              <div
                key={index}
                onClick={() => handleChoiceClick(choice)}
                className="flex items-center uppercase text-purple-600 cursor-pointer text-sm"
              >
                <span className="mr-2 text-3xl">{isSelected ? '●' : '○'}</span>
                <span>{choice}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col items-center justify-between">
        <button
          onClick={handlePrevPage}
          disabled={startIndex === 0}
          className="text-green-600 disabled:text-gray-400"
        >
          ▲
        </button>
        <div className="text-2xl">{currentPage}/{totalPages}</div>
        <button
          onClick={handleNextPage}
          disabled={startIndex + itemsPerPage >= totalChoices}
          className="text-green-600 disabled:text-gray-400"
        >
          ▼
        </button>
      </div>
    </div>
  </>;
};

export default FilterWidget;
