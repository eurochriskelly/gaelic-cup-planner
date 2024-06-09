import { useEffect, useState } from 'react';
import styles from './AutocompleteSelect.module.scss';

const AutocompleteSelect = ({
  options,
  limit = 100,
  selectAction = () => { }
}) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  // make limit number of blanks
  const blanks = Array(limit).fill('')

  useEffect(() => {
    setFilteredOptions([...options, ...blanks].slice(0, limit))
  }, [options])

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    const filtered = options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredOptions([...filtered, ...blanks].slice(0, limit));
  };

  return (
    <div className={styles.autocompleteSelect}>
      <div className={styles.control}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type to search..."
        />
      </div>
      <div>
        {filteredOptions.map((option, index) => (
          option == '' 
          ? <p>~</p> 
          : <span key={index} 
            className={option === '' ? 'blnk' : 'optn'} 
            onClick={selectAction.bind(null, option)}>{option}</span>
        ))}
      </div>
    </div>
  );
};

export default AutocompleteSelect;

// Usage Example
// <AutocompleteSelect options={['Option 1', 'Option 2', 'Option 3']} />
