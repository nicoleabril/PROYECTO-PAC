import React from 'react';
import { Breadcrumb } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

function DynamicBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }} active={pathnames.length === 0}>
        Home
      </Breadcrumb.Item>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return isLast ? (
          <Breadcrumb.Item key={name} active>
            {name}
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={name} linkAs={Link} linkProps={{ to: routeTo }}>
            {name}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}

export default DynamicBreadcrumb;
