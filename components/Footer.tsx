import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white shadow-soft mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-secondary">
          &copy; 2023 CNP Brasil. Todos os direitos reservados.
          <Link href="/termos-de-uso" className="ml-2 hover:text-primary">
            Termos de Uso
          </Link>
          <span className="mx-1">|</span>
          <Link href="/politica-de-privacidade" className="hover:text-primary">
            Política de Privacidade
          </Link>
        </p>
      </div>
    </footer>
  )
}
