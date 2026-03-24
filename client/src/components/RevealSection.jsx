import { useEffect, useRef, useState } from "react";

export default function RevealSection({ as: Tag = "section", className = "", children, ...props }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal-section ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}
