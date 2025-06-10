
import React, { useEffect, useRef } from 'react';
import { useAdManager } from '@/hooks/useAdManager';

interface AdContainerProps {
  placement: 'above-results' | 'below-form' | 'sidebar' | 'footer' | 'listing';
  className?: string;
  refreshTrigger?: number;
}

const AdContainer: React.FC<AdContainerProps> = ({ 
  placement, 
  className = '', 
  refreshTrigger = 0 
}) => {
  const { shouldShowAds, isAdBlocked } = useAdManager();
  const adRef = useRef<HTMLDivElement>(null);
  const adInstanceRef = useRef<number>(0);

  useEffect(() => {
    if (shouldShowAds && adRef.current) {
      // Increment instance counter for new ad loading
      adInstanceRef.current += 1;
      
      // Clear previous ad content
      adRef.current.innerHTML = '';
      
      // Load new ad based on placement
      loadAd(placement, adRef.current, adInstanceRef.current);
    }
  }, [shouldShowAds, placement, refreshTrigger]);

  const loadAd = (adPlacement: string, container: HTMLElement, instance: number) => {
    // This will be replaced with actual ad network scripts
    // For now, create placeholder that shows ad dimensions and placement info
    
    const adSizes = getAdSizeForPlacement(adPlacement);
    const placeholderAd = document.createElement('div');
    
    placeholderAd.className = `ad-placeholder ${adSizes.className}`;
    placeholderAd.style.cssText = `
      background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
      border: 2px dashed #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      font-size: 14px;
      text-align: center;
      margin: 8px 0;
      border-radius: 4px;
      min-height: ${adSizes.height}px;
      width: 100%;
      max-width: ${adSizes.width}px;
    `;
    
    placeholderAd.innerHTML = `
      <div>
        <div style="font-weight: bold; margin-bottom: 4px;">Advertisement</div>
        <div style="font-size: 12px; opacity: 0.7;">${adSizes.width}×${adSizes.height} • ${adPlacement}</div>
        <div style="font-size: 10px; opacity: 0.5; margin-top: 4px;">Instance: ${instance}</div>
      </div>
    `;
    
    container.appendChild(placeholderAd);
    
    // TODO: Replace with actual ad network integration
    // Example for Google AdSense:
    // const adElement = document.createElement('ins');
    // adElement.className = 'adsbygoogle';
    // adElement.style.display = 'block';
    // adElement.setAttribute('data-ad-client', 'ca-pub-XXXXXXXXXXXXXXXX');
    // adElement.setAttribute('data-ad-slot', 'XXXXXXXXXX');
    // adElement.setAttribute('data-ad-format', 'auto');
    // adElement.setAttribute('data-full-width-responsive', 'true');
    // container.appendChild(adElement);
    // (window.adsbygoogle = window.adsbygoogle || []).push({});
  };

  const getAdSizeForPlacement = (adPlacement: string) => {
    switch (adPlacement) {
      case 'above-results':
        return { width: 728, height: 90, className: 'ad-leaderboard' }; // Leaderboard
      case 'below-form':
        return { width: 336, height: 280, className: 'ad-rectangle' }; // Medium Rectangle
      case 'sidebar':
        return { width: 300, height: 250, className: 'ad-sidebar' }; // Medium Rectangle
      case 'footer':
        return { width: 728, height: 90, className: 'ad-footer' }; // Leaderboard
      case 'listing':
        return { width: 320, height: 100, className: 'ad-mobile' }; // Mobile Banner
      default:
        return { width: 336, height: 280, className: 'ad-default' };
    }
  };

  if (!shouldShowAds) {
    return null;
  }

  return (
    <div className={`ad-container ${className}`}>
      {isAdBlocked && (
        <div className="ad-blocked-notice p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
          <p className="text-sm text-yellow-700">
            Please consider disabling your ad blocker to support our free tools.
          </p>
        </div>
      )}
      <div 
        ref={adRef} 
        className="ad-content flex justify-center"
        data-placement={placement}
      />
    </div>
  );
};

export default AdContainer;
