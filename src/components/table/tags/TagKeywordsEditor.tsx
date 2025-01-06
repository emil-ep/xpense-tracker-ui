import './tagKeywordsEditor.css'

import React, { forwardRef, useEffect, useRef } from "react";

interface SimpleEditorProps {
  value: string | null; 
  onValueChange: (val: string | null) => void;
  eventKey?: string;
  rowIndex?: number;
  column?: any;
}

// Forward ref component with typed props and ref
const TagKeywordsEditor = forwardRef<HTMLInputElement, SimpleEditorProps>(
  ({ value, onValueChange, eventKey, rowIndex, column }, ref) => {
    const updateValue = (val: string) => {
      onValueChange(val === "" ? null : val);
    };

    const refInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      let startValue: string;

      if (eventKey === "Backspace") {
        startValue = "";
      } else if (eventKey && eventKey.length === 1) {
        startValue = eventKey;
      } else {
        startValue = value || "";
      }

      updateValue(startValue);

      if (refInput.current) {
        refInput.current.focus();
      }
    }, [eventKey, value]);

    return (
      <input
        value={value || ""}
        ref={(refInput as unknown) as React.RefObject<HTMLInputElement>} // Type assertion for compatibility
        onChange={(event) => updateValue(event.target.value)}
        className="keywordsEditor"
      />
    );
  }
);

export default TagKeywordsEditor;
