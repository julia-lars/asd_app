import React, { useState, useEffect, useRef } from 'react';

const ImageCarousel = ({ 
  images = [], 
  autoPlaySpeed = 3000, 
  showDots = true, 
  showArrows = true,
  height = 'h-64'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const intervalRef = useRef(null);

  // 自动播放
  useEffect(() => {
    if (autoPlaySpeed > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, autoPlaySpeed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoPlaySpeed, images.length]);

  // 惰性加载图片
  useEffect(() => {
    const loadImage = (index) => {
      if (images[index] && !loadedImages[index]) {
        const img = new Image();
        img.src = images[index];
        img.onload = () => {
          setLoadedImages(prev => ({ ...prev, [index]: true }));
        };
      }
    };

    // 加载当前图片和前后各一张图片
    loadImage(currentIndex);
    loadImage((currentIndex - 1 + images.length) % images.length);
    loadImage((currentIndex + 1) % images.length);
  }, [currentIndex, images, loadedImages]);

  // 处理图片切换
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // 处理箭头点击
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full ${height} overflow-hidden bg-gray-200`}>
      {/* 图片容器 */}
      <div className="relative w-full h-full">
        {images.map((image, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}
            >
              {loadedImages[index] ? (
                <img
                  src={image}
                  alt={`轮播图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 导航箭头 */}
      {showArrows && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
            aria-label="上一张"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
            aria-label="下一张"
          >
            ›
          </button>
        </>
      )}

      {/* 导航 dots */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-blue-500' : 'bg-white bg-opacity-50 hover:bg-opacity-75'}`}
              aria-label={`切换到图片 ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;