import {
  getCertificateTransactionHash,
  getCertByTxHash,
} from "@/server/GetCert";
import { CertificateDisplay } from "@/components/CertificateDisplay";

function getAttribute(attributes: any[], trait: string) {
  return attributes?.find((a) => a.trait_type === trait)?.value || "";
}

export default async function CertDetailPage({ params }: { params: { id: string } }) {
  const param = await params;
  const id = param.id;
  if (!id) return <div>No certificate ID provided.</div>;

  // 1. Get transaction hash
  const txHash = await getCertificateTransactionHash(id);
  if (!txHash) return <div>Transaction not found.</div>;

  // 2. Get transaction details
  const txData = await getCertByTxHash(txHash);
  if (!txData || !txData.token_transfers || txData.token_transfers.length === 0) {
    return <div>Certificate not found.</div>;
  }

  // 3. Find the transfer with metadata (ERC-721 mint)
  const certTransfer = txData.token_transfers.find(
    (t: any) => t.total?.token_instance?.metadata
  );
  const metadata = certTransfer?.total?.token_instance?.metadata || {};
  const attributes = metadata.attributes || [];

  // 4. Find the ERC-20 transfer for TCO2 contract and beneficiary
  const tco2Transfer = txData.token_transfers.find(
    (t: any) => t.token?.type === "ERC-20"
  );

  // 5. Get beneficiary name from decoded_input
  let beneficiaryName = "";
  if (txData.decoded_input?.parameters) {
    const param = txData.decoded_input.parameters.find(
      (p: any) => p.name === "_beneficiaryString"
    );
    beneficiaryName = param?.value || "";
  }

  // 6. Standard mapping
  const rawStandard = getAttribute(attributes, "Carbon standard");
  const standard = rawStandard === "Verified Carbon Standard" ? "VCS" : rawStandard;

  // 7. Project-specific token mapping
  const projectId = getAttribute(attributes, "Project ID");
  const vintage = getAttribute(attributes, "Vintage");
  const projectSpecificToken = projectId && vintage ? `CO2E-${projectId}-${vintage}` : "";

  // 8. Certificate data for display
  const certificateData = {
    id,
    backgroundImage: metadata.image || "",
    title: metadata.name || "",
    amount: {
      value: getAttribute(attributes, "Amount"),
      unit: "tonnes",
    },
    retirementDate: txData.timestamp ? txData.timestamp.split("T")[0] : "",
    retirementTime: txData.timestamp ? txData.timestamp.split("T")[1]?.split(".")[0] : "",
    protocol: certTransfer?.token?.symbol || "",
    category: getAttribute(attributes, "Credit category"),
    standard,
    retiredBy: txData.from?.hash || "",
    beneficiary: {
      name: beneficiaryName,
      walletAddress: tco2Transfer?.from?.hash || "",
    },
    creditSource: metadata.name || "",
    quote: txData.decoded_input?.parameters?.find((p: any) => p.name === "_retirementMessage")?.value || "",
    retirementDetails: {
      creditCategory: getAttribute(attributes, "Credit category"),
      amountRetired: getAttribute(attributes, "Amount"),
    },
    onChainDetails: {
      retirementTransaction: txData.hash || "",
      projectSpecificToken,
      tokenSmartContract: tco2Transfer?.token?.address || "",
    },
    projectDetails: {
      carbonStandard: standard,
      projectLocation: getAttribute(attributes, "Project location"),
      projectId,
      vintage,
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