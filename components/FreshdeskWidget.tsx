"use client";

import { useEffect } from "react";

const FreshdeskWidget = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Initialize Freshdesk settings
    window.fwSettings = { 
      widget_id: 156000000508,
      widget_hidden: true
    };

    // Load Freshdesk script
    const script = document.createElement("script");
    script.src = "https://widget.freshworks.com/widgets/156000000508.js";
    script.async = true;
    script.defer = true;
    
    // Hide widget once it's loaded
    script.onload = () => {
      if (window.FreshworksWidget) {
        window.FreshworksWidget('hide', 'launcher');
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default FreshdeskWidget;