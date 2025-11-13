# VibeCode Recruitment Website

A modern recruitment website built with Next.js 14, TypeScript, Tailwind CSS, and integrated with Odoo Recruitment API.

## Features

- 📋 **All Jobs Page** - Browse all available positions
- 📄 **Job Detail Page** - View detailed information about each position
- 📝 **Application Form** - Submit applications directly to Odoo Recruitment
- 🔗 **Odoo Integration** - Seamlessly integrates with Odoo's Recruitment module
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ⚡ **Fast Performance** - Built with Next.js 14 App Router

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **API Integration:** Axios
- **Backend:** Odoo Recruitment API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Odoo instance with Recruitment module enabled
- Odoo API credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vibecode
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your Odoo credentials:
```env
NEXT_PUBLIC_ODOO_URL=https://your-odoo-instance.com
NEXT_PUBLIC_ODOO_DB=your_database_name
ODOO_USERNAME=your_odoo_username
ODOO_PASSWORD=your_odoo_password
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
vibecode/
├── app/
│   ├── api/
│   │   └── applications/
│   │       └── route.ts          # API endpoint for submitting applications
│   ├── jobs/
│   │   ├── [id]/
│   │   │   └── page.tsx          # Job detail page
│   │   └── page.tsx              # All jobs page
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with navigation
│   └── page.tsx                  # Homepage
├── components/
│   ├── ApplicationForm.tsx       # Job application form component
│   └── JobCard.tsx               # Job card component for listing
├── lib/
│   └── odoo-api.ts               # Odoo API integration layer
├── types/
│   ├── application.ts            # Application type definitions
│   └── job.ts                    # Job type definitions
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Pages

### Homepage (`/`)
- Hero section with call-to-action
- Company benefits and culture highlights
- Navigation to jobs page

### All Jobs (`/jobs`)
- Displays all active job positions from Odoo
- Filterable and searchable job listings
- Click on any job to view details

### Job Detail (`/jobs/[id]`)
- Detailed job description and requirements
- Company information
- Application form

## Odoo Integration

### Requirements

Your Odoo instance must have:
- Recruitment module installed and configured
- API access enabled
- User account with appropriate permissions

### API Endpoints Used

- `hr.job` - Fetch job positions
- `hr.applicant` - Create new applications

### Data Flow

1. User browses jobs on the website
2. User selects a job and fills out the application form
3. Form data is submitted to `/api/applications`
4. Backend API authenticates with Odoo
5. Application is created in Odoo Recruitment as `hr.applicant`
6. User receives confirmation

## Development

### Running Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Customization

### Switching from Mock Data to Live Odoo Data

Currently, the application uses mock data for demonstration. To connect to your Odoo instance:

1. Configure `.env.local` with your Odoo credentials
2. In `app/jobs/page.tsx`, uncomment:
```typescript
async function getJobsData() {
  try {
    const { jobs } = await getJobs();
    return jobs;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}
```

3. Replace the mock data line:
```typescript
// const jobs = mockJobs; // Remove this line
const jobs = await getJobsData(); // Use this instead
```

4. Do the same in `app/jobs/[id]/page.tsx` for the job detail page.

### Customizing Styles

The application uses Tailwind CSS. You can customize:
- Colors in `tailwind.config.ts`
- Global styles in `app/globals.css`
- Component styles by editing the respective component files

### Adding More Fields to Application Form

1. Update the `Application` type in `types/application.ts`
2. Add form fields in `components/ApplicationForm.tsx`
3. Update the Odoo payload in `lib/odoo-api.ts`

## Security Notes

- Never commit `.env.local` or `.env` files
- Keep Odoo credentials secure
- Use environment variables for sensitive data
- ODOO_USERNAME and ODOO_PASSWORD are server-side only
- NEXT_PUBLIC_ prefixed variables are exposed to the browser

## Troubleshooting

### Odoo Connection Issues

If you're having trouble connecting to Odoo:

1. Verify your Odoo URL is correct and accessible
2. Check that your Odoo credentials are valid
3. Ensure the Recruitment module is installed in Odoo
4. Verify API access is enabled in Odoo
5. Check browser console and server logs for errors

### CORS Issues

If you encounter CORS errors:

1. Configure CORS settings in your Odoo instance
2. Add your website domain to allowed origins
3. Consider using a backend proxy for API calls

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please open an issue on the repository.
