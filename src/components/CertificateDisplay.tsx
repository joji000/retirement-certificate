"use client";

import { useState, useEffect, useRef } from "react";
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

export function CertificateDisplay() {
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/data/certificate.json")
      .then((res) => res.json())
      .then(setCertificateData)
      .catch((err) => {
        console.error("Error fetching certificate data:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const downloadPDF = async () => {
    if (!certificateRef.current || !certificateData) return;
    setDownloading(true);
    try {
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
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!certificateData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load certificate data</p>
      </div>
    );
  }

  return (
    <div className="bg-white md:rounded-xl md:shadow-xsm md:overflow-hidden -mx-6 md:mx-0 p-6">
      <div className="space-y-6">
        {/* Certificate Section */}
        <Card className="relative overflow-hidden" ref={certificateRef}>
          <div
            className="min-h-[656px] md:min-h-[600px] text-white bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${certificateData.backgroundImage}')`,
            }}
          >
            <div className="min-h-[656px] md:min-h-[600px] flex flex-col justify-between p-6 pb-20 md:p-8 md:pb-10 xl:p-12 xl:pb-10 gap-6 md:gap-8 xl:gap-12 w-full h-full">
              <div className="z-10 flex justify-between items-start">
                <h1 className="text-3xl font-bold mb-2">
                  {certificateData.title}
                </h1>
                <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
                  <span className="text-xs">CERT</span>
                </div>
              </div>
              <div className="z-10 gap-2">
                <div className="text-4xl font-bold mb-2">
                  {certificateData.amount.value} {certificateData.amount.unit}
                </div>
                <p className="text-lg">
                  of carbon credits have been retired on{" "}
                  {certificateData.retirementDate} via{" "}
                  {certificateData.protocol}
                </p>
              </div>
              <div className="z-10 w-full flex gap-6 justify-between pr-10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">🌱</span>
                  </div>
                  <div>
                    <div className="text-xs">Category</div>
                    <div className="font-medium">
                      {certificateData.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                  <div>
                    <div className="text-xs">Standard</div>
                    <div className="font-medium">
                      {certificateData.standard}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-xs">Retired by</div>
                  <div className="font-medium">
                    {shortenAddress(certificateData.retiredBy)}
                  </div>
                </div>
                <div>
                  <div className="text-xs">Beneficiary</div>
                  <div className="font-medium">
                    {certificateData.beneficiary.name}
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
                  <span className="text-white font-bold">NaN</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Credit source</div>
                  <div className="font-semibold">
                    {certificateData.creditSource}
                  </div>
                </div>
              </div>
              <Link
                href={certificateData.projectDetails.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm">
                  See project details
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <blockquote className="text-xl text-gray-700 mb-4">
              "{certificateData.quote}"
            </blockquote>
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">
                  {certificateData.beneficiary.name[0]}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {certificateData.beneficiary.name}
            </div>
          </CardContent>
        </Card>

        {/* Retirement Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Retirement Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <DetailItem
                icon="🌱"
                color="green-600"
                bg="green-100"
                label="Credit category"
                value={certificateData.retirementDetails.creditCategory}
              />
              <DetailItem
                icon="⏰"
                color="blue-600"
                bg="blue-100"
                label="Amount retired"
                value={certificateData.retirementDetails.amountRetired}
              />
              <DetailItem
                icon="📅"
                color="purple-600"
                bg="purple-100"
                label="Retired on"
                value={`${certificateData.retirementDate}, ${certificateData.retirementTime}`}
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
                icon="🔗"
                color="gray-600"
                bg="gray-100"
                label="Retiring Entity"
                value={
                  <Link
                    href={`https://polygonscan.com/address/${certificateData.retiredBy}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {shortenAddress(certificateData.retiredBy)}
                  </Link>
                }
              />
              <DetailItem
                icon="📄"
                color="purple-600"
                bg="purple-100"
                label="Retirement transaction"
                value={
                  <Link
                    href={`https://polygonscan.com/tx/${certificateData.onChainDetails.retirementTransaction}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {shortenAddress(
                      certificateData.onChainDetails.retirementTransaction
                    )}
                  </Link>
                }
              />
              <DetailItem
                icon="🎯"
                color="green-600"
                bg="green-100"
                label="Project-specific token"
                value={certificateData.onChainDetails.projectSpecificToken}
              />
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <DetailItem
                icon="👤"
                color="blue-600"
                bg="blue-100"
                label="Beneficiary"
                value={certificateData.beneficiary.name}
              />
              <DetailItem
                icon="💰"
                color="purple-600"
                bg="purple-100"
                label="Beneficiary wallet address"
                value={
                  <Link
                    href={`https://polygonscan.com/address/${certificateData.beneficiary.walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {shortenAddress(certificateData.beneficiary.walletAddress)}
                  </Link>
                }
              />
              <DetailItem
                icon="📋"
                color="green-600"
                bg="green-100"
                label="TCO2 token smart contract"
                value={
                  <Link
                    href={`https://polygonscan.com/address/${certificateData.onChainDetails.tokenSmartContract}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {shortenAddress(
                      certificateData.onChainDetails.tokenSmartContract
                    )}
                  </Link>
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
                  icon="✓"
                  color="green-600"
                  bg="green-100"
                  label="Carbon standard"
                  value={certificateData.projectDetails.carbonStandard}
                />
                <div>
                  <DetailItem
                    icon=""
                    color=""
                    bg=""
                    label="Project location"
                    value={certificateData.projectDetails.projectLocation}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Project ID</div>
                  <div className="font-medium text-blue-600 underline">
                    <Link
                      href={certificateData.projectDetails.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 flex items-center gap-1"
                    >
                      {certificateData.projectDetails.projectId}
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Vintage</div>
                  <div className="font-medium">
                    {certificateData.projectDetails.vintage}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Methodology</div>
                  <div className="font-medium">
                    {certificateData.projectDetails.methodology}
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
