#!/usr/bin/env python3
"""
Favicon Generator Script
Converts your rose gold phoenix logo into all necessary favicon formats
for cross-browser compatibility (Safari, Chrome, Firefox, Edge, Opera, etc.)
"""

from PIL import Image
import os

def generate_favicons(input_image_path, output_dir="favicons"):
    """
    Generate all necessary favicon sizes from a source image
    
    Args:
        input_image_path: Path to your source PNG image (preferably 512x512 or larger)
        output_dir: Directory where favicons will be saved
    """
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    print(f"📁 Creating favicon directory: {output_dir}")
    
    # Load the source image
    try:
        img = Image.open(input_image_path)
        print(f"✅ Loaded source image: {input_image_path}")
        print(f"   Original size: {img.size}")
    except Exception as e:
        print(f"❌ Error loading image: {e}")
        return
    
    # Convert to RGBA if not already (for transparency support)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
        print("   Converted to RGBA for transparency")
    
    # Define all the sizes we need
    favicon_sizes = {
        'favicon-16x16.png': (16, 16),
        'favicon-32x32.png': (32, 32),
        'favicon-48x48.png': (48, 48),
        'apple-touch-icon.png': (180, 180),
        'android-chrome-192x192.png': (192, 192),
        'android-chrome-512x512.png': (512, 512),
    }
    
    print("\n🎨 Generating favicon files...")
    
    # Generate each size
    for filename, size in favicon_sizes.items():
        try:
            # Resize with high-quality resampling
            resized = img.resize(size, Image.Resampling.LANCZOS)
            
            # Save the PNG
            output_path = os.path.join(output_dir, filename)
            resized.save(output_path, 'PNG', optimize=True)
            print(f"   ✓ Created {filename} ({size[0]}x{size[1]})")
        except Exception as e:
            print(f"   ✗ Error creating {filename}: {e}")
    
    # Generate .ico file (multi-resolution icon for older browsers)
    try:
        print("\n🔧 Generating favicon.ico (multi-resolution)...")
        ico_sizes = [(16, 16), (32, 32), (48, 48)]
        ico_images = [img.resize(size, Image.Resampling.LANCZOS) for size in ico_sizes]
        
        ico_path = os.path.join(output_dir, 'favicon.ico')
        ico_images[0].save(ico_path, format='ICO', sizes=ico_sizes, append_images=ico_images[1:])
        print(f"   ✓ Created favicon.ico (16x16, 32x32, 48x48)")
    except Exception as e:
        print(f"   ✗ Error creating favicon.ico: {e}")
    
    # Generate site.webmanifest
    webmanifest_content = """{
    "name": "Mégane Alexis",
    "short_name": "MA",
    "icons": [
        {
            "src": "android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ],
    "theme_color": "#ed4264",
    "background_color": "#ffffff",
    "display": "standalone"
}
"""
    
    try:
        manifest_path = os.path.join(output_dir, 'site.webmanifest')
        with open(manifest_path, 'w') as f:
            f.write(webmanifest_content)
        print(f"   ✓ Created site.webmanifest")
    except Exception as e:
        print(f"   ✗ Error creating site.webmanifest: {e}")
    
    # Generate HTML snippet
    html_snippet = """<!-- Favicon - Paste this in your <head> section -->
<link rel="icon" type="image/x-icon" href="images/favicon.ico" />
<link rel="icon" type="image/png" sizes="16x16" href="images/favicon-16x16.png" />
<link rel="icon" type="image/png" sizes="32x32" href="images/favicon-32x32.png" />
<link rel="apple-touch-icon" sizes="180x180" href="images/apple-touch-icon.png" />
<link rel="manifest" href="site.webmanifest" />
<meta name="theme-color" content="#ed4264" />
"""
    
    try:
        html_path = os.path.join(output_dir, 'html_snippet.txt')
        with open(html_path, 'w') as f:
            f.write(html_snippet)
        print(f"   ✓ Created html_snippet.txt")
    except Exception as e:
        print(f"   ✗ Error creating HTML snippet: {e}")
    
    print("\n" + "="*60)
    print("✨ FAVICON GENERATION COMPLETE! ✨")
    print("="*60)
    print(f"\n📂 All files saved to: {output_dir}/")
    print("\n📋 Next steps:")
    print("   1. Copy all files from the 'favicons' folder to your 'images' folder")
    print("   2. Copy site.webmanifest to your website root directory")
    print("   3. Replace your <head> favicon links with the code from html_snippet.txt")
    print("   4. Clear browser cache (Ctrl+Shift+Delete) or hard refresh (Ctrl+F5)")
    print("\n💡 Tip: If favicons still don't show, add a cache-busting query:")
    print("   Example: href='images/favicon.ico?v=2'")
    print("\n" + "="*60)


if __name__ == "__main__":
    print("="*60)
    print("🔥 FAVICON GENERATOR - Rose Gold Phoenix Edition 🔥")
    print("="*60)
    print()
    
    # You can specify your input image here
    # Default assumes your phoenix PNG is in the current directory
    input_image = input("Enter path to your rose gold phoenix PNG (or press Enter for 'ma.png'): ").strip()
    
    if not input_image:
        input_image = "ma.png"
    
    # Check if file exists
    if not os.path.exists(input_image):
        print(f"\n❌ Error: File '{input_image}' not found!")
        print("   Please make sure your rose gold phoenix PNG is in the same directory")
        print("   or provide the full path to the file.")
        exit(1)
    
    # Generate all favicons
    generate_favicons(input_image)