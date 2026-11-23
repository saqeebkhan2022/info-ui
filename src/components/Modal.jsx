import React, { useEffect, useRef } from "react";
export default function Modal({ title, close, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    node.showModal();
    return () => node.close();
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="flex justify-between items-center mb-5">
        <h2>{title}</h2>
        <button aria-label="Close" onClick={close}>
          ×
        </button>
      </div>
      {children}
    </dialog>
  );
}
