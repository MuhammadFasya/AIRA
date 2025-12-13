import React from "react";

/**
 * Avatar
 * Small reusable avatar component that supports image src or initials
 */
const Avatar = ({ src, alt = "avatar", size = 40, className = "" }) => {
  const s = typeof size === "number" ? `${size}px` : size;

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ width: s, height: s }}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  // Fallback: initials from alt
  const initials = alt
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{ width: s, height: s }}
      className={`rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;
