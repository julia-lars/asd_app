import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  // 使用本地图片
  const images = [
    "/bulletin_board_1.jpg",
    "/bulletin_board_2.jpg",
    "/bulletin_board_3.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // 自动轮播，每3秒切换一次
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-64 overflow-hidden bg-gray-200 border-4 border-blue-500 p-4">
      <h3 className="absolute top-2 left-2 bg-white bg-opacity-70 px-2 py-1 rounded text-xs">
        轮播组件已加载 - 当前图片: {currentIndex + 1}/{images.length}
      </h3>
      <div className="absolute top-10 left-2 bg-white bg-opacity-70 px-2 py-1 rounded text-xs">
        图片路径: {images[currentIndex]}
      </div>
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img
            src={image}
            alt={`信息栏 ${index + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image loading error:', e.target.src);
              e.target.src = 'https://via.placeholder.com/1200x300?text=图片加载失败';
              e.target.alt = '图片加载失败';
            }}
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-500' : 'bg-white bg-opacity-50'}`}
            aria-label={`切换到图片 ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
