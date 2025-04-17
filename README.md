# Time Tracker

A secure, client-side time tracking PWA designed for remote student workers at the University of Arizona.

## Table of Contents

- [Time Tracker](#time-tracker)  
  - [Table of Contents](#table-of-contents)  
  - [Overview](#overview)  
  - [Key Features](#key-features)  
  - [Technologies Used](#technologies-used)  
  - [Development](#development)  
  - [License](#license)

## Screenshot

![Screenshot](./assets/screenshots/screenshot.png)

## Overview

Time Tracker is a lightweight, browser-based progressive web application, or PWA. It enables remote student workers to track their working hours efficiently. The application operates entirely on the client side, ensuring that all data remains within the user's browser, never touches external servers, and is encrypted at rest. This design choice is crucial for adhering to the Family Educational Rights and Privacy Act (FERPA) requirements, which necessitate the strict safeguarding of sensitive student data.

## Key Features

- **Client-Side Operation**: All functionalities are executed within the user's browser, eliminating the need for server-side interactions.
- **Secure Data Storage**: Utilizes AES-256-GCM encryption to protect event data in `localStorage`.
- **User-Friendly Interface**: Simple and intuitive UI with support for `light` and `dark` modes for starting, stopping, and reviewing time logs.
- **Persistent Data**: Encrypted time events persist across sessions using the browser's `localStorage`.
- **Static Deployment**: Hosted as a static page on GitHub Pages, ensuring ease of access and maintenance.

## Usage

The app can be used in the browser or [installed on your system as a PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing).

**Visit** : [`https://iitoneloc.github.io/time-tracker/`](https://iitoneloc.github.io/time-tracker/)
  

## Technologies Used

| Technology    | Description                                                                                                 | Link                                     |
|---------------|-------------------------------------------------------------------------------------------------------------|------------------------------------------|
| Vite          | A fast and modern build tool for front-end development.                                                     | [https://vitejs.dev/](https://vitejs.dev/) |
| Vite PWA      | A zero-config, framework-agnostic PWA plugin for Vite, enabling Progressive Web App features.              | [https://vite-pwa-org.web.app/](https://vite-pwa-org.web.app/) |
| Preact        | A lightweight, 3kb alternative to React.js with the same API for building user interfaces.                  | [https://preact.dev/](https://preact.dev/) |
| TypeScript    | Provides static typing for improved code quality and maintainability.                                       | [https://www.typescriptlang.org/](https://www.typescriptlang.org/) |
| PBKDF2        | Used for secure password-based key derivation, strengthening user passwords for cryptographic use.           | [https://en.wikipedia.org/wiki/PBKDF2](https://en.wikipedia.org/wiki/PBKDF2) |
| AES-256-GCM   | Advanced Encryption Standard with a 256-bit key in Galois/Counter Mode, providing both confidentiality and authenticated encryption for secure data storage. | [https://en.wikipedia.org/wiki/Advanced_Encryption_Standard](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) (GCM is a mode of operation) |
| Tailwind CSS  | A utility-first CSS framework for rapidly building custom designs.                                          | [https://tailwindcss.com/](https://tailwindcss.com/) |

## Development

To set up a local development environment:

1. **Clone the Repository**:

   ```bash
   git clone [https://github.com/iiTONELOC/time-tracker.git](https://github.com/iiTONELOC/time-tracker.git)
   cd time-tracker
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Development Server**:

   ```bash
   npm run dev
   ```

4. **Build for Production**:

   ```bash
   npm run build
   ```

## License

This project is licensed under the [MIT License](LICENSE) found in the root of this repository.

---

For any questions or feedback, please open an issue on the [GitHub repository](https://github.com/iiTONELOC/time-tracker/issues).