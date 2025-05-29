import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_BLOCKSCOUT_URL!;
const tokenAddress = '0x3224304c75C5118af069bA7ce0b290aCd067E46E'

export async function getCertificateIds(): Promise<string[]> {
  const res = await axios.get(`${API_URL}/tokens/${tokenAddress}/instances`);
  return res.data.items.map((item: { id: string }) => item.id);
}


export async function getCertificateById(id: string) {
  const res = await axios.get(`${API_URL}/tokens/${tokenAddress}/instances/${id}`);
  return res.data;
}

export async function getCertificateTransactionHash(id: string): Promise<string | null> {
  const res = await axios.get(`${API_URL}/tokens/${tokenAddress}/instances/${id}/transfers`);
  const items = res.data.items;
  if (items && items.length > 0) {
    return items[0].transaction_hash;
  }
  return null;
}

export async function getCertByTxHash(txHash: string) {
  const url = `${API_URL}/transactions/${txHash}`;
  const res = await axios.get(url);
  return res.data;
}