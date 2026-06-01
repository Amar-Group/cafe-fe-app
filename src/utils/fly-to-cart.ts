import type React from "react";

export function flyToCart(e: React.MouseEvent<HTMLElement>, imageSrc: string) {
  // Find visible cart icon
  const cartIcons = document.querySelectorAll('.cart-icon');
  let targetCart: Element | null = null;
  
  cartIcons.forEach((icon) => {
    const rect = icon.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Check if the element has physical dimensions and its center is within the visible viewport
    if (
      rect.width > 0 && 
      rect.height > 0 && 
      centerX >= 0 && 
      centerX <= window.innerWidth &&
      centerY >= 0 && 
      centerY <= window.innerHeight
    ) {
      targetCart = icon;
    }
  });

  if (!targetCart) return;

  const targetRect = targetCart.getBoundingClientRect();
  const startX = e.clientX;
  const startY = e.clientY;

  // Create flying element
  const flyElement = document.createElement('div');
  flyElement.className = 'fixed z-[100] w-12 h-12 rounded-full border-2 border-cafe-orange shadow-lg overflow-hidden transition-all duration-700 pointer-events-none opacity-100 ease-in-out';
  flyElement.style.left = `${startX - 24}px`;
  flyElement.style.top = `${startY - 24}px`;
  
  // Set initial transform (bezier curve setup can be complex with just CSS, we'll use a simple scale and arc-like cubic bezier)
  flyElement.style.transitionTimingFunction = 'cubic-bezier(0.25, 1, 0.5, 1)';
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.className = 'w-full h-full object-cover';
  flyElement.appendChild(img);
  
  document.body.appendChild(flyElement);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      flyElement.style.left = `${targetRect.left + targetRect.width / 2 - 24}px`;
      flyElement.style.top = `${targetRect.top + targetRect.height / 2 - 24}px`;
      flyElement.style.transform = 'scale(0.2)';
      flyElement.style.opacity = '0.5';
    });
  });

  // Cleanup and bounce effect on cart
  setTimeout(() => {
    flyElement.remove();
    // Add brief pulse to cart
    targetCart?.classList.add('scale-125', 'text-cafe-orange');
    setTimeout(() => {
      targetCart?.classList.remove('scale-125', 'text-cafe-orange');
    }, 300);
  }, 700);
}
