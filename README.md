# SkillPath 🎓

A landing page in Framer for a fake learning platform. Skillpath.

One section of that page pulls live data from an API.

---

## 🔗 Framer Project Link

> 🌐 **Framer Canvas / Preview Link:**  
> [https://skillpath-parth.framer.website/](https://skillpath-parth.framer.website/)  

---

## 🛠️ Features

### 1. 🎨 Framer Canvas Property Controls (`addPropertyControls`)
- **Layout & Grid Controls**:
  - `columns`: Specify fixed column count ($1$–$8$) or set to `0` for responsive auto-fill layout.
  - `minCardWidth`: Set minimum card width ($150\text{px}$–$600\text{px}$) for responsive auto-fill mode.
  - `showControls`: Toggle visibility of the sort & filter control bar.
  - `skeletonCount`: Set total number of skeleton placeholder cards shown during loading.
- **Card Sizing & Layout (Pixel-Based)**:
  - `cardWidth`: Fixed card width in pixels. Centers horizontally (`margin: 0 auto`) so width expands/shrinks **symmetrically from both left & right sides**. Set to `0` for 100% column fill.
  - `cardHeight`: Fixed card height in pixels. Pushes price and badges to the bottom while keeping text aligned at top. Set to `0` for auto height.
  - `imageHeight`: Custom height for the top banner/tag area.
- **Card Styling & Theme**:
  - `cardBg` & `borderColor`: Custom card background color and border stroke color.
  - `borderRadius`: Adjustable corner radius ($0\text{px}$–$40\text{px}$).
  - `accentColor`: Primary brand color for tag text & soft dynamic background overlay.
- **Typography Controls**:
  - `titleColor` & `titleSize`: Title text color and font size ($10\text{px}$–$36\text{px}$).
  - `descColor` & `descSize`: Description text color and font size ($10\text{px}$–$24\text{px}$).
  - `descLines`: Line clamping limit ($1$–$6$ lines) with ellipsis (`...`) overflow.
  - `showCategory` & `categoryColor`: Toggle and colorize category text.
- **Badges & Labels**:
  - `showRefundBadge`: Show or hide the refundability guarantee label.
  - `refundableText` & `nonRefundableText`: Custom copy strings for refundable/non-refundable statuses.
- **Skeleton Customization**:
  - `skeletonBg` & `skeletonHighlight`: Customize placeholder base background color and animated shimmer gradient color.

---

### 2. 🌐 Dynamic Location-Aware Pricing
- **API Endpoint**: `GET /assignment/country-code`
- **Dynamic Country Detection**: Reads location dynamically (`IN` vs `US`).
- **Country-Specific Formats**:
  - `IN`: Formatted as **₹ (INR)** using `pricePaise` (e.g. `₹1,999`).
  - `US`: Formatted as **$ (USD)** using `priceUsdCents` (e.g. `$39.99`).

---

### 3. ⚡ Optimized API Fetching & Caching
- **API Endpoint**: `GET /assignment/course-data`
- **Single-Flight Shared Promise**: Prevents duplicate HTTP requests across multiple component consumers on the same page.
- **Automatic Retry Mechanism**: Retries up to 8 times with delay spacing on network failures.
- **Primary Key Indexing**: Extracts and exports `mangoIds` array dynamically and creates an $O(1)$ lookup Map (`getCourseByMangoId`).

---

### 4. ✨ Shimmer Skeleton Loader
- Animated loading placeholders with CSS keyframe shimmer.
- Automatically inherits the grid column layout, card width/height, corner radius, and color settings from the main `CourseCard` canvas controls.
- Registered as an independent Framer component (`SkeletonCardGrid`) for standalone canvas usage.

---

### 5. 🔍 Client-Side Sort & Filter
- **Sort Options**: Default order, Price: Low → High, Price: High → Low (country-aware).
- **Filter Options**: All courses, Refundable only, Non-refundable only.
- Clean empty state indicator when no courses match selected criteria.

---

## 🤖 AI Usage & Assistance Breakdown

This project was built in pair-programming collaboration with an **AI Coding Assistant**. Below is an explicit record of AI vs. Human contributions:

| Development Area | Built with AI? | Description |
|---|---|---|
| **Architecture & File Separation** | Yes (AI Assisted) | Refactored monolith into modular `api-data.tsx`, `course-filters.tsx`, `skeleton-loader.tsx`, `Course-card.tsx`, and `style-css.jsx`. |
| **API Caching & Single-Flight Fetch** | Yes (AI Assisted) | Implemented `_coursesFetchPromise` and `_countryFetchPromise` single-instance request cache with retry loops. |
| **Framer Canvas Controls (`addPropertyControls`)** | Yes (AI Assisted) | Defined type controls, property groups, hidden conditions, default props, and dynamic CSS mapping. |
| **Shimmer Skeleton Design** | Yes (AI Assisted) | CSS keyframe shimmer injection, responsive grid matching, and dynamic prop inheritance. |
| **Symmetric Card Sizing (`margin: 0 auto`)** | Yes (AI Assisted) | Configured pixel-based width & height controls so card width resizes symmetrically from both left and right sides. |
| **Requirements & Design Direction** | No (Human Driven) | Feature specifications, API endpoint definitions, UI feedback, and Framer usability testing. |

---

## 📝 

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
