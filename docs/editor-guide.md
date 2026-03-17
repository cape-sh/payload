# CAEPE Content Editor Guide

> This guide is for non-developer content editors who need to update marketing pages, pricing, and articles in the Payload CMS admin panel.

## Logging In

1. Go to `https://[your-domain]/admin`
2. Enter your email and password
3. You'll see the admin dashboard with Pages, Resources, and Media in the left sidebar

## Editing an Existing Page

### Features Page

1. Click **Pages** in the left sidebar
2. Click on **Features**
3. You'll see the page built from blocks:
   - **Hero** block at the top (headline, subheadline, CTA button)
   - **Feature Accordion** blocks below (one per category)

**To edit a feature item:**
1. Scroll to the Feature Accordion block you want to edit
2. Click the expand arrow to see the items
3. Click on an item to edit its name or description
4. Click **Save Draft** to save without publishing
5. Click **Publish** when ready to go live

**To add a new feature item:**
1. Open the Feature Accordion block
2. Click **Add Item** at the bottom of the items list
3. Fill in **Feature Name** and **Feature Description**
4. Save and publish

**To add a new feature category:**
1. Scroll to the bottom of the layout section
2. Click **Add Block** → select **Feature Accordion**
3. Fill in **Section Label** (e.g. "New Category"), **Section Title**, and add items
4. Save and publish

### Pricing Page

1. Click **Pages** → **Pricing**
2. The page has a **Hero** block and a **Pricing Table** block

**To update a tier price:**
1. Open the Pricing Table block
2. Find the tier (e.g. "Up to 25 clusters")
3. Change the **Price** field
4. Save Draft → Preview → Publish

**To update included features:**
1. In the Pricing Table block, scroll to **Included Features**
2. Edit, add, or remove feature text
3. Save and publish

### Test Drive Page

1. Click **Pages** → **Test Drive**
2. Edit the Hero headline/subheadline or CTAForm headline
3. The form fields themselves are coded — contact a developer to change form fields

## Writing a New Article

1. Click **Resources** in the left sidebar
2. Click **Create New**
3. Fill in:
   - **Title** — the article headline
   - **Slug** — URL-friendly version (e.g. "kubernetes-best-practices")
   - **Excerpt** — short summary for the index page (max 250 chars)
   - **Content** — the full article body. Use the toolbar for headings (H2, H3), bold, lists, code blocks, and images
   - **Feature Image** — hero image (upload or select from Media library)
   - **Author** — your name
   - **Publish Date** — when the article should appear
   - **Reading Time** — estimated minutes to read
   - **Tags** — click **Add Tag** to categorize (used for filtering on /resources)
4. Click **Save Draft** to save
5. Preview your article
6. Click **Publish** when ready

## Uploading Media

1. Click **Media** in the left sidebar
2. Click **Create New**
3. Drag and drop or click to upload an image
4. Fill in the **Alt Text** field (required for accessibility)
5. Click **Save**
6. The image is now available to use in any page or article

## Updating Navigation

1. Click **Navigation** under Globals in the left sidebar
2. Edit, add, or remove nav items (label + URL)
3. Update the CTA button text and link
4. Save

## Updating Footer

1. Click **Footer** under Globals in the left sidebar
2. Edit link groups, add/remove links
3. Update social media URLs
4. Save

## Tips

- **Save Draft** saves your changes without making them live
- **Publish** makes changes visible on the website
- **Versions** — Payload keeps a history of all changes. You can revert to any previous version from the Versions tab
- **Preview** — Use the preview button to see how your changes will look before publishing
- Changes typically appear on the live site within a few seconds of publishing

## Need Help?

Contact the development team if you need to:
- Add a new type of content block
- Change form fields
- Modify the site layout or navigation structure
- Fix a technical issue
