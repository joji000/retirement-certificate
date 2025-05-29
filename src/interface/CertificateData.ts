export interface CertificateData {
  id: string;
  backgroundImage: string;
  title: string;
  amount: { value: string; unit: string };
  retirementDate: string;
  retirementTime: string;
  protocol: string;
  category: string;
  standard: string;
  retiredBy: string;
  beneficiary: { name: string; walletAddress: string };
  creditSource: string;
  quote: string;
  retirementDetails: { creditCategory: string; amountRetired: string };
  onChainDetails: {
    retirementTransaction: string;
    projectSpecificToken: string;
    tokenSmartContract: string;
  };
  projectDetails: {
    carbonStandard: string;
    projectLocation: string;
    projectId: string;
    vintage: string;
    methodology: string;
    url: string;
  };
}