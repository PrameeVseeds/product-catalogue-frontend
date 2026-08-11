import { useId, useMemo, useState } from "react";
import { DynamicIcon } from "../common/dynamicIcon";
import { getIconOption, iconOptions } from "../../utils/iconMap";

interface Props {
  value: string | null;
  onChange: (value: string | null) => void;
}

export const IconPicker = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState("");
  const pickerId = useId(),
    selected = getIconOption(value);
  const options = useMemo(
    () =>
      iconOptions.filter((option) =>
        option.label.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [search],
  );
  return (
    <div className="iconPicker">
      <button
        className="iconPickerTrigger"
        type="button"
        aria-expanded={open}
        aria-controls={pickerId}
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? (
          <>
            <DynamicIcon name={selected.name} aria-hidden="true" />
            <span>
              <small>Selected icon</small>
              {selected.label}
            </span>
          </>
        ) : (
          <span>
            <small>Selected icon</small>No icon
          </span>
        )}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="iconPickerPanel" id={pickerId}>
          <label>
            Search icons
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search curated icons"/>
          </label>
          <div
            className="iconPickerGrid"
            role="listbox"
            aria-label="Choose an icon">
            {options.map((option) => (
              <button
                key={option.name}
                type="button"
                role="option"
                aria-selected={value === option.name}
                className={value === option.name ? "isSelected" : ""}
                onClick={() => {
                  onChange(option.name);
                  setOpen(false);
                }}>
                <DynamicIcon name={option.name} aria-hidden="true" />
                <span>{option.label}</span>
                {value === option.name && <small>Selected</small>}
              </button>
            ))}
          </div>
          {!options.length && <p className="emptyState">No matching icons.</p>}
          <button
            className="adminButton textButton"
            type="button"
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}>
            Clear / No Icon
          </button>
        </div>
      )}
    </div>
  );
};
