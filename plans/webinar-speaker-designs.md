# Webinar Speaker Display Design Suggestions

## Current Design Analysis
The current WebinarDetailsPage is designed for a single speaker:
- Displays one speaker card with image, name, and introduction
- Uses `webinar.Speakers[0]` for all speaker-related data
- Image logic: Multiple speakers → WebinarImage, Single speaker → profilePic
- One-to-one sessions fetched only for the first speaker

## Proposed Design Options for Multiple Speakers

### Option 1: Speaker Grid Layout
**Description:** Replace the single speaker card with a responsive grid of speaker cards.

**Layout:**
- For 2 speakers: 2-column grid on medium+ screens, stacked on mobile
- For 3+ speakers: 3-column grid on large screens, 2-column on medium, 1-column on small
- Each card shows: Avatar image, Name, Salutation, Brief introduction (truncated)

**Pros:**
- Clear visual hierarchy
- Easy to scan all speakers
- Responsive design
- Maintains card-based consistency

**Cons:**
- Takes more vertical space
- May look cluttered with many speakers

**Implementation Notes:**
- Use CSS Grid or Flexbox
- Truncate introductions to 2-3 lines
- Keep webinar image as fallback if no profile pics

### Option 2: Speaker Carousel/Slider
**Description:** Display speakers in a horizontal carousel with navigation arrows.

**Layout:**
- Main speaker card shows first speaker prominently
- Carousel below shows all speakers as smaller cards
- Click to switch main speaker
- Auto-play optional

**Pros:**
- Space-efficient
- Focuses on one speaker at a time while showing all
- Interactive and engaging
- Good for mobile

**Cons:**
- Requires JavaScript for carousel functionality
- Users might miss speakers if not scrolling
- More complex implementation

**Implementation Notes:**
- Use libraries like Swiper.js or native CSS scroll-snap
- Show speaker count indicator
- Update main card content dynamically

### Option 3: Speaker List with Avatars
**Description:** Compact list view with avatar circles and names.

**Layout:**
- Horizontal scrollable row of avatar circles with names below
- Click avatar to expand/show details in modal or inline
- Main content area shows webinar info, speakers listed separately

**Pros:**
- Very space-efficient
- Clean, modern look
- Easy to add many speakers
- Good for varying number of speakers

**Cons:**
- Less detailed speaker info visible at once
- Requires interaction to see full details
- May not emphasize speakers enough

**Implementation Notes:**
- Use horizontal scroll container
- Modal or expandable card for details
- Show speaker count badge

## Recommended Approach
For 2-3 speakers, **Option 1 (Grid Layout)** is recommended as it:
- Provides good balance of information and space
- Is straightforward to implement
- Maintains visual prominence of speakers
- Scales well for the expected number of speakers

## Additional Considerations
- Update one-to-one sessions to show for all speakers or remove if not applicable
- Ensure responsive design works on all devices
- Consider accessibility (alt text, keyboard navigation)
- Test with real data for 2-3 speakers