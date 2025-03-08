# ContractFlow Dashboard

A modern, responsive dashboard for ContractFlow - a SaaS platform for contract management and automation.

## Project Overview

This dashboard is built using pure vanilla technologies:
- HTML5
- CSS3
- JavaScript (ES6+)

No external libraries or frameworks are used - everything is implemented from scratch.

## Features

- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Modular Architecture**: Component-based structure for reusability
- **Client-side Routing**: Hash-based navigation without page reloads
- **State Management**: Centralized state with pub/sub pattern and localStorage persistence
- **Interactive Charts**: Custom-built visualizations using Canvas API
- **Dark Mode**: Full support for light and dark themes
- **Role-based Access Control**: Different views based on user permissions

## Project Structure

```
contractflow-dashboard/
├── index.html                # Main HTML file
├── css/
│   ├── variables.css         # CSS variables (colors, typography, spacing)
│   ├── base.css              # Global styles and reset
│   └── components/           # Component-specific styles
├── js/
│   ├── app.js                # Application initialization
│   ├── router.js             # Hash-based routing system
│   ├── auth.js               # Authentication management
│   ├── state.js              # Centralized state management
│   ├── components/           # UI components
│   ├── pages/                # Page controllers
│   ├── models/               # Mock data models
│   └── utils/                # Utility functions
└── assets/                   # Images, icons, etc.
```

## Running the Project

This project doesn't require any build steps or server. Simply open `index.html` in a modern browser.

For the best experience, use a recent version of Chrome, Firefox, Safari, or Edge.

## Demo Accounts

You can log in with any of these demo accounts:

- **Admin**: admin@example.com (any password)
- **Editor**: editor@example.com (any password)
- **Viewer**: viewer@example.com (any password)

## Development Principles

- **Clean Code**: Maintainable and well-documented
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: ARIA attributes and keyboard navigation
- **Mobile-First**: Designed for small screens first, then enhanced for larger ones

## License

This project is for demonstration purposes only. 
