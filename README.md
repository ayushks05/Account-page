# Firebase Auth

A React project for learning Firebase Authentication through a working email/password account flow.

## Overview

This project demonstrates Firebase email/password signup and login, profile display names, email verification, password reset, and protected routes. The interface is intentionally focused on making each authentication step clear.

## Features

* Responsive signup and login interfaces
* Client-side form validation with error messages
* Show/hide password functionality
* Firebase email/password signup and login
* User display name saved to the Firebase profile
* Email verification and resend/check actions
* Password reset email flow
* Login form with Firebase persistence selection
* Protected dashboard available after email verification
* Automated component tests with Vitest and React Testing Library
* Reusable UI components styled with Tailwind CSS

Authentication uses email and password. Social sign-in providers are not configured.

## Tech Stack

* Frontend: React, JavaScript
* Build Tool: Vite
* Styling: Tailwind CSS
* Routing: React Router
* Authentication: Firebase Authentication
* Testing: Vitest, React Testing Library, user-event

## Getting Started

### Prerequisites

Install the following before running the project:

* Node.js
* npm (included with Node.js)
* A Firebase project

## Installation

1. Clone the repo
    ```sh
    git clone https://github.com/ayushks05/Account-page.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Account-page
    ```
3. Install NPM packages
    ```sh
    npm i
    ```
4. Change git remote url to avoid accidental pushes to base project
    ```sh
    git remote set-url origin github_username/repo_name
    git remote -v # confirm the changes
    ```

### Firebase Configuration

1. Create or open your project in the Firebase Console.
1. Register a web app in your Firebase project.
1. Enable Email/Password under Authentication sign-in providers.
1. Copy the Firebase web app configuration values.
1. Create a .env.local file in the project root, alongside package.json.

Add your own Firebase configuration values:

`
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
`

Replace the placeholders with values from your Firebase project.

Keep .env.local out of Git. The .env.example file should contain placeholder values only.

### Run Locally

Start the development server:
```sh
    npm run dev
```

Open the local URL displayed in the terminal.

### Testing

Run the automated tests once:
```sh
    npm run test:run
```

Run the production build:
```sh
    npm run build
```

Make sure both commands complete successfully before submitting changes.

## Learning Goals

This project is part of my learning journey in frontend development. It helps me practise:

* React components, props, and state
* Form handling and validation
* React Router and client-side navigation
* Firebase Authentication integration
* Automated testing
* Git and GitHub workflow

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

No license has been specified yet. Check the repository's licensing before reusing or redistributing the code.

## Contact

[@aayeoshh](https://twitter.com/aayeoshh) - ayushks.work07@gmail.com

[https://github.com/ayushks05/Account-page](https://github.com/ayushks05/Account-page)