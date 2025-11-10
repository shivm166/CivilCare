import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SimplePageLoader() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* Icon spinner */}
        <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-blue-500 animate-spin mx-auto mb-4" />
      </div>
    </div>
  );
}
