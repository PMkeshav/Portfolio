export default function Footer({ siteSettings }) {
  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <p>{siteSettings?.footerText || ""}</p>
        <div className="social-links">
          {(siteSettings?.socialLinks || []).map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

