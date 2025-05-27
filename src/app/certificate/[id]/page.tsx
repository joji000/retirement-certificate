import {
  getCertificateParams,
  getCertificateById,
} from "@/server/GetCertificateData";
import { CertificateDisplay } from "@/components/CertificateDisplay";

export async function generateStaticParams() {
  return getCertificateParams();
}
type RouteParams = Promise<{ id: string }>;

export default async function CertificatePage({ params }: { params: RouteParams }) {
  const { id } = await params;
  const certificate = await getCertificateById(id);

  if (!certificate) {
    return <div>Certificate not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto">
        <CertificateDisplay certificateData={certificate} />
      </main>
    </div>
  );
}