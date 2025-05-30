import {
  getCertificateTransactionHash,
  getCertByTxHash,
} from "@/server/GetCert";
import { CertificateDisplay } from "@/components/CertificateDisplay";

function getAttribute(attributes: any[], trait: string) {
  return attributes?.find((a) => a.trait_type === trait)?.value || "";
}

export default async function CertDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const param = await params;
  const id = param.id;
  if (!id) return <div>No certificate ID provided.</div>;

  // 1. Get transaction hash
  const txHash = await getCertificateTransactionHash(id);
  if (!txHash) return <div>Transaction not found.</div>;

  // 2. Get certificate data in transaction details
  const txData = await getCertByTxHash(txHash);
  if (
    !txData ||
    !txData.token_transfers ||
    txData.token_transfers.length === 0
  ) {
    return <div>Certificate not found.</div>;
  }

  // 3. Map data for CertificateDisplay
  const transfer0 = txData.token_transfers[0];
  const transfer1 = txData.token_transfers[1] || {};
  const metadata = transfer0?.total?.token_instance?.metadata || {};
  const attributes = metadata.attributes || [];
  const rawStandard = getAttribute(attributes, "Carbon standard");
  const standard =
    rawStandard === "Verified Carbon Standard" ? "VCS" : rawStandard;

  const certificateData = {
    id,
    backgroundImage: metadata.image || "",
    title: metadata.name || "",
    amount: {
      value: getAttribute(attributes, "Amount"),
      unit: "tonnes",
    },
    retirementDate: txData.timestamp ? txData.timestamp.split("T")[0] : "",
    retirementTime: txData.timestamp
      ? txData.timestamp.split("T")[1]?.split(".")[0]
      : "",
    protocol: transfer0.token?.symbol || "",
    category: getAttribute(attributes, "Credit category"),
    standard,
    retiredBy: txData.from?.hash || "",
    beneficiary: {
      name: "",
      walletAddress: transfer1.to?.hash || "",
    },
    creditSource: metadata.name || "",
    quote: "",
    retirementDetails: {
      creditCategory: getAttribute(attributes, "Credit category"),
      amountRetired: getAttribute(attributes, "Amount"),
    },
    onChainDetails: {
      retirementTransaction: txData.hash || "",
      projectSpecificToken: getAttribute(attributes, "Project ID"),
      tokenSmartContract: transfer1.token?.address || "",
    },
    projectDetails: {
      carbonStandard: getAttribute(attributes, "Carbon standard"),
      projectLocation: getAttribute(attributes, "Project location"),
      projectId: getAttribute(attributes, "Project ID"),
      vintage: getAttribute(attributes, "Vintage"),
      methodology: getAttribute(attributes, "Methodology"),
      url: getAttribute(attributes, "Retirement Certificate"),
    },
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <CertificateDisplay certificateData={certificateData} />
      </main>
    </div>
  );
}
