interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}
export const StatusToggle = ({ checked, onChange, label, disabled }: Props) => (
  <label className="statusToggle">
    <input
      type="checkbox"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}/>
    <span>{label}</span>
  </label>
);
