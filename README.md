# TigerTix — Movie Reservation Website

**TigerTix** is a movie reservation website that allows users to browse available movies, select a cinema, choose a showtime, reserve seats, select a payment method, and receive an electronic ticket (e-ticket) through a simplified booking process.

This project was developed as a group academic project using **HTML, CSS, and JavaScript**.

**Live Website:** https://tigertix-qlvvtbcvb-borat3.vercel.app?_vercel_share=Q89wc7DmTPzdPP6fEtNjizHfm5YA8Ps7

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features and Functionalities](#features-and-functionalities)
3. [Reservation Process](#reservation-process)
4. [Technology Stack and Tools](#technology-stack-and-tools)
5. [Project Structure](#project-structure)
6. [Installation and Setup](#installation-and-setup)
7. [Deployment](#deployment)
8. [Development Workflow](#development-workflow)
9. [Design Process](#design-process)
10. [Development Team](#development-team)
11. [Disclaimer](#disclaimer)

---

## 1. Project Overview

TigerTix aims to provide users with a convenient and accessible platform for reserving movie tickets online. The website features a dark-themed interface with yellow accents, creating a consistent visual identity while maintaining clear navigation and an organized reservation process.

The system guides users through five reservation stages, allowing them to complete their selections in an organized and straightforward manner.

## 2. Features and Functionalities

### 2.1 Home Page
- Hero banner carousel featuring selected movies with **Play Trailer** and **Book Now** buttons.
- Separate tabs for **Now Showing** and **Coming Soon** movies.
- Movie cards displaying posters, titles, ratings, genres, and running times.

### 2.2 Movie Details Page
- Displays movie information, including posters, ratings, genres, running times, release dates, synopses, and cast members.
- Trailer preview through a modal video player.
- **Book Tickets** button that redirects users to the reservation process.

### 2.3 Movie Reservation
- Five-stage reservation process: Cinema, Date and Time, Seats, Payment, and E-Ticket.
- Selection summary displaying the user's current reservation details.
- Navigation controls, including **Back** and **Continue**, to move between reservation stages.

### 2.4 Navigation and Footer
- Main navigation menu containing Movies, Cinema, Experience, Search, and Sign In.
- Footer containing movie categories, customer support links, corporate information, and social media links.

## 3. Reservation Process

TigerTix implements a five-stage reservation process to guide users from cinema selection to ticket confirmation.

| Stage | Page | Description |
|---|---|---|
| 1 | **Cinema Selection** | Users can search for cinemas by name or location, filter by city (Makati, Pasay, Quezon City, and Taguig), and select a preferred cinema. Available formats include Regular, IMAX, ScreenX, and Director's Club. |
| 2 | **Date and Time Selection** | Users can choose their preferred reservation date, filter available cinema experiences, and select a showtime. |
| 3 | **Seat Selection** | Users can select seats through an interactive seating layout. Seats are categorized as Available, Unavailable, or Selected. The selected seats and total reservation cost are automatically updated. |
| 4 | **Payment** | Users can review their reservation summary, modify previous selections, and choose from the available payment methods: Credit/Debit Card, GCash, Maya, and GrabPay. |
| 5 | **E-Ticket Confirmation** | Upon completing the simulated reservation, users are presented with a confirmation page containing their TigerTix Pass, reference code, movie details, reservation date and time, seat assignment, cinema, format, and QR code. Users can also print their ticket or return to the home page. |

## 4. Technology Stack and Tools

The project was developed using fundamental web development technologies and design and collaboration tools.

| Category | Technology / Tool |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 |
| Functionality | Vanilla JavaScript |
| Initial Design | Canva |
| UI/UX Design and Prototyping | Figma |
| Version Control | Git |
| Collaboration and Code Repository | GitHub |
| Hosting and Deployment | Vercel |

**Note:** The website was developed without using external JavaScript frameworks or libraries.

## 5. Project Structure

The following illustrates the proposed directory structure of the project. Update the file names and organization to reflect the actual repository.

```text
tigertix/
├── index.html              # Home page
├── movie.html              # Movie details and reservation pages
├── css/
│   └── styles.css          # Main stylesheet
├── js/
│   └── script.js           # Website functionality
├── assets/
│   ├── images/             # Movie posters, banners, and logos
│   └── icons/              # Social media and payment icons
└── README.md               # Project documentation
```

## 6. Installation and Setup

### 6.1 Prerequisites

Before running the project locally, ensure that the following are available:

- A modern web browser (Google Chrome, Microsoft Edge, or Mozilla Firefox).
- [Git](https://git-scm.com/) for cloning the repository.
- [Visual Studio Code](https://code.visualstudio.com/) (optional).
- Live Server extension for Visual Studio Code (optional).

### 6.2 Running the Project Locally

Follow these steps to access the project on a local machine.

**Step 1: Clone the Repository**

```bash
git clone https://github.com/your-username/tigertix.git
```

**Step 2: Navigate to the Project Directory**

```bash
cd tigertix
```

**Step 3: Open the Project**

There are two ways to run the website:

- Open the `index.html` file directly using a web browser.
- Open the project folder in Visual Studio Code, right-click `index.html`, and select **Open with Live Server**.

No additional installation or build process is required.

## 7. Deployment

TigerTix is deployed using **Vercel** and connected to its corresponding GitHub repository.

The deployment workflow includes the following:

- Changes pushed to the `main` branch automatically trigger a new deployment.
- Pull requests generate preview deployments, allowing team members to review changes before merging them into the main branch.

### 7.1 Deployment Instructions

To deploy another instance of the project:

1. Sign in to [Vercel](https://vercel.com/) using a GitHub account.
2. Select **Add New → Project**.
3. Import the TigerTix GitHub repository.
4. Retain the default configuration settings for the static website.
5. Select **Deploy** to publish the project.

## 8. Development Workflow

The development team utilized **Git and GitHub** for source code management, collaboration, and tracking project updates.

The following workflow was followed during development:

**Step 1: Update the Local Repository**

Retrieve the latest changes from the main branch.

```bash
git pull origin main
```

**Step 2: Create a Development Branch**

Create a separate branch for the assigned task.

```bash
git checkout -b feature/seat-selection
```

**Step 3: Commit Changes**

Stage and commit the completed modifications with a descriptive message.

```bash
git add .
git commit -m "Add seat selection page"
```

**Step 4: Push the Development Branch**

Upload the changes to the remote repository.

```bash
git push origin feature/seat-selection
```

**Step 5: Submit a Pull Request**

Create a pull request through GitHub for code review. Once the changes have been reviewed and approved, merge the branch into `main`.

## 9. Design Process

The design and development of TigerTix followed a three-stage process:

1. **Initial Conceptualization (Canva)**  
   Canva was used during the initial planning stage to explore the website's visual direction, including its color palette, logo, and preliminary page layouts.

2. **UI/UX Design and Prototyping (Figma)**  
   The initial concepts were further developed in Figma into detailed, high-fidelity designs covering the website's pages and reservation stages.

3. **Website Development (HTML, CSS, and JavaScript)**  
   The finalized designs were translated into a functional website using HTML, CSS, and JavaScript.

### 9.1 Design Principles

The following design considerations guided the development of the website:

- **Dark Interface:** A dark background was implemented to emphasize movie posters and other visual elements.
- **Consistent Accent Color:** Yellow was used for buttons, active navigation elements, and important interface highlights.
- **Clear Progress Indicators:** A numbered progress indicator was incorporated to help users identify their current stage in the reservation process.
- **Visual Consistency:** Consistent typography, button styles, spacing, and card layouts were applied throughout the website to establish a unified interface.

**Figma Design File:** [View Design](https://figma.com/your-link)

*Note: Replace the placeholder URL with the actual Figma project link.*

## 10. Development Team

The following table identifies the members who contributed to the planning, design, and development of the TigerTix website.

| Team Member | Assigned Role |
|---|---|
| Kim | Front-End Developer |
| JJ | UI/UX Designer |
| Angelica | Front-End Developer |
| Trisha | Front-End Developer |


## 11. Disclaimer

TigerTix is an academic project developed solely for educational and demonstration purposes.

- TigerTix is not an officially operating movie ticket reservation service.
- The payment functionality is simulated. No actual financial transactions are processed, and no payment information is collected or stored.
- Movie titles, posters, trailers, and third-party brand logos, including GCash, Maya, GrabPay, Visa, Mastercard, and PayPal, are the property of their respective owners.

---

**© 2026 TigerTix. All rights reserved.**

Developed by the TigerTix Team.
