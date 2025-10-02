# FemiNova - Empowering Women's Voices

A modern, responsive campaign website built for women's empowerment and advocacy.

## Overview

FemiNova is a static website showcasing three main campaigns:
- **Karahasan / Pang-aabuso** - Supporting survivors of gender-based violence
- **Kwentong Balita** - Sharing untold stories from women in our communities  
- **Testimonyal** - Powerful testimonies from women who have overcome challenges

## Tech Stack

- **HTML5** - Semantic markup and structure
- **Tailwind CSS** - Utility-first styling via CDN
- **Vanilla JavaScript** - Client-side interactions and API integration
- **No build system** - Simple, dependency-free development

## Features

- 🎨 **Pink-themed responsive design** optimized for mobile
- 🔍 **Smart search** with keyword-based routing
- 💬 **Daily affirmations** fetched from external API with fallback
- 👥 **Dynamic team section** rendered from JavaScript array
- 📱 **Expandable campaigns** with smooth accordion animations
- 📧 **Contact forms** and authentication modals (demo functionality)
- ♿ **Accessible** with proper labels and keyboard navigation

## Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. **That's it!** No installation or build process required

### Optional: Local Server

For better local development (recommended if adding assets):

```bash
# Python
python -m http.server 8000

# Node.js  
npx serve .
```

Then visit `http://localhost:8000`

## Project Structure

```
FemiNova/
├── index.html              # Main landing page
├── campaigns.html          # Campaign details with accordions
├── Background.png          # Hero section background image
├── assets/
│   └── js/
│       └── main.js        # All JavaScript functionality
├── .github/
│   └── copilot-instructions.md  # AI agent guidance
└── README.md              # This file
```

## Customization

### Update Team Members

Edit the `team` array in `assets/js/main.js`:

```javascript
const team = [
    'Name|email@feminova.org',
    // Add more members in same format
];
```

### Modify Colors

The site uses Tailwind's pink palette. Key classes:
- `text-pink-600`, `bg-pink-600` - Primary pink
- `bg-pink-50`, `text-pink-200` - Light variants  
- `bg-pink-800` - Dark variants

### Add Functionality

- Forms currently show demo alerts
- To add backend integration, replace handlers in `main.js`
- Keep the zero-build approach unless absolutely necessary

## Browser Support

- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Keep changes minimal and preserve the simple architecture
2. Test on mobile devices - this is a mobile-first design
3. Maintain accessibility standards
4. Update this README for any significant changes

## License

© 2025 FemiNova. All rights reserved.
