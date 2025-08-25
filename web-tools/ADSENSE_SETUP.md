# Google AdSense Setup Guide

## 🚨 IMPORTANT: Replace Placeholder Values

Before your AdSense will work, you need to replace the placeholder values with your actual AdSense publisher ID and ad slot IDs.

### 1. Get Your AdSense Publisher ID

1. Go to [Google AdSense](https://www.google.com/adsense)
2. Sign in with your Google account
3. Once approved, go to **Settings** → **Account**
4. Copy your **Publisher ID** (starts with `ca-pub-`)

### 2. Update HTML Configuration

Replace `YOUR_PUBLISHER_ID` in `public/index.html`:

```html
<!-- Replace this: -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
 crossorigin="anonymous"></script>

<!-- With your actual publisher ID: -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8975115432793623"
 crossorigin="anonymous"></script>
```

Also update the Auto Ads configuration:

```html
<script>
  (adsbygoogle = window.adsbygoogle || []).push({
    google_ad_client: "ca-pub-8975115432793623", // Your actual publisher ID
    enable_page_level_ads: true
  });
</script>
```

### 3. Create Ad Units in AdSense

1. In AdSense dashboard, go to **Ads** → **By ad unit**
2. Click **Create new ad unit**
3. Choose ad format (Banner, Rectangle, etc.)
4. Set display name (e.g., "Home Page Top Banner")
5. Copy the **Ad unit ID** (starts with numbers)

### 4. Update Ad Slot IDs

Replace the placeholder ad slot IDs in your components:

```tsx
// In Home.tsx and other pages, replace:
<GoogleAd adSlot="1234567890" adFormat="banner" />

// With your actual ad unit IDs:
<GoogleAd adSlot="1234567890123456" adFormat="banner" />
```

### 5. Update GoogleAd Component

Replace `YOUR_PUBLISHER_ID` in `src/components/GoogleAd.tsx`:

```tsx
data-ad-client="ca-pub-8975115432793623" // Your actual publisher ID
```

## 📍 Recommended Ad Placements

### Home Page
- **Top Banner**: Above the tools grid
- **Bottom Banner**: Below the tools grid
- **Sidebar Rectangle**: Right side of the page

### Tool Pages
- **Top Banner**: Below the page title
- **Middle Rectangle**: Between content sections
- **Bottom Banner**: Above the footer

### Example Implementation

```tsx
// In any tool page component:
import GoogleAd from '../components/GoogleAd';

// Top banner
<GoogleAd adSlot="your_top_banner_id" adFormat="banner" />

// Middle rectangle
<GoogleAd adSlot="your_rectangle_id" adFormat="rectangle" />

// Bottom banner
<GoogleAd adSlot="your_bottom_banner_id" adFormat="banner" />
```

## 🔧 AdSense Auto Ads

Auto Ads are already configured in `public/index.html`. They will automatically place ads in optimal locations:

- **In-article ads**: Between paragraphs
- **In-feed ads**: In content feeds
- **Matched content**: Related content suggestions
- **Anchor ads**: Sticky ads at bottom
- **Vignette ads**: Full-screen interstitial ads

## 📱 Responsive Design

The `GoogleAd` component is already responsive and will:
- Automatically adjust ad size for mobile devices
- Use responsive ad formats when possible
- Maintain proper spacing and layout

## 🚀 Testing AdSense

### Development Testing
1. Use AdSense's test mode
2. Add `?google_adtest=on` to your URL
3. Check browser console for AdSense errors

### Production Testing
1. Deploy to your domain
2. Wait 24-48 hours for AdSense to start serving ads
3. Monitor AdSense dashboard for impressions

## 📊 AdSense Policies

Ensure your site complies with AdSense policies:

- ✅ Original, high-quality content
- ✅ No duplicate content
- ✅ Clear navigation
- ✅ No prohibited content
- ✅ Mobile-friendly design
- ✅ Fast loading times
- ✅ Clear privacy policy

## 🔍 Troubleshooting

### Common Issues

1. **Ads not showing**: Check publisher ID and ad slot IDs
2. **Console errors**: Verify AdSense script is loading
3. **Responsive issues**: Check ad format settings
4. **Policy violations**: Review AdSense policies

### Debug Steps

1. Check browser console for errors
2. Verify AdSense code is in HTML head
3. Confirm ad slot IDs are correct
4. Test with AdSense test mode
5. Check AdSense dashboard for status

## 📈 Optimization Tips

1. **Placement**: Put ads where users naturally look
2. **Frequency**: Don't overwhelm users with too many ads
3. **Loading**: Ensure ads don't slow down page load
4. **Testing**: A/B test different ad placements
5. **Monitoring**: Track performance in AdSense dashboard

## 🎯 Best Practices

- Start with 2-3 ads per page
- Use responsive ad formats
- Place ads in high-visibility areas
- Monitor user experience
- Follow AdSense policies strictly
- Test on multiple devices

## 📞 Support

- [AdSense Help Center](https://support.google.com/adsense)
- [AdSense Community](https://support.google.com/adsense/community)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)

---

**Remember**: AdSense approval can take 1-4 weeks. Ensure your site has original content and follows all policies before applying.
