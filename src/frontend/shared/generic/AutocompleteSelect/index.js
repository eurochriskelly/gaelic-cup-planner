import React, { useEffect, useState } from 'react';
import styles from './AutocompleteSelect.module.scss';

const AutocompleteSelect = ({ 
    options,
    limit = 100,
    selectAction=() => {}
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options.slice(0, limit))
  }, [options])

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions(filtered.slice(0, limit));
  };

  return (
    <div className={styles.autocompleteSelect}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Type to search..."
      />
      <ul>
        {filteredOptions.map((option, index) => (
          <li key={index} onClick={selectAction.bind(null, option)}>{option}</li>
        ))}
      </ul>
    </div>
  );
};

export default AutocompleteSelect;

// Usage Example
// <AutocompleteSelect options={['Option 1', 'Option 2', 'Option 3']} />
