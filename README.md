This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Launch SEO & Analytics

Set these environment variables in the deployment platform:

```bash
NEXT_PUBLIC_SITE_URL=https://your-live-domain.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=google-search-console-token
```

Optional, if using Google Tag Manager instead of direct GA4:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

For paid advertising, add the Meta pixel:

```bash
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
```

### Conversion tracking

There is no on-site checkout — every sale completes on Uber Eats, on DoorDash, or
at the counter — so the site tracks **proxy conversions** instead of purchases.
`src/lib/analytics.ts` defines them and forwards each to GA4 and Meta:

| Event | Fired by | Meta event |
| --- | --- | --- |
| `order_click` | Uber Eats / DoorDash links | custom |
| `call_click` | `tel:` links | `Contact` |
| `directions_click` | Google Maps links | `FindLocation` |

Every event carries `platform`, `location` and `placement` so a hero CTA can be
told apart from a footer link. Server components track clicks through
`components/shared/TrackedLink.tsx` rather than becoming client components.

With no IDs configured, `Analytics` renders nothing and `track()` is a no-op, so
this is safe to run locally and in preview. After deploying, mark `order_click`
and `call_click` as **key events** in GA4 — they are not conversions until you do.

After launch, add the live website URL to both Google Business Profiles, then submit `/sitemap.xml` in Google Search Console.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
