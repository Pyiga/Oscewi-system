import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/logo.jpg" // <-- image path relative to the public folder
            alt="Oscewi Logo"
        />
    );
}