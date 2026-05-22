import SiteRekiDocument from "./SiteRekiDocument";

export default function SiteRekiClientView({ rekiId, onBack }) {
  return <SiteRekiDocument rekiId={rekiId} onBack={onBack} onEdit={() => {}} />;
}
