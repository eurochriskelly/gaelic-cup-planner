import Select from 'react-select';
import './CategorySelect.scss';

const CategorySelect = ({
  categories = [],
  onSelect = () => {}
}) => {
  return (
    <div className="categorySelect">
      <span>&nbsp;</span>
      <span>
        <Select
          options={categories.map(cat => ({ value: cat, label: cat }))}
          onChange={onSelect}
          placeholder="Choose competition..."
        />
      </span>
    </div>
  )
};

export default CategorySelect;
