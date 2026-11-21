import { createElement } from "react";
import { Sparkles } from "lucide-react";
import { advantageIcons } from "@/data/advantageIcons";

const AdvantageIcon = ({ name, ...props }) =>
  createElement(advantageIcons[name]?.icon ?? Sparkles, props);

export default AdvantageIcon;
