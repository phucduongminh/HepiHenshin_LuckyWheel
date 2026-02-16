import { useAuth } from '@/context/auth-context';
import { ReactNode } from 'react';

export function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loadingUser } = useAuth();

  if (loadingUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-bold">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return <>{children}</>;
}
