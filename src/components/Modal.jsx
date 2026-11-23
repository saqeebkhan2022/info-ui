import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
export default function Modal({ title, close, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    if (node && !node.open) node.showModal();
    return () => { if (node?.open) node.close(); };
  }, []);
  return <dialog ref={ref} aria-label={title} className="responsive-dialog" onCancel={e => { e.preventDefault(); close(); }}>
    <div className="modal-heading"><h2>{title}</h2><button type="button" className="modal-close" aria-label="Close dialog" onClick={close}><X size={19}/></button></div>
    <div className="modal-content">{children}</div>
  </dialog>;
}
