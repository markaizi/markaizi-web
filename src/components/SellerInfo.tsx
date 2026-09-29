import { SELLER } from "@/lib/company";

// Yasal sayfalarda satıcı bilgisi bloğu
export default function SellerInfo() {
  return (
    <p>
      <strong>Unvan:</strong> {SELLER.legalName} — {SELLER.tradeName} ({SELLER.businessType})<br />
      <strong>Vergi Dairesi:</strong> {SELLER.taxOffice}<br />
      <strong>Adres:</strong> {SELLER.address}<br />
      <strong>Telefon:</strong> {SELLER.phone}<br />
      <strong>E-posta:</strong> <a href={`mailto:${SELLER.email}`}>{SELLER.email}</a><br />
      <strong>Web sitesi:</strong> markaizi.com.tr
    </p>
  );
}
