import { NextResponse } from "next/server";
import { getCertificatesData } from "@/server/GetCertificateData";

export async function GET() {
  try {
    const allCertificates = await getCertificatesData();

    const mappedCertificates = allCertificates.map((cert) => ({
      id: cert.id,
      title: cert.title,
      amount: cert.amount,
      retirementDate: cert.retirementDate,
      retirementTime: cert.retirementTime,
      protocol: cert.protocol,
      category: cert.category,
      standard: cert.standard,
      retiredBy: cert.retiredBy,
      beneficiary: cert.beneficiary,
      creditSource: cert.creditSource,
      quote: cert.quote,
      retirementDetails: cert.retirementDetails,
      onChainDetails: cert.onChainDetails,
      projectDetails: cert.projectDetails,
      backgroundImage: cert.backgroundImage,
    }));

    return NextResponse.json(mappedCertificates);
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}