"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Copy, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "sonner";
import { CertificateData } from "@/interface/CertificateData";
import { DetailItem } from "@/components/DetailItem";

function shortenAddress(addr: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

export function CertificateDisplay({ certificateData }: { certificateData: CertificateData }) {
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!certificateData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load certificate data</p>
      </div>
    );
  }

  const downloadPDF = async () => {
    if (!certificateRef.current || !certificateData) return;
    setDownloading(true);
    try {
      const width = 1230 * 0.26458333333333334;
      const height = 600 * 0.26458333333333334;
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#fff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [width, height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`carbon-retirement-certificate-${certificateData.id}.pdf`);
      toast.success("Certificate downloaded!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to download certificate.");
    } finally {
      setDownloading(false);
    }
  };

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("URL copied to clipboard!");
    } catch (error) {
      console.error("Error copying URL:", error);
      toast.error("Failed to copy URL.");
    }
  };

  // Safely access nested fields
  const { 
    backgroundImage,
    title,
    amount,
    retirementDate,
    retirementTime,
    protocol,
    category,
    standard,
    retiredBy,
    beneficiary,
    creditSource,
    quote,
    retirementDetails,
    onChainDetails,
    projectDetails
  } = certificateData;

  return (
    <div className="bg-white md:rounded-xl md:shadow-xsm md:overflow-hidden -mx-6 md:mx-0 p-6">
      <div className="space-y-6">
        {/* Certificate Section */}
        <Card className="relative overflow-hidden" ref={certificateRef}>
          <div
            className="min-h-[656px] md:min-h-[600px] text-white bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${backgroundImage ?? ""}')`,
            }}
          >
            <div className="min-h-[656px] md:min-h-[600px] flex flex-col justify-between p-6 pb-20 md:p-8 md:pb-10 xl:p-12 xl:pb-10 gap-6 md:gap-8 xl:gap-12 w-full h-full">
              <div className="z-10 flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2">
                  {title}
                </h1>
                <div className="w-[96px] h-[96px] md:w-[128px] md:h-[128px] rounded-full flex items-center justify-center">
                  <img
                    src="/icons/circle-label.svg"
                    alt="Certificate Stamp"
                    className="w-full h-full"
                  />
                </div>
              </div>
              <div className="z-10 gap-2">
                <div className="text-4xl font-bold mb-2">
                  {amount?.value} {amount?.unit}
                </div>
                <p className="text-lg">
                  of carbon credits have been retired on{" "}
                  {retirementDate} via{" "}
                  {protocol}
                </p>
              </div>
              <div className="z-10 w-full flex gap-6 justify-between pr-10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img
                      src='/icons/renewable-icon-white.png'
                      alt="Renewable Energy Icon"
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="text-xs">Category</div>
                    <div className="font-medium">
                      {category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img
                      src='/icons/project-icon-white.png'
                      alt="Project Icon"
                      className="w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="text-xs">Standard</div>
                    <div className="font-medium">
                      {standard}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs">Retired by</div>
                  <div className="font-medium">
                    {shortenAddress(retiredBy)}
                  </div>
                </div>
                <div>
                  <div className="text-xs">Beneficiary</div>
                  <div className="font-medium">
                    {beneficiary?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Credit Source */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-yellow-300`}
                >
                  <img
                    src="/icons/profile-icon.svg"
                    alt="Profile Icon"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Credit source</div>
                  <div className="font-semibold">
                    {creditSource}
                  </div>
                </div>
              </div>
              {projectDetails?.url && (
                <Link
                  href={projectDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    See project details
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <blockquote className="text-xl text-gray-700 mb-4">
              "{quote}"
            </blockquote>
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {beneficiary?.name?.[0]}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {beneficiary?.name}
            </div>
          </CardContent>
        </Card>

        {/* Retirement Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Retirement Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <DetailItem
                icon="renewable-energy"
                label="Credit category"
                value={retirementDetails?.creditCategory}
              />
              <DetailItem
                icon="amountretire"
                label="Amount retired"
                value={retirementDetails?.amountRetired}
              />
              <DetailItem
                icon="certificate"
                label="Retired on"
                value={`${retirementDate}, ${retirementTime}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* On-chain Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">On-chain Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <DetailItem
                icon="wallet"
                label="Retiring Entity"
                value={
                  <Link
                    href={`https://polygonscan.com/address/${retiredBy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {shortenAddress(retiredBy)}
                  </Link>
                }
              />
              <DetailItem
                icon="polygon"
                label="Retirement transaction"
                value={
                  onChainDetails?.retirementTransaction ? (
                    <Link
                      href={`https://polygonscan.com/tx/${onChainDetails.retirementTransaction}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {shortenAddress(onChainDetails.retirementTransaction)}
                    </Link>
                  ) : "-"
                }
              />
              <DetailItem
                icon="token-icon"
                label="Project-specific token"
                value={onChainDetails?.projectSpecificToken}
              />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <DetailItem
                icon="user"
                label="Beneficiary"
                value={beneficiary?.name}
              />
              <DetailItem
                icon="polygon"
                label="Beneficiary wallet address"
                value={
                  beneficiary?.walletAddress ? (
                    <Link
                      href={`https://polygonscan.com/address/${beneficiary.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {shortenAddress(beneficiary.walletAddress)}
                    </Link>
                  ) : "-"
                }
              />
              <DetailItem
                icon="token-contract"
                label="TCO2 token smart contract"
                value={
                  onChainDetails?.tokenSmartContract ? (
                    <Link
                      href={`https://polygonscan.com/address/${onChainDetails.tokenSmartContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {shortenAddress(onChainDetails.tokenSmartContract)}
                    </Link>
                  ) : "-"
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <DetailItem
                  icon="project-icon"
                  label="Carbon standard"
                  value={projectDetails?.carbonStandard}
                />
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center"></div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Project location
                      </div>
                      <div className={"font-medium "}>
                        {projectDetails?.projectLocation}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Project ID</div>
                  <div className="font-medium">
                    {projectDetails?.url ? (
                      <Link
                        href={projectDetails.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1"
                      >
                        {projectDetails.projectId}
                      </Link>
                    ) : (
                      projectDetails?.projectId
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Vintage</div>
                  <div className="font-medium">
                    {projectDetails?.vintage}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Methodology</div>
                  <div className="font-medium">
                    {projectDetails?.methodology}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button onClick={downloadPDF} disabled={downloading} className="gap-2">
          {downloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {downloading ? "Generating PDF..." : "Download my certificate"}
        </Button>
        <Button variant="outline" onClick={copyURL} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy URL
        </Button>
      </div>
    </div>
  );
}