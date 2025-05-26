import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { CertificateDisplay } from "@/components/CertificateDisplay"

export default function Page() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-auto">
          <CertificateDisplay />
        </main>
      </div>
    </div>
  )
}
