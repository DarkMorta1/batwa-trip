# How to Make Tours Visible on Frontend

## The Problem
Tours appear in the admin panel but not on the home page because they need to be set to **"Published"** status.

## Solution: Publish Your Tours

### Method 1: Using Admin Panel (Recommended)

1. Go to **Admin Panel** → **Tours** (`/admin/tours`)
2. Find the tour you want to show on the frontend
3. Click **"Edit"** button
4. In the form:
   - Set **Status** dropdown to **"Published"**
   - Check **"Trending"** checkbox (to show in "Available Trips" section)
   - Check **"Upcoming"** checkbox (to show in "Upcoming Trips" section)
   - Or check **"Featured"** for featured tours
5. Click **"Save Tour"**
6. Refresh the home page - your tour should now appear!

### Method 2: Quick Publish All Script

If you want to publish all existing tours at once:

1. Make sure your `.env` file has `MONGO_URI` set
2. Run this command from the project root:
   ```bash
   node server/scripts/publishAllTours.js
   ```

This will set all tours to "published" status.

### Understanding Tour Status

- **Draft**: Only visible in admin panel (default when creating)
- **Published**: Visible on frontend/public pages ✅
- **Hidden**: Not visible anywhere (archived)

### Understanding Tour Flags

- **Trending**: Shows in "Available Trips" section on homepage
- **Upcoming**: Shows in "Upcoming Trips" section on homepage  
- **Featured**: Can be used for special highlighting

### Quick Checklist

For a tour to appear on the frontend:
- ✅ Status must be **"Published"**
- ✅ At least one flag should be checked (Trending, Upcoming, or Featured)
- ✅ Tour must have required fields (title, image, description, location, price)

### Debugging

If tours still don't appear:

1. Open browser console (F12)
2. Look for messages like:
   - "Fetched tours from backend: X tours"
   - "Published tours: X"
3. If you see "0 published tours", the tours need to be published
4. Check the Network tab to see the API response

### Common Issues

**Issue**: "I see tours in admin but not on homepage"
- **Solution**: Tours are likely in "Draft" status. Change to "Published"

**Issue**: "Tours are published but not showing in sections"
- **Solution**: Check the "Trending" or "Upcoming" flags

**Issue**: "No tours showing at all"
- **Solution**: 
  1. Check if tours exist in database
  2. Check if they're published
  3. Check browser console for errors
  4. Verify backend is running and accessible

