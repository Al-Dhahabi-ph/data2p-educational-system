import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#153864] text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Data2P. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
