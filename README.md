# SafeDrive Frontend

React-based frontend for the SafeDrive ride-sharing application.

## Features

- **Multi-role Interface**: Passenger, Driver, and Admin dashboards
- **Real-time Trip Tracking**: Interactive maps with Leaflet.js
- **M-Pesa Integration**: Seamless payment processing
- **Document Upload**: Driver KYC document management
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet.js** - Interactive maps
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone git@github.com:koriMK/safedrive-frontend.git
cd safedrive-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── passenger/      # Passenger interface
│   ├── driver/         # Driver interface
│   └── admin/          # Admin interface
├── context/            # React context providers
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5002
```

## User Roles

### Passenger
- Book rides with pickup/dropoff locations
- Real-time trip tracking
- M-Pesa payment processing
- Trip history and ratings

### Driver
- Online/offline status management
- Accept/reject trip requests
- Document upload for verification
- Earnings tracking

### Admin
- Driver approval/rejection
- System statistics monitoring
- User and trip management
- Payment oversight

## API Integration

The frontend communicates with the SafeDrive backend API:

- **Authentication**: JWT token-based
- **Trip Management**: Real-time trip requests and tracking
- **Payment Processing**: M-Pesa STK Push integration
- **File Upload**: Driver document verification

## Deployment

### Production Build

```bash
npm run build
```

The `dist/` folder contains the production-ready files.

### Deploy to Netlify/Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.