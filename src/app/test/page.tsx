import Link from "next/link";
import { getCertificateIds, getCertificateById } from "@/server/GetCert";

export default async function GetIdPage() {
  const ids = await getCertificateIds();

  // Fetch all certificate details in parallel
  const certificates = await Promise.all(
    ids.map(async (id) => {
      const cert = await getCertificateById(id);
      return cert;
    })
  );

  return (
    <div className="p-4 sm:p-6">
      <h1 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-3xl">Retirement Certificates</h1>
      <div className="flex flex-col gap-4 sm:gap-6">
        {certificates.map((cert) => (
          <Link
            key={cert.id}
            href={`/test/cert/${cert.id}`}
            className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-md transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="font-semibold text-lg">
              {cert.metadata?.name || "Certificate"}
            </div>
            <div className="text-gray-600 text-sm">
              ID: {cert.id} &nbsp;|&nbsp; Amount: {cert.metadata?.attributes?.find((a: any) => a.trait_type === "Amount")?.value}
            </div>
            <div className="text-gray-500 text-xs">
              Retired by: {cert.owner?.name || "-"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}