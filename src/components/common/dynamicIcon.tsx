import type { ComponentProps } from "react";
import { getIconOption } from "../../utils/iconMap";

interface Props extends Omit<ComponentProps<"svg">, "ref" | "name"> {
  name?: string | null;
}

export const DynamicIcon = ({ name, ...props }: Props) => {
  const option = getIconOption(name);
  if (!option) return null;
  const Icon = option.icon;
  return <Icon {...props} />;
};
