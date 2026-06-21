import AdminGuard  from './AdminGuard'
import AdminLayout from './AdminLayout'

export default function Admin() {
  return (
    <AdminGuard>
      <AdminLayout />
    </AdminGuard>
  )
}