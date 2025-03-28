import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 logo-container">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary-foreground overflow-hidden">
        <Image
          src="/images/justice-scales-closeup.png"
          alt="Adhivakta"
          width={32}
          height={32}
          className="object-cover"
        />
      </div>
      <h1 className="text-xl font-bold">Adhivakta</h1>
    </Link>
  )
}

