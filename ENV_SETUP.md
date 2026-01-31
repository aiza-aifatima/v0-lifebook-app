# Environment Setup Guide for Lifebook

## Required Environment Variables

This document outlines the necessary environment variables for the Lifebook application to run correctly in both local development and production environments.

### Supabase Configuration

The application requires the following Supabase environment variables:

\`\`\`env
# These are PUBLIC variables (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development redirect URL (for password reset emails)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

### Getting Your Supabase Credentials

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings → API**
4. Copy the **Project URL** and **Anon Key**

### Local Development Setup

1. **Create a `.env.local` file in the project root:**

\`\`\`bash
touch .env.local
\`\`\`

2. **Add your Supabase credentials:**

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
\`\`\`

3. **Start the development server:**

\`\`\`bash
npm run dev
\`\`\`

4. **Access the application:**

\`\`\`
http://localhost:3000
\`\`\`

### Production Deployment

For Vercel or other hosting platforms:

1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add the variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` (set to your production domain)

### Security Best Practices

- **Never commit `.env.local` to git** - Add it to `.gitignore`
- **Anon Key is PUBLIC** - It's safe to expose in the browser
- **Use Row Level Security (RLS)** - All database tables have RLS enabled
- **Enable Email Verification** - Set up email templates in Supabase Auth settings

### Database Migrations

Run the migration scripts in order:

\`\`\`bash
# 1. Create main schema
scripts/001-create-database-schema.sql

# 2. Enable RLS policies
scripts/002-enable-rls-policies.sql

# 3. Seed avatars
scripts/003-seed-avatars-and-data.sql

# 4. Add OTP system (for password reset)
scripts/005-add-otp-system.sql
\`\`\`

### Email Configuration (OTP Delivery)

The application uses Supabase's email service for OTP delivery. To ensure emails are sent:

1. Go to Supabase Dashboard → Auth → Email Templates
2. Configure your custom domain or use Supabase's default
3. Test email delivery with a test account

### Troubleshooting

**Issue: "Your project's URL and Key are required"**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check `.env.local` file exists in project root
- Restart development server: `npm run dev`

**Issue: Connection timeout at localhost:3000**
- Ensure Supabase project is active (not paused)
- Check internet connectivity
- Verify Supabase URL is correct format: `https://xxx.supabase.co`

**Issue: OTP emails not received**
- Check Supabase email settings
- Verify email template is configured
- Check spam/junk folder
- Wait up to 2 minutes for delivery

### Development vs Production

| Setting | Development | Production |
|---------|-------------|-----------|
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | `http://localhost:3000` | `https://yourdomain.com` |
| Database | Supabase Free Tier | Supabase Pro/Enterprise |
| RLS | Enabled | Enabled |

### Support

For issues with Supabase:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Support](https://supabase.com/support)

For issues with the application:
- Check the console logs for error messages
- Verify all environment variables are set
- Review database RLS policies
