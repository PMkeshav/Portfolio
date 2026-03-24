import { Link, NavLink } from "react-router-dom";

export default function Header({ siteSettings }) {
  const navigation = [...(siteSettings?.navigation || [])].sort(
    (left, right) => left.displayOrder - right.displayOrder,
  );

  return (
    <header className="site-header">
      <div className="shell site-header-inner">
        <Link className="brand-mark" to="/">
          {siteSettings?.brand?.logoText || "KK"}
        </Link>
        <nav className="main-nav">
          {navigation.map((item) => {
            const isHashLink = item.href.includes("#");

            if (isHashLink) {
              return (
                <Link key={item.label} to={item.href} className="nav-link">
                  {item.label}
                </Link>
              );
            }

            return (
              <NavLink key={item.label} to={item.href} className="nav-link">
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
