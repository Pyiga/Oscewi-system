import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
  const tealColor = '#008080';

  return (
    <div className="flex items-center"> {/* Added a container for flex layout */}
      <div className="aspect-square size-8 rounded-md flex items-center justify-center" style={{ backgroundColor: tealColor }}>
        <AppLogoIcon className="size-full fill-white" /> {/* Made the icon size full and fill white for contrast */}
      </div>
      <div className="ml-2 text-left text-sm"> {/* Increased margin for better spacing */}
        <span className="mb-0.5 truncate leading-none font-bold" style={{ color: tealColor }}>OSCEWI</span> {/* Applied teal color to the text */}
      </div>
    </div>
  );
}