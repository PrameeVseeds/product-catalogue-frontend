import { useState } from "react";
import {getSocialPlatform,socialPlatformOptions,type SocialPlatform,} from "../../config/socialPlatformConfig";

interface SocialPlatformPickerProps {
  value: string;
  onChange: (value: SocialPlatform) => void;
}

export const SocialPlatformPicker = ({value,onChange,}: SocialPlatformPickerProps) => {
  const [open, setOpen] = useState(false);
  const selected = getSocialPlatform(value);
  const SelectedIcon = selected?.icon;

  return (
    <div className="socialPlatformPicker">
      <button
        className="socialPlatformTrigger"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {SelectedIcon && (
          <span
            className="socialPlatformIcon"
            style={{
              backgroundColor: selected.brandColor,
              color: selected.iconColor,
            }}
          >
            <SelectedIcon aria-hidden="true" />
          </span>
        )}
        <span>{selected?.label ?? "Choose a platform"}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div
          className="socialPlatformOptions"
          role="listbox"
          aria-label="Social platforms"
        >
          {socialPlatformOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === selected?.value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                className={isSelected ? "isSelected" : undefined}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span
                  className="socialPlatformIcon"
                  style={{
                    backgroundColor: option.brandColor,
                    color: option.iconColor,
                  }}
                >
                  <Icon aria-hidden="true" />
                </span>
                <span>{option.label}</span>
                {isSelected && <span className="visuallyHidden">Selected</span>}
              </button>
            );
          })}
        </div>
      )}
      {selected && SelectedIcon && (
        <div className="socialPlatformPreview">
          <span>Preview</span>
          <span
            className="socialPlatformIcon"
            style={{
              backgroundColor: selected.brandColor,
              color: selected.iconColor,
            }}
          >
            <SelectedIcon aria-hidden="true" />
          </span>
          <strong>{selected.label}</strong>
        </div>
      )}
    </div>
  );
};
