import Image from "next/image";
import Link from "next/link";
import { programs } from "@/lib/directory";

export default function ProgramCards() {
  return <div className="program-grid">{programs.map(program =>
    <Link className="program-card" key={program.href} href={program.href}>
      <div className="program-image"><Image src={program.image} alt={program.alt} width={800} height={800} unoptimized referrerPolicy="no-referrer" /></div>
      <div className="program-card-copy"><h3>{program.label}</h3><p>{program.description}</p></div>
    </Link>
  )}</div>;
}
