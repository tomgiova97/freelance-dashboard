"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>
          DASHBOARD
        </Link>
        <Link href="/projects" className={pathname === '/projects' ? styles.active : ''}>
          PROJECTS
        </Link>
        <Link href="/payments" className={pathname === '/payments' ? styles.active : ''}>
          PAYMENTS
        </Link>
      </div>
    </nav>
  );
}