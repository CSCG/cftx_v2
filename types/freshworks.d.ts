interface Window {
    fwSettings?: {
      widget_id: number;
      widget_hidden?: boolean;
    };
    FreshworksWidget?: (action: string, ...args: any[]) => void;
  }