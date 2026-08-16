import { IconRecycle } from "./icons";

const VECTOR_MAP: Record<string, string> = {
  plastic: "/vectors/plastic.png",
  paper: "/vectors/paper.png",
  glass: "/vectors/glassa.png",
  metal: "/vectors/metal.png",
  organic: "/vectors/organic.png",
  electronic: "/vectors/electronics.png",
  battery: "/vectors/harzardous.png",
  general: "/vectors/general.png",
};

export function CategoryIcon({
  iconKey,
  className = "h-6 w-6",
  alt = "Waste category",
  style,
}: {
  iconKey?: string;
  className?: string;
  alt?: string;
  style?: React.CSSProperties;
}) {
  const src = iconKey ? VECTOR_MAP[iconKey] : null;

  if (src) {
    return (
      <img
        alt={alt}
        className={className}
        src={src}
        style={style}
      />
    );
  }

  return <IconRecycle className={className} />;
}
