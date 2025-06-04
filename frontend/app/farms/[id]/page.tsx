import FarmClientView from "./FarmClientView"

export async function generateStaticParams() {
  return [
    { id: "farm-1" },
    { id: "farm-2" },
    { id: "farm-3" },
    { id: "farm-4" },
  ]
}

export default function Page({ params }: { params: { id: string } }) {
  return <FarmClientView farmId={params.id} />
}
