import { getCertificateById } from "@/server/GetCert";

export default async function CertDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  const id = param.id;
  if (!id) {
    return <div>No certificate ID provided.</div>;
  }

  const cert = await getCertificateById(id);

  if (!cert) {
    return <div>Certificate not found.</div>;
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Certificate Detail</h1>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(cert, null, 2)}
        </pre>
      </main>
    </div>
  );
}
