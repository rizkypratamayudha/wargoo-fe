import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col text-center items-center  h-full gap-4">
      <h2 className="text-3xl font-bold text-zinc-900">
        Selamat Datang di Dashboard!
      </h2>
      <p className="text-zinc-500">
        Ini adalah halaman Home yang menggunakan Shadcn UI.
      </p>
      
      {/* Ini adalah komponen Tombol dari Shadcn */}
      <div className="flex gap-4 mt-4">
        <Button variant="default">Tombol Utama</Button>
        <Button variant="outline">Tombol Outline</Button>
        <Button variant="destructive">Tombol Bahaya</Button>
      </div>
    </div>
  );
}
