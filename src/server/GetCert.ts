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