# Lumière - Premium Luxury Scented Candles Website

A production-ready, fully responsive luxury scented candles website featuring modern animations, elegant design, and comprehensive functionality.

## 🎯 Features

### Design & Aesthetics
- **Luxury Brand Identity**: Sophisticated color palette with warm golds, creams, and elegant typography
- **Responsive Design**: Mobile-first approach with flawless adaptation to all screen sizes
- **Modern Animations**: Smooth parallax effects, scroll-triggered reveals, and micro-interactions
- **Rich Visual Content**: Abundant image placement areas throughout all sections

### Sections Included

1. **Hero Banner** - Cinematic full-screen introduction with animated headline
2. **About Us** - Brand story with statistics, multiple images, and timeline
3. **Collections** - Fragrance families gallery with hover effects
4. **Featured Products** - Product carousel with ratings, prices, and quick actions
5. **Product Showcase** - Visual grid displaying various product angles
6. **OEM/Custom Services** - B2B solutions with detailed service offerings
7. **Sustainability** - Natural ingredients and eco-friendly practices
8. **Quality Assurance** - Certifications and quality control process
9. **Testimonials** - Customer reviews with ratings and statistics
10. **Blog/News** - Latest articles with image thumbnails
11. **Contact** - Inquiry form with Google Maps integration
12. **Footer** - Comprehensive navigation, newsletter signup, and social links

### Interactive Features
- ✅ Sticky navigation with active section highlighting
- ✅ Mobile hamburger menu
- ✅ Smooth scroll to sections
- ✅ Scroll-to-top button
- ✅ Animated counters for statistics
- ✅ Product quick view
- ✅ Wishlist functionality (localStorage)
- ✅ Shopping cart (localStorage)
- ✅ Form validation
- ✅ Newsletter subscription
- ✅ Notification system
- ✅ Lazy loading images
- ✅ Parallax effects

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools required - pure HTML, CSS, and JavaScript

### Installation

1. **Download or clone the files**:
   ```
   - index.html
   - styles.css
   - script.js
   ```

2. **Open in browser**:
   - Simply double-click `index.html` or
   - Use a local development server for better performance:
   
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the website**:
   - Open your browser and navigate to `http://localhost:8000`

## 📱 Responsive Breakpoints

The website is optimized for all devices:

- **Large Desktop**: 1400px and up
- **Desktop**: 1025px - 1399px
- **Tablet**: 768px - 1024px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css` (lines 10-30):

```css
:root {
    --color-primary: #c9a86a;        /* Main brand color */
    --color-secondary: #2c2416;      /* Dark accents */
    --color-accent: #d4a574;         /* Secondary accents */
    /* ... more colors */
}
```

### Typography
The website uses Google Fonts:
- **Headings**: Cormorant Garamond (serif)
- **Body**: Montserrat (sans-serif)

Change fonts by modifying the Google Fonts link in `index.html` and updating CSS variables.

### Images
Replace placeholder images with your own:

1. **Hero Section**: Update `hero__image` src (line ~50 in HTML)
2. **Product Images**: Replace Unsplash URLs with your product photos
3. **About Section**: Update company and craftsmanship images
4. **All Sections**: Search for `img src=` and replace URLs

Recommended image sizes:
- Hero: 1920x1080px
- Products: 800x800px
- Blog thumbnails: 600x400px
- Team photos: 400x400px

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern features including Grid, Flexbox, Custom Properties
- **JavaScript ES6+**: Vanilla JS with modern practices
- **Font Awesome 6.4.0**: Icon library
- **Google Fonts**: Cormorant Garamond & Montserrat

## ✨ Key Features Implementation

### Scroll Animations
Custom intersection observer implementation:
```javascript
// Elements with data-aos attribute animate on scroll
<div data-aos="fade-up">Content</div>
```

### Counter Animation
Automatically animates numbers with `data-count` attribute:
```html
<h3 data-count="500">0</h3>
```

### Form Handling
Contact form includes validation and notification system:
- Email validation
- Required field checking
- Success/error notifications

### Local Storage
Wishlist and cart data persist across sessions:
- Products saved to localStorage
- Cart count updates automatically

## 🔧 Browser Support

- ✅ Chrome (90+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Edge (90+)
- ✅ Opera (76+)

## 📊 Performance Optimization

- Lazy loading for images
- Debounced scroll events
- CSS animations with GPU acceleration
- Minimal JavaScript dependencies
- Optimized asset loading

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast mode support
- Reduced motion support for users with vestibular disorders
- Alt text on all images
- Focus indicators

## 🎯 SEO Features

- Semantic HTML5 elements
- Meta descriptions and keywords
- Open Graph tags ready
- Structured heading hierarchy
- Alt text on images
- Fast loading performance

## 📝 Customization Guide

### Adding New Products

1. Copy a product card from the HTML
2. Update the image, name, price, and description
3. Add unique product ID for cart functionality

```html
<article class="product__card" data-aos="zoom-in">
    <!-- Product content here -->
</article>
```

### Adding New Collections

Add a new collection card in the Collections section:
```html
<article class="collection__card">
    <div class="collection__image-container">
        <img src="your-image.jpg" alt="Collection name">
    </div>
    <div class="collection__content">
        <h3 class="collection__title">Collection Name</h3>
        <!-- More content -->
    </div>
</article>
```

### Modifying Contact Information

Update contact details in the Contact section:
- Address (line ~950 in HTML)
- Phone number (line ~960)
- Email addresses (line ~970)
- Google Maps embed (line ~1050)

## 📧 Form Backend Integration

The contact form is ready for backend integration. To connect to your email service:

1. **Using FormSpree** (Easiest):
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

2. **Using Custom Backend**:
Uncomment the fetch code in `script.js` (lines ~300-315) and update the endpoint.

3. **Using Email Services** (SendGrid, Mailgun, etc.):
Implement the API call in the form submission handler.

## 🚢 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and save

### Netlify
1. Drag and drop folder to Netlify
2. Site is live instantly

### Traditional Hosting
1. Upload files via FTP
2. Ensure index.html is in root directory

## 📄 File Structure

```
luxury-candles-website/
│
├── index.html          # Main HTML file
├── styles.css          # Complete stylesheet
├── script.js           # JavaScript functionality
└── README.md           # Documentation (this file)
```

## 🎓 Code Quality

- ✅ Clean, well-commented code
- ✅ Consistent naming conventions
- ✅ Modular CSS architecture
- ✅ DRY principles followed
- ✅ Production-ready code

## 💡 Tips for Production

1. **Optimize Images**: Use WebP format and compress images
2. **Minify CSS/JS**: Use tools like cssnano and terser
3. **Add Caching**: Configure cache headers
4. **SSL Certificate**: Enable HTTPS
5. **Analytics**: Add Google Analytics or similar
6. **CDN**: Use a CDN for static assets

## 🐛 Troubleshooting

### Images not loading
- Check image paths are correct
- Ensure images are in the same directory or use absolute URLs

### Animations not working
- Check browser console for errors
- Verify JavaScript is enabled
- Clear browser cache

### Mobile menu not opening
- Ensure nav-toggle and nav-menu IDs match in HTML and JS
- Check for JavaScript errors in console

## 📞 Support & Contact

For questions or customization requests, feel free to reach out!

## 📜 License

This project is provided as-is for use in commercial and personal projects.

## 🙏 Credits

- **Fonts**: Google Fonts (Cormorant Garamond, Montserrat)
- **Icons**: Font Awesome
- **Images**: Unsplash (replace with your own)
- **Design**: Custom luxury brand design system

---

**Made with ❤️ for luxury candle brands**

*Last Updated: January 2024*
