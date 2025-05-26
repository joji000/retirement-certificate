"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Copy, Loader2 } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

interface CertificateData {
  id: string
  projectId: string
  title: string
  amount: {
    value: number
    unit: string
  }
  retirementDate: string
  retirementTime: string
  protocol: string
  category: string
  standard: string
  retiredBy: string
  beneficiary: {
    name: string
    walletAddress: string
  }
  creditSource: {
    name: string
    icon: string
    color: string
  }
  quote: {
    text: string
    author: string
    avatar: string
  }
  retirementDetails: {
    creditCategory: string
    amountRetired: string
    retiredOn: string
  }
  onChainDetails: {
    retiringEntity: string
    retirementTransaction: string
    projectSpecificToken: string
    beneficiaryWallet: string
    tokenSmartContract: string
  }
  projectDetails: {
    carbonStandard: string
    projectLocation: string
    projectId: string
    vintage: string
    methodology: string
  }
  backgroundImage: string
}

export function CertificateDisplay() {
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        const response = await fetch("/data/certificate.json")
        const data = await response.json()
        setCertificateData(data)
      } catch (error) {
        console.error("Error fetching certificate data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCertificateData()
  }, [])

  const downloadPDF = async () => {
    if (!certificateRef.current || !certificateData) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`carbon-retirement-certificate-${certificateData.id}.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setDownloading(false)
    }
  }

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
      alert("URL copied to clipboard!")
    } catch (error) {
      console.error("Error copying URL:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!certificateData) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load certificate data</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div ref={certificateRef} className="space-y-6">
        {/* Hero Section */}
        <Card className="relative overflow-hidden">
          <div
            className="h-80 bg-cover bg-center relative"
            style={{
              backgroundImage: `url('${certificateData.backgroundImage}')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{certificateData.title}</h1>
                </div>
                <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center">
                  <span className="text-xs">CERT</span>
                </div>
              </div>

              <div>
                <div className="text-4xl font-bold mb-2">
                  {certificateData.amount.value} {certificateData.amount.unit}
                </div>
                <p className="text-lg opacity-90">
                  of carbon credits have been retired on {certificateData.retirementDate} via {certificateData.protocol}
                </p>

                <div className="flex gap-8 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                      <span className="text-xs">🌱</span>
                    </div>
                    <div>
                      <div className="text-xs opacity-70">Category</div>
                      <div className="font-medium">{certificateData.category}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                      <span className="text-xs">✓</span>
                    </div>
                    <div>
                      <div className="text-xs opacity-70">Standard</div>
                      <div className="font-medium">{certificateData.standard}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs opacity-70">Retired by</div>
                    <div className="font-medium">{certificateData.retiredBy}</div>
                  </div>

                  <div>
                    <div className="text-xs opacity-70">Beneficiary</div>
                    <div className="font-medium">{certificateData.beneficiary.name}</div>
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
                  className={`w-10 h-10 bg-${certificateData.creditSource.color}-500 rounded-full flex items-center justify-center`}
                >
                  <span className="text-white font-bold">{certificateData.creditSource.icon}</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Credit source</div>
                  <div className="font-semibold">{certificateData.creditSource.name}</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                See project details
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quote Section */}
        <Card>
          <CardContent className="p-8 text-center">
            <blockquote className="text-xl text-gray-700 mb-4">"{certificateData.quote.text}"</blockquote>
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{certificateData.quote.avatar}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">{certificateData.quote.author}</div>
          </CardContent>
        </Card>

        {/* Retirement Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Retirement Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-sm">🌱</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Credit category</div>
                  <div className="font-medium">{certificateData.retirementDetails.creditCategory}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-sm">⏰</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Amount retired</div>
                  <div className="font-medium">{certificateData.retirementDetails.amountRetired}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📅</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Retired on</div>
                  <div className="font-medium">{certificateData.retirementDetails.retiredOn}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* On-chain Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">On-chain Details</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-sm">🔗</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Retiring Entity</div>
                  <div className="font-medium text-blue-600">{certificateData.onChainDetails.retiringEntity}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 text-sm">📄</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Retirement transaction</div>
                  <div className="font-medium text-blue-600">
                    {certificateData.onChainDetails.retirementTransaction} ↗
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-sm">🎯</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Project-specific token</div>
                  <div className="font-medium">{certificateData.onChainDetails.projectSpecificToken}</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-blue-600 text-sm">👤</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Beneficiary</div>
                  <div className="font-medium">{certificateData.beneficiary.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                  <span className="text-purple-600 text-sm">💰</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Beneficiary wallet address</div>
                  <div className="font-medium text-blue-600">{certificateData.onChainDetails.beneficiaryWallet} ↗</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <span className="text-green-600 text-sm">📋</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">TCO2 token smart contract</div>
                  <div className="font-medium text-blue-600">{certificateData.onChainDetails.tokenSmartContract} ↗</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Details</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Carbon standard</div>
                    <div className="font-medium">{certificateData.projectDetails.carbonStandard}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Project location</div>
                  <div className="font-medium">{certificateData.projectDetails.projectLocation}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Project ID</div>
                  <div className="font-medium text-blue-600">{certificateData.projectDetails.projectId} ↗</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Vintage</div>
                  <div className="font-medium">{certificateData.projectDetails.vintage}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500">Methodology</div>
                  <div className="font-medium">{certificateData.projectDetails.methodology}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button onClick={downloadPDF} disabled={downloading} className="gap-2">
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          {downloading ? "Generating PDF..." : "Download my certificate"}
        </Button>
        <Button variant="outline" onClick={copyURL} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy URL
        </Button>
      </div>
    </div>
  )
}
