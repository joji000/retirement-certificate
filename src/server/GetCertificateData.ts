import path from "path";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import { CertificateData } from "@/interface/CertificateData";


export async function getCertificateParams() {
  const certDir = path.join(process.cwd(), "src/data/retirement");

  try {
    const files = await fs.readdir(certDir);
    return files
      .filter((file) => file.endsWith(".json"))
      .map((file) => ({
        id: file.replace(".json", ""),
      }));
  } catch {
    return [];
  }
}


export async function getCertificatesData(): Promise<CertificateData[]> {
  const certDir = path.join(process.cwd(), "src/data/retirement");

  try {
    const files = await fs.readdir(certDir);

    const certificates = await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const filePath = path.join(certDir, file);
          const content = await fs.readFile(filePath, "utf-8");
          return JSON.parse(content) as CertificateData;
        })
    );

    return certificates;
  } catch {
    return [];
  }
}


export async function getCertificateById(id: string): Promise<CertificateData> {
  const filePath = path.join(process.cwd(), "src/data/retirement", `${id}.json`);

  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as CertificateData;
  } catch {
    notFound();
  }
}